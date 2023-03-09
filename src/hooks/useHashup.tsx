import { BigNumber, ethers } from 'ethers';
import { useMemo, useState } from 'react';
import { useEthereum } from './useEthereum';

import { HashupStoreV0_ABI } from '../abi/HashupStoreV0';
import { HashupStoreV1_ABI } from '../abi/HashupStoreV1';
import { USDC_ABI } from '../abi/USDC';
import {
    hashupMarketplace,
    hashupStoreV0Address,
    hashupStoreV1Address,
    paymentTokenAddress,
} from '../constants/addresses';
import { BuyStage } from '../enum/buy-stage.enum';
import useAsyncEffect from './effects/async';
import { MAX_PURCHASABLE_COPIES } from '../constants/settings';
import { Network } from '../enum/network.enum';
import { IGame, IGameToken } from '../types';
import useNetworks from './useNetworks';
import { HashupError } from '../enum/error.enum';

interface UseHashupOutput {
    /**
     * Allows for ahead-of-time payment approval. Called automatically by `buyGame()`.
     */
    approve: () => Promise<void>;
    /**
     * Purchases a license. Defaults to one token bought, i.e. 100 units.
     * @param address address of ERC20 licence about to be bought
     * @param amount amount of token units bought (unit is 0.01 of a token)
     * @param metadata game data; specify to automatically add the token to wallet
     */
    buyGame: (
        address: string,
        amount?: string,
        metadata?: Pick<IGame & IGameToken, 'address' | 'symbol' | 'media'>
    ) => Promise<string | void>;
    /**
     * HashUp-protocol lifecycle state. Affected by `buyGame()` method call.
     * @default BuyStage.NOT_STARTED
     */
    buyingStage: BuyStage;
    /**
     * HashUp-protocol wallet connection init status
     */
    isEthereumLoading: boolean;
    /**
     * HashUp-protocol network compatibility status
     */
    isNetworkValid: boolean;
    /**
     * Sets a custom marketplace. Defaults to HashUp.
     * @param marketplace marketplace's blockchain address
     */
    setMarketplace: React.Dispatch<React.SetStateAction<string>>;
    /**
     * Sets a reflink variable. Affects `buyGame()` method call.
     * @param referrer purchase referrer's blockchain address
     */
    setReferrer: React.Dispatch<React.SetStateAction<string>>;
}

const useHashup = (): UseHashupOutput => {
    const { isEthereumLoading, isNetworkValid, network, account, signer } = useEthereum();
    const networkManager = useNetworks();

    const [buyingStage, setBuyingStage] = useState(BuyStage.NOT_STARTED);
    const [referrer, setReferrer] = useState(ethers.constants.AddressZero);
    const [marketplace, setMarketplace] = useState(hashupMarketplace);

    const getTokenAddress = (lookup: {} | any, chainId: Network) => !isNetworkValid ? ethers.constants.AddressZero : lookup[chainId];

    const paymentTokenContract = useMemo(
        () => new ethers.Contract(getTokenAddress(paymentTokenAddress, network), USDC_ABI, signer!),
        [signer, network]
    );
    const hashupStoreV0Contract = useMemo(
        () => new ethers.Contract(getTokenAddress(hashupStoreV0Address, network), HashupStoreV0_ABI, signer!),
        [signer, network]
    );
    const hashupStoreV1Contract = useMemo(
        () => new ethers.Contract(getTokenAddress(hashupStoreV1Address, network), HashupStoreV1_ABI, signer!),
        [signer, network]
    );

    const _getStore = (isDeprecationMode: boolean) =>
        isDeprecationMode ? hashupStoreV0Contract : hashupStoreV1Contract;

    const _getPurchaseTx = async (address: string, price: string, amount: string, isDeprecationMode = false) => {
        /** Approve fallback */
        const approval = await paymentTokenContract.allowance(account, _getStore(isDeprecationMode).address);

        if (BigNumber.from(approval).lte(BigNumber.from(Number(price) * MAX_PURCHASABLE_COPIES).mul('100'))) {
            await approve(isDeprecationMode);
        }

        /** HashUp V0 */
        if (isDeprecationMode) {
            if (referrer !== ethers.constants.AddressZero) {
                return await hashupStoreV0Contract['buyCartridge(address,uint256,address)'](address, amount, referrer);
            } else {
                return await hashupStoreV0Contract['buyCartridge(address,uint256)'](address, amount);
            }
        }

        /** HashUp V1 */
        console.log('getting new store');
        console.log('passing in', address, amount.toString(), referrer);
        return await hashupStoreV1Contract['buyLicense(address,uint256,address,address)'](
            address,
            amount.toString(),
            marketplace,
            referrer
        );
    };

    /**
     * Allows for ahead-of-time payment approval
     * @param isDeprecationMode
     */
    const approve = async (isDeprecationMode = false) => {
        setBuyingStage(BuyStage.APPROVING);

        const approvalTransaction = await paymentTokenContract.approve(
            _getStore(isDeprecationMode).address,
            ethers.constants.MaxUint256
        );
        await approvalTransaction.wait();

        setBuyingStage(BuyStage.APPROVED);
    };

    /**
     * Token purchase action.
     * @param address license to purchase
     * @param amount amount in 0.01 units
     * @param metadata game data; specify to automatically save the token in wallet
     */
    const buyGame = async (
        address: string,
        amount: string = '100',
        metadata?: Pick<IGame & IGameToken, 'address' | 'symbol' | 'media'>
    ) => {
        try {
            const v1price: string = await hashupStoreV1Contract.getLicensePrice(address);
            const v0price = await hashupStoreV0Contract.getCartridgePrice(address);
            const isDeprecationMode = !(Number(v1price) > 0);
            const price = Number(v1price) > 0 ? v1price : v0price;

            const buyTransaction = await _getPurchaseTx(address, price, amount, isDeprecationMode);

            setBuyingStage(BuyStage.BUYING);
            await buyTransaction.wait();
            setBuyingStage(BuyStage.BOUGHT);

            /** TODO: factor out for outside use */
            if (metadata) {
                // @ts-ignore
                await (window as any).ethereum.request({
                    method: 'wallet_watchAsset',
                    params: {
                        type: 'ERC20',
                        options: {
                            address: metadata.address,
                            symbol: metadata.symbol,
                            decimals: 2,
                            image: metadata.media.logoUrl,
                        },
                    },
                });
            }
        } catch (error) {
            const _error = error as any;
            if (_error.reason === 'execution reverted: ERC20: transfer amount exceeds balance') {
                setBuyingStage(BuyStage.APPROVED);
                return HashupError.BALANCE;
            } else if (_error.reason === 'user rejected transaction') {
                return HashupError.DISMISSAL;
            } /** @dev fired upon internal error, hence general catch */ else {
                void networkManager.switchNetwork();
                return HashupError.NETWORK;
            }
        }
    };

    /** TODO: Check payment allowance AOT */
    useAsyncEffect(async () => {
    }, []);

    return {
        isEthereumLoading,
        isNetworkValid,
        setReferrer,
        setMarketplace,
        approve,
        buyGame,
        buyingStage,
    };
};

export default useHashup;
