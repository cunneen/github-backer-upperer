import { Octokit, App } from "octokit";
import 'dotenv/config'

const app = new App({ appId, privateKey });
const { data: slug } = await app.octokit.rest.apps.getAuthenticated();
const octokit = await app.getInstallationOctokit(123);
await octokit.rest.issues.create({
  owner: "octocat",
  repo: "hello-world",
  title: "Hello world from " + slug,
});
