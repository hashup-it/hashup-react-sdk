import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import useAsyncEffect from './effects/async';
import { fetchAccounts } from '../utils/ethereum';
import { Network } from '../enum/network.enum';

const DESIRED_NETWORKS = [Network.POLYGON_MAINNET];

export const useEthereum = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isWalletInstalled, setIsWalletInstalled] = useState(false);
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [account, setAccount] = useState<string | null>(null);

    const [isNetworkValid, setIsNetworkValid] = useState(false);
    const [chainId, setChainId] = useState<Network | number>(DESIRED_NETWORKS[0]);

    /** Check if ethereum is installed */
    useEffect(() => setIsWalletInstalled(typeof window.ethereum !== 'undefined'), []);

    /** Check if network is supported */
    useEffect(() => {
        if (chainId === -1) {
            return;
        }

        const isNetworkValid = DESIRED_NETWORKS.includes(chainId);

        setIsNetworkValid(isNetworkValid);
        console.log(isNetworkValid ? 'Network connection successful' : 'Invalid network.');

        setIsLoading(false);
    }, [chainId]);

    /** Network listener */
    useEffect(() => {
        if (!isWalletInstalled) {
            return;
        }

        const onChainChanged = async (chainIdRaw: string) => {
            setChainId(parseInt(chainIdRaw, 16));
        };
        (window.ethereum as any).on('chainChanged', onChainChanged);
    }, [isWalletInstalled]);

    /** Get signer */
    useEffect(() => {
        if (!provider) {
            return;
        }

        setSigner(provider.getSigner());
    }, [provider]);

    /** Get account */
    useAsyncEffect(async () => setAccount((await fetchAccounts())[0]), []);

    return {
        isEthereumLoading: isLoading,
        walletInstalled: isWalletInstalled,
        isNetworkValid,
        provider,
        account,
        network: chainId,
        signer
    };
};
