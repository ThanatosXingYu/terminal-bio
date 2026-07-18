export type CommandName =
  | "about"
  | "clear"
  | "echo"
  | "education"
  | "email"
  | "gui"
  | "help"
  | "history"
  | "projects"
  | "pwd"
  | "socials"
  | "themes"
  | "welcome"
  | "whoami";

export type TerminalBioConfig = {
  site: {
    ownerName: string;
    projectName: string;
    githubUsername: string;
    githubProfileUrl: string;
    repositoryUrl: string;
    homeDirectory: string;
  };
  whoami: {
    mode: "simple" | "location";
  };
  theme: {
    randomOnRefresh: boolean;
  };
  logging: {
    enabled: boolean;
  };
  email: {
    address: string;
    openClientOnCommand: boolean;
  };
  education: {
    intro: string;
    entries: Array<{
      degree: string;
      institution: string;
      period: string;
    }>;
  };
  help: {
    commandDescriptions: Record<CommandName, string>;
    shortcuts: Array<{
      key: string;
      description: string;
    }>;
  };
  projects: {
    intro: string[];
    links: Array<{
      title: string;
      description: string;
      url: string;
    }>;
  };
  socials: {
    intro: string;
    links: Array<{
      title: string;
      url: string;
    }>;
  };
};
