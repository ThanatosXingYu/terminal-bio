import { describe, expect, it, vi } from "vitest";
import { COMMAND_LOG_ENDPOINT, logCommand } from "../services/commandLogger";

const successfulResponse = { ok: true } as Response;

describe("command logger", () => {
  it("posts a command with browser context when logging is enabled", async () => {
    const fetcher = vi.fn().mockResolvedValue(successfulResponse);

    await expect(
      logCommand("  projects go 1  ", {
        enabled: true,
        fetcher,
        browserContext: { hostname: "example.com", path: "/terminal" },
      })
    ).resolves.toBe(true);

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith(
      COMMAND_LOG_ENDPOINT,
      expect.objectContaining({
        method: "POST",
        credentials: "same-origin",
        keepalive: true,
      })
    );

    const request = fetcher.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(String(request.body))).toEqual({
      command: "projects go 1",
      truncated: false,
      hostname: "example.com",
      path: "/terminal",
    });
  });

  it("does not send disabled or empty command logs", async () => {
    const fetcher = vi.fn();

    await expect(logCommand("help", { enabled: false, fetcher })).resolves.toBe(
      false
    );
    await expect(logCommand("   ", { enabled: true, fetcher })).resolves.toBe(
      false
    );

    expect(fetcher).not.toHaveBeenCalled();
  });

  it("keeps terminal commands working when the log request fails", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("offline"));

    await expect(logCommand("help", { enabled: true, fetcher })).resolves.toBe(
      false
    );
  });
});
