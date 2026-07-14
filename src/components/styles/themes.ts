import { DefaultTheme } from "styled-components";

export type Themes = {
  [key: string]: DefaultTheme;
};

const theme: Themes = {
  dark: {
    id: "T_001",
    name: "dark",
    colors: {
      body: "#1D2A35",
      scrollHandle: "#19252E",
      scrollHandleHover: "#162028",
      primary: "#05CE91",
      secondary: "#FF9D00",
      text: {
        100: "#cbd5e1",
        200: "#B2BDCC",
        300: "#64748b",
      },
    },
    window: {
      background: "#1D2A35",
      titleBar: "rgba(255, 255, 255, 0.04)",
      border: "rgba(255, 255, 255, 0.08)",
      divider: "rgba(255, 255, 255, 0.06)",
      shadow: "0 18px 60px rgba(0, 0, 0, 0.55), 0 2px 10px rgba(0, 0, 0, 0.35)",
    },
  },
  light: {
    id: "T_002",
    name: "light",
    colors: {
      body: "#EFF3F3",
      scrollHandle: "#C1C1C1",
      scrollHandleHover: "#AAAAAA",
      primary: "#027474",
      secondary: "#FF9D00",
      text: {
        100: "#334155",
        200: "#475569",
        300: "#64748b",
      },
    },
    window: {
      background: "#EFF3F3",
      titleBar: "rgba(0, 0, 0, 0.03)",
      border: "rgba(0, 0, 0, 0.12)",
      divider: "rgba(0, 0, 0, 0.08)",
      shadow:
        "0 18px 55px rgba(15, 23, 42, 0.18), 0 2px 10px rgba(15, 23, 42, 0.10)",
    },
  },
  "blue-matrix": {
    id: "T_003",
    name: "blue-matrix",
    colors: {
      body: "#101116",
      scrollHandle: "#424242",
      scrollHandleHover: "#616161",
      primary: "#00ff9c",
      secondary: "#60fdff",
      text: {
        100: "#ffffff",
        200: "#c7c7c7",
        300: "#76ff9f",
      },
    },
    window: {
      background: "#101116",
      titleBar: "rgba(255, 255, 255, 0.03)",
      border: "rgba(255, 255, 255, 0.08)",
      divider: "rgba(255, 255, 255, 0.06)",
      shadow: "0 20px 80px rgba(0, 0, 0, 0.65), 0 2px 10px rgba(0, 0, 0, 0.40)",
    },
  },
  espresso: {
    id: "T_004",
    name: "espresso",
    colors: {
      body: "#323232",
      scrollHandle: "#5b5b5b",
      scrollHandleHover: "#393939",
      primary: "#E1E48B",
      secondary: "#A5C260",
      text: {
        100: "#F7F7F7",
        200: "#EEEEEE",
        300: "#5b5b5b",
      },
    },
    window: {
      background: "#323232",
      titleBar: "rgba(255, 255, 255, 0.04)",
      border: "rgba(255, 255, 255, 0.10)",
      divider: "rgba(255, 255, 255, 0.07)",
      shadow: "0 18px 65px rgba(0, 0, 0, 0.60), 0 2px 10px rgba(0, 0, 0, 0.40)",
    },
  },
  "green-goblin": {
    id: "T_005",
    name: "green-goblin",
    colors: {
      body: "#000000",
      scrollHandle: "#2E2E2E",
      scrollHandleHover: "#414141",
      primary: "#E5E500",
      secondary: "#04A500",
      text: {
        100: "#01FF00",
        200: "#04A5B2",
        300: "#E50101",
      },
    },
    window: {
      background: "#000000",
      titleBar: "rgba(255, 255, 255, 0.05)",
      border: "rgba(255, 255, 255, 0.12)",
      divider: "rgba(255, 255, 255, 0.08)",
      shadow: "0 22px 90px rgba(0, 0, 0, 0.80), 0 2px 10px rgba(0, 0, 0, 0.50)",
    },
  },
  ubuntu: {
    id: "T_006",
    name: "ubuntu",
    colors: {
      body: "#2D0922",
      scrollHandle: "#F47845",
      scrollHandleHover: "#E65F31",
      primary: "#80D932",
      secondary: "#80D932",
      text: {
        100: "#FFFFFF",
        200: "#E1E9CC",
        300: "#CDCDCD",
      },
    },
    window: {
      background: "#2D0922",
      titleBar: "rgba(255, 255, 255, 0.05)",
      border: "rgba(255, 255, 255, 0.12)",
      divider: "rgba(255, 255, 255, 0.09)",
      shadow: "0 18px 70px rgba(0, 0, 0, 0.65), 0 2px 10px rgba(0, 0, 0, 0.40)",
    },
  },
};

export default theme;
