import { Octokit, App } from "octokit";
import {execa} from 'execa';
// import { createTokenAuth } from "@octokit/auth-token";
import "dotenv/config";

const ghAppID: string = process.env.GITHUB_APP_ID ?? "";
const ghPK: string = process.env.GITHUB_APP_PRIVATE_KEY ?? "";

const app = new App({ appId: ghAppID, privateKey: ghPK });
(async () => {
  // const { data: slug } = await app.octokit.rest.apps.getAuthenticated();
  // for await (const { octokit, installation } of app.eachInstallation.iterator()) {
  //     // eachRepository.iterator()) {
  //     // const {full_name, description, id} = repository;
  //     // console.log(installation);
  //     const { id, account } = installation;

  //     if (account) {
  //         app.eachRepository({ installationId: id }, async ({ octokit, repository }) => {
  //             const { full_name, description, id, git_url } = repository;
  //             console.log(full_name, description, id, git_url);
  //             // const { data: { login } } = await octokit.rest.users.getByUsername({ username: account.login });
  //             // console.log(login);
  //             return;
  //         })
  //     }
  // }
  const octokit = await app.getInstallationOctokit(47392620);
  const result: any = await octokit.auth({ type: "installation" });

  const {
    type,
    tokenType,
    token,
    installationId,
    repositorySelection,
    // permissions,
  }: {
    type: string;
    tokenType: string;
    token: string;
    installationId: number;
    repositorySelection: string;
    // // skipcq: JS-0323
    // permissions: any;
  } = result;
  console.log(
    type,
    tokenType,
    token,
    installationId,
    repositorySelection,
    // permissions
  );

  const tokenWithPrefix =
  tokenType === "installation" ? `x-access-token:${token}` : token;

const repositoryUrl = `https://${tokenWithPrefix}@github.com/cunneen/loggingframework-demo.git`;

const { stdout } = await execa("git", ["clone", repositoryUrl, "--mirror"]);
console.log(stdout);
})();
