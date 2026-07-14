import packageJson from "../../package.json";

export const siteConfig = {
  ownerName: "Thanatos",
  projectName: "terminal-bio",
  version: packageJson.version,
  githubUsername: "ThanatosXingYu",
  githubProfileUrl: "https://github.com/ThanatosXingYu",
  repositoryUrl: "https://github.com/ThanatosXingYu/terminal-bio",
} as const;

export const projectLinks = [
  {
    id: 1,
    title: "terminal-bio",
    desc: "An interactive macOS-style terminal portfolio built with React and TypeScript.",
    url: siteConfig.repositoryUrl,
  },
];

export const socialLinks = [
  {
    id: 1,
    title: "GitHub",
    url: siteConfig.githubProfileUrl,
    tab: 3,
  },
];
