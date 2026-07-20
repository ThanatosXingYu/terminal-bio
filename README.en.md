# terminal-bio

[简体中文](./README.md) | English

A customizable, macOS-style interactive terminal portfolio template built with React, TypeScript, and styled-components.

## Preview

[Live Demo](https://blog.luckysix.cc/terminal-bio/)

![terminal-bio preview](./public/terminal-bio-preview.png)

## Highlights

- A floating macOS-style terminal window centered on desktop and adapted to full screen on mobile.
- 14 built-in commands with autocomplete, command history, and keyboard shortcuts.
- Six switchable themes with optional random selection on every refresh.
- One configuration file for projects, social links, help text, and terminal behavior.
- Automatic hostname prompts and optional asynchronous visitor location lookup.
- Optional NDJSON command logging for server time, IP, raw commands, and User-Agent.
- Installable PWA with offline caching and automated GitHub Pages deployment.

## Quick Start

Requires Node.js `>=18.17` and npm `>=10`.

```bash
npm install
npm run dev
```

Open <http://localhost:9487/>.

## Configuration

For everyday customization, edit [`terminal.config.mjs`](./terminal.config.mjs) in the project root. `src/config/` and `tooling/` contain internal and build configuration and usually do not need changes when personalizing the homepage.

### Common Settings

| Setting                     | Purpose                                                                 |
| --------------------------- | ----------------------------------------------------------------------- |
| `site`                      | Owner name, project name, GitHub URLs, repository URL, and `pwd`        |
| `whoami.mode`               | `"simple"` prints `a visitor`; `"location"` fetches an English location |
| `theme.randomOnRefresh`     | Randomize the theme on refresh; otherwise fall back to `dark`           |
| `logging.enabled`           | Record submitted visitor commands; enabled by default                   |
| `analytics`                 | 51.LA toggle, SDK URL, and initialization options; enabled by default   |
| `email`                     | Email address and whether `email` opens the system mail application     |
| `education`                 | Education introduction, degrees, institutions, and periods              |
| `help.commandDescriptions`  | Descriptions displayed by `help`                                        |
| `help.shortcuts`            | Shortcut names and descriptions displayed by `help`                     |
| `projects.intro` / `.links` | Project list introduction, titles, descriptions, and URLs               |
| `socials.intro` / `.links`  | Social list introduction, platform names, and URLs                      |

For example, change terminal behavior with:

```js
whoami: {
  mode: "location", // "simple" or "location"
},
theme: {
  randomOnRefresh: false,
},
logging: {
  enabled: true,
},
analytics: {
  enabled: true, // Set to false to disable analytics
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
  address: "your-name@example.com",
  openClientOnCommand: true,
},
```

The page starts location lookup asynchronously after its first load, so terminal input does not wait for the request. The prompt reads its hostname from `window.location.hostname`; no separate configuration is needed for localhost, an IP address, or a production domain. With `email.openClientOnCommand` enabled, the browser uses `mailto:` to ask the system to open its default mail application; the final behavior depends on the visitor's browser and configured mail handler.

51.LA analytics is enabled by default. The build tooling synchronously inserts the SDK and `LA.init`, in that order, before `</head>` without `async` or `defer`. Set `analytics.enabled` to `false` to disable analytics. After changing the analytics settings, restart `npm run dev` or run `npm run build` again.

### Help, Projects, and Socials

Edit the text in `help.commandDescriptions` to customize command descriptions. Keep the built-in command names unchanged.

Each item in `education.entries` uses `degree`, `institution`, and `period` to configure a qualification, school, and date range.

Add a project to `projects.links`:

```js
{
  title: "Project Name",
  description: "A short project description.",
  url: "https://github.com/your-name/project-name",
},
```

Add a platform to `socials.links`:

```js
{
  title: "Blog",
  url: "https://example.com",
},
```

Project and social IDs are generated from their array order. Do not add an `id`; the second entries are opened with `projects go 2` and `socials go 2`.

### Welcome Content and Styling

| Content                                | File                                        |
| -------------------------------------- | ------------------------------------------- |
| Welcome text, FIGlet banner, ASCII art | `src/components/commands/Welcome.tsx`       |
| About content                          | `src/components/commands/About.tsx`         |
| Education and email                    | `terminal.config.mjs`                       |
| Command-to-output component mapping    | `src/components/Output.tsx`                 |
| Terminal dimensions and title bar      | `src/components/styles/Terminal.styled.tsx` |
| Theme colors                           | `src/components/styles/themes.ts`           |
| Page title, SEO, and social preview    | `index.html`                                |

Generate a FIGlet banner with the [FIGlet web tool](http://www.figlet.org/) or run:

```bash
npm exec --package=figlet-cli -- figlet -f Slant "Your Name"
```

Place the result in the matching template string in `Welcome.tsx`. Escape backslashes and backticks according to JavaScript template string syntax. Replace the ASCII art directly in the same file.

## Live Demo and Deployment

### GitHub Pages

The included [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml) builds and deploys every push to `main`. It also supports manual deployment through **Run workflow** on GitHub's **Actions** page.

For the first deployment:

1. Open **Settings > Pages** in the repository.
2. Set **Build and deployment > Source** to **GitHub Actions**.
3. Push to `main`, or manually run **Deploy GitHub Pages** from Actions.

The deployed URL follows this format:

```text
https://<username>.github.io/<repository>/
```

If the account already uses a custom Pages domain, GitHub automatically uses that domain instead. This repository is available at <https://blog.luckysix.cc/terminal-bio/>. GitHub Pages is static and has no writable Node logging API, so the workflow disables command log requests in its static build. All other terminal features remain available.

### Node Server

To keep command logging, run the included Node server:

```bash
npm run build
npm start
```

It listens on `127.0.0.1:9487` by default and writes logs to `logs/commands.ndjson`. Each record contains the server UTC timestamp, IP, raw command, hostname, path, and User-Agent. Set `logging.enabled` to `false` to disable both client reporting and server writes.

## Commands and Themes

Built-in commands: `about`, `clear`, `echo`, `education`, `email`, `gui`, `help`, `history`, `projects`, `pwd`, `socials`, `themes`, `welcome`, and `whoami`. The `gui` command opens the project repository.

Common arguments: `projects go 1`, `socials go 1`, and `themes set <name>`.

Available themes: `dark`, `light`, `blue-matrix`, `espresso`, `green-goblin`, and `ubuntu`.

Shortcuts: Tab / `Ctrl + I` for autocomplete, Up/Down for command history, and `Ctrl + L` to clear the terminal.

## Development Checks

These commands are optional when maintaining the codebase and are not required for normal installation or use:

```bash
npm run test:once
npm run lint
npm run format:check
```

## License

Licensed under the [MIT License](./LICENSE).

## Credits

Based on [satnaing/terminal-portfolio](https://github.com/satnaing/terminal-portfolio).
