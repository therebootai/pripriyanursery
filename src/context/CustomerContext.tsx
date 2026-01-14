"use client";

import { Customer } from "@/types/types";
import { createResourceContext } from "./createResourceContext";
import {  getMe, logout } from "@/library/api";

const { Provider: CustomerProviderBase, useResource: useCustomerBase } =
  createResourceContext<Customer>(getMe, { clearable: true });

export const CustomerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <CustomerProviderBase>{children}</CustomerProviderBase>;
};

export const useCustomer = () => {
  const ctx = useCustomerBase();

  const logoutCustomer = async () => {
    await logout();
    ctx.clear?.();
  };

  return {
    customer: ctx.data,
    loading: ctx.loading,
    refreshCustomer: ctx.refresh,
    logoutCustomer,
  };
};
