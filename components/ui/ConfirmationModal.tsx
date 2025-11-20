import React from "react";
import { LucideIcon } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  description: string;
  icon?: LucideIcon;
  iconColor?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "primary" | "danger" | "warning" | "success" | "default";
  onConfirm: () => void;
  isDangerous?: boolean;
  warningMessage?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  icon: Icon,
  iconColor = "text-danger",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "danger",
  onConfirm,
  isDangerous = false,
  warningMessage,
}) => {
  if (!isOpen) return null;

  const confirmColorClass = {
    primary: "bg-primary text-white hover:bg-primary/90",
    danger: "bg-red-600 text-white hover:bg-red-700",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
    success: "bg-green-600 text-white hover:bg-green-700",
    default: "bg-default-200 text-default-900 hover:bg-default-300",
  }[confirmColor || "default"];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="rounded-lg border border-default-200 bg-white shadow-lg overflow-hidden">
          <div className="flex gap-2 items-center px-4 py-3 border-b border-default-200">
            {Icon && <Icon className={`h-5 w-5 ${iconColor}`} />}
            <span className="font-medium">{title}</span>
          </div>

          <div className="p-4">
            {isDangerous && warningMessage && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
                <div className="flex items-start gap-3">
                  {Icon && (
                    <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${iconColor}`} />
                  )}
                  <div>
                    <p className="font-medium">This action cannot be undone</p>
                    <p className="text-sm mt-1">{warningMessage}</p>
                  </div>
                </div>
              </div>
            )}

            <p className="text-default-700">{description}</p>
          </div>

          <div className="flex justify-end gap-3 px-4 py-3 border-t border-default-200">
            <button
              type="button"
              className="px-4 py-2 rounded bg-default-100 text-default-800 hover:bg-default-200"
              onClick={() => onOpenChange(false)}
            >
              {cancelText}
            </button>

            <button
              type="button"
              className={`px-4 py-2 rounded ${confirmColorClass}`}
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              {Icon && <Icon className="h-4 w-4 inline mr-2" />}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
