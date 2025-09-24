// src/components/admin/orders/OrderStats.jsx
import React from "react";
import { Package, Clock, Truck, CheckCircle, X } from "lucide-react";
import StatsCard from "../shared/StatsCard";
import { ORDER_STATUSES } from "../../../utils/constants";

const OrderStats = ({ orders = [] }) => {
  const calculateStats = () => {
    if (!orders.length) {
      return ORDER_STATUSES.reduce((acc, status) => {
        acc[status.value] = 0;
        return acc;
      }, {});
    }

    return orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
  };

  const stats = calculateStats();

  const getIconForStatus = (status) => {
    const iconMap = {
      pending: Clock,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: X,
    };
    return iconMap[status] || Package;
  };

  const getColorForStatus = (status) => {
    const colorMap = {
      pending: "yellow",
      processing: "blue",
      shipped: "indigo",
      delivered: "green",
      cancelled: "red",
    };
    return colorMap[status] || "gray";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      {ORDER_STATUSES.map((status) => {
        const Icon = getIconForStatus(status.value);
        const count = stats[status.value] || 0;

        return (
          <StatsCard
            key={status.value}
            title={status.label}
            value={count}
            icon={Icon}
            iconColor={getColorForStatus(status.value)}
            subtitle={`${
              orders.length > 0 ? Math.round((count / orders.length) * 100) : 0
            }% of total`}
          />
        );
      })}
    </div>
  );
};

export default OrderStats;
