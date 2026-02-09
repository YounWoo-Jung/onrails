#!/usr/bin/env bun

import { Command } from "commander";
import { resolve } from "path";
import { readdir } from "fs/promises";
import { run } from "./core/runner";
import { log, error } from "./core/io";

const program = new Command();

program
  .name("onrails")
  .description("Convention-over-Configuration CLI for Rails development orchestration")
  .version("0.1.0");

program
  .command("roles")
  .description("List available roles in the current pack")
  .action(async () => {
    const rolesDir = resolve(import.meta.dir, "packs/rails/roles");
    try {
      const files = await readdir(rolesDir);
      const roles = files
        .filter((f) => f.endsWith(".md"))
        .map((f) => f.replace(/\.md$/, ""));
      log("Available roles:");
      for (const role of roles) {
        log(`  - ${role}`);
      }
    } catch (err) {
      error("Failed to read roles directory", err);
      process.exit(1);
    }
  });

program
  .command("workflows")
  .description("List available workflows in the current pack")
  .action(async () => {
    const workflowsDir = resolve(import.meta.dir, "packs/rails/workflows");
    try {
      const files = await readdir(workflowsDir);
      const workflows = files
        .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
        .map((f) => f.replace(/\.(yaml|yml)$/, ""));
      log("Available workflows:");
      for (const wf of workflows) {
        log(`  - ${wf}`);
      }
    } catch (err) {
      error("Failed to read workflows directory", err);
      process.exit(1);
    }
  });

program
  .command("run")
  .description("Run a workflow with a goal")
  .argument("<workflow>", "Workflow name (e.g. feature, refine, recover)")
  .argument("<goal>", "Goal description in quotes")
  .action(async (workflow: string, goal: string) => {
    try {
      await run(workflow, goal);
    } catch (err) {
      error(`Workflow "${workflow}" failed`, err);
      process.exit(1);
    }
  });

program.parse();
