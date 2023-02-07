import { Network } from '../enum/network.enum';

export const networkChainParams: any = {
	[Network.POLYGON_MAINNET]: {
		chainId: '0x89',
		chainName: 'Polygon Mainnet',
		nativeCurrency: {
			name: 'MATIC',
			symbol: 'MATIC',
			decimals: 18,
		},
		rpcUrls: [
			'https://rpc-mainnet.matic.quiknode.pro/',
			'https://polygon-rpc.com/',
			'https://matic-mainnet-archive-rpc.bwarelabs.com/',
		],
		blockExplorerUrls: ['https://polygonscan.com/'],
	},
	[Network.MUMBAI_TESTNET]: {
		chainId: '0x13881',
		chainName: 'Mumbai Testnet',
		nativeCurrency: {
			name: 'MATIC',
			symbol: 'MATIC',
			decimals: 18,
		},
		rpcUrls: ['https://matic-mumbai.chainstacklabs.com/'],
		blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
	},
};

const useNetworks = () => {
	const switchNetwork = async (network = Network.FALLBACK) => {
		if (!window.ethereum.request) {
			return;
		}

		try {
			await window.ethereum.request({
				method: 'wallet_addEthereumChain',
				params: [networkChainParams[network]],
			});
		} catch {
			return 'Open your wallet to take action';
		}
	};

	return { switchNetwork };
};

export default useNetworks;
