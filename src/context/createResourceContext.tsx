"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ResourceContextType<T> {
  data: T | null;
  loading: boolean;
  refresh: () => Promise<void>;
  clear?: () => void;
}

export function createResourceContext<T>(
  fetcher: () => Promise<T>,
  options?: {
    clearable?: boolean;
  }
) {
  const Context = createContext<ResourceContextType<T> | null>(null);

  const Provider = ({ children }: { children: React.ReactNode }) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = async () => {
      try {
        setLoading(true);
        const result = await fetcher();
        setData(result);
      } catch (err) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      refresh();
    }, []);

    const value: ResourceContextType<T> = {
      data,
      loading,
      refresh,
      ...(options?.clearable && {
        clear: () => setData(null),
      }),
    };

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  const useResource = () => {
    const ctx = useContext(Context);
    if (!ctx) {
      throw new Error("Hook must be used inside its Provider");
    }
    return ctx;
  };

  return { Provider, useResource };
}
