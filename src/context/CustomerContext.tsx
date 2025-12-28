"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Customer, getMe, logout } from "@/library/api";

interface CustomerContextType {
  customer: Customer | null;
  loading: boolean;
  setCustomer: React.Dispatch<React.SetStateAction<Customer | null>>;
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
    const stored = localStorage.getItem("customer");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          setCustomer(parsed);
          setLoading(false);
        } else {
          // Invalid JSON, fetch fresh data
          refreshCustomer().finally(() => setLoading(false));
        }
      } catch (error) {
        console.error("Failed to parse customer from localStorage:", error);
        localStorage.removeItem("customer"); // Clean up invalid data
        refreshCustomer().finally(() => setLoading(false));
      }
    } else {
      refreshCustomer().finally(() => setLoading(false));
    }
  }, []);

  // 🔥 Keep localStorage ALWAYS in sync with customer state
  useEffect(() => {
    if (customer) {
      localStorage.setItem("customer", JSON.stringify(customer));
    } else {
      localStorage.removeItem("customer");
    }
  }, [customer]);

  const refreshCustomer = async () => {
    try {
      const data = await getMe();
      console.log(data);
      setCustomer(data);
    } catch {
      setCustomer(null);
      localStorage.removeItem("customer");
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
        setCustomer,
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
