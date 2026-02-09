import { existsSync } from "fs";
import { resolve } from "path";
import { exec } from "./shell";
import { info, warn } from "./io";

export interface Context {
  cwd: string;
  isRails: boolean;
  isGit: boolean;
  repoSummary: string;
  changedFiles: string;
  diff: string;
}

function detectRails(cwd: string): boolean {
  const markers = ["Gemfile", "bin/rails", "config/application.rb"];
  return markers.some((m) => existsSync(resolve(cwd, m)));
}

function detectGit(cwd: string): boolean {
  return existsSync(resolve(cwd, ".git"));
}

export async function gatherContext(cwd: string): Promise<Context> {
  const isRails = detectRails(cwd);
  const isGit = detectGit(cwd);

  if (isRails) {
    info("Rails project detected");
  } else {
    warn("No Rails project detected in current directory — proceeding anyway");
  }

  let repoSummary = "";
  let changedFiles = "";
  let diff = "";

  if (isGit) {
    info("Git repository detected — gathering context");

    const [logResult, statusResult, diffResult] = await Promise.all([
      exec("git log --oneline -10", cwd),
      exec("git status --short", cwd),
      exec("git diff --stat HEAD~3 2>/dev/null || git diff --stat", cwd),
    ]);

    repoSummary = logResult.stdout || "(no commits)";
    changedFiles = statusResult.stdout || "(no changes)";
    diff = diffResult.stdout || "(no diff)";
  } else {
    warn("Not a git repository — skipping git context");
  }

  return { cwd, isRails, isGit, repoSummary, changedFiles, diff };
}
