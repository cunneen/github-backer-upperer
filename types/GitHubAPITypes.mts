// types inferred from the Octokit API

export type GitHubUser = {
  name?: string | null | undefined;
  email?: string | null | undefined;
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  starred_at?: string | undefined;
};

export type GitHubLabel =
  | string
  | {
      id?: number | undefined;
      node_id?: string | undefined;
      url?: string | undefined;
      name?: string | undefined;
      description?: string | null | undefined;
      color?: string | null | undefined;
      default?: boolean | undefined;
    };

export type GitHubRepository = {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  license: {
    key: string;
    name: string;
    url: string | null;
    spdx_id: string | null;
    node_id: string;
    html_url?: string | undefined;
  } | null;
  organization?:
    | {
        name?: string | null | undefined;
        email?: string | null | undefined;
        login: string;
        id: number;
        node_id: string;
        avatar_url: string;
        gravatar_id: string | null;
        url: string;
        html_url: string;
        followers_url: string;
        following_url: string;
        gists_url: string;
        starred_url: string;
        subscriptions_url: string;
        organizations_url: string;
        repos_url: string;
        events_url: string;
        received_events_url: string;
        type: string;
        site_admin: boolean;
        starred_at?: string | undefined;
      }
    | null
    | undefined;
  forks: number;
  permissions?:
    | {
        admin: boolean;
        pull: boolean;
        triage?: boolean | undefined;
        push: boolean;
        maintain?: boolean | undefined;
      }
    | undefined;
  owner: GitHubUser;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  archive_url: string;
  assignees_url: string;
  blobs_url: string;
  branches_url: string;
  collaborators_url: string;
  comments_url: string;
  commits_url: string;
  compare_url: string;
  contents_url: string;
  contributors_url: string;
  deployments_url: string;
  downloads_url: string;
  events_url: string;
  forks_url: string;
  git_commits_url: string;
  git_refs_url: string;
  git_tags_url: string;
  git_url: string;
  issue_comment_url: string;
  issue_events_url: string;
  issues_url: string;
  keys_url: string;
  labels_url: string;
  languages_url: string;
  merges_url: string;
  milestones_url: string;
  notifications_url: string;
  pulls_url: string;
  releases_url: string;
  ssh_url: string;
  stargazers_url: string;
  statuses_url: string;
  subscribers_url: string;
  subscription_url: string;
  tags_url: string;
  teams_url: string;
  trees_url: string;
  clone_url: string;
  mirror_url: string | null;
  hooks_url: string;
  svn_url: string;
  homepage: string | null;
  language: string | null;
  forks_count: number;
  stargazers_count: number;
  watchers_count: number;
  size: number;
  default_branch: string;
  open_issues_count: number;
  is_template?: boolean | undefined;
  topics?: string[] | undefined;
  has_issues: boolean;
  has_projects: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_downloads: boolean;
  has_discussions?: boolean | undefined;
  archived: boolean;
  disabled: boolean;
  visibility?: string | undefined;
  pushed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  allow_rebase_merge?: boolean | undefined;
  template_repository?:
    | {
        id?: number | undefined;
        node_id?: string | undefined;
        name?: string | undefined;
        full_name?: string | undefined;
        owner?: GitHubUser | undefined;
        private?: boolean | undefined;
        html_url?: string | undefined;
        description?: string | undefined;
        fork?: boolean | undefined;
        url?: string | undefined;
        archive_url?: string | undefined;
        assignees_url?: string | undefined;
        blobs_url?: string | undefined;
        branches_url?: string | undefined;
        collaborators_url?: string | undefined;
        comments_url?: string | undefined;
        commits_url?: string | undefined;
        compare_url?: string | undefined;
        contents_url?: string | undefined;
        contributors_url?: string | undefined;
        deployments_url?: string | undefined;
        downloads_url?: string | undefined;
        events_url?: string | undefined;
        forks_url?: string | undefined;
        git_commits_url?: string | undefined;
        git_refs_url?: string | undefined;
        git_tags_url?: string | undefined;
        git_url?: string | undefined;
        issue_comment_url?: string | undefined;
        issue_events_url?: string | undefined;
        issues_url?: string | undefined;
        keys_url?: string | undefined;
        labels_url?: string | undefined;
        languages_url?: string | undefined;
        merges_url?: string | undefined;
        milestones_url?: string | undefined;
        notifications_url?: string | undefined;
        pulls_url?: string | undefined;
        releases_url?: string | undefined;
        ssh_url?: string | undefined;
        stargazers_url?: string | undefined;
        statuses_url?: string | undefined;
        subscribers_url?: string | undefined;
        subscription_url?: string | undefined;
        tags_url?: string | undefined;
        teams_url?: string | undefined;
        trees_url?: string | undefined;
        clone_url?: string | undefined;
        mirror_url?: string | undefined;
        hooks_url?: string | undefined;
        svn_url?: string | undefined;
        homepage?: string | undefined;
        language?: string | undefined;
        forks_count?: number | undefined;
        stargazers_count?: number | undefined;
        watchers_count?: number | undefined;
        size?: number | undefined;
        default_branch?: string | undefined;
        open_issues_count?: number | undefined;
        is_template?: boolean | undefined;
        topics?: string[] | undefined;
        has_issues?: boolean | undefined;
        has_projects?: boolean | undefined;
        has_wiki?: boolean | undefined;
        has_pages?: boolean | undefined;
        has_downloads?: boolean | undefined;
        archived?: boolean | undefined;
        disabled?: boolean | undefined;
        visibility?: string | undefined;
        pushed_at?: string | undefined;
        created_at?: string | undefined;
        updated_at?: string | undefined;
        permissions?:
          | {
              admin?: boolean | undefined;
              maintain?: boolean | undefined;
              push?: boolean | undefined;
              triage?: boolean | undefined;
              pull?: boolean | undefined;
            }
          | undefined;
        allow_rebase_merge?: boolean | undefined;
        temp_clone_token?: string | undefined;
        allow_squash_merge?: boolean | undefined;
        allow_auto_merge?: boolean | undefined;
        delete_branch_on_merge?: boolean | undefined;
        allow_update_branch?: boolean | undefined;
        use_squash_pr_title_as_default?: boolean | undefined;
        squash_merge_commit_title?:
          | "PR_TITLE"
          | "COMMIT_OR_PR_TITLE"
          | undefined;
        squash_merge_commit_message?:
          | "PR_BODY"
          | "COMMIT_MESSAGES"
          | "BLANK"
          | undefined;
        merge_commit_title?: "PR_TITLE" | "MERGE_MESSAGE" | undefined;
        merge_commit_message?: "PR_TITLE" | "PR_BODY" | "BLANK" | undefined;
        allow_merge_commit?: boolean | undefined;
        subscribers_count?: number | undefined;
        network_count?: number | undefined;
      }
    | null
    | undefined;
  temp_clone_token?: string | undefined;
  allow_squash_merge?: boolean | undefined;
  allow_auto_merge?: boolean | undefined;
  delete_branch_on_merge?: boolean | undefined;
  allow_update_branch?: boolean | undefined;
  use_squash_pr_title_as_default?: boolean | undefined;
  squash_merge_commit_title?: "PR_TITLE" | "COMMIT_OR_PR_TITLE" | undefined;
  squash_merge_commit_message?:
    | "PR_BODY"
    | "COMMIT_MESSAGES"
    | "BLANK"
    | undefined;
  merge_commit_title?: "PR_TITLE" | "MERGE_MESSAGE" | undefined;
  merge_commit_message?: "PR_TITLE" | "PR_BODY" | "BLANK" | undefined;
  allow_merge_commit?: boolean | undefined;
  allow_forking?: boolean | undefined;
  web_commit_signoff_required?: boolean | undefined;
  subscribers_count?: number | undefined;
  network_count?: number | undefined;
  open_issues: number;
  watchers: number;
  master_branch?: string | undefined;
  starred_at?: string | undefined;
  anonymous_access_enabled?: boolean | undefined;
};

