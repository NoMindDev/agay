import { TutorialStep } from "./tutorial-step";

export default function ConnectSupabaseSteps() {
  return (
    <ol className="flex flex-col gap-6">
      <TutorialStep title="Pull the latest commit">
        <p>
          {" "}
          <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
            git pull
          </span>{" "}
          the latest commit and then open docker
        </p>
      </TutorialStep>

      <TutorialStep title="Start up a local supabase instance">
        <p>
          Open your docker app and do an{" "}
          <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
            npx supabase start
          </span>
        </p>
      </TutorialStep>

      <TutorialStep title="Declare environment variables">
        <p>
          Rename the{" "}
          <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
            .env.example
          </span>{" "}
          file in your Next.js app to{" "}
          <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
            .env.local
          </span>{" "}
          and populate with values you get by doing{" "}
          <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
            npx supabase status
          </span>{" "}
        </p>
      </TutorialStep>

      <TutorialStep title="Restart your Next.js development server">
        <p>
          You may need to quit your Next.js development server and run{" "}
          <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
            npm run dev
          </span>{" "}
          again to load the new environment variables.
        </p>
      </TutorialStep>

      <TutorialStep title="Refresh the page">
        <p>
          You may need to refresh the page for Next.js to load the new
          environment variables.
        </p>
      </TutorialStep>
    </ol>
  );
}
