export enum Network {
    _ /** Null network */,
    POLYGON_MAINNET = 137,
    MUMBAI_TESTNET = 80001,
    FALLBACK = process.env.REACT_APP_ENV === 'development' ? MUMBAI_TESTNET : POLYGON_MAINNET,
}

export enum TestNetwork {
    MUMBAI_TESTNET = Network.MUMBAI_TESTNET,
}
