import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import useAsyncEffect from './effects/async';
import { fetchAccounts } from '../utils/ethereum';
import { Network } from '../enum/network.enum';

const DESIRED_NETWORKS = [Network.POLYGON_MAINNET];

export const useEthereum = () => {
    const [isLoading, setLoading] = useState(true);
    const [walletInstalled, setWalletInstalled] = useState(false);
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [account, setAccount] = useState<string | null>(null);

    const [isNetworkValid, setNetworkValid] = useState(false);
    const [chainId, setChainId] = useState(DESIRED_NETWORKS[0]);

    /** Check if ethereum installed */
    /** Check if ethereum installed */
    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            setWalletInstalled(true);
        }
    }, []);

    /** Check if ethereum installed */
    useEffect(() => {
        if (chainId === -1) {
            return;
        }

        if (DESIRED_NETWORKS.includes(chainId)) {
            setNetworkValid(true);
            console.log('Network connection successful');
        } else {
            console.log('Invalid network.');
        }
        setLoading(false);
    }, [chainId]);

    /** Load provider */
    useEffect(() => {
        if (walletInstalled) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            provider.on('network', (newNetwork, oldNetwork) => {
                if (oldNetwork) {
                    console.log('Network changed. Page will reload now.');
                    window.location.reload();
                } else {
                    console.log('Network ID: ' + newNetwork.chainId);
                    setChainId(newNetwork.chainId);
                }
            });

            setProvider(provider);
        }
    }, [walletInstalled]);

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
        walletInstalled,
        isNetworkValid,
        provider,
        account,
        network: chainId,
        signer
    };
};
