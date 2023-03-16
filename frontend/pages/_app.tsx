import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { RainbowKitSiweNextAuthProvider } from "@rainbow-me/rainbowkit-siwe-next-auth";

import { gnosis, gnosisChiado, goerli, hardhat } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

const { chains, provider, webSocketProvider } = configureChains(
  [
    gnosis,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? [hardhat, gnosisChiado]
      : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "GumRua",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
  persister: null,
});

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  return (
    <WagmiConfig client={wagmiClient}>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <RainbowKitSiweNextAuthProvider>
          <RainbowKitProvider chains={chains}>
            <Component {...pageProps} />
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}

export default MyApp;
