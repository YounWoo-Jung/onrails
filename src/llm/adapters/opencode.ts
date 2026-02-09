import type { LlmAdapter } from "../adapter";
import { exec, which } from "../../core/shell";
import { error } from "../../core/io";

export class OpencodeAdapter implements LlmAdapter {
  name = "opencode";

  async invoke(role: string, prompt: string): Promise<string> {
    const hasOpencode = await which("opencode");
    if (!hasOpencode) {
      error("opencode CLI not found");
      console.log(`
To use onrails, install opencode first:

  curl -fsSL https://opencode.ai/install | bash

Or see: https://github.com/nicepkg/opencode

opencode wraps LLM providers so you don't need API keys configured here.
`);
      process.exit(1);
    }

    const tmpFile = `/tmp/onrails-prompt-${Date.now()}.md`;
    await Bun.write(tmpFile, prompt);

    const result = await exec(
      `cat "${tmpFile}" | opencode run --prompt -`,
    );

    await exec(`rm -f "${tmpFile}"`);

    if (result.exitCode !== 0) {
      throw new Error(
        `opencode failed for role "${role}": ${result.stderr}`,
      );
    }

    return result.stdout;
  }
}
