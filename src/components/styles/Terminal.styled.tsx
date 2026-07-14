import styled from "styled-components";

export const TerminalPage = styled.main`
  min-height: 100vh;
  min-height: 100dvh;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors?.body};

  @media (max-width: 768px) {
    padding: 0;
    align-items: stretch;
    justify-content: flex-start;
  }
`;

export const TerminalWindow = styled.section`
  width: 80vw;
  height: 80vh;
  height: 80dvh;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  background: ${({ theme }) => theme.window?.background ?? theme.colors?.body};
  border: 1px solid ${({ theme }) => theme.window?.border ?? "transparent"};
  box-shadow: ${({ theme }) => theme.window?.shadow ?? "none"};
  overflow: hidden;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 100%;
    height: 100vh;
    height: 100dvh;
    max-width: none;
    border-radius: 0;
    border: none;
    box-shadow: none;
  }
`;

export const TitleBar = styled.header`
  height: 44px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  flex-shrink: 0;
  padding: 0 0.875rem;
  background: ${({ theme }) => theme.window?.titleBar ?? "transparent"};
  border-bottom: 1px solid
    ${({ theme }) => theme.window?.divider ?? "transparent"};
  box-sizing: border-box;
  user-select: none;

  @supports (
    (-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))
  ) {
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
  }

  @media (max-width: 768px) {
    height: calc(44px + env(safe-area-inset-top));
    padding-top: env(safe-area-inset-top);
  }
`;

export const WindowControls = styled.div`
  justify-self: start;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const trafficLightColors = {
  close: "#FF5F57",
  minimize: "#FEBC2E",
  zoom: "#28C840",
};

export const TrafficLight = styled.span<{
  $variant: keyof typeof trafficLightColors;
}>`
  width: 12px;
  height: 12px;
  flex: 0 0 12px;
  border-radius: 999px;
  background: ${({ $variant }) => trafficLightColors[$variant]};
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.18);
`;

export const WindowTitle = styled.div`
  justify-self: center;
  max-width: 100%;
  padding: 0 0.5rem;
  overflow: hidden;
  color: ${({ theme }) => theme.colors?.text[200]};
  font-size: 0.75rem;
  line-height: 1;
  letter-spacing: 0;
  opacity: 0.9;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const TerminalBody = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.window?.background ?? theme.colors?.body};
`;

export const Wrapper = styled.div`
  flex: 1;
  min-height: 0;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-gutter: stable;

  @media (max-width: 768px) {
    padding: 1rem;
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  }
`;

export const CmdNotFound = styled.div`
  margin-top: 0.25rem;
  margin-bottom: 1rem;
`;

export const Empty = styled.div`
  margin-bottom: 0.25rem;
`;

export const MobileSpan = styled.span`
  line-height: 1.5rem;
  margin-right: 0.75rem;

  @media (min-width: 550px) {
    display: none;
  }
`;

export const MobileBr = styled.br`
  @media (min-width: 550px) {
    display: none;
  }
`;

export const Form = styled.form`
  @media (min-width: 550px) {
    display: flex;
  }
`;

export const Input = styled.input`
  flex-grow: 1;

  @media (max-width: 550px) {
    min-width: 85%;
  }
`;

export const Hints = styled.span`
  margin-right: 0.875rem;
`;
