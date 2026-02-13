"use client";

import { useState, useCallback, useEffect } from "react";
// Replaced HeroUI Card and Tabs with plain HTML + Tailwind
import { FileUp, FileText, User } from "lucide-react";
import FileUploadForm from "@/components/FileUploadForm";
import FileList from "@/components/FileList";
import UserProfile from "@/components/UserProfile";
import { useSearchParams } from "next/navigation";

interface DashboardContentProps {
  userId: string;
  userName: string;
}

export default function DashboardContent({
  userId,
  userName,
}: DashboardContentProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<string>("files");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  // Set the active tab based on URL parameter
  useEffect(() => {
    if (tabParam === "profile") {
      setActiveTab("profile");
    } else {
      setActiveTab("files");
    }
  }, [tabParam]);

  const handleFileUploadSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleFolderChange = useCallback((folderId: string | null) => {
    setCurrentFolder(folderId);
  }, []);

  return (
    <>
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-default-900">
          Hi,{" "}
          <span className="text-primary">
            {userName?.length > 10
              ? `${userName?.substring(0, 10)}...`
              : userName?.split(" ")[0] || "there"}
          </span>
          !
        </h2>
        <p className="text-default-600 mt-2 text-lg">
          Your images are waiting for you.
        </p>
      </div>

      <nav className="flex gap-6 border-b border-default-200">
        <button
          className={`py-3 flex items-center gap-3 ${
            activeTab === "files" ? "border-b-2 border-primary font-medium" : "text-default-600"
          }`}
          onClick={() => setActiveTab("files")}
        >
          <FileText className="h-5 w-5" />
          <span>My Files</span>
        </button>

        <button
          className={`py-3 flex items-center gap-3 ${
            activeTab === "profile" ? "border-b-2 border-primary font-medium" : "text-default-600"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          <User className="h-5 w-5" />
          <span>Profile</span>
        </button>
      </nav>

      {activeTab === "files" && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="border border-default-200 bg-default-50 shadow-sm hover:shadow-md transition-shadow rounded-md overflow-hidden">
              <div className="flex gap-3 items-center px-4 py-3">
                <FileUp className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Upload</h2>
              </div>
              <div className="p-4">
                <FileUploadForm
                  userId={userId}
                  onUploadSuccess={handleFileUploadSuccess}
                  currentFolder={currentFolder}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="border border-default-200 bg-default-50 shadow-sm hover:shadow-md transition-shadow rounded-md overflow-hidden">
              <div className="flex gap-3 items-center px-4 py-3">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Your Files</h2>
              </div>
              <div className="p-4">
                <FileList
                  userId={userId}
                  refreshTrigger={refreshTrigger}
                  onFolderChange={handleFolderChange}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "profile" && (
        <div className="mt-8">
          <UserProfile />
        </div>
      )}
    </>
  );
}
