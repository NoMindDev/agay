"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Brain,
  Sparkles,
  Zap,
  Database,
} from "lucide-react";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [training, setTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );

  // Simulate upload progress
  useEffect(() => {
    if (uploading) {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [uploading]);

  // Simulate training progress with different phases
  useEffect(() => {
    if (training) {
      const phases = [
        "Analyzing document structure...",
        "Extracting text content...",
        "Processing embeddings...",
        "Building knowledge base...",
        "Optimizing search index...",
        "Finalizing training...",
      ];

      let phaseIndex = 0;
      const interval = setInterval(() => {
        setTrainingProgress((prev) => {
          const newProgress = prev + Math.random() * 8;

          // Update message based on progress
          const progressPhase = Math.floor((newProgress / 100) * phases.length);
          if (progressPhase < phases.length && progressPhase !== phaseIndex) {
            phaseIndex = progressPhase;
            setMessage(phases[progressPhase]);
          }

          if (newProgress >= 95) {
            clearInterval(interval);
            return 95;
          }
          return newProgress;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [training]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setUploaded(false);
      setMessage("");
      setUploadProgress(0);
      setTrainingProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    setMessage("Preparing upload...");
    setMessageType("info");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("https://nlcs-rag.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      const uploadJson = await uploadRes.json();

      // Complete the progress bar
      setUploadProgress(100);

      if (!uploadRes.ok) throw new Error(uploadJson.error || "Upload failed");

      setTimeout(() => {
        setMessage("File uploaded successfully!");
        setMessageType("success");
        setUploaded(true);
      }, 500);
    } catch (err: any) {
      setUploadProgress(100);
      setTimeout(() => {
        setMessage(`Upload Error: ${err.message}`);
        setMessageType("error");
      }, 500);
    } finally {
      setTimeout(() => {
        setUploading(false);
      }, 1000);
    }
  };

  const handleTrain = async () => {
    setTraining(true);
    setTrainingProgress(0);
    setMessage("Initializing training process...");
    setMessageType("info");

    try {
      const trainRes = await fetch("https://nlcs-rag.onrender.com/train", {
        method: "POST",
      });

      const trainJson = await trainRes.json();

      // Complete the progress
      setTrainingProgress(100);

      if (!trainRes.ok) throw new Error(trainJson.error || "Training failed");

      setTimeout(() => {
        setMessage(trainJson.message || "Training completed successfully!");
        setMessageType("success");
      }, 500);
    } catch (err: any) {
      setTrainingProgress(100);
      setTimeout(() => {
        setMessage(`Training Error: ${err.message}`);
        setMessageType("error");
      }, 500);
    } finally {
      setTimeout(() => {
        setTraining(false);
      }, 1000);
    }
  };

  const getMessageIcon = () => {
    switch (messageType) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto pt-16">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <Upload className="w-6 h-6 text-blue-500" />
              New Document Upload
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* File Selection */}
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer h-14"
                />
              </div>

              {fileName && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {fileName}
                  </span>
                  <Badge variant="secondary" className="ml-auto">
                    PDF
                  </Badge>
                </div>
              )}
            </div>

            {/* Upload and Training Buttons Side by Side */}
            <div className="flex flex-col md:flex-row gap-4">
              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="flex-1 h-10 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
              >
                {uploading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload to Database
                  </div>
                )}
              </Button>

              <Button
                onClick={handleTrain}
                disabled={!uploaded || training}
                className="flex-1 h-10 text-lg font-semibold bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:opacity-50"
              >
                {training ? (
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 animate-pulse" />
                    Training RAG Agent...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Start Training RAG Agent
                  </div>
                )}
              </Button>
            </div>

            {/* Progress & Feedback */}
            {uploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-center text-gray-600">
                  {uploadProgress < 100
                    ? `${Math.round(uploadProgress)}% uploaded`
                    : "Processing..."}
                </p>
              </div>
            )}

            {training && (
              <div className="space-y-3">
                <Progress value={trainingProgress} className="h-3" />
                <div className="flex items-center justify-center gap-2 p-3 bg-purple-50 rounded-lg">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                  <Database className="w-4 h-4 text-purple-600 animate-pulse" />
                </div>
                <p className="text-sm text-center text-purple-700 font-medium">
                  {Math.round(trainingProgress)}% complete
                </p>
              </div>
            )}

            {/* Status Message */}
            {message && (
              <div
                className={`flex items-center gap-2 p-2 rounded-lg ${
                  messageType === "success"
                    ? "bg-green-50 border border-green-200"
                    : messageType === "error"
                      ? "bg-red-50 border border-red-200"
                      : "bg-blue-50 border border-blue-200"
                }`}
              >
                {getMessageIcon()}
                <p
                  className={`text-sm font-medium ${
                    messageType === "success"
                      ? "text-green-700"
                      : messageType === "error"
                        ? "text-red-700"
                        : "text-blue-700"
                  }`}
                >
                  {message}
                </p>
              </div>
            )}

            {/* Success State */}
            {uploaded && !training && messageType === "success" && (
              <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                <h3 className="text-lg font-semibold text-green-800">
                  Ready for Training RAG Agent!
                </h3>
                <p className="text-sm text-green-600">
                  Your document has been uploaded successfully
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadPage;
