import './App.css';
import Navbar from "./Components/Navbar"
import Home from "./Components/Home"
import Livestock from "./Components/LightHouse"
import Messages from "./Components/Messages"
import { Route, Routes } from 'react-router-dom';
import SearchBar from './Components/SearchBar';
import LoginPage from './Components/LoginPage';
import Connect from './Components/Connect';
import LightHouse from './Components/LightHouse';

import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { useEffect } from 'react';




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

export default function App()

{
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}> 
       <Navbar/>
       <Routes>
         <Route path="/" element={<LoginPage />} />
         <Route path="/light-house" element={<LightHouse />} />
         <Route path="/login" element={<LoginPage />} />
         <Route path="/home" element={<Home />} />
         {/* <Route path="/proposal" element={<Proposal />} />
        
         <Route path="/proposal" element={<Proposal />} /> */}
       </Routes>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}



















 