import { describe, expect, it, vi } from "vitest";
import {
  findVisitorLocation,
  formatVisitorLocation,
} from "../services/visitorLocation";

const response = (data: unknown, ok = true) =>
  ({
    ok,
    json: vi.fn().mockResolvedValue(data),
  } as unknown as Response);

describe("visitor location service", () => {
  it("formats an English location and removes duplicate parts", () => {
    expect(formatVisitorLocation("Singapore", "Singapore", "Singapore")).toBe(
      "Singapore"
    );
    expect(formatVisitorLocation("Jinan", "Shandong", "China")).toBe(
      "Jinan, Shandong, China"
    );
  });

  it("uses GeoJS when the primary provider returns a valid location", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(
        response({ city: "Jinan", region: "Shandong", country: "China" })
      ) as unknown as typeof fetch;

    await expect(findVisitorLocation(fetcher)).resolves.toBe(
      "Jinan, Shandong, China"
    );
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith(
      "https://get.geojs.io/v1/ip/geo.json",
      expect.any(Object)
    );
  });

  it("falls back to ipapi.is when the primary provider fails", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(response({}, false))
      .mockResolvedValueOnce(
        response({
          location: { city: "Jinan", state: "Shandong", country: "China" },
        })
      ) as unknown as typeof fetch;

    await expect(findVisitorLocation(fetcher)).resolves.toBe(
      "Jinan, Shandong, China"
    );
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("falls back to ipwho.is and handles all providers being unavailable", async () => {
    const successfulFallback = vi
      .fn()
      .mockResolvedValueOnce(response({}, false))
      .mockResolvedValueOnce(response({ location: null }))
      .mockResolvedValueOnce(
        response({
          success: true,
          city: "Jinan",
          region: "Shandong",
          country: "China",
        })
      ) as unknown as typeof fetch;

    await expect(findVisitorLocation(successfulFallback)).resolves.toBe(
      "Jinan, Shandong, China"
    );

    const failedFetch = vi
      .fn()
      .mockRejectedValue(new Error("offline")) as unknown as typeof fetch;
    await expect(findVisitorLocation(failedFetch)).resolves.toBeNull();
    expect(failedFetch).toHaveBeenCalledTimes(3);
  });
});
