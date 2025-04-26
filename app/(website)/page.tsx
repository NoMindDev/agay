"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, BookOpen } from "lucide-react";
import Link from "next/link";

const WebsiteLanding = () => {
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return now.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  });

  return (
    <div className="flex-1 p-6 flex flex-col items-center pt-16">
      <h1 className="text-5xl font-medium text-gray-800">{currentTime}</h1>
      <p className="text-xl text-orange-400 mt-4 mb-12">
        Hello Kuenzang, we are glad to have you.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Chatbot Card */}
        <Link href="/chats">
          <Card className="bg-gray-50 border border-gray-200 cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl flex flex-col justify-between min-h-[200px]">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Bot className="h-4 w-4 text-blue-500" />
              </div>
              <h3 className="font-medium text-lg mb-1">Chat with AI</h3>
              <p className="text-sm text-gray-500">
                Interact with the chatbot to get instant help and guidance.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Repositories Card */}
        <Link href="/repositories">
          <Card className="bg-gray-50 border border-gray-200 cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl flex flex-col justify-between min-h-[200px]">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <BookOpen className="h-4 w-4 text-green-500" />
              </div>
              <h3 className="font-medium text-lg mb-1">Browse Repositories</h3>
              <p className="text-sm text-gray-500">
                Search and explore content from your uploaded documents.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default WebsiteLanding;

// <>
//   <Hero />
//   <main className="flex-1 flex flex-col gap-6 px-4">
//     <h2 className="font-medium text-xl mb-4">Next steps</h2>
//     {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
//   </main>
// </>
