import { App } from "octokit";
import "dotenv/config";
import { logger } from "../lib/logging.js";
import { getGitHubRepoIssues } from "../getGitHubRepoIssues.mjs";
// test
(async () => {
    const installationId: number = Number(process.env.GITHUB_APP_INSTALLATION_ID);
    const ghAppID: string = process.env.GITHUB_APP_ID ?? "";
    const ghPK: string = process.env.GITHUB_APP_PRIVATE_KEY ?? "";
    const repoName: string = process.env.GITHUB_REPO_TO_BACKUP ?? "";
    const repoOwner: string = process.env.GITHUB_REPO_OWNER ?? "";
  
    const octokitAppInstance = new App({ appId: ghAppID, privateKey: ghPK });
  
    await getGitHubRepoIssues({
      installationId,
      destinationFolder: "out",
      octokitAppInstance,
      repoName,
      repoOwner
    });
  })();
  