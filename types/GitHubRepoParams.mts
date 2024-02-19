import { App } from "octokit";

export type GitHubRepoParams = {
  /** The installation ID of the GitHub app, which you can find from the
   * "configure" button at https://github.com/settings/installations (for a
   * personal account) or
   * https://github.com/organizations/[my-organization]/settings/installations
   * for an organization account */
  installationId: number;
  /** The full name of the repository, in the form of owner/repo e.g. `facebook/react` */
  repoFullName?: string;
  /** The destination folder to clone the repository to */
  destinationFolder: string;
  /** An initialized OctoKit app instance (of type "installation") */
  octokitAppInstance: InstanceType<typeof App>;
  /** repo owner */
  repoOwner: string;
  /** repo short name */
  repoName: string;
};
