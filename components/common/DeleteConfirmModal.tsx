"use client";
import React from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  itemName?: string;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Confirmation",
  description = "Are you sure you want to delete this item?",
  itemName,
  loading = false,
  confirmText = "Delete",
  cancelText = "Cancel"
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-[var(--site-bg)] border border-slate-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">

        <div className="flex justify-between items-center p-5 border-b border-[var(--text-color)] bg-[var(--site-bg)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-color)]">{title}</h3>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-[var(--text-color)] hover:text-[var(--text-color)]/50 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-[var(--text-color)] text-sm leading-relaxed">
            {description}
            {itemName && (
              <span className="block mt-2 font-semibold text-white">
                "{itemName}"
              </span>
            )}
          </p>
          <p className="text-xs text-slate-500 mt-3">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 px-6 py-4 bg-[var(--site-bg)] border-t border-[var(--text-color)]">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded- border border-slate-700 text-[var(--text-color)] hover:text-white hover:bg-[var(--text-color)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded- bg-red-600 text-white hover:bg-red-500 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}