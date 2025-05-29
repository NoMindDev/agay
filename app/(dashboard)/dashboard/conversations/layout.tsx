"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  created_by: string | null;
  name: string;
  initials: string;
  lastMessage: string;
  messageTimestamp: string;
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  const today = new Date();

  useEffect(() => {
    const fetchConversationsWithExtras = async () => {
      // 1. Fetch all conversations
      const { data: conversations, error: convError } = await supabase
        .from("conversations")
        .select("*")
        .order("created_at", { ascending: false });

      if (convError) {
        console.error("Error fetching conversations:", convError);
        return;
      }

      // 2. Fetch the creator names from members table
      const userIds = Array.from(
        new Set(conversations.map((conv) => conv.created_by))
      );

      const { data: members, error: memberError } = await supabase
        .from("member")
        .select("id, name")
        .in("id", userIds);

      if (memberError) {
        console.error("Error fetching member names:", memberError);
        return;
      }

      // 3. Fetch the last message for each conversation
      const lastMessagesPromises = conversations.map(async (conv) => {
        const { data: messages, error: msgError } = await supabase
          .from("messages")
          .select("content, created_at")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (msgError && msgError.code !== "PGRST116") {
          console.error("Error fetching message:", msgError);
        }

        return {
          conversationId: conv.id,
          lastMessage: messages?.content || "",
          messageTimestamp: messages?.created_at || null,
        };
      });

      const lastMessages = await Promise.all(lastMessagesPromises);

      // 4. Merge everything into one enriched conversation object
      const enriched = conversations.map((conv) => {
        const member = members.find((m) => m.id === conv.created_by);
        const message = lastMessages.find((m) => m.conversationId === conv.id);

        return {
          ...conv,
          name: member?.name || "Unknown",
          initials: member?.name
            ? member.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
            : "U",
          lastMessage: message?.lastMessage || "",
          messageTimestamp: message?.messageTimestamp || "",
        };
      });

      setConversations(enriched);
    };

    fetchConversationsWithExtras();
  }, []);

  const filteredConversations = conversations.filter((conv) => {
    const convDate = new Date(conv.created_at);

    if (!dateRange?.from || !dateRange?.to) return true;

    // Strip time from 'from' date and set 'to' date to end of day
    const fromDate = new Date(dateRange.from);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(dateRange.to);
    toDate.setHours(23, 59, 59, 999);

    return convDate >= fromDate && convDate <= toDate;
  });

  const handleConversationClick = (id: string) => {
    setSelectedConversationId(id);
    router.push(`/dashboard/conversations/${id}`);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-full md:max-w-sm border-r border-gray-200 bg-gray-50 flex flex-col">
        {/* Filter */}
        <div className="p-3 border-b border-gray-200 bg-white">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange?.from && dateRange?.to
                  ? `${format(dateRange.from, "MMM d, yyyy")} - ${format(
                      dateRange.to,
                      "MMM d, yyyy"
                    )}`
                  : "Filter by Date Range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={new Date()}
                toDate={today}
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range);
                  if (range?.from && range?.to) {
                    setIsCalendarOpen(false);
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-auto w-full">
          <div className="max-h-full overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleConversationClick(conversation.id)}
                className={`flex items-start gap-3 p-4 cursor-pointer border-b border-gray-200 ${
                  selectedConversationId === conversation.id
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback>{conversation.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-sm text-gray-500">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {conversation.messageTimestamp
                        ? format(
                            new Date(conversation.messageTimestamp),
                            "MMM d"
                          )
                        : ""}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate whitespace-nowrap overflow-hidden">
                    {conversation.lastMessage || "No messages yet"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 hidden md:flex flex-col">{children}</div>
    </div>
  );
}
