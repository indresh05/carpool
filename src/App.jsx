import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from "petra-plugin-wallet-adapter";
import CarpoolingApp from './CarpoolingApp';

const wallets = [new PetraWallet()];

function App() {
    return (
      <h1 className="text-3xl font-bold underline">
        <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      <CarpoolingApp />
    </AptosWalletAdapterProvider>
      </h1>
    )
  }

export default App;