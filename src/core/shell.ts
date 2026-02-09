import { $ } from "bun";

export interface ShellResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export async function exec(command: string, cwd?: string): Promise<ShellResult> {
  try {
    const result = await $`sh -c ${command}`.quiet().cwd(cwd ?? process.cwd());
    return {
      stdout: result.stdout.toString().trim(),
      stderr: result.stderr.toString().trim(),
      exitCode: result.exitCode,
    };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "exitCode" in err) {
      const shellErr = err as { stdout: Buffer; stderr: Buffer; exitCode: number };
      return {
        stdout: shellErr.stdout?.toString().trim() ?? "",
        stderr: shellErr.stderr?.toString().trim() ?? "",
        exitCode: shellErr.exitCode,
      };
    }
    throw err;
  }
}

export async function which(binary: string): Promise<boolean> {
  const result = await exec(`which ${binary}`);
  return result.exitCode === 0;
}
