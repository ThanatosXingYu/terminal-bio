import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { terminalConfig } from "../config";
import { getVisitorLocation } from "../services/visitorLocation";

type VisitorStatus = "loading" | "ready" | "unavailable";

type VisitorContextValue = {
  hostname: string;
  location: string | null;
  status: VisitorStatus;
  whoami: string;
};

const fallbackContext: VisitorContextValue = {
  hostname: "localhost",
  location: null,
  status: "loading",
  whoami: "a visitor",
};

export const visitorContext =
  createContext<VisitorContextValue>(fallbackContext);

export const getCurrentHostname = () => {
  if (typeof window === "undefined") return "localhost";
  return window.location.hostname || "localhost";
};

type VisitorProviderProps = {
  children: ReactNode;
  whoamiMode?: "simple" | "location";
};

export const VisitorProvider = ({
  children,
  whoamiMode = terminalConfig.whoami.mode,
}: VisitorProviderProps) => {
  const shouldLocate = whoamiMode === "location";
  const [location, setLocation] = useState<string | null>(null);
  const [status, setStatus] = useState<VisitorStatus>(
    shouldLocate ? "loading" : "ready"
  );

  useEffect(() => {
    if (!shouldLocate) {
      setLocation(null);
      setStatus("ready");
      return;
    }

    let active = true;
    setStatus("loading");

    getVisitorLocation().then(visitorLocation => {
      if (!active) return;

      setLocation(visitorLocation);
      setStatus(visitorLocation ? "ready" : "unavailable");
    });

    return () => {
      active = false;
    };
  }, [shouldLocate]);

  const whoami = !shouldLocate
    ? "a visitor"
    : status === "unavailable"
    ? "a visitor from somewhere on Earth"
    : location
    ? `a visitor from ${location}`
    : "a visitor";

  return (
    <visitorContext.Provider
      value={{
        hostname: getCurrentHostname(),
        location,
        status,
        whoami,
      }}
    >
      {children}
    </visitorContext.Provider>
  );
};

export const useVisitor = () => useContext(visitorContext);
