"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export function Captcha({
  invisible = false,
}: {
  readonly invisible?: boolean;
}) {
  const ref = useRef<TurnstileInstance>(null);
  const { setCaptchaToken, setResetCaptcha } = useCaptcha();

  useEffect(() => {
    setResetCaptcha(() => () => ref.current?.reset());
  }, [setResetCaptcha]);

  if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
    if (process.env.NODE_ENV === "development") {
      console.warn("NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set");
    }
    return null;
  }

  return (
    <Turnstile
      className={(invisible && "hidden") || ""}
      onExpire={() => ref.current?.reset()}
      onSuccess={(token: string) => {
        setCaptchaToken(token);
      }}
      ref={ref}
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
    />
  );
}

interface CaptchaContextType {
  captchaToken: string;
  resetCaptcha: () => void;
  setCaptchaToken: (token: string) => void;
  setResetCaptcha: (resetFn: () => void) => void;
}

const CaptchaContext = createContext<CaptchaContextType | undefined>(undefined);

export const useCaptcha = () => {
  const context = useContext(CaptchaContext);
  if (!context) {
    throw new Error("useCaptcha must be used within a CaptchaProvider");
  }
  return context;
};

export const CaptchaProvider = ({ children }: { children: ReactNode }) => {
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [resetCaptcha, setResetCaptcha] = useState<() => void>(() => () => {});

  const value = useMemo(
    () => ({
      captchaToken,
      setCaptchaToken,
      resetCaptcha,
      setResetCaptcha,
    }),
    [captchaToken, resetCaptcha]
  );

  return (
    <CaptchaContext.Provider value={value}>{children}</CaptchaContext.Provider>
  );
};
