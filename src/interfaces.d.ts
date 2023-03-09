import { ExternalProvider } from '@ethersproject/providers';

declare type AbstractProvider = import('web3/node_modules/web3-core/types').AbstractProvider;

interface EthereumProvider extends ExternalProvider {
	_state: {
		accounts: string[];
	};
	sendAsync: AbstractProvider['sendAsync'];

	on(event: 'close' | 'accountsChanged' | 'chainChanged' | 'networkChanged', callback: (payload: any) => void): void;

	once(
		event: 'close' | 'accountsChanged' | 'chainChanged' | 'networkChanged',
		callback: (payload: any) => void
	): void;

	removeAllListeners(): void;
}

declare global {
	interface Window {
		ethereum: EthereumProvider;
	}
}
