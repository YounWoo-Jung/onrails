import { readFile } from "fs/promises";
import { resolve } from "path";

export async function loadTemplate(role: string): Promise<string> {
  const templatePath = resolve(
    import.meta.dir,
    `../packs/rails/roles/${role}.md`,
  );
  return readFile(templatePath, "utf-8");
}

export function render(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{${key}}`, value);
  }
  return result;
}
