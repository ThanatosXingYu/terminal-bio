import { StrictMode } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent } from "../utils/test-utils";
import Terminal from "../components/Terminal";
import {
  projectLinks,
  siteConfig,
  socialLinks,
  terminalConfig,
} from "../config";

const submitInStrictMode = async (command: string) => {
  const user = userEvent.setup();
  render(
    <StrictMode>
      <Terminal />
    </StrictMode>
  );

  await user.type(screen.getByTitle("terminal-input"), `${command}{enter}`);
};

describe("redirect commands", () => {
  it("opens gui exactly once in React StrictMode", async () => {
    window.open = vi.fn();

    await submitInStrictMode("gui");

    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith(
      siteConfig.repositoryUrl,
      "_blank"
    );
  });

  it("opens the configured mail client exactly once in React StrictMode", async () => {
    window.open = vi.fn();

    await submitInStrictMode("email");

    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith(
      `mailto:${terminalConfig.email.address}`,
      "_self"
    );
  });

  it("opens a configured project exactly once in React StrictMode", async () => {
    window.open = vi.fn();
    const project = projectLinks[0];
    if (!project) {
      expect(window.open).not.toHaveBeenCalled();
      return;
    }

    await submitInStrictMode(`projects go ${project.id}`);

    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith(project.url, "_blank");
  });

  it("opens a configured social link exactly once in React StrictMode", async () => {
    window.open = vi.fn();
    const social = socialLinks[0];
    if (!social) {
      expect(window.open).not.toHaveBeenCalled();
      return;
    }

    await submitInStrictMode(`socials go ${social.id}`);

    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith(social.url, "_blank");
  });
});
