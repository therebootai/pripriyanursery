"use client";

import { createContext, useContext, useState } from "react";
import LoadingAnimation from "@/components/globals/LoadingAnimation";

const GlobalUIContext = createContext<{
  showLoader: boolean;
  setShowLoader: (v: boolean) => void;
} | null>(null);

export function GlobalUIProvider({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState(false);

  return (
    <GlobalUIContext.Provider value={{ showLoader, setShowLoader }}>
      {children}

      {showLoader && (
        <div className="fixed inset-0 z-[99999] bg-white flex items-center justify-center">
          <LoadingAnimation />
        </div>
      )}
    </GlobalUIContext.Provider>
  );
}

export function useGlobalUI() {
  const ctx = useContext(GlobalUIContext);
  if (!ctx) throw new Error("useGlobalUI must be used inside GlobalUIProvider");
  return ctx;
}
