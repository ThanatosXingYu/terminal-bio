import { randomUUID } from "node:crypto";
import {
  appendFile,
  mkdir,
  readdir,
  rename,
  stat,
  unlink,
} from "node:fs/promises";
import { isIP } from "node:net";
import { join } from "node:path";

export const COMMAND_LOG_ENDPOINT = "/api/command-log";

const DEFAULT_MAX_BODY_BYTES = 4096;
const DEFAULT_MAX_FILE_BYTES = 5 * 1024 * 1024;
const DEFAULT_MAX_ARCHIVES = 5;
const DEFAULT_RATE_LIMIT = 120;
const DEFAULT_RATE_WINDOW_MS = 60 * 1000;
const MAX_RATE_LIMIT_CLIENTS = 10_000;
const LOG_FILE_NAME = "commands.ndjson";
const ARCHIVE_FILE_PATTERN = /^commands-\d{8}T\d{9}Z-[a-f0-9]+\.ndjson$/;

class HttpError extends Error {
  constructor(statusCode, code) {
    super(code);
    this.statusCode = statusCode;
    this.code = code;
  }
}

const sendJson = (response, statusCode, payload, extraHeaders = {}) => {
  if (response.headersSent || response.writableEnded) return;

  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    ...extraHeaders,
  });
  response.end(body);
};

const sendNoContent = response => {
  if (response.headersSent || response.writableEnded) return;
  response.writeHead(204, { "Cache-Control": "no-store" });
  response.end();
};

const getPathname = request => {
  try {
    return new URL(request.url ?? "/", "http://localhost").pathname;
  } catch {
    return "";
  }
};

const normalizeIp = value => {
  if (typeof value !== "string") return "unknown";

  let candidate = value.trim();
  if (candidate.startsWith("::ffff:")) candidate = candidate.slice(7);

  if (candidate.startsWith("[") && candidate.includes("]")) {
    candidate = candidate.slice(1, candidate.indexOf("]"));
  }

  return isIP(candidate) ? candidate : "unknown";
};

const getClientIp = (request, trustProxy) => {
  if (trustProxy) {
    const forwarded = request.headers["x-forwarded-for"];
    const forwardedHeader = Array.isArray(forwarded)
      ? forwarded.at(-1)
      : forwarded;
    const closestForwarded = forwardedHeader?.split(",").at(-1);
    const forwardedIp = normalizeIp(closestForwarded);
    if (forwardedIp !== "unknown") return forwardedIp;
  }

  return normalizeIp(request.socket.remoteAddress);
};

const readJsonBody = async (request, maxBodyBytes) => {
  const chunks = [];
  let totalBytes = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buffer.length;
    if (totalBytes > maxBodyBytes) {
      throw new HttpError(413, "request_too_large");
    }
    chunks.push(buffer);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new HttpError(400, "invalid_json");
  }
};

const normalizeOptionalText = (value, maxLength) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const createRateLimiter = ({ limit, windowMs }) => {
  const clients = new Map();

  const pruneClients = now => {
    for (const [clientIp, record] of clients) {
      if (now - record.startedAt >= windowMs) clients.delete(clientIp);
    }

    while (clients.size >= MAX_RATE_LIMIT_CLIENTS) {
      const oldestClient = clients.keys().next().value;
      if (oldestClient === undefined) break;
      clients.delete(oldestClient);
    }
  };

  return (ip, now) => {
    const current = clients.get(ip);
    if (!current || now - current.startedAt >= windowMs) {
      if (clients.size >= MAX_RATE_LIMIT_CLIENTS) pruneClients(now);
      clients.set(ip, { count: 1, startedAt: now });
      return true;
    }

    if (current.count >= limit) return false;
    current.count += 1;

    return true;
  };
};

const getLogSize = async logFilePath => {
  try {
    return (await stat(logFilePath)).size;
  } catch (error) {
    if (error?.code === "ENOENT") return 0;
    throw error;
  }
};

const pruneArchives = async (logDirectory, maxArchives) => {
  const archives = (await readdir(logDirectory))
    .filter(fileName => ARCHIVE_FILE_PATTERN.test(fileName))
    .sort()
    .reverse();

  await Promise.all(
    archives
      .slice(maxArchives)
      .map(fileName => unlink(join(logDirectory, fileName)))
  );
};

