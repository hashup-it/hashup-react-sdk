export enum Network {
    _ /** Null network */,
    POLYGON_MAINNET = 137,
    MUMBAI_TESTNET = 80001,
    FALLBACK = process.env.REACT_APP_ENV === 'production' ? POLYGON_MAINNET : MUMBAI_TESTNET,
}
