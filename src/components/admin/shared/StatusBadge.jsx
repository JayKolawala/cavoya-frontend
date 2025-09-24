// src/components/admin/shared/StatusBadge.jsx
import React from "react";
import {
  CheckCircle,
  AlertCircle,
  CreditCard,
  Ban,
  Clock,
  Package,
  Truck,
  X,
} from "lucide-react";

const StatusBadge = ({
  status,
  type = "customer", // "customer" | "order" | "payment"
  showIcon = true,
  size = "sm", // "xs" | "sm" | "md" | "lg"
}) => {
  const statusConfig = {
    customer: {
      active: {
        label: "Active",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      inactive: {
        label: "Inactive",
        color: "bg-gray-100 text-gray-800",
        icon: AlertCircle,
      },
      vip: {
        label: "VIP",
        color: "bg-purple-100 text-purple-800",
        icon: CreditCard,
      },
      blocked: {
        label: "Blocked",
        color: "bg-red-100 text-red-800",
        icon: Ban,
      },
    },
    order: {
      pending: {
        label: "Pending",
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      },
      processing: {
        label: "Processing",
        color: "bg-blue-100 text-blue-800",
        icon: Package,
      },
      shipped: {
        label: "Shipped",
        color: "bg-indigo-100 text-indigo-800",
        icon: Truck,
      },
      delivered: {
        label: "Delivered",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      cancelled: {
        label: "Cancelled",
        color: "bg-red-100 text-red-800",
        icon: X,
      },
    },
    payment: {
      paid: {
        label: "Paid",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      pending: {
        label: "Pending",
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      },
      failed: {
        label: "Failed",
        color: "bg-red-100 text-red-800",
        icon: AlertCircle,
      },
    },
  };

  const sizeClasses = {
    xs: "px-2 py-1 text-xs",
    sm: "px-2 inline-flex text-xs leading-5",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const iconSizes = {
    xs: "h-3 w-3",
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const config = statusConfig[type]?.[status] || {
    label: status,
    color: "bg-gray-100 text-gray-800",
    icon: AlertCircle,
  };

  const Icon = config.icon;

  return (
    <span
      className={`
        ${sizeClasses[size]} 
        ${config.color} 
        font-semibold rounded-full items-center inline-flex
      `}
    >
      {showIcon && (
        <Icon className={`${iconSizes[size]} ${showIcon ? "mr-1" : ""}`} />
      )}
      {config.label}
    </span>
  );
};

export default StatusBadge;
