import { useContext } from "react";
import { ProjectsIntro } from "../styles/Projects.styled";
import { Cmd, CmdDesc, CmdList, HelpWrapper } from "../styles/Help.styled";
import { generateTabs, isArgInvalid } from "../../utils/funcs";
import { termContext } from "../Terminal";
import Usage from "../Usage";
import { socialLinks, terminalConfig } from "../../config";

const socialIds = socialLinks.map(({ id }) => String(id));

const Socials: React.FC = () => {
  const { arg } = useContext(termContext);

  /* ===== check arg is valid ===== */
  const checkArg = () =>
    isArgInvalid(arg, "go", socialIds) ? <Usage cmd="socials" /> : null;

  return arg.length > 0 || arg.length > 2 ? (
    checkArg()
  ) : (
    <HelpWrapper data-testid="socials">
      <ProjectsIntro>{terminalConfig.socials.intro}</ProjectsIntro>
      {socialLinks.map(({ id, title, url, tab }) => (
        <CmdList key={id}>
          <Cmd>{`${id}. ${title}`}</Cmd>
          {generateTabs(tab)}
          <CmdDesc>- {url}</CmdDesc>
        </CmdList>
      ))}
      <Usage cmd="socials" marginY />
    </HelpWrapper>
  );
};

export default Socials;
