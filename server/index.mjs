import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import {
  basename,
  extname,
  isAbsolute,
  join,
  relative,
  resolve,
} from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import terminalConfig from "../terminal.config.mjs";
import { createCommandLogService } from "./command-log.mjs";

const ROOT_DIRECTORY = resolve(fileURLToPath(new URL("..", import.meta.url)));
const DEFAULT_PORT = 9487;
const DEFAULT_HOST = "127.0.0.1";

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

const parseBoolean = value => {
  if (typeof value !== "string") return undefined;
  if (["1", "true", "yes", "on"].includes(value.toLowerCase())) return true;
  if (["0", "false", "no", "off"].includes(value.toLowerCase())) return false;
  return undefined;
};

const parseInteger = (value, fallback, minimum = 1) => {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isInteger(parsed) && parsed >= minimum ? parsed : fallback;
};

const getCliOption = name => {
  const directIndex = process.argv.indexOf(name);
  if (directIndex >= 0) return process.argv[directIndex + 1];

  const prefix = `${name}=`;
  return process.argv
    .find(argument => argument.startsWith(prefix))
    ?.slice(prefix.length);
};

const sendJson = (response, statusCode, payload) => {
  if (response.headersSent || response.writableEnded) return;

  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  response.end(body);
};

const getPathname = request => {
  try {
    return new URL(request.url ?? "/", "http://localhost").pathname;
  } catch {
    return "";
  }
};

const isCommandLogRequest = request => {
  try {
    const fileName = basename(decodeURIComponent(getPathname(request)));
    return /^commands.*\.ndjson$/i.test(fileName);
  } catch {
    return false;
  }
};

const isInsideDirectory = (directory, filePath) => {
  const relativePath = relative(directory, filePath);
  return (
    relativePath === "" ||
    (!relativePath.startsWith("..") && !isAbsolute(relativePath))
  );
};

const getStaticFile = async (request, distDirectory, logDirectory) => {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(getPathname(request));
  } catch {
    throw Object.assign(new Error("invalid_path"), { statusCode: 400 });
  }

  const relativePath = decodedPath.replace(/^\/+/, "") || "index.html";
  let filePath = resolve(distDirectory, relativePath);
  if (!isInsideDirectory(distDirectory, filePath)) {
    throw Object.assign(new Error("forbidden_path"), { statusCode: 403 });
  }
  if (isInsideDirectory(logDirectory, filePath)) return null;

  try {
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) filePath = join(filePath, "index.html");
    return { filePath, fileStat: await stat(filePath) };
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;

    const acceptsHtml = String(request.headers.accept ?? "").includes(
      "text/html"
    );
    if (!acceptsHtml) return null;

    filePath = join(distDirectory, "index.html");
    return { filePath, fileStat: await stat(filePath) };
  }
};

const serveStatic = async (request, response, distDirectory, logDirectory) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    sendJson(response, 405, { error: "method_not_allowed" });
    return;
  }

  const staticFile = await getStaticFile(request, distDirectory, logDirectory);
  if (!staticFile) {
    sendJson(response, 404, { error: "not_found" });
    return;
  }

  const extension = extname(staticFile.filePath).toLowerCase();
  const isIndex = staticFile.filePath === join(distDirectory, "index.html");
  const isHashedAsset = /[/\\]assets[/\\].+-[a-f0-9]{8,}\./i.test(
    staticFile.filePath
  );

  response.writeHead(200, {
    "Content-Type": MIME_TYPES[extension] ?? "application/octet-stream",
    "Content-Length": staticFile.fileStat.size,
    "Cache-Control": isIndex
      ? "no-cache"
      : isHashedAsset
      ? "public, max-age=31536000, immutable"
      : "public, max-age=3600",
    "X-Content-Type-Options": "nosniff",
  });

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  await pipeline(createReadStream(staticFile.filePath), response);
};

const handleUnexpectedError = (response, error, logger) => {
  logger.error?.("Request handling failed", error);
  sendJson(response, error?.statusCode ?? 500, {
    error: error?.statusCode ? error.message : "internal_error",
  });
};

