import {
  Cmd,
  CmdDesc,
  CmdList,
  HelpWrapper,
  KeyContainer,
} from "../styles/Help.styled";
import { commands, terminalConfig } from "../../config";
import { generateTabs } from "../../utils/funcs";

const SHORTCUT_KEY_WIDTH = 15;

const Help: React.FC = () => {
  return (
    <HelpWrapper data-testid="help">
      {commands.map(({ cmd, desc, tab }) => (
        <CmdList key={cmd}>
          <Cmd>{cmd}</Cmd>
          {generateTabs(tab)}
          <CmdDesc>- {desc}</CmdDesc>
        </CmdList>
      ))}
      <KeyContainer>
        {terminalConfig.help.shortcuts.map(shortcut => (
          <div key={shortcut.key}>
            {shortcut.key}
            {generateTabs(
              Math.max(0, SHORTCUT_KEY_WIDTH - shortcut.key.length)
            )}
            =&gt; {shortcut.description}
          </div>
        ))}
      </KeyContainer>
    </HelpWrapper>
  );
};

export default Help;
