// src/components/admin/customers/CustomerStats.jsx
import React from "react";
import { User, CheckCircle, CreditCard, ShoppingBag } from "lucide-react";
import StatsCard from "../shared/StatsCard";
import { formatCurrency, formatNumber } from "../../../utils/formatters";

const CustomerStats = ({ customers = [] }) => {
  const calculateStats = () => {
    if (!customers.length) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        vip: 0,
        blocked: 0,
        totalRevenue: 0,
        avgOrderValue: 0,
      };
    }

    const stats = customers.reduce(
      (acc, customer) => {
        // Count by status
        acc[customer.status] = (acc[customer.status] || 0) + 1;

        // Sum revenue
        acc.totalRevenue += customer.totalSpent || 0;

        return acc;
      },
      { totalRevenue: 0 }
    );

    const avgOrderValue =
      customers.length > 0
        ? customers.reduce((sum, c) => sum + (c.averageOrderValue || 0), 0) /
          customers.length
        : 0;

    return {
      total: customers.length,
      active: stats.active || 0,
      inactive: stats.inactive || 0,
      vip: stats.vip || 0,
      blocked: stats.blocked || 0,
      totalRevenue: stats.totalRevenue,
      avgOrderValue: Math.round(avgOrderValue),
    };
  };

  const stats = calculateStats();

  const statsCards = [
    {
      title: "Total Customers",
      value: formatNumber(stats.total),
      icon: User,
      iconColor: "blue",
      subtitle: "All registered customers",
    },
    {
      title: "Active Customers",
      value: formatNumber(stats.active),
      icon: CheckCircle,
      iconColor: "green",
      subtitle: `${
        stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0
      }% of total`,
    },
    {
      title: "VIP Customers",
      value: formatNumber(stats.vip),
      icon: CreditCard,
      iconColor: "purple",
      subtitle: "Premium tier customers",
    },
    {
      title: "Avg Order Value",
      value: formatCurrency(stats.avgOrderValue).replace("INR", ""),
      icon: ShoppingBag,
      iconColor: "yellow",
      subtitle: "Per customer average",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsCards.map((card, index) => (
        <StatsCard
          key={index}
          title={card.title}
          value={card.value}
          subtitle={card.subtitle}
          icon={card.icon}
          iconColor={card.iconColor}
        />
      ))}
    </div>
  );
};

export default CustomerStats;
