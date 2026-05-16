"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { ScrollToTop } from "./ScrollToTop";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "10px",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#0a8f08",
              secondary: "#fff",
            },
          },
        }}
      />
      {children}
    </SessionProvider>
  );
}
