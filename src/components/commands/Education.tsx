import { terminalConfig } from "../../config";
import { EduIntro, EduList } from "../styles/Education.styled";
import { Wrapper } from "../styles/Output.styled";

const Education: React.FC = () => {
  return (
    <Wrapper data-testid="education">
      <EduIntro>{terminalConfig.education.intro}</EduIntro>
      {terminalConfig.education.entries.map(
        ({ degree, institution, period }) => (
          <EduList key={`${institution}-${period}-${degree}`}>
            <div className="title">{degree}</div>
            <div className="desc">
              {institution} | {period}
            </div>
          </EduList>
        )
      )}
    </Wrapper>
  );
};

export default Education;
