"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

export default function ConversationPage() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    //     {
    //       id: "1",
    //       content: "What can you do?",
    //       sender: "user",
    //       timestamp: new Date(),
    //     },
    //     {
    //       id: "2",
    //       content: `I can do lots of things! I'm good at brainstorming ideas, clarifying tricky concepts, and tasks like recapping meetings and helping you research a topic.
    // Not sure where to begin? Here's how I can help:
    // Get more done
    // • Write emails: Ask me to write or re-write emails and even change the tone based on who will read it.
    // • Refine work: Request feedback, discuss different perspectives, and get help with research and outlines.
    // • Streamline tasks: Go from multiple tabs to one conversation by asking me to find information for you and complete tasks directly in the chat.
    // Learn something new
    // • Help with studying: Generate study plans, quizzes, and practice questions to test your knowledge.
    // • Create summaries: Get an overview of reports or lecture notes, including key points and takeaways.
    // • Translate text and check grammar: Ask me to translate text or edit your grammar and sentence structure. I can even help you practice your pronunciation.
    // Boost your creativity
    // • Generate images: I can quickly design images, mock up logos, illustrate bedtime stories, and add text to photos.
    // • Compose a song or story: Prompt me to write something that will capture a memory or delight a loved one.
    // • Explore different styles: Envision your work across a range of approaches, visual genres, and copy formats.
    // What would you like help with first? I can also elaborate on anything that caught your attention.`,
    //       sender: "bot",
    //       timestamp: new Date(),
    //     },
  ]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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

    // Add temporary loading message
    const loadingMessage: Message = {
      id: "loading",
      content: "Thinking...",
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, loadingMessage]);

    // Call the API
    try {
      const response = await fetch("https://nlcs-rag.onrender.com/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: inputValue }),
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
            timestamp: new Date(),
          })
      );
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
                    <div className="whitespace-pre-wrap">{message.content}</div>
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
              disabled={!inputValue.trim()}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
