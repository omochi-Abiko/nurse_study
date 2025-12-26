"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import { fetcher } from "@/lib/api";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <SWRConfig
        value={{
          fetcher,
          revalidateOnFocus: false,
          dedupingInterval: 5000,
        }}
      >
        {children}
      </SWRConfig>
    </NextAuthSessionProvider>
  );
}
