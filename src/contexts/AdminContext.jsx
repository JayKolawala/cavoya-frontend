// src/contexts/AdminContext.jsx
import React, { createContext, useContext, useState } from "react";

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [adminProducts, setAdminProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Product management functions
  const addProduct = (product) => {
    setAdminProducts([...adminProducts, product]);
  };

  const updateProduct = (id, updatedProduct) => {
    setAdminProducts(
      adminProducts.map((product) =>
        product.id === id ? { ...product, ...updatedProduct } : product
      )
    );
  };

  const deleteProduct = (id) => {
    setAdminProducts(adminProducts.filter((product) => product.id !== id));
  };

  const value = {
    adminProducts,
    orders,
    customers,
    addProduct,
    updateProduct,
    deleteProduct,
    setOrders,
    setCustomers,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
