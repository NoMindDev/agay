"use client";

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

import { use, useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ChatViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params); // Unwrap the Promise to access `id`
  const { id } = unwrappedParams;
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isNameLoading, setIsNameLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    const fetchMessages = async () => {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("messages")
        .select("id, content, sender, created_at, trace")
        .eq("conversation_id", id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        setIsLoading(false);
        return;
      }

      const mappedMessages = data.map((msg) => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender.toLowerCase(),
        timestamp: new Date(msg.created_at),
        trace: msg.trace || null,
      }));

      setMessages(mappedMessages);
      setIsLoading(false);
    };

    const fetchConversation = async () => {
      setIsNameLoading(true);
      const { data, error: convError } = await supabase
        .from("conversations")
        .select("created_by")
        .eq("id", id)
        .single();

      if (convError) {
        console.error("Error fetching conversations:", convError);
        setIsNameLoading(false);
        return;
      }

      const { data: member, error: memberError } = await supabase
        .from("member")
        .select("id, name")
        .eq("id", data.created_by)
        .single();

      if (memberError) {
        console.error("Error fetching member names:", memberError);
        setIsNameLoading(false);
        return;
      }

      setUsername(member.name);
      setIsNameLoading(false);
    };

    fetchMessages();
    fetchConversation();
  }, [id]);

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {isNameLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback>{getInitials(username)}</AvatarFallback>
            </Avatar>
            <h2 className="font-medium text-black">
              {username || "User Name"}
            </h2>
          </div>
        )}

        {/* Keep name here */}
        {/* <Image
          src="/nlcs-logo.png"
          alt="User"
          width={32}
          height={32}
          className="rounded-full"
        /> */}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6 overflow-auto" ref={scrollAreaRef}>
        {isLoading ? (
          <div>Loading</div>
        ) : (
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
                        src="/agay.png?height=32&width=32"
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
        )}
      </ScrollArea>
    </>
  );
}
