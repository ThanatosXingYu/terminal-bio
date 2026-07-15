import { terminalConfig } from "../config";

export const COMMAND_LOG_ENDPOINT = "/api/command-log";

const MAX_COMMAND_LENGTH = 1000;
const REQUEST_TIMEOUT_MS = 2000;

type BrowserContext = {
  hostname: string;
  path: string;
};

type CommandLoggerOptions = {
  enabled?: boolean;
  endpoint?: string;
  fetcher?: typeof fetch;
  browserContext?: BrowserContext;
};

const getBrowserContext = (): BrowserContext =>
  typeof window === "undefined"
    ? { hostname: "", path: "" }
    : {
        hostname: window.location.hostname,
        path: window.location.pathname,
      };

export const logCommand = async (
  rawCommand: string,
  options: CommandLoggerOptions = {}
): Promise<boolean> => {
  const enabled = options.enabled ?? terminalConfig.logging.enabled;
  const command = rawCommand.trim();
  if (!enabled || !command) return false;

  const fetcher = options.fetcher ?? globalThis.fetch;
  if (typeof fetcher !== "function") return false;

  const controller = new AbortController();
  const timeout = globalThis.setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS
  );
  const browserContext = options.browserContext ?? getBrowserContext();

  try {
    const response = await fetcher(options.endpoint ?? COMMAND_LOG_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      keepalive: true,
      signal: controller.signal,
      body: JSON.stringify({
        command: command.slice(0, MAX_COMMAND_LENGTH),
        truncated: command.length > MAX_COMMAND_LENGTH,
        hostname: browserContext.hostname,
        path: browserContext.path,
      }),
    });

    return response.ok;
  } catch {
    return false;
  } finally {
    globalThis.clearTimeout(timeout);
  }
};
