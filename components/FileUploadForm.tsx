"use client";

import { useState, useRef } from "react";
import {
  Upload,
  X,
  FileUp,
  AlertTriangle,
  FolderPlus,
  ArrowRight,
} from "lucide-react";
// Replaced HeroUI Button, Progress, Input, Modal and Toast with plain HTML/Tailwind
import axios from "axios";

interface FileUploadFormProps {
  userId: string;
  onUploadSuccess?: () => void;
  currentFolder?: string | null;
}

export default function FileUploadForm({
  userId,
  onUploadSuccess,
  currentFolder = null,
}: FileUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Folder creation state
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Validate file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit");
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];

      // Validate file size (5MB limit)
      if (droppedFile.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit");
        return;
      }

      setFile(droppedFile);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    if (currentFolder) {
      formData.append("parentId", currentFolder);
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      await axios.post("/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });

      console.log("Upload Successful:", `${file.name} has been uploaded successfully.`);

      // Clear the file after successful upload
      clearFile();

      // Call the onUploadSuccess callback if provided
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file. Please try again.");
      console.error("Upload Failed: We couldn't upload your file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      console.error("Invalid Folder Name: Please enter a valid folder name.");
      return;
    }

    setCreatingFolder(true);

    try {
      await axios.post("/api/folders/create", {
        name: folderName.trim(),
        userId: userId,
        parentId: currentFolder,
      });

      console.log("Folder Created:", `Folder "${folderName}" has been created successfully.`);

      // Reset folder name and close modal
      setFolderName("");
      setFolderModalOpen(false);

      // Call the onUploadSuccess callback to refresh the file list
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      console.error("Folder Creation Failed: We couldn't create the folder. Please try again.");
    } finally {
      setCreatingFolder(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex gap-2 mb-2">
        <button type="button" onClick={() => setFolderModalOpen(true)} className="flex-1 px-3 py-2 rounded bg-default-100 hover:bg-default-200 flex items-center justify-center gap-2">
          <FolderPlus className="h-4 w-4" />
          <span>New Folder</span>
        </button>
        <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 px-3 py-2 rounded bg-default-100 hover:bg-default-200 flex items-center justify-center gap-2">
          <FileUp className="h-4 w-4" />
          <span>Add Image</span>
        </button>
      </div>

      {/* File drop area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          error
            ? "border-danger/30 bg-danger/5"
            : file
              ? "border-primary/30 bg-primary/5"
              : "border-default-300 hover:border-primary/5"
        }`}
      >
        {!file ? (
          <div className="space-y-3">
            <FileUp className="h-12 w-12 mx-auto text-primary/70" />
            <div>
              <p className="text-default-600">
                Drag and drop your image here, or{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary cursor-pointer font-medium inline bg-transparent border-0 p-0 m-0"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-default-500 mt-1">Images up to 5MB</p>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-md">
                  <FileUp className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium truncate max-w-[180px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-default-500">
                    {file.size < 1024
                      ? `${file.size} B`
                      : file.size < 1024 * 1024
                        ? `${(file.size / 1024).toFixed(1)} KB`
                        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                  </p>
                </div>
              </div>
              <button type="button" onClick={clearFile} className="text-default-500 p-1 rounded hover:bg-default-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            {error && (
              <div className="bg-danger-5 text-danger-700 p-3 rounded-lg flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {uploading && (
              <div className="w-full bg-default-200 rounded-full h-2 overflow-hidden">
                <div className="h-2 bg-primary" style={{ width: `${progress}%` }} />
              </div>
            )}

            <button
              type="button"
              onClick={handleUpload}
              disabled={!!error || uploading}
              className="w-full px-4 py-2 rounded bg-primary text-white disabled:opacity-60"
            >
              {uploading ? `Uploading... ${progress}%` : "Upload Image"}
            </button>
          </div>
        )}
      </div>

      {/* Upload tips */}
      <div className="bg-default-100/5 p-4 rounded-lg">
        <h4 className="text-sm font-medium mb-2">Tips</h4>
        <ul className="text-xs text-default-600 space-y-1">
          <li>• Images are private and only visible to you</li>
          <li>• Supported formats: JPG, PNG, GIF, WebP</li>
          <li>• Maximum file size: 5MB</li>
        </ul>
      </div>

      {/* Create Folder Modal (simple implementation) */}
      {folderModalOpen && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFolderModalOpen(false)} />
          <div className="relative z-10 w-full max-w-md mx-4">
            <div className="rounded-lg border border-default-200 bg-white shadow-lg overflow-hidden">
              <div className="flex gap-2 items-center px-4 py-3 border-b border-default-200">
                <FolderPlus className="h-5 w-5 text-primary" />
                <span className="font-medium">New Folder</span>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <p className="text-sm text-default-600">Enter a name for your folder:</p>
                  <input type="text" placeholder="My Images" value={folderName} onChange={(e) => setFolderName(e.target.value)} autoFocus className="w-full border border-default-200 rounded px-3 py-2" />
                </div>
              </div>
              <div className="flex justify-end gap-3 px-4 py-3 border-t border-default-200">
                <button type="button" className="px-3 py-1 rounded bg-default-100" onClick={() => setFolderModalOpen(false)}>Cancel</button>
                <button type="button" className="px-3 py-1 rounded bg-primary text-white" onClick={handleCreateFolder} disabled={!folderName.trim() || creatingFolder}>{creatingFolder ? 'Creating...' : 'Create'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
