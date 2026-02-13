"use client";

import { RefreshCw, Trash } from "lucide-react";

interface FileActionButtonsProps {
  activeTab: string;
  trashCount: number;
  folderPath: Array<{ id: string; name: string }>;
  onRefresh: () => void;
  onEmptyTrash: () => void;
}

export default function FileActionButtons({
  activeTab,
  trashCount,
  folderPath,
  onRefresh,
  onEmptyTrash,
}: FileActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
      <h2 className="text-xl sm:text-2xl font-semibold truncate max-w-full">
        {activeTab === "all" &&
          (folderPath.length > 0
            ? folderPath[folderPath.length - 1].name
            : "All Files")}
        {activeTab === "starred" && "Starred Files"}
        {activeTab === "trash" && "Trash"}
      </h2>
      <div className="flex gap-2 sm:gap-3 self-end sm:self-auto">
        <button type="button" onClick={onRefresh} className="px-3 py-1 rounded hover:bg-default-100 flex items-center gap-2"><RefreshCw className="h-4 w-4" /> <span>Refresh</span></button>
        {activeTab === "trash" && trashCount > 0 && (
          <button type="button" onClick={onEmptyTrash} className="px-3 py-1 rounded bg-red-50 text-red-600 flex items-center gap-2"><Trash className="h-4 w-4" /> <span>Empty Trash</span></button>
        )}
      </div>
    </div>
  );
}
