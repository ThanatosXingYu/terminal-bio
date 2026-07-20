import { describe, expect, it } from "vitest";
import terminalConfig from "../terminal.config.mjs";
import { createAnalyticsTags } from "./vite.config";

describe("analytics HTML injection", () => {
  it("injects the configured SDK and initializer synchronously into head", () => {
    const tags = createAnalyticsTags(terminalConfig.analytics);

    expect(tags).toEqual([
      {
        tag: "script",
        attrs: {
          charset: "UTF-8",
          id: "LA_COLLECT",
          src: "//sdk.51.la/js-sdk-pro.min.js",
        },
        injectTo: "head",
      },
      {
        tag: "script",
        children:
          'LA.init({id:"KPLdq1br4Fo42JcH",ck:"KPLdq1br4Fo42JcH",autoTrack:true,hashMode:true})',
        injectTo: "head",
      },
    ]);
    expect(tags[0]?.attrs).not.toHaveProperty("async");
    expect(tags[0]?.attrs).not.toHaveProperty("defer");
  });

  it("does not inject analytics when it is disabled", () => {
    expect(
      createAnalyticsTags({ ...terminalConfig.analytics, enabled: false })
    ).toEqual([]);
  });

  it("escapes values before placing them in an inline script", () => {
    const tags = createAnalyticsTags({
      ...terminalConfig.analytics,
      init: {
        ...terminalConfig.analytics.init,
        id: "</script><script>alert(1)</script>",
      },
    });

    expect(tags[1]?.children).not.toContain("</script>");
    expect(tags[1]?.children).toContain("\\u003c/script>");
  });
});
