import {
  Cmd,
  HeroContainer,
  Link,
  PreImg,
  PreName,
  PreNameMobile,
  PreWrapper,
  Seperator,
} from "../styles/Welcome.styled";
import { siteConfig } from "../../config";

const Welcome: React.FC = () => {
  return (
    <HeroContainer data-testid="welcome">
      <div className="info-section">
        <PreName>
          {`
  ________                      __
 /_  __/ /_  ____ _____  ____ _/ /_____  _____
  / / / __ \\/ __ \`/ __ \\/ __ \`/ __/ __ \\/ ___/
 / / / / / / /_/ / / / / /_/ / /_/ /_/ (__  )
/_/ /_/ /_/\\__,_/_/ /_/\\__,_/\\__/\\____/____/
          `}
        </PreName>
        <PreWrapper>
          <PreNameMobile>
            {`
 ________                  __
/_  __/ /  ___ ____  ___ _/ /____  ___
 / / / _ \\/ _ \`/ _ \\/ _ \`/ __/ _ \\(_-<
/_/ /_//_/\\_,_/_//_/\\_,_/\\__/\\___/___/
          `}
          </PreNameMobile>
        </PreWrapper>
        <div>
          Welcome to {siteConfig.ownerName}' homepage. (Version{" "}
          {siteConfig.version})
        </div>
        <Seperator>----</Seperator>
        <div>
          This project's source code can be found in this project's{" "}
          <Link
            href={siteConfig.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub repo
          </Link>
          .
        </div>
        <Seperator>----</Seperator>
        <div>
          For a list of available commands, type `<Cmd>help</Cmd>`.
        </div>
      </div>
      <div className="illu-section">
        <PreImg>
          {`
                    'c.
                 ,xNMM.
               .OMMMMo
               OMMM0,
     .;loddo:' loolloddol;.
   cKMMMMMMMMMMNWMMMMMMMMMM0:
 .KMMMMMMMMMMMMMMMMMMMMMMMWd.
 XMMMMMMMMMMMMMMMMMMMMMMMX.
;MMMMMMMMMMMMMMMMMMMMMMMM:
:MMMMMMMMMMMMMMMMMMMMMMMM:
.MMMMMMMMMMMMMMMMMMMMMMMMX.
 kMMMMMMMMMMMMMMMMMMMMMMMMWd.
 .XMMMMMMMMMMMMMMMMMMMMMMMMMMk
  .XMMMMMMMMMMMMMMMMMMMMMMMMK.
    kMMMMMMMMMMMMMMMMMMMMMMd
     ;KMMMMMMMWXXWMMMMMMMk.
       .cooc,.    .,coo:.
         `}
        </PreImg>
      </div>
    </HeroContainer>
  );
};

export default Welcome;
