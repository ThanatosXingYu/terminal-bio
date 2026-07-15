import { render, screen, waitFor } from "../utils/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getCurrentHostname,
  useVisitor,
  VisitorProvider,
} from "../context/VisitorContext";
import { getVisitorLocation } from "../services/visitorLocation";

vi.mock("../services/visitorLocation", () => ({
  getVisitorLocation: vi.fn(),
}));

const VisitorOutput = () => {
  const { hostname, whoami } = useVisitor();
  return (
    <div>
      <span data-testid="hostname">{hostname}</span>
      <span data-testid="whoami">{whoami}</span>
    </div>
  );
};

describe("VisitorProvider", () => {
  beforeEach(() => {
    vi.mocked(getVisitorLocation).mockReset();
  });

  it("uses the current browser hostname and updates the visitor location", async () => {
    vi.mocked(getVisitorLocation).mockResolvedValue("Jinan, Shandong, China");

    render(
      <VisitorProvider>
        <VisitorOutput />
      </VisitorProvider>
    );

    expect(screen.getByTestId("hostname")).toHaveTextContent(
      getCurrentHostname()
    );
    expect(screen.getByTestId("whoami")).toHaveTextContent("a visitor");

    await waitFor(() => {
      expect(screen.getByTestId("whoami")).toHaveTextContent(
        "a visitor from Jinan, Shandong, China"
      );
    });
  });

  it("skips location lookup in simple whoami mode", () => {
    render(
      <VisitorProvider whoamiMode="simple">
        <VisitorOutput />
      </VisitorProvider>
    );

    expect(screen.getByTestId("whoami")).toHaveTextContent("a visitor");
    expect(getVisitorLocation).not.toHaveBeenCalled();
  });

  it("uses an English fallback when all providers are unavailable", async () => {
    vi.mocked(getVisitorLocation).mockResolvedValue(null);

    render(
      <VisitorProvider>
        <VisitorOutput />
      </VisitorProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("whoami")).toHaveTextContent(
        "a visitor from somewhere on Earth"
      );
    });
  });
});
