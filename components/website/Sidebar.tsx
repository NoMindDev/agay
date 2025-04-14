"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Home, Plus, Send, Pencil } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const initialConversations = [
  { id: "1", title: "Karma Land" },
  { id: "2", title: "Faq what is" },
  { id: "3", title: "Questions re" },
  { id: "4", title: "How to make" },
  { id: "5", title: "Another chat" },
  { id: "6", title: "Long chat thread" },
  { id: "7", title: "Test chat" },
  { id: "8", title: "Another one" },
  { id: "9", title: "Legal Process Overview" },
  { id: "10", title: "Contract Template FAQ" },
  { id: "11", title: "Intellectual Property Help" },
  { id: "12", title: "Startup Compliance Tips" },
  { id: "13", title: "Tenant Rights Bhutan" },
  { id: "14", title: "Employment Law Guide" },
  { id: "15", title: "Digital Signatures Info" },
]; // ... more as needed

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [conversations, setConversations] = useState(initialConversations);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");

  const handleNewChat = () => {
    const newId = (conversations.length + 1).toString();
    const newConv = { id: newId, title: `New Chat ${newId}` };
    setConversations([...conversations, newConv]);
    router.push(`/chats/${newId}`);
  };

  const handleRename = (id: string) => {
    setEditingId(id);
    const conv = conversations.find((c) => c.id === id);
    if (conv) setEditedTitle(conv.title);
  };

  const handleRenameSubmit = () => {
    if (!editingId) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === editingId ? { ...c, title: editedTitle } : c))
    );
    setEditingId(null);
  };

  return (
    <div className="w-[240px] bg-gray-50 border-r border-gray-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-4 flex items-center">
        <Image
          src="/nlcs-logo.png"
          alt="Agay Logo"
          width={32}
          height={32}
          className="rounded-md mr-2"
        />
        <span className="text-xl text-gray-700">Agay</span>
      </div>

      {/* New Chat Button */}
      <div className="px-4 py-2">
        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 bg-white text-gray-700 rounded-full px-3 py-2 w-full border border-gray-200 hover:bg-gray-50 shadow-sm"
        >
          <Plus className="h-4 w-4 text-red-500" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 relative overflow-hidden">
        <div className="sticky top-0 z-10 bg-gray-50 px-4 py-2 text-sm text-gray-500">
          Chat History
        </div>
        <ScrollArea className="h-full">
          <div className="space-y-1 px-2 pb-9">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg ${
                  pathname === `/chats/${conv.id}`
                    ? "bg-gray-200 text-gray-900"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
              >
                {editingId === conv.id ? (
                  <input
                    className="text-sm w-full bg-transparent outline-none border-b border-gray-300"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onBlur={handleRenameSubmit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRenameSubmit();
                    }}
                    autoFocus
                  />
                ) : (
                  <Link href={`/chats/${conv.id}`} className="flex-1 truncate">
                    {conv.title}
                  </Link>
                )}
                {editingId !== conv.id && (
                  <button
                    className="invisible group-hover:visible ml-2 text-gray-400 hover:text-gray-600"
                    onClick={() => handleRename(conv.id)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Navigation */}
      <div className="mb-4">
        <div className="px-4 py-2 text-sm text-gray-500">Navigations</div>
        <div className="space-y-1 px-2">
          <Link
            href="/"
            className={`px-4 py-2 flex items-center gap-2 rounded-lg ${
              pathname === "/" ? "bg-gray-200" : "hover:bg-gray-200"
            }`}
          >
            <Home className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">Home</span>
          </Link>
          <Link
            href="/repositories"
            className={`px-4 py-2 flex items-center gap-2 rounded-lg ${
              pathname.startsWith("/repositories")
                ? "bg-gray-200"
                : "hover:bg-gray-200"
            }`}
          >
            <Send className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">Repositories</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
