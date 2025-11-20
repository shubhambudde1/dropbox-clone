"use client";

import { Star, Trash, X, ArrowUpFromLine, Download } from "lucide-react";
import type { File as FileType } from "@/lib/db/schema";

interface FileActionsProps {
  file: FileType;
  onStar: (id: string) => void;
  onTrash: (id: string) => void;
  onDelete: (file: FileType) => void;
  onDownload: (file: FileType) => void;
}

export default function FileActions({
  file,
  onStar,
  onTrash,
  onDelete,
  onDownload,
}: FileActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-end">
      {/* Download button */}
      {!file.isTrash && !file.isFolder && (
        <button type="button" onClick={() => onDownload(file)} className="min-w-0 px-2 py-1 rounded hover:bg-default-100 flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download</span>
        </button>
      )}

      {/* Star button */}
      {!file.isTrash && (
        <button type="button" onClick={() => onStar(file.id)} className="min-w-0 px-2 py-1 rounded hover:bg-default-100 flex items-center gap-2">
          <Star className={`h-4 w-4 ${file.isStarred ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
          <span className="hidden sm:inline">{file.isStarred ? 'Unstar' : 'Star'}</span>
        </button>
      )}

      {/* Trash/Restore button */}
      <button type="button" onClick={() => onTrash(file.id)} className="min-w-0 px-2 py-1 rounded hover:bg-default-100 flex items-center gap-2">
        {file.isTrash ? <ArrowUpFromLine className="h-4 w-4" /> : <Trash className="h-4 w-4" />}
        <span className="hidden sm:inline">{file.isTrash ? 'Restore' : 'Delete'}</span>
      </button>

      {/* Delete permanently button */}
      {file.isTrash && (
        <button type="button" onClick={() => onDelete(file)} className="min-w-0 px-2 py-1 rounded bg-red-50 text-red-600 flex items-center gap-2">
          <X className="h-4 w-4" />
          <span className="hidden sm:inline">Remove</span>
        </button>
      )}
    </div>
  );
}
