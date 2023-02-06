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

import { configureChains, createClient, useAccount, WagmiConfig } from "wagmi";
import { mainnet, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { useEffect } from 'react';
import Syndicate from './Components/Syndicate';
import Huddle from './Components/Huddle';
import { Chain } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import CreateCommunity from './Components/CreateCommunity';
import Post from './Components/Post';
import CreatePost from './Components/CreatePost';
import Notification from './Components/Notification';

const avalancheChain = {
  id: 3141,
  name: 'Filecoin - Hyperspace testnet',
  network: 'Hyperspace',
  iconUrl: 'https://example.com/icon.svg',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Hyperspace',
    symbol: 'tFil',
  },
  rpcUrls: {
    default: {
      http: ['https://api.hyperspace.node.glif.io/rpc/v1'],
    },
  },
  blockExplorers: {
    default: { name: 'HyperSpace', url: 'https://hyperspace.filfox.info/en' },
    // etherscan: { name: 'SnowTrace', url: 'https://snowtrace.io' },
  },
  testnet: true,
};


const { chains, provider } = configureChains(
  [avalancheChain],
  [
    jsonRpcProvider({
      rpc: chain => ({ http: chain.rpcUrls.default.http[0] }),
    }),
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




export default function App() {
  const {isConnected} = useAccount()
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        {isConnected ? 
      <>
      <Navbar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/light-house" element={<LightHouse />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
          {/* <Route path="/Syndicates" element={<Syndicate />} /> */}
          <Route path="/Syndicates/:id" element={<Syndicate />} />
          <Route path="/Huddle/:id" element={<Huddle />} />
          <Route path="/CreatePost/:id" element={<CreatePost />} />
          <Route path="/Notification" element={<Notification />} />
          
          {/* <Route path="/proposal" element={<Proposal />} />
        
         <Route path="/proposal" element={<Proposal />} /> */}
         <Route path="/Community" element={<CreateCommunity />} />
         <Route path="/Post/:id" element={<Post/>} />

        </Routes>
        </> : <LoginPage/>  }
      </RainbowKitProvider>
    </WagmiConfig>
  );
}



















