import {
  AboutWrapper,
  HighlightAlt,
  HighlightSpan,
} from "../styles/About.styled";
import { siteConfig } from "../../config";

const About: React.FC = () => {
  return (
    <AboutWrapper data-testid="about">
      <p>
        Hi, my name is <HighlightSpan>{siteConfig.ownerName}</HighlightSpan>!
      </p>
      <p>
        I'm <HighlightAlt>a developer</HighlightAlt> who enjoys building useful
        software.
      </p>
      <p>
        This terminal is an interactive introduction to my work and projects.
      </p>
    </AboutWrapper>
  );
};

export default About;