export type GitHubMilestone = {
  url: string;
  html_url: string;
  labels_url: string;
  id: number;
  node_id: string;
  number: number;
  state: "closed" | "open";
  title: string;
  description: string | null;
  creator: GitHubUser | null;
  open_issues: number;
  closed_issues: number;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  due_on: string | null;
};

export type GitHubIssue = {
  id: number;
  node_id: string;
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  number: number;
  state: string;
  state_reason?: "completed" | "reopened" | "not_planned" | null | undefined;
  title: string;
  body?: string | null | undefined;
  user: GitHubUser | null;
  labels: GitHubLabel[];
  assignee: GitHubUser | null;
  assignees?: GitHubUser[] | null | undefined;
  milestone: GitHubMilestone | null;
  locked: boolean;
  active_lock_reason?: string | null | undefined;
  comments: number;
  pull_request?:
    | {
        merged_at?: string | null | undefined;
        diff_url: string | null;
        html_url: string | null;
        patch_url: string | null;
        url: string | null;
      }
    | undefined;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  draft?: boolean | undefined;
  closed_by?: GitHubUser | null | undefined;
  body_html?: string | undefined;
  body_text?: string | undefined;
  timeline_url?: string | undefined;
  repository?: GitHubRepository | undefined;
  performed_via_github_app?:
    | {
        id: number;
        slug?: string | undefined;
        node_id: string;
        owner: GitHubUser | null;
        name: string;
        description: string | null;
        external_url: string;
        html_url: string;
        created_at: string;
        updated_at: string;
        permissions: {
          [key: string]: string | undefined;
          issues?: string | undefined;
          checks?: string | undefined;
          metadata?: string | undefined;
          contents?: string | undefined;
          deployments?: string | undefined;
        };
        events: string[];
        installations_count?: number | undefined;
        client_id?: string | undefined;
        client_secret?: string | undefined;
        webhook_secret?: string | null | undefined;
        pem?: string | undefined;
      }
    | null
    | undefined;
  author_association:
    | "COLLABORATOR"
    | "CONTRIBUTOR"
    | "FIRST_TIMER"
    | "FIRST_TIME_CONTRIBUTOR"
    | "MANNEQUIN"
    | "MEMBER"
    | "NONE"
    | "OWNER";
  reactions?:
    | {
        url: string;
        total_count: number;
        "+1": number;
        "-1": number;
        laugh: number;
        confused: number;
        heart: number;
        hooray: number;
        eyes: number;
        rocket: number;
      }
    | undefined;
};
