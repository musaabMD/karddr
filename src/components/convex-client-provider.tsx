"use client";

import { ReactNode, useCallback, useState } from "react";
import { ConvexReactClient, ConvexProviderWithAuth } from "convex/react";
import {
  AuthKitProvider,
  useAccessToken,
  useAuth,
} from "@workos-inc/authkit-nextjs/components";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [convex] = useState(
    () => new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!),
  );

  return (
    <AuthKitProvider>
      <ConvexProviderWithAuth client={convex} useAuth={useAuthFromAuthKit}>
        {children}
      </ConvexProviderWithAuth>
    </AuthKitProvider>
  );
}

function useAuthFromAuthKit() {
  const { user, loading: isLoading } = useAuth();
  const { getAccessToken, refresh } = useAccessToken();

  const fetchAccessToken = useCallback(
    async ({
      forceRefreshToken,
    }: { forceRefreshToken?: boolean } = {}): Promise<string | null> => {
      if (!user) return null;
      try {
        return forceRefreshToken
          ? ((await refresh()) ?? null)
          : ((await getAccessToken()) ?? null);
      } catch (error) {
        console.error("Failed to get WorkOS access token for Convex", error);
        return null;
      }
    },
    [user, getAccessToken, refresh],
  );

  return {
    isLoading,
    isAuthenticated: !!user,
    fetchAccessToken,
  };
}
