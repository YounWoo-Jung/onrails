import { readFile } from "fs/promises";
import { resolve } from "path";
import yaml from "js-yaml";
import { gatherContext, type Context } from "./context";
import { loadTemplate, render } from "./template";
import { createAdapter, type LlmAdapter } from "../llm/adapter";
import { info, success, error, step, divider } from "./io";

interface WorkflowStep {
  role: string;
  input: string[];
}

interface WorkflowDef {
  name: string;
  steps: WorkflowStep[];
}

export async function run(workflowName: string, goal: string): Promise<void> {
  const workflowPath = resolve(
    import.meta.dir,
    `../packs/rails/workflows/${workflowName}.yaml`,
  );

  let raw: string;
  try {
    raw = await readFile(workflowPath, "utf-8");
  } catch {
    throw new Error(
      `Workflow "${workflowName}" not found. Run \`onrails workflows\` to see available workflows.`,
    );
  }

  const workflow = yaml.load(raw) as WorkflowDef;
  if (!workflow?.steps?.length) {
    throw new Error(`Workflow "${workflowName}" has no steps defined.`);
  }

  info(`Running workflow: ${workflow.name}`);
  divider();

  const ctx = await gatherContext(process.cwd());
  const adapter = createAdapter();

  const state: Record<string, string> = {
    goal,
    repo_summary: ctx.repoSummary,
    changed_files: ctx.changedFiles,
    diff: ctx.diff,
  };

  for (let i = 0; i < workflow.steps.length; i++) {
    const s = workflow.steps[i];
    step(i, workflow.steps.length, s.role);

    const template = await loadTemplate(s.role);

    const vars: Record<string, string> = {};
    for (const key of s.input) {
      vars[key] = state[key] ?? "";
    }

    const prompt = render(template, vars);
    info(`Sending prompt to ${s.role}...`);

    const result = await adapter.invoke(s.role, prompt);

    state[s.role] = result;
    if (s.role === "orion") state.plan = result;
    if (s.role === "libra") state.review = result;
    if (s.role === "phoenix") state.diagnosis = result;

    success(`${s.role} completed`);
    divider();
    console.log(result);
    divider();
  }

  success(`Workflow "${workflowName}" completed`);
}
