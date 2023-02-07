import { Network } from '../enum/network.enum';

const paymentTokenAddress: { [p: number]: string } = {
    [Network.POLYGON_MAINNET]: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    [Network.MUMBAI_TESTNET]: '0xf583F23e2b26f1ABd88804704E3826DeafC8A21d',
};
const hashupStoreV0Address: { [p: number]: string } = {
    [Network.POLYGON_MAINNET]: '0x9741708b2DeDE32c972D3EF7959Fa3262860E485',
    [Network.MUMBAI_TESTNET]: '0xa455F248ba4475D11043D029d7dc6FD11270B66e',
};
const hashupStoreV1Address: { [p: number]: string } = {
    [Network.POLYGON_MAINNET]: '0x1aFb90451aBbF5Eb6f59842CAF8949374F1B4683',
    [Network.MUMBAI_TESTNET]: '0xFeddE591f50d9de05A39609E479Dd65bc85A1112',
};

const hashupMarketplace = '0x714EF5c429ce9bDD0cAC3631D30474bd04e954Dc';

export { paymentTokenAddress, hashupStoreV0Address, hashupStoreV1Address, hashupMarketplace };
