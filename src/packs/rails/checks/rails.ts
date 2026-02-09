import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

export interface RailsCheckResult {
  isRails: boolean;
  version: string | null;
  hasBundler: boolean;
}

export function checkRails(cwd: string): RailsCheckResult {
  const markers = ["Gemfile", "bin/rails", "config/application.rb"];
  const isRails = markers.some((m) => existsSync(resolve(cwd, m)));

  let version: string | null = null;
  const gemfileLock = resolve(cwd, "Gemfile.lock");
  if (existsSync(gemfileLock)) {
    const content = readFileSync(gemfileLock, "utf-8");
    const match = content.match(/rails \((\d+\.\d+\.\d+)\)/);
    if (match) {
      version = match[1];
    }
  }

  const hasBundler = existsSync(resolve(cwd, "Gemfile.lock"));

  return { isRails, version, hasBundler };
}
