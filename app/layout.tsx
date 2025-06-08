import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "@/styles/main.css";
import { Toaster } from "@/components/ui/sonner";
import { readUserSession } from "@/utils/supabase/auth";
import { redirect } from "next/navigation";
import { useUserStore } from "@/lib/store/user";
import { createClient } from "@/utils/supabase/server";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Agay | NLCS RAG Agent",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { data: userSession } = await readUserSession();

  // if (!userSession.session) {
  //   return redirect("/sign-in");
  // }

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
