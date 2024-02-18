import { tmpdir } from "node:os";
import { sep } from "node:path";
import { mkdtempSync, mkdirSync } from "node:fs";
import * as path from "node:path";
import { App } from "octokit";

import "dotenv/config";
import { cloneGitHubRepoAsMirror } from "./cloneGitHubRepoAsMirror.mjs";
import { execa } from "execa";
import * as tar from "tar";

const installationId: number = Number(process.env.GITHUB_APP_INSTALLATION_ID);
const repoFullName: string = process.env.GITHUB_REPO_TO_BACKUP ?? "";

const ghAppID: string = process.env.GITHUB_APP_ID ?? "";
const ghPK: string = process.env.GITHUB_APP_PRIVATE_KEY ?? "";
const s3BucketName: string = process.env.S3_BUCKET_NAME ?? "";

const octokitAppInstance = new App({ appId: ghAppID, privateKey: ghPK });

(async () => {
  // make temp folder
  const dateString = new Date().toISOString().substring(0, 19);
  const repoFolderName = repoFullName.replace("/", "-");
  const tempFolderName = `${repoFolderName}-${dateString}`;
  const tmpDir = tmpdir();



  const tempPath = mkdtempSync(`${tmpDir}${sep}`);
  const destinationFolder = path.join(tempPath, tempFolderName);
  await execa("rm", ["-rf", destinationFolder]);
  mkdirSync(destinationFolder);
  console.log("cloning repo to:", destinationFolder);

  // clone repo
  await cloneGitHubRepoAsMirror({
    installationId,
    repoFullName,
    destinationFolder,
    octokitAppInstance
  });
  console.log("tarring")
  // zip output folder
  const zipFileName = `${tempFolderName}.tgz`;
  const zipFilePath = path.join(tempPath, zipFileName);
  await execa("rm", ["-rf", zipFilePath]);

  process.chdir(tempPath);
  await tar.c(
    {
      gzip: true,
      file: zipFileName,
      C: tempPath
    },
    [tempFolderName]
  )

  console.log("uploading to S3")
  // upload zip to S3 (with node AWS credentials)
  const { stdout: s3out } = await execa("aws", [
    "s3",
    "cp",
    zipFilePath,
    `s3://${s3BucketName}`
  ]);

  console.log("s3 output:", s3out);

  await execa("rm", ["-rf", tempPath]);
  await execa("rm", ["-rf", destinationFolder]);
  await execa("rm", ["-rf", zipFilePath]);
  console.log("Done!");
})();
