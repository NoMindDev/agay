"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

const conversations = [
  {
    id: 1,
    user: { name: "John Doe", avatar: "/placeholder.svg", initials: "JD" },
    lastMessage: "Get the related documents to Thram 1",
    timestamp: "2min ago",
    date: new Date(2025, 3, 9), // April 9, 2025
  },
  {
    id: 2,
    user: { name: "Emily", avatar: "", initials: "E" },
    lastMessage: "Are you ok?",
    timestamp: "Yesterday",
    date: new Date(2025, 3, 8), // April 8, 2025
  },
  {
    id: 3,
    user: { name: "Sara", avatar: "/placeholder.svg", initials: "S" },
    lastMessage: "Let's meet tomorrow for the project discussion",
    timestamp: "2 days ago",
    date: new Date(2025, 3, 7), // April 7, 2025
  },
  {
    id: 4,
    user: { name: "Alice", avatar: "/placeholder.svg", initials: "A" },
    lastMessage: "Please send the updated files.",
    timestamp: "3 days ago",
    date: new Date(2025, 3, 6), // April 6, 2025
  },
  {
    id: 5,
    user: { name: "Bob", avatar: "", initials: "B" },
    lastMessage: "Can you provide the status report?",
    timestamp: "Last week",
    date: new Date(2025, 2, 30), // March 30, 2025
  },
  {
    id: 6,
    user: { name: "Charlie", avatar: "/placeholder.svg", initials: "C" },
    lastMessage: "Let's catch up soon!",
    timestamp: "2 weeks ago",
    date: new Date(2025, 2, 25), // March 25, 2025
  },
  {
    id: 7,
    user: { name: "David", avatar: "", initials: "D" },
    lastMessage: "I'll send you the details later.",
    timestamp: "3 weeks ago",
    date: new Date(2025, 2, 18), // March 18, 2025
  },
  {
    id: 8,
    user: { name: "Ella", avatar: "/placeholder.svg", initials: "E" },
    lastMessage: "Looking forward to the meeting.",
    timestamp: "Last month",
    date: new Date(2025, 1, 28), // February 28, 2025
  },
];

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null); // Track selected conversation

  const today = new Date();

  const filteredConversations = conversations.filter((conv) => {
    if (!dateRange?.from || !dateRange?.to) return true;
    return conv.date >= dateRange.from && conv.date <= dateRange.to;
  });

  const handleConversationClick = (id: number) => {
    setSelectedConversationId(id); // Update selected conversation
    router.push(`/dashboard/conversations/${id}`);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-full md:w-[37%] border-r border-gray-200 bg-gray-50 flex flex-col">
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
                  setDateRange(range); // Allow partial selection
                  if (range?.from && range?.to) {
                    setIsCalendarOpen(false); // Close only when both are selected
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => handleConversationClick(conversation.id)}
              className={`flex items-start gap-3 p-4 cursor-pointer border-b border-gray-200 ${
                selectedConversationId === conversation.id
                  ? "bg-blue-100" // Highlight selected conversation
                  : "hover:bg-gray-100"
              }`}
            >
              <Avatar className="h-10 w-10 shrink-0">
                {conversation.user.avatar && (
                  <AvatarImage
                    src={conversation.user.avatar}
                    alt={conversation.user.name}
                  />
                )}
                <AvatarFallback>{conversation.user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm text-gray-500">
                    {conversation.user.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {conversation.timestamp}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {conversation.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="w-[63%] hidden md:flex flex-col">{children}</div>
    </div>
  );
}
