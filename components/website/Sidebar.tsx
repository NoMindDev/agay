import React from "react";
import Image from "next/image";
import { Home, Plus, Send, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="w-[240px] bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-4 flex items-center">
        <div className="h-8 w-8 mr-2">
          <Image
            src="/nlcs-logo.png"
            alt="Agay Logo"
            width={32}
            height={32}
            className="rounded-md"
          />
        </div>
        <span className="text-xl text-gray-700">Agay</span>
      </div>

      {/* New Chat Button */}
      <div className="px-4 py-2">
        <button className="flex items-center gap-2 bg-white text-gray-700 rounded-full px-3 py-2 w-full border border-gray-200 hover:bg-gray-50 shadow-sm">
          <Plus className="h-4 w-4 text-red-500" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Recent Chats */}
      <div className="mt-4">
        <div className="px-4 py-2 text-sm text-gray-500">Recent</div>
        <div className="space-y-1 px-2">
          <div className="px-4 py-2 bg-gray-200 flex items-center gap-2 rounded-lg">
            <span className="text-gray-500">=</span>
            <span className="text-gray-700">Karma Land</span>
          </div>
          <div className="px-4 py-2 flex items-center gap-2 hover:bg-gray-200 rounded-lg">
            <span className="text-gray-500">=</span>
            <span className="text-gray-700">Faq what is</span>
          </div>
          <div className="px-4 py-2 flex items-center gap-2 hover:bg-gray-200 rounded-lg">
            <span className="text-gray-500">=</span>
            <span className="text-gray-700">Questions re</span>
          </div>
          <div className="px-4 py-2 flex items-center gap-2 hover:bg-gray-200 rounded-lg">
            <span className="text-gray-500">=</span>
            <span className="text-gray-700">How to make</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-auto mb-4">
        <div className="px-4 py-2 text-sm text-gray-500">Navigations</div>
        <div className="space-y-1 px-2">
          <Link
            href="#"
            className="px-4 py-2 flex items-center gap-2 hover:bg-gray-200 rounded-lg"
          >
            <Home className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">Home</span>
          </Link>
          <Link
            href="#"
            className="px-4 py-2 flex items-center gap-2 hover:bg-gray-200 rounded-lg"
          >
            <svg
              className="h-4 w-4 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-gray-700">Repositories</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
