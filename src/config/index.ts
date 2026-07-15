import packageJson from "../../package.json";
import userConfig from "../../terminal.config";
import type { TerminalBioConfig } from "./types";

const HELP_COLUMN_WIDTH = 13;
const SOCIAL_COLUMN_WIDTH = 12;

export const terminalConfig: TerminalBioConfig = userConfig;

export const siteConfig = {
  ...terminalConfig.site,
  version: packageJson.version,
} as const;

export const commands = Object.entries(
  terminalConfig.help.commandDescriptions
).map(([cmd, desc]) => ({
  cmd,
  desc,
  tab: Math.max(0, HELP_COLUMN_WIDTH - cmd.length),
}));

export const projectLinks = terminalConfig.projects.links.map(
  ({ description, ...link }, index) => ({
    ...link,
    id: index + 1,
    desc: description,
  })
);

export const socialLinks = terminalConfig.socials.links.map((link, index) => {
  const id = index + 1;
  const labelLength = `${id}. ${link.title}`.length;

  return {
    ...link,
    id,
    tab: Math.max(0, SOCIAL_COLUMN_WIDTH - labelLength),
  };
});
