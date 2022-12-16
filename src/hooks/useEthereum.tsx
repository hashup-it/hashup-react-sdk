import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const desiredId = 80001;

export const useEthereum = () => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [walletInstalled, setWalletInstalled] = useState<boolean>(false);
    const [provider, setProvider] =
      useState<ethers.providers.Web3Provider | null>(null);

    const [isNetworkValid, setNetworkValid] = useState<boolean>(false);
    const [chainId, setChainId] = useState<number | null>(null);

    // Check if ethereum installed
    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            setWalletInstalled(true);
        }
    }, []);

    // Check if ethereum installed
    useEffect(() => {
        if (chainId !== null) {
            if (desiredId === chainId) {
                setNetworkValid(true);
                console.log('Network connection successful');
            } else {
                console.log('Invalid network.');
            }
            setLoading(false);
        }
    }, [chainId]);

    // Load provider
    useEffect(() => {
        if (walletInstalled) {
            let newProvider = new ethers.providers.Web3Provider(
              window.ethereum,
              'any'
            );

            newProvider.on('network', (newNetwork, oldNetwork) => {
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

    return { isLoading, walletInstalled, isNetworkValid, provider };
};
