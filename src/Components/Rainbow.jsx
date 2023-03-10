import React from 'react'
import { Link } from "react-router-dom";
// import polygonLogo from "./images/polygon-id.png";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import Connect from './Connect';

function Rainbow() {
    const { chains, provider } = configureChains(
        [mainnet, polygonMumbai],
        [
            publicProvider()
        ]
    );
    const { connectors } = getDefaultWallets({
        appName: "Decntralized Social Media",
        chains,
    });
    const wagmiClient = createClient({
        autoConnect: true,
        connectors,
        provider,
    });

    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider modalSize="compact" chains={chains}>
                <Connect />
            </RainbowKitProvider>
        </WagmiConfig>
    )
}



export default Rainbow