"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";

// Sample repository data
const repositoryFiles = Array(8).fill({
  name: "1967-10-06-01.pdf",
  type: "pdf",
  icon: <FileText className="h-5 w-5 text-white" />,
  thumbnail: "/placeholder.svg?height=200&width=150",
});

export default function RepositoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {repositoryFiles.map((file, index) => (
              <div
                key={index}
                className="bg-white rounded-md overflow-hidden shadow-sm cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg"
              >
                <div className="relative">
                  <div className="absolute top-2 left-2 bg-red-500 rounded p-1">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <Image
                    src="/placeholder.jpeg?height=200&width=150"
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
