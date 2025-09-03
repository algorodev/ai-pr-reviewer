import type { Octokit } from "@octokit/rest";

export async function getChangedFiles(octokit: Octokit, owner: string, repo: string, prNumber: number) {
  const files = await octokit.paginate(octokit.pulls.listFiles, { owner, repo, pull_number: prNumber, per_page: 100 });
  return files
    .filter(f => f.status !== "removed" && !f.filename.endsWith(".lock"))
    .map(f => ({ filename: f.filename, patch: f.patch || "", status: f.status }));
}
