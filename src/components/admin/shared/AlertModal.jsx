// src/components/admin/shared/AlertModal.jsx
import React, { useEffect } from "react";
import { AlertTriangle, CheckCircle, XCircle, Info, X } from "lucide-react";

/**
 * AlertModal — themed replacement for window.alert() and window.confirm()
 *
 * Props:
 *   isOpen        {boolean}  - controls visibility
 *   onClose       {fn}       - called when dismissed (alert) or cancelled (confirm)
 *   onConfirm     {fn}       - called when the primary action is confirmed (confirm mode only)
 *   title         {string}   - modal heading
 *   message       {string}   - body text
 *   type          {string}   - "error" | "warning" | "success" | "info"  (default: "info")
 *   mode          {string}   - "alert" | "confirm"  (default: "alert")
 *   confirmLabel  {string}   - label for confirm button  (default: "Confirm")
 *   cancelLabel   {string}   - label for cancel button   (default: "Cancel")
 */
const ICONS = {
    error: { Icon: XCircle, iconClass: "text-red-500", ringClass: "bg-red-50", btnClass: "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600" },
    warning: { Icon: AlertTriangle, iconClass: "text-red-500", ringClass: "bg-red-50", btnClass: "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600" },
    success: { Icon: CheckCircle, iconClass: "text-emerald-500", ringClass: "bg-emerald-50", btnClass: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600" },
    info: { Icon: Info, iconClass: "text-pink-500", ringClass: "bg-pink-50", btnClass: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600" },
};

const AlertModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = "info",
    mode = "alert",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
}) => {
    const { Icon, iconClass, ringClass, btnClass } = ICONS[type] ?? ICONS.info;

    // ESC key closes the modal
    useEffect(() => {
        if (!isOpen) return;
        const handle = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handle);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handle);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
                {/* Top coloured bar */}
                <div className={`h-1.5 w-full ${btnClass}`} />

                {/* Body */}
                <div className="px-6 pt-6 pb-4">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {/* Icon */}
                    <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${ringClass}`}>
                        <Icon className={`h-7 w-7 ${iconClass}`} />
                    </div>

                    {/* Title */}
                    {title && (
                        <h3 className="text-center text-lg font-bold text-gray-900 mb-2">
                            {title}
                        </h3>
                    )}

                    {/* Message */}
                    {message && (
                        <p className="text-center text-sm text-gray-600 leading-relaxed">
                            {message}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className={`px-6 pb-6 flex gap-3 ${mode === "confirm" ? "flex-row" : "flex-col"}`}>
                    {mode === "confirm" && (
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            {cancelLabel}
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (mode === "confirm" && onConfirm) onConfirm();
                            else onClose();
                        }}
                        className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md transition-all ${btnClass}`}
                    >
                        {mode === "confirm" ? confirmLabel : "OK"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;
