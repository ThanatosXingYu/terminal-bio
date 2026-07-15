/// <reference types="vite/client" />

import "styled-components";

interface ImportMetaEnv {
  readonly VITE_COMMAND_LOG_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "styled-components" {
  export interface DefaultTheme {
    id: string;
    name: string;
    colors: {
      body: string;
      scrollHandle: string;
      scrollHandleHover: string;
      primary: string;
      secondary: string;
      text: {
        100: string;
        200: string;
        300: string;
      };
    };
    window: {
      background: string;
      titleBar: string;
      border: string;
      divider: string;
      shadow: string;
    };
  }
}
