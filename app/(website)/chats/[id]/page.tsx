"use client";

import { useState, useRef, useEffect, use } from "react";
import { Send, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import TraceViewer from "@/lib/trace_utils";

type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  trace?: string | null;
};

export default function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createClient();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const unwrappedParams = use(params); // Unwrap the Promise to access `id`
  const { id } = unwrappedParams;

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Save User Message
    const { error: msgError } = await supabase.from("messages").insert([
      {
        conversation_id: id,
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

    // Add temporary loading message
    const loadingMessage: Message = {
      id: "loading",
      content: "Thinking...",
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, loadingMessage]);

    // Payload for the bot request
    const context = messages
      .map((msg) => `${msg.sender === "user" ? "User" : "Bot"}: ${msg.content}`)
      .join(" ");

    const combinedQuestion = `${context} User: ${inputValue}`;

    // Send the message to the bot
    try {
      const response = await fetch("https://nlcs-rag.onrender.com/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: combinedQuestion }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from the server.");
      }

      const data = await response.json();

      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== "loading") // remove loading message
          .concat({
            id: (Date.now() + 1).toString(),
            content: data.answer || "Sorry, I couldn't find an answer.",
            sender: "bot",
            trace: data.trace || null,
            timestamp: new Date(),
          })
      );

      // Save the bot response in the conversation
      const { error: responseMsgError } = await supabase
        .from("messages")
        .insert([
          {
            conversation_id: id,
            content: data.answer || "Sorry, I couldn't find an answer.",
            trace: data.trace || null,
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
    } catch (error: any) {
      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== "loading")
          .concat({
            id: (Date.now() + 1).toString(),
            content: "Sorry, there was an error contacting the server.",
            sender: "bot",
            timestamp: new Date(),
          })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Fetch messages from Supabase
  useEffect(() => {
    if (!id) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, content, sender, created_at, trace") // include trace here
        .eq("conversation_id", id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      if (data) {
        // Map DB sender ('USER'|'BOT') to lowercase ('user'|'bot')
        const mappedMessages = data.map((msg) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender.toLowerCase() as "user" | "bot",
          timestamp: new Date(msg.created_at),
          trace: msg.trace, // could be null or string
        }));
        setMessages(mappedMessages);
      }
    };

    fetchMessages();
  }, [id]);

  return (
    <>
      {/* Chat Content */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="max-w-3xl mx-auto px-4 flex flex-col space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {message.sender === "bot" && (
                    <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 mr-2">
                      <Image
                        src="/nlcs-logo.png?height=32&width=32"
                        alt="Bot avatar"
                        width={32}
                        height={32}
                      />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-500 text-white rounded-tr-none"
                        : "bg-gray-100 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">
                      {message.content}
                      {message.trace && (
                        <>
                          <TraceViewer trace={message.trace} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="pt-4 px-4">
          <div className="max-w-3xl mx-auto relative">
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
      </div>
    </>
  );
}
