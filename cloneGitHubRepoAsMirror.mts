import { execa } from "execa";
import "dotenv/config";
import { GitHubRepoParams } from "./types/GitHubRepoParams.mjs";
import { logger } from "./lib/logging.js";

/**
 * Clones the specified GitHub repo with the --mirror option to the specified output folder.
 * @param params
 * @returns The destination folder of the cloned repository.
 * @throws Error if the repo is not found or if the clone operation fails.
 */
export const cloneGitHubRepoAsMirror = async (
  params: GitHubRepoParams
): Promise<string> => {
  const {
    installationId,
    repoName,
    repoOwner,
    destinationFolder,
    octokitAppInstance,
  } = params;
  const octokit = await octokitAppInstance.getInstallationOctokit(
    installationId
  );
  const result: any = await octokit.auth({ type: "installation" });
  const {
    tokenType,
    token,
  }: {
    type: string;
    tokenType: string;
    token: string;
    repositorySelection: string;
  } = result;

  const tokenWithPrefix =
    tokenType === "installation" ? `x-access-token:${token}` : token;

  const repositoryUrl = `https://${tokenWithPrefix}@github.com/${repoOwner}/${repoName}.git`;
  logger.info(`Cloning ${repositoryUrl} to ${destinationFolder}`);

  const { stdout: cloneStdout } = await execa("git", [
    "clone",
    repositoryUrl,
    "--mirror",
    destinationFolder,
  ]);
  return destinationFolder;
};
