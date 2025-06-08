"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  Clock,
  MessageSquare,
  Settings,
  Users,
  Files,
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="w-56 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-4 flex items-center gap-2">
        <div className="h-8 w-8 relative overflow-hidden rounded">
          {/* Replace with your actual logo PNG */}
          <Image
            src="/nlcs-logo.png"
            alt="NLCS Logo"
            width={32}
            height={32}
            className="object-cover"
          />
        </div>
        <span className="text-xl font-medium text-gray-700">NLCS</span>
      </div>

      <div className="py-4">
        <p className="px-4 text-sm text-gray-500 mb-2">Navigations</p>
        <nav className="space-y-1">
          <Link
            href="/dashboard"
            className={`flex items-center px-4 py-2 text-sm ${
              isActive("/dashboard")
                ? "bg-gray-100 text-gray-700 rounded-md mx-2"
                : "text-gray-600 hover:bg-gray-100 rounded-md mx-2"
            }`}
          >
            <Home className="h-5 w-5 mr-3 text-gray-500" />
            <span>Home</span>
          </Link>
          <Link
            href="/dashboard/repositories"
            className={`flex items-center px-4 py-2 text-sm ${
              isActive("/dashboard/repositories")
                ? "bg-gray-100 text-gray-700 rounded-md mx-2"
                : "text-gray-600 hover:bg-gray-100 rounded-md mx-2"
            }`}
          >
            <Package className="h-5 w-5 mr-3 text-gray-500" />
            <span>Documents</span>
          </Link>
          <Link
            href="/dashboard/logs"
            className={`flex items-center px-4 py-2 text-sm ${
              isActive("/dashboard/logs")
                ? "bg-gray-100 text-gray-700 rounded-md mx-2"
                : "text-gray-600 hover:bg-gray-100 rounded-md mx-2"
            }`}
          >
            <Clock className="h-5 w-5 mr-3 text-gray-500" />
            <span>Logs</span>
          </Link>
          <Link
            href="/dashboard/conversations"
            className={`flex items-center px-4 py-2 text-sm ${
              isActive("/dashboard/conversations")
                ? "bg-gray-100 text-gray-700 rounded-md mx-2"
                : "text-gray-600 hover:bg-gray-100 rounded-md mx-2"
            }`}
          >
            <MessageSquare className="h-5 w-5 mr-3 text-gray-500" />
            <span>Conversations</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className={`flex items-center px-4 py-2 text-sm ${
              isActive("/dashboard/settings")
                ? "bg-gray-100 text-gray-700 rounded-md mx-2"
                : "text-gray-600 hover:bg-gray-100 rounded-md mx-2"
            }`}
          >
            <Users className="h-5 w-5 mr-3 text-gray-500" />
            <span>Users</span>
          </Link>
          <Link
            href="/dashboard/upload"
            className={`flex items-center px-4 py-2 text-sm ${
              isActive("/dashboard/settings")
                ? "bg-gray-100 text-gray-700 rounded-md mx-2"
                : "text-gray-600 hover:bg-gray-100 rounded-md mx-2"
            }`}
          >
            <Files className="h-5 w-5 mr-3 text-gray-500" />
            <span>Add Documents</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
