"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Users, AlertCircle } from "lucide-react";
import Link from "next/link"; // Import the Link component
import { createClient } from "@/utils/supabase/client";

const DashboardLanding = () => {
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return now.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  });

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

  return (
    <div className="flex-1 p-6 flex flex-col items-center pt-16">
      <h1 className="text-5xl font-medium text-gray-800">{currentTime}</h1>
      <p className="text-xl text-orange-400 mt-4 mb-12">
        Hello {isLoading ? "Name" : name}, we are glad to have you.
      </p>

      <div className="grid grid-cols-3 gap-6 w-full max-w-4xl">
        {/* Conversations Card */}
        <Link href="/dashboard/conversations">
          <Card className="bg-gray-50 border border-gray-200 cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl flex flex-col justify-between min-h-[200px]">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-medium text-lg mb-1">Conversations</h3>
              <p className="text-sm text-gray-500">
                Check out what the users are talking about
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Invite Members Card */}
        <Link href="/dashboard/settings/invite-agent">
          <Card className="bg-gray-50 border border-gray-200 cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl flex flex-col justify-between min-h-[200px]">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <Users className="h-4 w-4 text-orange-400" />
              </div>
              <h3 className="font-medium text-lg mb-1">Invite Members</h3>
              <p className="text-sm text-gray-500">
                Invite people to your organization to access your data
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Check Audits Card */}
        <Link href="/dashboard/logs">
          <Card className="bg-gray-50 border border-gray-200 cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl flex flex-col justify-between min-h-[200px]">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertCircle className="h-4 w-4 text-red-400" />
              </div>
              <h3 className="font-medium text-lg mb-1">Check Audits</h3>
              <p className="text-sm text-gray-500">
                Review the organization's audit logs
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default DashboardLanding;
