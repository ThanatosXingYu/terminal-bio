import { Wrapper } from "../styles/Output.styled";
import { terminalConfig } from "../../config";

const Email: React.FC = () => {
  return <Wrapper data-testid="email">{terminalConfig.email.address}</Wrapper>;
};

export default Email;
