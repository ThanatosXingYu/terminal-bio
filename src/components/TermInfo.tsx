import { User, WebsiteName, Wrapper } from "./styles/TerminalInfo.styled";
import { useVisitor } from "../context/VisitorContext";

const TermInfo = () => {
  const { hostname } = useVisitor();

  return (
    <Wrapper>
      <User>visitor</User>@<WebsiteName>{hostname}</WebsiteName>:~$
    </Wrapper>
  );
};

export default TermInfo;
