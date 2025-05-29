"use client";

import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { User, Settings, LogOut } from "lucide-react";
import Link from "next/link"; // Import Link from Next.js
import { usePathname, useRouter } from "next/navigation";
import { signOutAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [name, setName] = useState("Name");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setName(user.user_metadata.name || "Name");
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const getTitle = () => {
    if (pathname === "/") return "Home";
    if (pathname.startsWith("/repositories")) return "Repositories";
    if (pathname.startsWith("/chats")) return "Chats";
    if (pathname.startsWith("/profile")) return "Profile";
    if (pathname.startsWith("/setting")) return "Setting";
    return "Home";
  };
  return (
    <div className="h-16 border-b border-gray-200 flex items-center px-6">
      <h1 className="text-xl text-gray-700">{getTitle()}</h1>
      <div className="ml-auto">
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
                {isLoading ? "Loading..." : name}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* Use Link for navigation */}
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <form action={signOutAction}>
              <button
                type="submit"
                className="w-full flex items-center px-2 py-1 text-left bg-transparent hover:bg-gray-100"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
