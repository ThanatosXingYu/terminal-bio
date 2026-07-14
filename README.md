# terminal-bio

`terminal-bio` 是一个可自由定制的交互式终端个人主页模板。页面使用 React、TypeScript 和 styled-components 构建，在主题同色背景上呈现一个 macOS 风格的悬浮终端窗口。访客可以输入命令查看介绍、项目、社交地址、命令历史和主题列表。

![terminal-bio 效果图](./public/terminal-bio-preview.png)

## 页面效果

- 桌面端使用居中的 macOS 风格终端窗口，包含标题栏、红黄绿窗口标识、圆角、边框和阴影。
- 移动端自动切换为全屏终端，并适配移动设备安全区。
- 首页支持自定义 FIGlet 字符横幅和 ASCII 图。
- 页面背景、终端窗口、文字和滚动条会随当前主题同步变化。
- 终端内容独立滚动，新命令执行后自动定位到最新输出。

## 功能

- 支持 14 条内置终端命令。
- 支持 Tab 和 `Ctrl + I` 命令补全。
- 支持方向键浏览历史命令。
- 支持 `Ctrl + L` 或 `clear` 清空终端。
- 支持 6 套主题，并通过 `sessionStorage/localStorage` 保留相关状态。
- 提示符自动读取当前页面域名，例如 `localhost`、`127.0.0.1` 或正式域名。
- `whoami` 会尝试通过公开 IP 地理位置服务生成英文位置回显。
- 支持响应式布局、PWA 安装和离线缓存。
- 使用 Vitest 和 React Testing Library 进行回归测试。

## 内置命令

| 命令          | 说明                                            |
| ------------- | ----------------------------------------------- |
| `about`       | 显示站点作者简介                                |
| `clear`       | 清空终端历史                                    |
| `echo <text>` | 输出输入的文字                                  |
| `education`   | 显示教育经历，目前为待配置状态                  |
| `email`       | 显示联系方式，目前引导至 GitHub                 |
| `gui`         | 打开本项目 GitHub 仓库                          |
| `help`        | 显示命令和快捷键帮助                            |
| `history`     | 显示历史命令                                    |
| `projects`    | 显示项目列表，使用 `projects go 1` 打开项目     |
| `pwd`         | 显示模拟工作目录                                |
| `socials`     | 显示社交账号，使用 `socials go 1` 打开 GitHub   |
| `themes`      | 显示主题列表，使用 `themes set <name>` 切换主题 |
| `welcome`     | 重新显示首页欢迎内容                            |
| `whoami`      | 显示访客英文位置                                |

可用主题：`dark`、`light`、`blue-matrix`、`espresso`、`green-goblin`、`ubuntu`。

## 技术栈

- React 18
- TypeScript 5
- Vite 4
- styled-components 5
- Lodash
- Vitest
- React Testing Library
- vite-plugin-pwa

## 环境要求

- Node.js 18 或更高版本，推荐 Node.js 20 LTS
- npm 9 或更高版本

## 本地启动

```bash
npm install
npm run dev
```

默认访问地址：

```text
http://localhost:9487/
```

## 构建与检查

```bash
# TypeScript 检查并生成生产构建
npm run build

# 本地预览生产构建
npm run preview

# 单次运行测试
npm run test:once

# 监听模式运行测试
npm run test

# 生成覆盖率
npm run coverage

# ESLint 检查
npm run lint

# Prettier 检查
npm run format:check
```

生产构建输出在 `dist/` 目录，可部署到任意支持静态文件的网站托管服务。

## 项目结构

```text
terminal-bio/
├── public/                     # 图标、PWA 和分享资源
├── src/
│   ├── components/
│   │   ├── commands/           # 各终端命令输出
│   │   └── styles/             # styled-components 样式与主题
│   ├── config/site.ts          # 项目名、作者、仓库、项目和社交配置
│   ├── context/                # 访客域名和位置上下文
│   ├── hooks/                  # 主题 Hook
│   ├── services/               # IP 地理位置服务
│   ├── test/                   # Vitest 测试
│   └── utils/                  # 命令解析、补全和存储工具
├── index.html                  # SEO、分享卡片和站点入口
├── package.json
└── vite.config.ts              # Vite、Vitest 和 PWA 配置
```

## 个性化配置

常用身份和项目配置集中在：

```text
src/config/site.ts
```

可以在这里修改作者名、GitHub 用户名、仓库地址、项目列表和社交地址。

其他常用修改位置：

| 内容                          | 文件                                        |
| ----------------------------- | ------------------------------------------- |
| 合法命令及 help 描述          | `src/components/Terminal.tsx`               |
| 命令到输出组件的映射          | `src/components/Output.tsx`                 |
| 欢迎文字、姓名横幅和 ASCII 图 | `src/components/commands/Welcome.tsx`       |
| About 内容                    | `src/components/commands/About.tsx`         |
| 教育经历                      | `src/components/commands/Education.tsx`     |
| 窗口尺寸和 macOS 标题栏       | `src/components/styles/Terminal.styled.tsx` |
| 六套主题颜色                  | `src/components/styles/themes.ts`           |
| 页面标题、SEO 和分享卡片      | `index.html`                                |
| PWA 信息                      | `vite.config.ts`                            |

FIGlet 横幅可以使用以下命令重新生成：

```bash
npm install --global figlet-cli
figlet -f Slant "Your Name"
figlet -f "Small Slant" "Your Name"
```

把结果粘贴到 `Welcome.tsx` 的模板字符串时，需要转义反斜杠和反引号。

## 域名和访客位置

命令提示符通过 `window.location.hostname` 自动读取当前域名，因此开发环境和正式域名不需要分别配置。

访客位置查询按以下顺序串行回退：

1. `https://get.geojs.io/v1/ip/geo.json`
2. `https://api.ipapi.is/`
3. `https://ipwho.is/`

每个服务最多等待 3 秒。成功后只把格式化的英文位置缓存到当前标签页的 `sessionStorage`，缓存有效期为 1 小时，不会由本项目保存访客 IP。全部服务不可用时，`whoami` 回退为：

```text
a visitor from somewhere on Earth
```

IP 地理定位只能反映网络出口的大致位置，不代表访客的精确实时位置。浏览器会直接请求上述第三方服务，因此第三方能够看到请求 IP、User-Agent 和 Origin 等网络信息。免费接口没有 SLA，本项目通过超时、串行回退和会话缓存提高可用性，但不能保证所有中国大陆网络始终可访问。

## 部署

先生成生产构建：

```bash
npm run build
```

将 `dist/` 目录部署到静态托管服务即可。若部署在 GitHub Pages 的子路径 `/terminal-bio/` 下，需要同时在 `vite.config.ts` 设置对应的 `base`，并检查 PWA 图标路径；使用独立域名或根路径部署时无需修改。

## 许可证

项目使用 [MIT License](./LICENSE)。

## 致谢

本项目基于 [satnaing/terminal-portfolio](https://github.com/satnaing/terminal-portfolio) 修改。
