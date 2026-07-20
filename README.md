# terminal-bio

简体中文 | [English](./README.en.md)

一个可自由定制的 macOS 风格交互式终端个人主页模板，使用 React、TypeScript 和 styled-components 构建。

## 效果展示

[在线演示](https://blog.luckysix.cc/terminal-bio/)

![terminal-bio 效果图](./public/terminal-bio-preview.png)

## 亮点

- macOS 风格悬浮终端，桌面端居中显示，移动端自动适配全屏。
- 内置 14 条命令，支持命令补全、历史记录和快捷键操作。
- 内置 6 套主题，可手动切换，也可配置为每次刷新随机选择。
- 项目、社交链接、帮助文字和终端行为都通过一个配置文件管理。
- 提示符自动显示当前域名，`whoami` 可异步获取访客的英文位置。
- 可选的 NDJSON 命令日志，记录服务端时间、IP、原始命令和 User-Agent。
- 支持 PWA 安装、离线缓存和 GitHub Pages 自动部署。

## 快速开始

需要 Node.js `>=18.17` 和 npm `>=10`。

```bash
npm install
npm run dev
```

打开 <http://localhost:9487/>。

## 配置

日常定制只需要修改项目根目录的 [`terminal.config.mjs`](./terminal.config.mjs)。`src/config/` 和 `tooling/` 是内部配置与构建配置，更换主页内容时通常不用调整。

### 常用设置

| 配置项                      | 作用                                                         |
| --------------------------- | ------------------------------------------------------------ |
| `site`                      | 姓名、项目名、GitHub 地址、仓库地址和 `pwd` 输出             |
| `whoami.mode`               | `"simple"` 显示 `a visitor`；`"location"` 在后台获取英文位置 |
| `theme.randomOnRefresh`     | 是否在每次刷新时随机选择主题；关闭时默认使用 `dark`          |
| `logging.enabled`           | 是否记录访客提交的命令，默认开启                             |
| `analytics`                 | 51.LA 网站统计开关、SDK 地址和初始化参数，默认开启           |
| `email`                     | 邮箱地址，以及执行 `email` 时是否拉起系统默认邮件应用        |
| `education`                 | 教育经历介绍、学位、学校和时间                               |
| `help.commandDescriptions`  | `help` 中每条命令的说明                                      |
| `help.shortcuts`            | `help` 中的快捷键及说明                                      |
| `projects.intro` / `.links` | 项目列表的介绍、名称、说明和链接                             |
| `socials.intro` / `.links`  | 社交列表的介绍、平台名称和链接                               |

例如，修改终端行为：

```js
whoami: {
  mode: "location", // "simple" 或 "location"
},
theme: {
  randomOnRefresh: false,
},
logging: {
  enabled: true,
},
analytics: {
  enabled: true, // 设为 false 可关闭统计
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

页面会在首次加载后异步查询访客位置，因此终端输入不会等待定位请求。命令提示符中的域名来自 `window.location.hostname`，无需为 `localhost`、IP 或正式域名单独配置。启用 `email.openClientOnCommand` 后，浏览器会通过 `mailto:` 请求系统打开默认邮件应用；具体行为取决于访客的浏览器和系统是否配置了邮件处理程序。

51.LA 统计默认启用。构建工具会按照 `analytics` 配置，以同步方式将 SDK 和 `LA.init` 依次插入 `</head>` 前，不使用 `async` 或 `defer`。将 `analytics.enabled` 设为 `false` 即可关闭统计；修改统计配置后，需要重启 `npm run dev`，或重新执行 `npm run build`。

### Help、Projects 和 Socials

直接修改 `help.commandDescriptions` 中的文字即可调整命令说明，命令名应保持不变。

`education.entries` 中的每一项使用 `degree`、`institution` 和 `period` 配置学位、学校及时间。

向 `projects.links` 添加一个项目：

```js
{
  title: "Project Name",
  description: "A short project description.",
  url: "https://github.com/your-name/project-name",
},
```

向 `socials.links` 添加一个平台：

```js
{
  title: "Blog",
  url: "https://example.com",
},
```

项目和社交链接的编号按数组顺序自动生成，不需要填写 `id`。例如第二项分别使用 `projects go 2` 和 `socials go 2` 打开。

### 欢迎内容和样式

| 要修改的内容                        | 文件                                        |
| ----------------------------------- | ------------------------------------------- |
| 欢迎文字、FIGlet 姓名横幅、ASCII 图 | `src/components/commands/Welcome.tsx`       |
| About 内容                          | `src/components/commands/About.tsx`         |
| 教育经历和邮箱                      | `terminal.config.mjs`                       |
| 命令与输出组件的对应关系            | `src/components/Output.tsx`                 |
| 终端窗口尺寸和标题栏                | `src/components/styles/Terminal.styled.tsx` |
| 主题颜色                            | `src/components/styles/themes.ts`           |
| 页面标题、SEO 和分享卡片            | `index.html`                                |

FIGlet 横幅可使用 [FIGlet](http://www.figlet.org/) 在线生成，或执行：

```bash
npm exec --package=figlet-cli -- figlet -f Slant "Your Name"
```

将结果放进 `Welcome.tsx` 对应的模板字符串；其中的反斜杠和反引号需要按 JavaScript 模板字符串语法转义。ASCII 图也在同一文件中直接替换。

## 在线演示与部署

### GitHub Pages

项目包含 [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml)。它会在代码推送到 `main` 后自动构建并发布，也支持在 GitHub 的 **Actions** 页面点击 **Run workflow** 手动发布。

首次使用时：

1. 打开仓库的 **Settings > Pages**。
2. 将 **Build and deployment > Source** 设置为 **GitHub Actions**。
3. 推送一次 `main`，或在 Actions 页面手动运行 **Deploy GitHub Pages**。

发布地址格式为：

```text
https://<用户名>.github.io/<仓库名>/
```

如果账号的 Pages 已绑定自定义域名，GitHub 会自动改用该域名。本仓库的演示地址是 <https://blog.luckysix.cc/terminal-bio/>。Pages 是静态托管，没有可写的 Node 日志接口，因此工作流会在静态构建中关闭命令日志上报；其他功能保持不变。

### Node 服务

需要保留命令日志功能时，使用项目自带的 Node 服务：

```bash
npm run build
npm start
```

默认监听 `127.0.0.1:9487`，日志写入 `logs/commands.ndjson`。每条记录包含服务端 UTC 时间、IP、原始命令、hostname、path 和 User-Agent。`logging.enabled` 设为 `false` 可同时关闭前端上报和服务端写入。

## 命令与主题

内置命令：`about`、`clear`、`echo`、`education`、`email`、`gui`、`help`、`history`、`projects`、`pwd`、`socials`、`themes`、`welcome`、`whoami`。其中 `gui` 用于打开项目仓库。

常用参数：`projects go 1`、`socials go 1`、`themes set <name>`。

可用主题：`dark`、`light`、`blue-matrix`、`espresso`、`green-goblin`、`ubuntu`。

快捷键：Tab / `Ctrl + I` 补全命令，方向键上/下浏览历史，`Ctrl + L` 清屏。

## 开发检查

以下命令只在维护代码时按需使用，普通安装和运行不需要执行：

```bash
npm run test:once
npm run lint
npm run format:check
```

## 许可证

项目使用 [MIT License](./LICENSE)。

## 致谢

本项目基于 [satnaing/terminal-portfolio](https://github.com/satnaing/terminal-portfolio) 修改。
