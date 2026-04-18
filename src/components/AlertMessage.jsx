import React from "react";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";

/**
 * A reusable component to display inline alerts/messages.
 * 
 * @param {string} type - "warning", "error", "success", or "info"
 * @param {string} message - The message to display
 * @param {string} className - Optional additional CSS classes
 */
const AlertMessage = ({ type = "info", message, className = "" }) => {
  if (!message) return null;

  const config = {
    warning: {
      Icon: AlertTriangle,
      containerClass: "bg-yellow-50 border-yellow-200 text-yellow-800",
      iconClass: "text-yellow-600",
    },
    error: {
      Icon: XCircle,
      containerClass: "bg-red-50 border-red-200 text-red-800",
      iconClass: "text-red-600",
    },
    success: {
      Icon: CheckCircle,
      containerClass: "bg-green-50 border-green-200 text-green-800",
      iconClass: "text-green-600",
    },
    info: {
      Icon: Info,
      containerClass: "bg-blue-50 border-blue-200 text-blue-800",
      iconClass: "text-blue-600",
    },
  };

  const { Icon, containerClass, iconClass } = config[type] || config.info;

  return (
    <div
      className={`flex items-start gap-3 p-4 border rounded-xl shadow-sm ${containerClass} ${className}`}
    >
      <Icon className={`w-6 h-6 flex-shrink-0 ${iconClass}`} />
      <div className="flex-1 text-sm font-medium leading-tight">
        {message}
      </div>
    </div>
  );
};

export default AlertMessage;
