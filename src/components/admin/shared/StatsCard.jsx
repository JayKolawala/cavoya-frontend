// src/components/admin/shared/StatsCard.jsx
import React from "react";

const StatsCard = ({
  title,
  value,
  subtitle = "",
  icon: Icon,
  iconColor = "blue",
  trend = null, // { value: number, isPositive: boolean }
  className = "",
  onClick = null,
}) => {
  const iconColorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
    indigo: "bg-indigo-100 text-indigo-600",
    pink: "bg-pink-100 text-pink-600",
    gray: "bg-gray-100 text-gray-600",
  };

  const formatValue = (val) => {
    if (typeof val === "number") {
      // Format large numbers with commas
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div
      className={`
        bg-white rounded-lg shadow p-4 transition-all duration-200 
        ${onClick ? "cursor-pointer hover:shadow-md hover:bg-gray-50" : ""} 
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-center">
        {Icon && (
          <div className={`p-3 rounded-full ${iconColorClasses[iconColor]}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div className={Icon ? "ml-4" : ""}>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">
              {formatValue(value)}
            </p>
            {trend && (
              <span
                className={`
                  ml-2 text-sm font-medium
                  ${trend.isPositive ? "text-green-600" : "text-red-600"}
                `}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
            )}
          </div>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
