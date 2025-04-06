"use client";

import { useState } from "react";
import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Home, Plus, Send, User, Settings, LogOut } from "lucide-react";

export default function Page() {
  const [inputValue, setInputValue] = useState("");
  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-light text-orange-400 mb-8">
          Hello Sara,
        </h2>

        {/* Recent Conversation Card */}
        <div className="max-w-md w-full border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
            Move to recent conversation
          </div>
          <div className="p-4 flex items-start gap-3">
            <span className="text-gray-500 mt-1">=</span>
            <div className="text-gray-800">
              Get the land with the Thram No 2 and the owner Rinzin
            </div>
            <button className="ml-auto text-gray-400 hover:text-gray-600">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 flex justify-center">
        <div className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Ask Agay"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full border border-gray-300 rounded-full py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
          />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={!inputValue}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
}

// <>
//   <Hero />
//   <main className="flex-1 flex flex-col gap-6 px-4">
//     <h2 className="font-medium text-xl mb-4">Next steps</h2>
//     {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
//   </main>
// </>
