import assert from "node:assert/strict";
import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createApplicationServer } from "./index.mjs";

const silentLogger = { error: () => undefined };

const createTestApplication = async (testContext, options = {}) => {
  const rootDirectory = await mkdtemp(join(tmpdir(), "terminal-bio-log-"));
  const distDirectory = join(rootDirectory, "dist");
  const logDirectory = join(rootDirectory, "logs");
  await mkdir(distDirectory, { recursive: true });
  await writeFile(join(distDirectory, "index.html"), "<h1>terminal-bio</h1>");

  if (options.development) {
    const toolingDirectory = join(rootDirectory, "tooling");
    await mkdir(toolingDirectory, { recursive: true });
    await writeFile(
      join(toolingDirectory, "vite.config.ts"),
      "export default {};\n"
    );
    await writeFile(
      join(rootDirectory, "index.html"),
      "<h1>terminal-bio dev</h1>"
    );
  }

  const application = await createApplicationServer({
    rootDirectory,
    distDirectory,
    logDirectory,
    logger: silentLogger,
    ...options,
  });
  await application.listen({ port: 0, host: "127.0.0.1" });

  const address = application.server.address();
  assert.equal(typeof address, "object");
  const baseUrl = `http://127.0.0.1:${address.port}`;

  testContext.after(async () => {
    await application.close();
    await rm(rootDirectory, { recursive: true, force: true });
  });

  return {
    application,
    baseUrl,
    distDirectory,
    logDirectory,
    rootDirectory,
  };
};

const postCommand = (baseUrl, command, headers = {}) =>
  fetch(`${baseUrl}/api/command-log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({
      command,
      hostname: "example.com",
      path: "/terminal",
    }),
  });

test("serves the app and writes a structured raw command log", async context => {
  const { application, baseUrl } = await createTestApplication(context, {
    trustProxy: true,
  });

  const pageResponse = await fetch(baseUrl);
  assert.equal(pageResponse.status, 200);
  assert.match(await pageResponse.text(), /terminal-bio/);

  const healthResponse = await fetch(`${baseUrl}/healthz`);
  assert.deepEqual(await healthResponse.json(), {
    status: "ok",
    logging: true,
  });

  const rawCommand = `  echo token=super-secret ${"x".repeat(1100)}  `;
  const userAgent = `terminal-bio-test/${"u".repeat(600)}`;
  const logResponse = await postCommand(baseUrl, rawCommand, {
    "User-Agent": userAgent,
    "X-Forwarded-For": "198.51.100.1, 203.0.113.8",
  });
  assert.equal(logResponse.status, 204);

  const logContents = await readFile(application.logFilePath, "utf8");
  const entry = JSON.parse(logContents.trim());
  assert.match(entry.timestamp, /^\d{4}-\d{2}-\d{2}T/);
  assert.match(entry.requestId, /^[a-f0-9-]{36}$/);
  assert.equal(entry.ip, "203.0.113.8");
  assert.equal(entry.command, rawCommand);
  assert.equal(entry.hostname, "example.com");
  assert.equal(entry.path, "/terminal");
  assert.equal(entry.userAgent, userAgent);
});

test("does not create a log file when command logging is disabled", async context => {
  const { application, baseUrl } = await createTestApplication(context, {
    loggingEnabled: false,
  });

  const response = await postCommand(baseUrl, "help");
  assert.equal(response.status, 204);
  await assert.rejects(readFile(application.logFilePath, "utf8"), {
    code: "ENOENT",
  });
});

test("rejects command log request bodies over 4 KiB", async context => {
  const { application, baseUrl } = await createTestApplication(context);

  const response = await postCommand(baseUrl, "x".repeat(5000));
  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), { error: "request_too_large" });
  await assert.rejects(readFile(application.logFilePath, "utf8"), {
    code: "ENOENT",
  });
});

test("does not expose command logs from the development server", async context => {
  const { application, baseUrl, logDirectory, rootDirectory } =
    await createTestApplication(context, {
      development: true,
      loggingEnabled: true,
    });
  await mkdir(logDirectory, { recursive: true });
  await writeFile(application.logFilePath, '{"command":"private"}\n');
  const publicLogDirectory = join(rootDirectory, "public", "logs");
  await mkdir(publicLogDirectory, { recursive: true });
  await writeFile(
    join(publicLogDirectory, "commands.ndjson"),
    '{"command":"stale"}\n'
  );

  const protectedUrls = [
    `${baseUrl}/logs/commands.ndjson`,
    `${baseUrl}/logs/%63ommands.ndjson`,
    `${baseUrl}/logs/commands.ndjson?raw`,
    `${baseUrl}/@fs/${application.logFilePath}`,
  ];
  for (const url of protectedUrls) {
    assert.equal((await fetch(url)).status, 404);
  }
});

test("does not serve stale logs copied into the production directory", async context => {
  const { baseUrl, distDirectory } = await createTestApplication(context, {
    loggingEnabled: true,
  });
  const staleLogDirectory = join(distDirectory, "logs");
  await mkdir(staleLogDirectory, { recursive: true });
  await writeFile(
    join(staleLogDirectory, "commands.ndjson"),
    '{"command":"private"}\n'
  );

  const response = await fetch(`${baseUrl}/logs/commands.ndjson`);
  assert.equal(response.status, 404);
});

test("rejects log directories that overlap public or dist", async context => {
  const rootDirectory = await mkdtemp(join(tmpdir(), "terminal-bio-log-dir-"));
  const distDirectory = join(rootDirectory, "dist");
  context.after(() => rm(rootDirectory, { recursive: true, force: true }));

  for (const logDirectory of [
    rootDirectory,
    join(rootDirectory, "public", "logs"),
    join(distDirectory, "logs"),
  ]) {
    await assert.rejects(
      createApplicationServer({
        rootDirectory,
        distDirectory,
        logDirectory,
        loggingEnabled: true,
        logger: silentLogger,
      }),
      /COMMAND_LOG_DIR must not overlap public or dist/
    );
  }
});

test("rate limits repeated command log requests by IP", async context => {
  const { baseUrl } = await createTestApplication(context, {
    loggingEnabled: true,
    rateLimit: 1,
  });

  assert.equal((await postCommand(baseUrl, "help")).status, 204);

  const limitedResponse = await postCommand(baseUrl, "whoami");
  assert.equal(limitedResponse.status, 429);
  assert.deepEqual(await limitedResponse.json(), { error: "rate_limited" });
});

test("rotates command logs and prunes old archives", async context => {
  const { baseUrl, logDirectory } = await createTestApplication(context, {
    loggingEnabled: true,
    maxFileBytes: 1,
    maxArchives: 1,
    rateLimit: 20,
  });

  for (const command of ["help", "whoami", "projects", "socials"]) {
    assert.equal((await postCommand(baseUrl, command)).status, 204);
  }

  const files = await readdir(logDirectory);
  const archives = files.filter(fileName => fileName.startsWith("commands-"));
  assert.equal(files.includes("commands.ndjson"), true);
  assert.equal(archives.length, 1);
});
