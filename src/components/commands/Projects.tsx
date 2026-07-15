import { Fragment, useContext } from "react";
import { isArgInvalid } from "../../utils/funcs";
import {
  ProjectContainer,
  ProjectDesc,
  ProjectsIntro,
  ProjectTitle,
} from "../styles/Projects.styled";
import { termContext } from "../Terminal";
import Usage from "../Usage";
import { projectLinks, terminalConfig } from "../../config";

const projectIds = projectLinks.map(({ id }) => String(id));

const Projects: React.FC = () => {
  const { arg } = useContext(termContext);

  /* ===== check arg is valid ===== */
  const checkArg = () =>
    isArgInvalid(arg, "go", projectIds) ? <Usage cmd="projects" /> : null;

  return arg.length > 0 || arg.length > 2 ? (
    checkArg()
  ) : (
    <div data-testid="projects">
      <ProjectsIntro>
        {terminalConfig.projects.intro.map((line, index) => (
          <Fragment key={`${index}-${line}`}>
            {index > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </ProjectsIntro>
      {projectLinks.map(({ id, title, desc }) => (
        <ProjectContainer key={id}>
          <ProjectTitle>{`${id}. ${title}`}</ProjectTitle>
          <ProjectDesc>{desc}</ProjectDesc>
        </ProjectContainer>
      ))}
      <Usage cmd="projects" marginY />
    </div>
  );
};

export default Projects;
