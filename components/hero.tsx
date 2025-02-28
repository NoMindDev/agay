import NLCSLogo from "./nlcs-logo";
import NoMindLogo from "./nomind-logo";

export default function Header() {
  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="flex gap-8 justify-center items-center">
        <a href="https://nlcs.bt" target="_blank" rel="noreferrer">
          <NLCSLogo />
        </a>
      </div>
      <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
      <div className="flex flex-col">
        <p className="text-3xl lg:text-5xl !leading-tight mx-auto max-w-xl text-center font-medium">
          Hello there dev!
        </p>
        <p className="text-lg text-zinc-400 dark:text-zinc-600 lg:text-xl !leading-tight mx-auto max-w-xl text-center">
          Follow below to setup your local environment.
        </p>
      </div>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
