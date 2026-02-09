import { exec } from "../../../core/shell";

export interface GitInfo {
  isGit: boolean;
  branch: string;
  changedFiles: string[];
  recentLog: string;
  diffStat: string;
}

export async function checkGit(cwd: string): Promise<GitInfo> {
  const branchResult = await exec("git rev-parse --abbrev-ref HEAD", cwd);
  if (branchResult.exitCode !== 0) {
    return {
      isGit: false,
      branch: "",
      changedFiles: [],
      recentLog: "",
      diffStat: "",
    };
  }

  const [statusResult, logResult, diffResult] = await Promise.all([
    exec("git status --short", cwd),
    exec("git log --oneline -10", cwd),
    exec("git diff --stat HEAD~3 2>/dev/null || git diff --stat", cwd),
  ]);

  return {
    isGit: true,
    branch: branchResult.stdout,
    changedFiles: statusResult.stdout
      .split("\n")
      .filter(Boolean)
      .map((line) => line.trim()),
    recentLog: logResult.stdout,
    diffStat: diffResult.stdout,
  };
}
