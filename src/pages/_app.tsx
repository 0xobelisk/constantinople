import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';
import "../css/font-awesome.css"
import {
    WalletProvider,
    Chain,
} from "@suiet/wallet-kit";
import '@suiet/wallet-kit/style.css';

const SuiCustomChain: Chain = {
    id: "sui:localnet",
    name: "Sui Localnet",
    rpcUrl: "http://127.0.0.1:9000",
};

const SupportedChains: Chain[] = [
    // ...DefaultChains,
    SuiCustomChain
];



function MyApp({ Component, pageProps }: AppProps) {



  return (
      <WalletProvider chains={SupportedChains}>
      {/*<WalletProvider defaultWallets={AllDefaultWallets}>*/}
        <Component {...pageProps} />
      </WalletProvider>
  )
}

export default  MyApp
