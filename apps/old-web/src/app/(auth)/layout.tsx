// Components

import Link from "next/link";
import { Logo } from "@/components/logo";

// Auth
import AuthCheckpoint from "@/utils/auth/checkpoint";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthCheckpoint ifAuthenticated="/home">
      <div className="min-h-screen bg-white text-black">
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col border-black/10 border-dashed px-4 min-md:border-x">
          <header className="mb-6 flex h-[88px] w-full items-center border-black/10 border-b border-dashed py-6">
            <div className="container mx-auto flex items-center justify-between">
              <Link className="flex items-center gap-2 text-black" href="/">
                <Logo className="h-6 w-6" />
                <span className="font-medium text-xl">Sotsial</span>
              </Link>
            </div>
          </header>
          <div className="flex-1 grow">{children}</div>
          <footer className="mt-6 w-full border-black/10 border-t border-dashed py-6">
            <div className="container mx-auto flex items-center justify-between">
              <p className="text-black/50 text-sm">
                &copy; {new Date().getFullYear()} Arsen Shkrumelyak. All rights
                reserved.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </AuthCheckpoint>
  );
}
