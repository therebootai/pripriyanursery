"use client";

import { X } from "lucide-react";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null; // 🚨 THIS IS CRITICAL

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg w-[90%] max-w-sm p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500"
          onClick={onCancel}
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>

        <p className="text-sm text-gray-600 mb-6">{description}</p>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 text-sm rounded-md bg-gray-100"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
