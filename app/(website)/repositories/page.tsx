"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RepositoriesPage() {
  const [repositoryFiles, setRepositoryFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      const res = await fetch("/api/files");
      const files = await res.json();
      const repoFiles = files.map((file: any) => ({
        ...file,
        type: "pdf",
        icon: <FileText className="h-5 w-5 text-white" />,
        thumbnail: "/placeholder.jpeg?height=200&width=150",
      }));
      setRepositoryFiles(repoFiles);
      setLoading(false);
    };
    fetchFiles();
  }, []);

  const saveToLog = async (file: any) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const res = await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_email: user?.email,
        user_name: user?.user_metadata?.name,
        event: "viewing file",
        description: "file viewed by the user",
        resource_name: file.name,
        resource_link: file.link,
      }),
    });
    const data = await res.json();
    console.log(data, " data from logs");
    window.open(file.link, "_blank");
  };

  const filteredFiles = repositoryFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col p-6">
      <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10 bg-white"
            placeholder="Search in Repo"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Files Section */}
        <h2 className="text-lg font-medium mb-4">Files</h2>
        <ScrollArea className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pr-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-md overflow-hidden shadow-sm"
                >
                  <Skeleton className="h-40 w-full" />
                  <div className="p-3">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pr-4">
              {filteredFiles.map((file, index) => (
                <a
                  key={index}
                  href={file.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  onClick={(e) => {
                    e.preventDefault();
                    saveToLog(file);
                  }}
                >
                  <div className="bg-white rounded-md overflow-hidden shadow-sm cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg">
                    <div className="relative">
                      <div className="absolute top-2 left-2 bg-red-500 rounded p-1">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <Image
                        src={file.thumbnail}
                        alt={file.name}
                        width={150}
                        height={200}
                        className="w-full h-40 object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium truncate text-black">
                        {file.name}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No files found.</p>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
