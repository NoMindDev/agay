import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  Package,
  Clock,
  MessageSquare,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-56 bg-white border-r flex flex-col">
      <div className="p-4 flex items-center gap-2 border-b">
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
        <span className="text-xl font-medium text-gray-700">Agay</span>
      </div>

      <div className="py-4">
        <p className="px-4 text-sm text-gray-500 mb-2">Navigations</p>
        <nav className="space-y-1">
          <Link
            href="#"
            className="flex items-center px-4 py-2 text-sm bg-gray-100 rounded-md mx-2"
          >
            <Home className="h-5 w-5 mr-3 text-gray-500" />
            <span>Home</span>
          </Link>
          <Link
            href="#"
            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md mx-2"
          >
            <Package className="h-5 w-5 mr-3 text-gray-500" />
            <span>Repositories</span>
          </Link>
          <Link
            href="#"
            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md mx-2"
          >
            <Clock className="h-5 w-5 mr-3 text-gray-500" />
            <span>Logs</span>
          </Link>
          <Link
            href="#"
            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md mx-2"
          >
            <MessageSquare className="h-5 w-5 mr-3 text-gray-500" />
            <span>Conversations</span>
          </Link>
          <Link
            href="#"
            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md mx-2"
          >
            <Settings className="h-5 w-5 mr-3 text-gray-500" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
