import { describe, expect, it } from "vitest";
import themes from "../components/styles/themes";
import { resolveInitialTheme } from "../hooks/useTheme";

describe("theme configuration", () => {
  it("uses dark when random themes are off and no saved theme exists", () => {
    expect(resolveInitialTheme(false)).toBe(themes.dark);
    expect(resolveInitialTheme(false, "missing-theme")).toBe(themes.dark);
  });

  it("restores a valid saved theme when random themes are off", () => {
    expect(resolveInitialTheme(false, "light")).toBe(themes.light);
  });

  it("selects from the available themes when random themes are on", () => {
    expect(resolveInitialTheme(true, "light", () => 0)).toBe(themes.dark);
    expect(resolveInitialTheme(true, "dark", () => 0.999)).toBe(themes.ubuntu);
  });
});
