// src/components/admin/orders/OrderFilters.jsx
import React from "react";
import SearchBar from "../shared/SearchBar";
import { ORDER_STATUSES } from "../../../utils/constants";

const OrderFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  className = "",
}) => {
  return (
    <div className={`flex flex-col md:flex-row gap-4 mb-6 ${className}`}>
      {/* Search Bar */}
      <SearchBar
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by order ID, customer name, or email..."
        className="flex-1"
      />

      {/* Status Filter */}
      <div className="w-full md:w-48">
        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-pink-500 focus:border-pink-500 bg-white"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
        >
          <option value="all">All Statuses</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default OrderFilters;
