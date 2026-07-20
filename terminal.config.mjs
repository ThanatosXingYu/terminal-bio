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

  // Injected synchronously before </head> when enabled.
  analytics: {
    enabled: true,
    script: {
      charset: "UTF-8",
      id: "LA_COLLECT",
      src: "//sdk.51.la/js-sdk-pro.min.js",
    },
    init: {
      id: "KPLdq1br4Fo42JcH",
      ck: "KPLdq1br4Fo42JcH",
      autoTrack: true,
      hashMode: true,
    },
  },

  email: {
    address: "574401159@qq.com",
    // true asks the browser to open the system's default mail client.
    openClientOnCommand: true,
  },

  education: {
    intro: "Here is my education background!",
    entries: [
      {
        degree: "M.Eng. in Cyberspace Security",
        institution: "Tsinghua University",
        period: "2021 - 2024",
      },
      {
        degree: "B.S. in Computer Science",
        institution: "Harvard University",
        period: "2017 - 2021",
      },
    ],
  },

  help: {
    // Keep command names unchanged; edit their descriptions as needed.
    commandDescriptions: {
      about: "about Thanatos",
      clear: "clear the terminal",
      echo: "print out anything",
      education: "my education background",
      email: "send me an email",
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
      "Here are some projects you can explore",
    ],
    // Project numbers are generated from the array order.
    links: [
      {
        title: "Hikvision-iSecureFucker",
        description:
          "A PySide6 desktop API testing tool for iSecure Center with AK/SK signing, request debugging, and integrated API docs.",
        url: "https://github.com/ThanatosXingYu/Hikvision-iSecureFucker",
      },
      {
        title: "GuardCV",
        description:
          "A desktop blind-watermarking tool for embedding and recovering traceable text in PDF and image resumes.",
        url: "https://github.com/ThanatosXingYu/GuardCV",
      },
      {
        title: "astrbot_plugin_qqmanager",
        description:
          "An AstrBot QQ group-management plugin with moderation, join review, blacklists, risk controls, and a visual settings panel.",
        url: "https://github.com/ThanatosXingYu/astrbot_plugin_qqmanager",
      },
      {
        title: "iKun_Keyboard",
        description:
          "A configurable Python keyboard soundboard with custom key mappings, startup settings, and packaged releases.",
        url: "https://github.com/ThanatosXingYu/iKun_Keyboard",
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
