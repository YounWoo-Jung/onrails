const RESET = "\x1b[0m";
const BLUE = "\x1b[34m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

export function log(message: string): void {
  console.log(message);
}

export function info(message: string): void {
  console.log(`${BLUE}ℹ${RESET} ${message}`);
}

export function success(message: string): void {
  console.log(`${GREEN}✔${RESET} ${message}`);
}

export function warn(message: string): void {
  console.warn(`${YELLOW}⚠${RESET} ${message}`);
}

export function error(message: string, err?: unknown): void {
  console.error(`${RED}✖${RESET} ${message}`);
  if (err instanceof Error) {
    console.error(`${DIM}${err.message}${RESET}`);
  }
}

export function step(index: number, total: number, role: string): void {
  console.log(
    `\n${CYAN}[${index + 1}/${total}]${RESET} ${BOLD}${role}${RESET}`,
  );
}

export function divider(): void {
  console.log(`${DIM}${"─".repeat(60)}${RESET}`);
}
