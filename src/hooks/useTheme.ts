import { useEffect, useState } from "react";
import themes from "../components/styles/themes";
import { setToLS, getFromLS } from "../utils/storage";
import { DefaultTheme } from "styled-components";
import { terminalConfig } from "../config";

const THEME_STORAGE_KEY = "tsn-theme";

export const resolveInitialTheme = (
  randomOnRefresh: boolean,
  storedThemeName?: string,
  random: () => number = Math.random
): DefaultTheme => {
  if (!randomOnRefresh) {
    return storedThemeName && themes[storedThemeName]
      ? themes[storedThemeName]
      : themes.dark;
  }

  const availableThemes = Object.values(themes);
  const randomIndex = Math.floor(random() * availableThemes.length);
  return availableThemes[randomIndex] ?? themes.dark;
};

const getConfiguredInitialTheme = () => {
  const storedThemeName = terminalConfig.theme.randomOnRefresh
    ? undefined
    : getFromLS(THEME_STORAGE_KEY);

  return resolveInitialTheme(
    terminalConfig.theme.randomOnRefresh,
    storedThemeName
  );
};

export const useTheme = () => {
  const [theme, setTheme] = useState<DefaultTheme>(getConfiguredInitialTheme);
  const [themeLoaded, setThemeLoaded] = useState(false);

  const setMode = (mode: DefaultTheme) => {
    setToLS(THEME_STORAGE_KEY, mode.name);
    setTheme(mode);
  };

  useEffect(() => {
    setThemeLoaded(true);
  }, []);

  return { theme, themeLoaded, setMode };
};
