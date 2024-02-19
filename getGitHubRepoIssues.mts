import * as path from "node:path";
import * as fs from "node:fs";
import { App, Octokit } from "octokit";
import { execa } from "execa";
import "dotenv/config";
import { GitHubRepoParams } from "./types/GitHubRepoParams.mjs";
// this module is logger-agnostic.
import { logger } from "./lib/logging.js";
import { GitHubIssue } from "./types/GitHubAPITypes.mjs";

/**
 * Gets the issues (including pull requests) for a GitHub repository to the specified output folder.
 * @param params
 * @returns The destination folder for the downloaded pull requests.
 * @throws Error if the repo is not found or if the operation fails.
 */
export const getGitHubRepoIssues = async (params: GitHubRepoParams) => {
  const {
    installationId,
    repoName,
    repoOwner,
    destinationFolder,
    octokitAppInstance,
  } = params;

  // check that repoOwner is specified
  if (!repoOwner) {
    throw new Error("repoOwner is required");
  }

  // check that destinationFolder exists, create if it doesn't
  if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder);
  }

  const octokit = await octokitAppInstance.getInstallationOctokit(
    installationId
  );

  try {
    const issueIterator = octokit.paginate.iterator(
      octokit.rest.issues.listForRepo,
      {
        owner: repoOwner,
        repo: repoName,
        state: "all",
        per_page: 100,
      }
    );

    // iterate through each response
    for await (const { data: issues } of issueIterator) {
      for (const issue of issues) {
        const typedIssue = issue as GitHubIssue;
        const { number: issueNumber, id: issueId, pull_request } = typedIssue;
        const issueSlug = `issue-${issueNumber}-${issueId}`;
        const filename = `${issueSlug}.json`;
        const issueFolderPath = path.join(destinationFolder, issueSlug);
        if (!fs.existsSync(issueFolderPath)) {
          fs.mkdirSync(issueFolderPath);
        }
        const filepath = path.join(issueFolderPath, filename);
        const content = JSON.stringify(typedIssue, null, 2);
        fs.writeFileSync(filepath, content);
        logger.info(`wrote issue ${issueNumber} to ${filepath}`);

        // get comments for this issue
        await backupCommentsForIssue(
          octokit,
          repoOwner,
          repoName,
          issueNumber,
          issueFolderPath,
          typedIssue
        );

        // get labels for this issue
        await backupLabelsForIssue(
          octokit,
          repoOwner,
          repoName,
          issueNumber,
          issueFolderPath,
          typedIssue
        );

        // get events for this issue
        await backupEventsForIssue(
          octokit,
          repoOwner,
          repoName,
          issueNumber,
          issueFolderPath,
          typedIssue
        );

        if (pull_request) {
          // get pullRequests for this issue
          await backupPullRequestsForIssue(
            octokit,
            repoOwner,
            repoName,
            issueNumber,
            issueFolderPath,
            typedIssue
          );
        }
      }

    }
  } catch (error) {
    logger.error("error getting issues", error);
  }
};

/**
 * Get the pull requests for an issue
 * @param octokit
 * @param repoOwner
 * @param repoName
 * @param issueNumber
 * @param issueFolderPath
 * @param issue
 */
async function backupPullRequestsForIssue(
  octokit: Octokit,
  repoOwner: string,
  repoName: string,
  issueNumber: number,
  issueFolderPath: string,
  issue: GitHubIssue
) {
  const pullRequest = await octokit.rest.pulls.get({
    owner: repoOwner,
    repo: repoName,
    pull_number: issueNumber, // pull_request.number,
    per_page: 100,
  });

  // iterate through each response
  if (pullRequest?.data) {
    const { id: pullRequestId } = pullRequest.data;
    const pullRequestFilename = `pullRequest-${pullRequestId}.json`;
    const pullRequestFilepath = path.join(issueFolderPath, pullRequestFilename);
    const content = JSON.stringify(issue, null, 2);
    fs.writeFileSync(pullRequestFilepath, content);
    logger.info(
      `wrote issue ${issueNumber} pullRequest ${pullRequestId} to ${pullRequestFilepath}`
    );
  }
}

/**
 * Get the events for an issue
 * @param octokit
 * @param repoOwner
 * @param repoName
 * @param issueNumber
 * @param issueFolderPath
 * @param issue
 */
async function backupEventsForIssue(
  octokit: Octokit,
  repoOwner: string,
  repoName: string,
  issueNumber: number,
  issueFolderPath: string,
  issue: GitHubIssue
) {
  const eventsIterator = octokit.paginate.iterator(
    octokit.rest.issues.listEvents,
    {
      owner: repoOwner,
      repo: repoName,
      issue_number: issueNumber,
      per_page: 100,
    }
  );

  // iterate through each response
  for await (const { data: events } of eventsIterator) {
    for (const event of events) {
      const { id: eventId } = event;
      const eventFilename = `event-${eventId}.json`;
      const eventFilepath = path.join(issueFolderPath, eventFilename);
      const content = JSON.stringify(issue, null, 2);
      fs.writeFileSync(eventFilepath, content);
      logger.info(
        `wrote issue ${issueNumber} event ${eventId} to ${eventFilepath}`
      );
    }
  }
}

/** get the labels for an issue */
async function backupLabelsForIssue(
  octokit: Octokit,
  repoOwner: string,
  repoName: string,
  issueNumber: number,
  issueFolderPath: string,
  issue: GitHubIssue
) {
  const labelsIterator = octokit.paginate.iterator(
    octokit.rest.issues.listLabelsOnIssue,
    {
      owner: repoOwner,
      repo: repoName,
      issue_number: issueNumber,
      per_page: 100,
    }
  );

  // iterate through each response
  for await (const { data: labels } of labelsIterator) {
    for (const label of labels) {
      const { id: labelId } = label;
      const labelFilename = `label-${labelId}.json`;
      const labelFilepath = path.join(issueFolderPath, labelFilename);
      const content = JSON.stringify(issue, null, 2);
      fs.writeFileSync(labelFilepath, content);
      logger.info(
        `wrote issue ${issueNumber} label ${labelId} to ${labelFilepath}`
      );
    }
  }
}

/**
 * backup the comments for an issue
 * @param octokit
 * @param repoOwner
 * @param repoName
 * @param issueNumber
 * @param issueFolderPath
 * @param issue
 */
async function backupCommentsForIssue(
  octokit: Octokit,
  repoOwner: string,
  repoName: string,
  issueNumber: number,
  issueFolderPath: string,
  issue: GitHubIssue
) {
  const commentsIterator = octokit.paginate.iterator(
    octokit.rest.issues.listComments,
    {
      owner: repoOwner,
      repo: repoName,
      issue_number: issueNumber,
      per_page: 100,
    }
  );

  // iterate through each response
  for await (const { data: comments } of commentsIterator) {
    for (const comment of comments) {
      const { id: commentId } = comment;
      const commentFilename = `comment-${commentId}.json`;
      const commentFilepath = path.join(issueFolderPath, commentFilename);
      const content = JSON.stringify(issue, null, 2);
      fs.writeFileSync(commentFilepath, content);
      logger.info(
        `wrote issue ${issueNumber} comment ${commentId} to ${commentFilepath}`
      );
    }
  }
}
