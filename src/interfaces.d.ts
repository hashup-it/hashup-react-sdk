interface Window {
    ethereum: EthereumProvider;
}

declare type ExternalProvider =
  import('@ethersproject/providers').ExternalProvider;
declare type AbstractProvider =
  import('web3/node_modules/web3-core/types').AbstractProvider;

interface EthereumProvider extends ExternalProvider {
    _state: any;
    sendAsync: AbstractProvider['sendAsync'];
}
