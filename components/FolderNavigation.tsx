"use client";

import { ArrowUpFromLine } from "lucide-react";

interface FolderNavigationProps {
  folderPath: Array<{ id: string; name: string }>;
  navigateUp: () => void;
  navigateToPathFolder: (index: number) => void;
}

export default function FolderNavigation({
  folderPath,
  navigateUp,
  navigateToPathFolder,
}: FolderNavigationProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm overflow-x-auto pb-2">
      <button
        type="button"
        onClick={navigateUp}
        disabled={folderPath.length === 0}
        className={`px-2 py-1 rounded ${folderPath.length === 0 ? 'text-default-400 cursor-not-allowed' : 'hover:bg-default-100'} `}
        aria-disabled={folderPath.length === 0}
      >
        <ArrowUpFromLine className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => navigateToPathFolder(-1)}
        className={`${folderPath.length === 0 ? "font-bold" : "hover:bg-default-100"} px-2 py-1 rounded`}
      >
        Home
      </button>
      {folderPath.map((folder, index) => (
        <div key={folder.id} className="flex items-center">
          <span className="mx-1 text-default-400">/</span>
          <button
            type="button"
            onClick={() => navigateToPathFolder(index)}
            className={`${index === folderPath.length - 1 ? "font-bold" : "hover:bg-default-100"} text-ellipsis overflow-hidden max-w-[150px] px-2 py-1 rounded`}
            title={folder.name}
          >
            {folder.name}
          </button>
        </div>
      ))}
    </div>
  );
}
