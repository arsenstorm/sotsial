// UI

// Utils
import clsx from "clsx";
// Components
import { Logo } from "@/components/logo";
import { Subheading } from "@/components/ui/heading";
import { Text, TextLink } from "@/components/ui/text";

export function Footer({
  className,
  simpleFooter,
  forceDark,
}: Readonly<{
  className?: string;
  simpleFooter?: boolean;
  forceDark?: boolean;
}>) {
  return (
    <footer
      className={clsx(
        "mx-auto flex max-w-7xl flex-col gap-y-8 px-4 sm:gap-y-16",
        className
      )}
    >
      {!simpleFooter && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-7">
            <TextLink
              className={clsx(
                "flex flex-row items-center gap-x-2 font-semibold",
                forceDark && "!text-black"
              )}
              href="/"
            >
              <Logo className="h-6" />
              Sotsial
            </TextLink>
          </div>
          <div className="flex flex-col gap-4 md:col-span-5 md:flex-row md:justify-between">
            <div>
              <Subheading
                className={clsx(forceDark && "!text-black !decoration-black")}
              >
                Links
              </Subheading>
              <ul>
                <li>
                  <Text>
                    <TextLink
                      className={clsx(
                        forceDark && "!text-black !decoration-black"
                      )}
                      href="/docs"
                    >
                      Documentation
                    </TextLink>
                  </Text>
                </li>
                <li>
                  <Text>
                    <TextLink
                      className={clsx(
                        forceDark && "!text-black !decoration-black"
                      )}
                      href="/pricing"
                    >
                      Pricing
                    </TextLink>
                  </Text>
                </li>
                <li>
                  <Text>
                    <TextLink
                      className={clsx(
                        forceDark && "!text-black !decoration-black"
                      )}
                      href="https://github.com/arsenstorm/sotsial"
                    >
                      GitHub
                    </TextLink>
                  </Text>
                </li>
              </ul>
            </div>
            <div>
              <Subheading
                className={clsx(forceDark && "!text-black !decoration-black")}
              >
                Important Stuff
              </Subheading>
              <ul>
                <li>
                  <Text>
                    <TextLink
                      className={clsx(
                        forceDark && "!text-black !decoration-black"
                      )}
                      href="/privacy"
                    >
                      Privacy Policy
                    </TextLink>
                  </Text>
                </li>
                <li>
                  <Text>
                    <TextLink
                      className={clsx(
                        forceDark && "!text-black !decoration-black"
                      )}
                      href="/security"
                    >
                      Security Policy
                    </TextLink>
                  </Text>
                </li>
                <li>
                  <Text>
                    <TextLink
                      className={clsx(
                        forceDark && "!text-black !decoration-black"
                      )}
                      href="/terms"
                    >
                      Terms of Service
                    </TextLink>
                  </Text>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Text className={clsx(forceDark && "!text-black")}>
          &copy; 2025 Sotsial. All rights reserved.
        </Text>
        <Text className={clsx(forceDark && "!text-black")}>
          Made with ❤️ by{" "}
          <TextLink
            className={clsx(
              "underline-offset-2",
              forceDark && "!text-black !decoration-black"
            )}
            href="https://arsenstorm.com?ref=sotsial"
          >
            Arsen Shkrumelyak
          </TextLink>
          .
        </Text>
      </div>
    </footer>
  );
}
