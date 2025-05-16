
'use client';
import type { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
export function Providers({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey="EUK6nliWVdB5Nkt4VuNXUsAV7VwBmtwR"
      projectId="1d0226d4-9f84-48d6-9486-b4381e220d9f"
      chain={base}
      config={{
        appearance: {
          name: 'TrustVote',
          logo: '/logo.svg',
          mode: 'auto',
          theme: 'default',
        },
      }}
    >
      {children}
    </OnchainKitProvider>
  );
}
