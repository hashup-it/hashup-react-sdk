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

	const updateNetworkStatus = (chainId: number) => {
		const isNetworkValid = DESIRED_NETWORKS.includes(chainId);

		setIsNetworkValid(isNetworkValid);
		console.log(isNetworkValid ? 'Network connected' : 'Invalid network.');
	};

	/** Check if ethereum is installed */
	useEffect(() => setIsWalletInstalled(typeof window.ethereum !== 'undefined'), []);

	/** Check if network is supported */
	useEffect(() => {
		if (chainId === -1) {
			return;
		}

		updateNetworkStatus(chainId);
		setIsLoading(false);
	}, [chainId]);

	/** Network retrieval */
	useAsyncEffect(async () => {
		if (!isWalletInstalled) {
			return
		}

		if (!isWalletInstalled || !window.ethereum.request) {
			return;
		}

		const chainIdRaw = await window.ethereum.request({ method: 'eth_chainId' });
		const chainId = parseInt(chainIdRaw, 16);

		setChainId(chainId);
		updateNetworkStatus(chainId);
	}, [isWalletInstalled]);

	/** Network listener */
	useEffect(() => {
		if (!isWalletInstalled) {
			return;
		}

		const onChainChanged = async (chainIdRaw: string) => {
			const chainId = parseInt(chainIdRaw, 16);

			setChainId(chainId);
			updateNetworkStatus(chainId);
		};

		(window.ethereum as any).on('chainChanged', onChainChanged);
	}, [isWalletInstalled]);

	/** Provider and signer retrieval */
	useEffect(() => {
		if (!isWalletInstalled) {
			return
		}

		if (account === ethers.constants.AddressZero) {
			setProvider(null);
			setSigner(null);

			return;
		}

		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();

		setProvider(provider);
		setSigner(signer);
	}, [isWalletInstalled, account, chainId]);

	/** Get account */
	useAsyncEffect(async () => {
		if (!isWalletInstalled) {
			return
		}

		setAccount((await fetchAccounts())[0])
	}, []);

	return {
		isEthereumLoading: isLoading,
		walletInstalled: isWalletInstalled,
		isNetworkValid,
		provider,
		account,
		network: chainId,
		signer,
	};
};
