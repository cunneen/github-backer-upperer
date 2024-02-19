import { tmpdir } from "node:os";
import { sep } from "node:path";
import { mkdtempSync, mkdirSync } from "node:fs";
import * as path from "node:path";
import { App } from "octokit";
import { execa } from "execa";
import * as tar from "tar";

import "dotenv/config";
// To use the logger, call the setLogger function at the top-level before requiring any other modules.
// This will ensure that all modules use the same logger.
import { setLogger } from "./lib/global-logger/index.js"; // get our desired logger so we can set it as the global logger

// if you comment out these two lines, the console logger will be used by default instead of the winston logger
// const { logger, getLoggingConfig } = require("./lib/logging"); // get our desired logger so we can set it as the global logger
import { logger, getLoggingConfig } from "./lib/logging.js";
// use our logger by setting it as the global
//    logger before requiring the node-modules that use the global logger
//    (because this current file is the top-level file) i.e. this is the only place where we need to set the logger
setLogger(logger);
import { cloneGitHubRepoAsMirror } from "./cloneGitHubRepoAsMirror.mjs";
import { getGitHubRepoIssues } from "./getGitHubRepoIssues.mjs";

const installationId: number = Number(process.env.GITHUB_APP_INSTALLATION_ID);
const repoName: string = process.env.GITHUB_REPO_TO_BACKUP ?? "";
const repoOwner: string = process.env.GITHUB_REPO_OWNER ?? "";

const ghAppID: string = process.env.GITHUB_APP_ID ?? "";
const ghPK: string = process.env.GITHUB_APP_PRIVATE_KEY ?? "";
const s3BucketName: string = process.env.S3_BUCKET_NAME ?? "";

const octokitAppInstance = new App({ appId: ghAppID, privateKey: ghPK });

(async () => {
  // make temp folder
  const dateString = new Date().toISOString().substring(0, 19).replace(/:/g,""); // e.g. "2024-02-19T102800"
  const repoFolderName = repoName.replace("/", "-").replace(sep, "-"); // e.g. "cunneen/logging-framework-demo" becomes "cunneen-logging-framework-demo"
  const tempFolderName = `${repoOwner}-${repoFolderName}-${dateString}`; // e.g. cunneen-logging-framework-demo-2024-02-19T10:28:00
  const tmpDir = tmpdir(); // get the OS-specific temporary dir e.g. "/tmp"

  const octokit = await octokitAppInstance.getInstallationOctokit(
    installationId
  );

  // octokit.rest.repos.get({
  //   owner: 
  // })
  // ensure we're creating inside the temp dir e.g. /tmp/blah, and not a new file/folder that just starts with /tmp e.g. /tmpblah
  const tempPath = mkdtempSync(`${tmpDir}${sep}`);
  const destinationFolder = path.join(tempPath, tempFolderName);
  const destinationRepoFolder = path.join(destinationFolder, "repo");
  // attempt to remove the destination folder just in case it already existed
  await execa("rm", ["-rf", destinationFolder]);
  mkdirSync(destinationRepoFolder, { recursive: true });
  logger.info("cloning repo to:", destinationFolder);

  // get the repo
  const repoDetails = await octokit.rest.repos.get({
    owner: repoOwner,
    repo: repoName
  })
  logger.debug("repoDetails", repoDetails);

  if (!repoDetails?.data) {
    logger.error("repoDetails", "no repo details");
    return;
  }

  const { full_name: repoFullName, owner: { login } } = repoDetails.data;

  // clone repo
  await cloneGitHubRepoAsMirror({
    installationId,
    repoName,
    repoOwner: login,
    repoFullName,
    destinationFolder: destinationRepoFolder,
    octokitAppInstance,
  });

  await getGitHubRepoIssues({
    installationId,
    repoName,
    repoOwner,
    octokitAppInstance,
    destinationFolder
  });

  logger.info("tarring");
  // zip output folder
  const zipFileName = `${tempFolderName}.tgz`;
  const zipFilePath = path.join(tempPath, zipFileName);
  await execa("rm", ["-rf", zipFilePath]);

  process.chdir(tempPath);
  await tar.c(
    {
      gzip: true,
      file: zipFileName,
      C: tempPath,
    },
    [tempFolderName]
  );

  logger.info("uploading to S3");
  // upload zip to S3 (with node AWS credentials)
  const { stdout: s3out } = await execa("aws", [
    "s3",
    "cp",
    zipFilePath,
    `s3://${s3BucketName}`,
  ]);

  logger.info("s3 output:", s3out);
  logger.info("removing everything in:", [tempPath, destinationFolder, zipFilePath]);

  await execa("rm", ["-rf", tempPath]);
  await execa("rm", ["-rf", destinationFolder]);
  await execa("rm", ["-rf", zipFilePath]);
  logger.info("Done!");
})();
