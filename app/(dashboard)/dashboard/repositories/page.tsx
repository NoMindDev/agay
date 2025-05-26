"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/lib/store/user";

// Repository files with the required naming format
// const repositoryFiles = [
//   { name: "1967-10-06-01.pdf" },
//   { name: "1967-10-06-02.pdf" },
//   { name: "1968-02-14-01.pdf" },
//   { name: "1970-07-21-01.pdf" },
//   { name: "1971-03-15-02.pdf" },
//   { name: "1980-01-01-01.pdf" },
//   { name: "1999-12-31-01.pdf" },
//   { name: "2024-04-01-01.pdf" },
// ].map((file) => ({
//   ...file,
//   type: "pdf",
//   icon: <FileText className="h-5 w-5 text-white" />,
//   thumbnail: "/placeholder.jpeg?height=200&width=150",
// }));

export default function RepositoriesPage() {
  const [repositoryFiles, setRepositoryFiles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const user = useUserStore((state: { user: any }) => state.user);
  const saveToLog = async (file: any) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log(user, " user from store");
    const res = await fetch("/api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // date:new Date().toISOString(),
        user_email: user?.email,
        user_name: user?.user_metadata?.name,
        event: "search",
        description: "file viewed by the user",
        resource_name: file.name,
        resource_link: file.link,
      }),
    });
    const data = await res.json();
    console.log(data, " data from logs");
  };
  useEffect(() => {
    const fetchFiles = async () => {
      const res = await fetch("/api/files");
      const files = await res.json();
      console.log(files, " data from api");
      const repoFiles = files.map((file: any) => ({
        ...file,
        type: "pdf",
        icon: <FileText className="h-5 w-5 text-white" />,
        thumbnail: "/placeholder.jpeg?height=200&width=150",
      }));
      setRepositoryFiles(repoFiles);
    };
    fetchFiles();
  }, []);
  const filteredFiles = repositoryFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10 bg-white"
            placeholder="Search in Repo"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Files Section */}
        <div>
          <h2 className="text-lg font-medium mb-4">Files</h2>
          {filteredFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredFiles.map((file, index) => (
                <a
                  key={index}
                  href={file.link} // Adjust this path if files are stored elsewhere
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
        </div>
      </div>
    </div>
  );
}
