import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import Web3Modal from 'web3modal'
type SignerContextType = {
  signer?: JsonRpcSigner;
  address?: string;
  loading: boolean;
  connectWallet: () => Promise<void>;
}
const SignerContext = createContext<SignerContextType>({} as any);

// using useSigner we can consume the data of context type SignerContext
const useSigner = () => useContext(SignerContext);

export const SignerProvider = ({ children }: { children: ReactNode }) => {
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [address, setAddress] = useState<String>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const web3modal = new Web3Modal();
    if (web3modal.cachedProvider) connectWallet();
  }, [])

  const connectWallet = async () => {
    // should open metamask
    setLoading(true);
    try {
      const web3model = new Web3Modal({ cacheProvider: true });
      const instance = await web3model.connect();
      const provider = new Web3Provider(instance);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setSigner(signer);
      setAddress(address);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }
  const contextValue = { signer, address, loading, connectWallet };
  return <SignerContext.Provider value={contextValue}>
    {children}
  </SignerContext.Provider>
}

export default useSigner;