export const createCommandLogService = ({
  enabled = true,
  logDirectory,
  trustProxy = false,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
  maxFileBytes = DEFAULT_MAX_FILE_BYTES,
  maxArchives = DEFAULT_MAX_ARCHIVES,
  rateLimit = DEFAULT_RATE_LIMIT,
  rateWindowMs = DEFAULT_RATE_WINDOW_MS,
  clock = () => new Date(),
  logger = console,
} = {}) => {
  if (!logDirectory) throw new Error("logDirectory is required");

  const logFilePath = join(logDirectory, LOG_FILE_NAME);
  const allowRequest = createRateLimiter({
    limit: Math.max(1, rateLimit),
    windowMs: Math.max(1000, rateWindowMs),
  });
  let writeQueue = Promise.resolve();

  const writeEntry = async entry => {
    await mkdir(logDirectory, { recursive: true, mode: 0o750 });

    const line = `${JSON.stringify(entry)}\n`;
    const currentSize = await getLogSize(logFilePath);

    if (
      currentSize > 0 &&
      currentSize + Buffer.byteLength(line) > maxFileBytes
    ) {
      const archiveTimestamp = entry.timestamp
        .replace(/[-:]/g, "")
        .replace(".", "");
      const archiveName = `commands-${archiveTimestamp}-${entry.requestId.slice(
        0,
        8
      )}.ndjson`;

      await rename(logFilePath, join(logDirectory, archiveName));
      await pruneArchives(logDirectory, Math.max(0, maxArchives));
    }

    await appendFile(logFilePath, line, {
      encoding: "utf8",
      mode: 0o640,
    });
  };

  const enqueueEntry = entry => {
    const operation = writeQueue.then(() => writeEntry(entry));
    writeQueue = operation.catch(() => undefined);
    return operation;
  };

  const handleRequest = async (request, response) => {
    if (getPathname(request) !== COMMAND_LOG_ENDPOINT) return false;

    if (!enabled) {
      sendNoContent(response);
      return true;
    }

    if (request.method !== "POST") {
      sendJson(
        response,
        405,
        { error: "method_not_allowed" },
        { Allow: "POST" }
      );
      return true;
    }

    const contentType = request.headers["content-type"] ?? "";
    if (!String(contentType).toLowerCase().startsWith("application/json")) {
      sendJson(response, 415, { error: "json_required" });
      return true;
    }

    const ip = getClientIp(request, trustProxy);
    if (!allowRequest(ip, Date.now())) {
      sendJson(
        response,
        429,
        { error: "rate_limited" },
        { "Retry-After": "60" }
      );
      return true;
    }

    let payload;
    try {
      payload = await readJsonBody(request, maxBodyBytes);
    } catch (error) {
      const statusCode = error instanceof HttpError ? error.statusCode : 400;
      const code = error instanceof HttpError ? error.code : "invalid_request";
      sendJson(response, statusCode, { error: code });
      return true;
    }

    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      sendJson(response, 400, { error: "invalid_payload" });
      return true;
    }

    const rawCommand =
      typeof payload.command === "string" ? payload.command : "";
    if (!rawCommand.trim()) {
      sendJson(response, 400, { error: "command_required" });
      return true;
    }

    const now = clock();
    const requestId = randomUUID();
    const userAgent = request.headers["user-agent"];
    const entry = {
      timestamp: now.toISOString(),
      requestId,
      ip,
      command: rawCommand,
      hostname: normalizeOptionalText(payload.hostname, 255),
      path: normalizeOptionalText(payload.path, 500),
      userAgent: typeof userAgent === "string" ? userAgent : "",
    };

    try {
      await enqueueEntry(entry);
      sendNoContent(response);
    } catch (error) {
      logger.error?.("Command log write failed", { requestId, error });
      sendJson(response, 500, { error: "log_write_failed", requestId });
    }

    return true;
  };

  return {
    handleRequest,
    logFilePath,
    flush: () => writeQueue,
  };
};
