// @ts-check

/**
 * terminal-bio user configuration.
 * Edit this file to customize the homepage without touching component code.
 *
 * @satisfies {import("./src/config/types").TerminalBioConfig}
 */
export const terminalConfig = {
  site: {
    ownerName: "Thanatos",
    projectName: "terminal-bio",
    githubUsername: "ThanatosXingYu",
    githubProfileUrl: "https://github.com/ThanatosXingYu",
    repositoryUrl: "https://github.com/ThanatosXingYu/terminal-bio",
    homeDirectory: "/home/thanatos",
  },

  // "simple" returns "a visitor"; "location" adds geolocation.
  whoami: {
    mode: "location",
  },

  // true selects a random theme on every page load.
  theme: {
    randomOnRefresh: false,
  },

  // The Node server records the submitted command, IP and User-Agent as-is.
  logging: {
    enabled: true,
  },

  help: {
    // Keep command names unchanged; edit their descriptions as needed.
    commandDescriptions: {
      about: "about Thanatos",
      clear: "clear the terminal",
      echo: "print out anything",
      education: "my education background",
      email: "show contact information",
      gui: "open the project on GitHub",
      help: "check available commands",
      history: "view command history",
      projects: "view projects that I've coded",
      pwd: "print current working directory",
      socials: "check out my social accounts",
      themes: "check available themes",
      welcome: "display hero section",
      whoami: "about current user",
    },
    shortcuts: [
      {
        key: "Tab or Ctrl + i",
        description: "autocompletes the command",
      },
      {
        key: "Up Arrow",
        description: "go back to previous command",
      },
      {
        key: "Ctrl + l",
        description: "clear the terminal",
      },
    ],
  },

  projects: {
    intro: [
      "“Talk is cheap. Show me the code”? I got you.",
      "Here is a project you can explore",
    ],
    // Project numbers are generated from the array order.
    links: [
      {
        title: "terminal-bio",
        description:
          "An interactive macOS-style terminal portfolio built with React and TypeScript.",
        url: "https://github.com/ThanatosXingYu/terminal-bio",
      },
    ],
  },

  socials: {
    intro: "Here are my social links",
    // Social numbers are generated from the array order.
    links: [
      {
        title: "GitHub",
        url: "https://github.com/ThanatosXingYu",
      },
    ],
  },
};

export default terminalConfig;
