"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ConversationPage() {
  const supabase = createClient();
  const router = useRouter();

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;
    setIsLoading(true);

    try {
      // User
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 1 >>> Create a new conversation*
      const { data: conversation, error: convError } = await supabase
        .from("conversations")
        .insert([{ created_by: user?.id, title: inputValue.slice(0, 40) }])
        .select()
        .single();

      if (convError || !conversation) {
        toast.error("Failed to create conversation", {
          description: convError?.message || "Unknown error",
        });
        throw convError || new Error("Failed to create conversation");
      }

      // 2 >>> Insert the initial message from the user
      const { error: msgError } = await supabase.from("messages").insert([
        {
          conversation_id: conversation.id,
          content: inputValue,
          sender: "USER", // Use enum uppercase
        },
      ]);

      if (msgError) {
        toast.error("Failed to send message", {
          description: msgError.message || "Unknown error",
        });
        throw msgError;
      }

      // 3 >>> Send the message to the bot
      const response = await fetch("https://nlcs-rag.onrender.com/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: inputValue,
          session_id: conversation.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from the server.");
      }

      const data = await response.json();

      // 4 >>> Save the bot response in the conversation
      const { error: responseMsgError } = await supabase
        .from("messages")
        .insert([
          {
            conversation_id: conversation.id,
            content: data.answer,
            trace: data.trace,
            sender: "BOT",
          },
        ]);

      if (responseMsgError) {
        toast.error("Failed to send message", {
          description: responseMsgError.message || "Unknown error",
        });
        throw msgError;
      }

      // 5 >>> Redirect the user to the conversation page
      setInputValue("");
      router.push(`/chats/${conversation.id}`);
    } catch (error: any) {
      console.error("Error creating conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-[70%] relative">
        <input
          type="text"
          placeholder="Ask Agay"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="w-full border border-gray-300 rounded-full py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
        />
        <button
          onClick={handleSendMessage}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
