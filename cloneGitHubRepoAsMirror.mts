import { App } from "octokit";
import { execa } from "execa";
import "dotenv/config";

type CloneRepoParams = {
  /** The installation ID of the GitHub app, which you can find from the
   * "configure" button at https://github.com/settings/installations (for a
   * personal account) or
   * https://github.com/organizations/[my-organization]/settings/installations
   * for an organization account */
  installationId: number;
  /** The full name of the repository, in the form of owner/repo e.g. `facebook/react` */
  repoFullName: string;
  /** The destination folder to clone the repository to */
  destinationFolder: string;
  /** An initialized OctoKit app instance (of type "installation") */
  octokitAppInstance: InstanceType<typeof App>;
};

/**
 * Clones the specified GitHub repo with the --mirror option to the specified output folder.
 * @param params
 * @returns The destination folder of the cloned repository.
 * @throws Error if the repo is not found or if the clone operation fails.
 */
export const cloneGitHubRepoAsMirror = async (params: CloneRepoParams) => {
  const {
    installationId,
    repoFullName,
    destinationFolder,
    octokitAppInstance,
  } = params;
  const octokit = await octokitAppInstance.getInstallationOctokit(
    installationId
  );
  const result: any = await octokit.auth({ type: "installation" });
  const {
    type,
    tokenType,
    token,
    repositorySelection,
  }: // permissions,
  {
    type: string;
    tokenType: string;
    token: string;
    repositorySelection: string;
  } = result;

  const tokenWithPrefix =
    tokenType === "installation" ? `x-access-token:${token}` : token;

  const repositoryUrl = `https://${tokenWithPrefix}@github.com/${repoFullName}.git`;

  const { stdout } = await execa("git", [
    "clone",
    repositoryUrl,
    "--mirror",
    destinationFolder,
  ]);
  return destinationFolder;
};

// test
// (async () => {
//   await cloneGitHubRepoAsMirror({
//     installationId: 47392620,
//     destinationFolder: "out",
//     repoFullName: "cunneen/loggingframework-demo",
//     octokitAppInstance
//   });
// })();