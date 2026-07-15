import { Wrapper } from "../styles/Output.styled";
import { siteConfig } from "../../config";

const Email: React.FC = () => {
  return (
    <Wrapper>
      <span>
        Email is not configured. Contact {siteConfig.ownerName} on GitHub:{" "}
        {siteConfig.githubProfileUrl}
      </span>
    </Wrapper>
  );
};

export default Email;
