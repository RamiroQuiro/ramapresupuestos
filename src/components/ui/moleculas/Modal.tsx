import { cn } from "@/utils/cn";
import { X } from "lucide-react";
import React, { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const sizeClasses: Record<string, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[95vw] max-h-[95vh]",
};

export default function Modal({ open, onClose, title, size = "md", children, footer }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className={cn(
          "flex w-full flex-col rounded-xl border border-gray-200 bg-white shadow-2xl animate-in fade-in zoom-in-95",
          sizeClasses[size],
        )}
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-primary-textoTitle text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

// Hook para controlar el modal
export function useModal(initial = false) {
  const [open, setOpen] = React.useState(initial);
  return {
    open,
    setOpen,
    openModal: () => setOpen(true),
    closeModal: () => setOpen(false),
    toggle: () => setOpen((p) => !p),
  };
}
