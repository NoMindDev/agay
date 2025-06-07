"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

const UploadPage = () => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFileName(selectedFile.name);
    }
  };

  return (
    <div className="flex-1 p-6 flex flex-col items-center pt-16">
      <h1 className="text-3xl font-semibold mb-6">Upload File</h1>
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col gap-4">
          <Input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf,.docx"
            onChange={handleFileChange}
          />
          <Input
            type="text"
            value={fileName}
            readOnly
            placeholder="Selected file name will appear here..."
          />
          <Button disabled>
            <Upload className="mr-2" />
            Upload (Disabled)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;
