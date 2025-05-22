import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import AgayLogo from "@/components/agay-logo";
import Sidebar from "@/components/website/Sidebar";
import Header from "@/components/website/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Fixed Sidebar */}
      <div className="w-[240px] shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <div className="shrink-0">
          <Header />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto bg-white p-4">{children}</div>
      </div>
    </div>
  );
}

{
  /* <div>
<main className="min-h-screen flex flex-col items-center">
  <div className="flex-1 w-full flex flex-col gap-20 items-center">
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-2 items-center font-semibold">
          <AgayLogo />
          <Link href={"/"}>Agay</Link>
        </div>
        {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
      </div>
    </nav>
    <div className="flex flex-col gap-20 max-w-5xl p-5">{children}</div>

    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
      <p>
        Powered by{" "}
        <a
          href="https://nomindbhutan.com"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          NoMindBhutan
        </a>
      </p>
      <ThemeSwitcher />
    </footer>
  </div>
</main>
</div> */
}
