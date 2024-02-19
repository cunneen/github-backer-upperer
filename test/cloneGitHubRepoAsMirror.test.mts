// test
import { App } from "octokit";
import "dotenv/config";
import { cloneGitHubRepoAsMirror } from "../cloneGitHubRepoAsMirror.mjs";
import { logger } from "../lib/logging.js";

(async () => {
  const installationId: number = Number(process.env.GITHUB_APP_INSTALLATION_ID);
  const repoName: string = process.env.GITHUB_REPO_TO_BACKUP ?? "";
  const repoOwner: string = process.env.GITHUB_REPO_OWNER ?? "";

  const ghAppID: string = process.env.GITHUB_APP_ID ?? "";
  const ghPK: string = process.env.GITHUB_APP_PRIVATE_KEY ?? "";

  const octokitAppInstance = new App({ appId: ghAppID, privateKey: ghPK });

  try {
    const result = await cloneGitHubRepoAsMirror({
      installationId: installationId,
      destinationFolder: "out",
      repoName: repoName,
      repoOwner: repoOwner,
      octokitAppInstance,
    });
    console.log(result);
  } catch (error) {
    if (error?.hasOwnProperty?.("exitCode")) {
      // no such repo or access denied
      logger.error("error", "repo not found");
    }
    logger.error("error", error);
  }
})();
