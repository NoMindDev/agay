"use client";

import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, User, LogOut } from "lucide-react";
import { signOutAction } from "@/app/actions";

// Utility function to get page title
const getPageTitle = (pathname: string) => {
  if (pathname.includes("/dashboard/settings/invite-agent"))
    return "Invite Agent";
  if (pathname.includes("/dashboard/profile")) return "Profile";
  if (pathname.includes("/dashboard/settings")) return "Settings";
  if (pathname.includes("/dashboard/conversations")) return "Conversations";
  if (pathname.includes("/dashboard/repositories")) return "Repositories";
  if (pathname.includes("/dashboard/logs")) return "Logs";
  if (pathname.includes("/dashboard")) return "Dashboard";
  return "Home";
};

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <h1 className="text-lg font-medium">{pageTitle}</h1>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full hover:bg-gray-100 p-1 transition-colors">
              <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                <Image
                  src="/nlcs-logo.png"
                  alt="User avatar"
                  width={32}
                  height={32}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Kuenzang
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <form action={signOutAction}>
              <button
                type="submit"
                className="w-full flex items-center px-2 py-1 text-left bg-transparent hover:bg-gray-100 text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
