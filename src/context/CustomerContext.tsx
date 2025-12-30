"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Customer, getMe, logout } from "@/library/api";

interface CustomerContextType {
  customer: Customer | null;
  loading: boolean;
  refreshCustomer: () => Promise<void>;
  logoutCustomer: () => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | null>(null);

export const CustomerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshCustomer();
  }, []);

  const refreshCustomer = async () => {
    try {
      setLoading(true);
      const data = await getMe();
      setCustomer(data);
    } catch (error) {
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  const logoutCustomer = async () => {
    await logout();
    setCustomer(null);
  };

  return (
    <CustomerContext.Provider
      value={{
        customer,
        loading,
        refreshCustomer,
        logoutCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error("useCustomer must be used inside CustomerProvider");
  return ctx;
};
