import { OpencodeAdapter } from "./adapters/opencode";

export interface LlmAdapter {
  name: string;
  invoke(role: string, prompt: string): Promise<string>;
}

export function createAdapter(): LlmAdapter {
  return new OpencodeAdapter();
}
