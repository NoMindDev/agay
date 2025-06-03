"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image"; // ✅ import next/image

export default function ConversationPage() {
  const supabase = createClient();
  const router = useRouter();

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

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

      const { error: msgError } = await supabase.from("messages").insert([
        {
          conversation_id: conversation.id,
          content: inputValue,
          sender: "USER",
        },
      ]);

      if (msgError) {
        toast.error("Failed to send message", {
          description: msgError.message || "Unknown error",
        });
        throw msgError;
      }

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

      setInputValue("");
      router.push(`/chats/${conversation.id}`);
    } catch (error: any) {
      console.error("Error creating conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full overflow-hidden flex flex-col items-center justify-center px-4 bg-gray-50">
      {/* Title and Icon */}
      <div className="mb-8 flex items-center justify-center space-x-4">
        <Image
          src="/agay.png"
          alt="Agay Icon"
          width={48}
          height={48}
          className="rounded-full shadow-md object-cover"
        />
        <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
          Ask Agay
        </h1>
      </div>

      {/* Input */}
      <div className="w-full max-w-xl relative">
        <input
          type="text"
          placeholder="Type your question..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="w-full border border-gray-300 rounded-full py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white shadow-sm"
        />
        <button
          onClick={handleSendMessage}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 transition"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