export const createApplicationServer = async ({
  development = false,
  rootDirectory = ROOT_DIRECTORY,
  distDirectory = join(rootDirectory, "dist"),
  logDirectory,
  loggingEnabled,
  trustProxy,
  maxFileBytes,
  maxArchives,
  rateLimit,
  logger = console,
} = {}) => {
  const configuredDistDirectory = resolve(rootDirectory, distDirectory);
  const configuredPublicDirectory = resolve(rootDirectory, "public");
  const configuredLogDirectory = resolve(
    rootDirectory,
    logDirectory ?? process.env.COMMAND_LOG_DIR ?? "logs"
  );
  const configuredLoggingEnabled =
    loggingEnabled ??
    parseBoolean(process.env.COMMAND_LOG_ENABLED) ??
    terminalConfig.logging.enabled;
  const configuredTrustProxy =
    trustProxy ?? parseBoolean(process.env.TRUST_PROXY) ?? false;

  if (
    isInsideDirectory(configuredPublicDirectory, configuredLogDirectory) ||
    isInsideDirectory(configuredDistDirectory, configuredLogDirectory) ||
    isInsideDirectory(configuredLogDirectory, configuredPublicDirectory) ||
    isInsideDirectory(configuredLogDirectory, configuredDistDirectory)
  ) {
    throw new Error("COMMAND_LOG_DIR must not overlap public or dist");
  }

  const commandLogService = createCommandLogService({
    enabled: configuredLoggingEnabled,
    logDirectory: configuredLogDirectory,
    trustProxy: configuredTrustProxy,
    maxFileBytes:
      maxFileBytes ??
      parseInteger(process.env.COMMAND_LOG_MAX_BYTES, 5 * 1024 * 1024),
    maxArchives:
      maxArchives ?? parseInteger(process.env.COMMAND_LOG_MAX_ARCHIVES, 5, 0),
    rateLimit:
      rateLimit ?? parseInteger(process.env.COMMAND_LOG_RATE_LIMIT, 120),
    logger,
  });

  let viteServer = null;

  const handleRequest = async (request, response) => {
    if (await commandLogService.handleRequest(request, response)) return;

    if (isCommandLogRequest(request)) {
      sendJson(response, 404, { error: "not_found" });
      return;
    }

    if (getPathname(request) === "/healthz") {
      if (request.method !== "GET") {
        sendJson(response, 405, { error: "method_not_allowed" });
        return;
      }

      sendJson(response, 200, {
        status: "ok",
        logging: configuredLoggingEnabled,
      });
      return;
    }

    if (viteServer) {
      viteServer.middlewares(request, response, error => {
        if (error) handleUnexpectedError(response, error, logger);
        else if (!response.writableEnded) {
          sendJson(response, 404, { error: "not_found" });
        }
      });
      return;
    }

    await serveStatic(
      request,
      response,
      configuredDistDirectory,
      configuredLogDirectory
    );
  };

  const server = createServer((request, response) => {
    void handleRequest(request, response).catch(error =>
      handleUnexpectedError(response, error, logger)
    );
  });
  server.requestTimeout = 10_000;
  server.headersTimeout = 5_000;
  server.keepAliveTimeout = 5_000;

  server.on("clientError", (_error, socket) => {
    if (socket.writable) {
      socket.end("HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n");
    }
  });

  if (development) {
    const { createServer: createViteServer } = await import("vite");
    viteServer = await createViteServer({
      root: rootDirectory,
      configFile: join(rootDirectory, "tooling/vite.config.ts"),
      server: {
        middlewareMode: true,
        hmr: { server },
        fs: {
          deny: [".env", ".env.*", "*.{crt,pem}", "**/commands*.ndjson"],
        },
      },
      appType: "spa",
    });
  }

  const listen = ({ port = DEFAULT_PORT, host = DEFAULT_HOST } = {}) =>
    new Promise((resolveListen, rejectListen) => {
      const handleError = error => {
        server.off("listening", handleListening);
        rejectListen(error);
      };
      const handleListening = () => {
        server.off("error", handleError);
        resolveListen(server.address());
      };

      server.once("error", handleError);
      server.once("listening", handleListening);
      server.listen(port, host);
    });

  const close = async () => {
    await viteServer?.close();
    if (server.listening) {
      await new Promise((resolveClose, rejectClose) =>
        server.close(error => (error ? rejectClose(error) : resolveClose()))
      );
    }
    await commandLogService.flush();
  };

  return {
    server,
    listen,
    close,
    logFilePath: commandLogService.logFilePath,
    loggingEnabled: configuredLoggingEnabled,
  };
};

const isMainModule =
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMainModule) {
  const development = process.argv.includes("--dev");
  const port = parseInteger(
    getCliOption("--port") ?? process.env.PORT,
    DEFAULT_PORT
  );
  const host = getCliOption("--host") ?? process.env.HOST ?? DEFAULT_HOST;
  const application = await createApplicationServer({ development });

  await application.listen({ port, host });
  console.log(
    `${
      development ? "Development" : "Production"
    } server: http://${host}:${port}`
  );
  console.log(
    `Command logging: ${
      application.loggingEnabled ? application.logFilePath : "disabled"
    }`
  );

  let shuttingDown = false;
  const shutdown = async signal => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`Received ${signal}; shutting down.`);

    try {
      await application.close();
      process.exitCode = 0;
    } catch (error) {
      console.error("Graceful shutdown failed", error);
      process.exitCode = 1;
    }
  };

  process.once("SIGINT", () => void shutdown("SIGINT"));
  process.once("SIGTERM", () => void shutdown("SIGTERM"));
}
