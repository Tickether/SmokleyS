import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { sepolia, mainnet, configureChains, createConfig, WagmiConfig } from 'wagmi'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'

// Wagmi Config
const chains = [sepolia, mainnet];
const projectId = process.env.NEXT_PUBLIC_W3M_PROJECT_ID

const { publicClient } = configureChains(
  chains,
  [w3mProvider({ projectId })],
)

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({
    version: 2,
    chains,
    projectId 
  }),
  publicClient,
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

export default function App({ Component, pageProps }: AppProps) {
  return( 
  <>
    <WagmiConfig config={wagmiConfig} >
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </WagmiConfig>
    <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
  </>
  )
}
