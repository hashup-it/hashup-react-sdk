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
    paymentTokenAddress
} from '../constants/addresses';
import { BuyStage } from '../enum/buy-stage.enum';
import useAsyncEffect from './effects/async';
import { MAX_PURCHASABLE_COPIES } from '../constants/settings';

interface UseHashupOutput {
    approve: (isDeprecationMode?: boolean) => Promise<void>;
    buyGame: (address: string, amount?: string) => Promise<string | void>;
    buyingStage: BuyStage;
    isEthereumLoading: boolean;
    isNetworkValid: boolean;
    setMarketplace: React.Dispatch<React.SetStateAction<string>>;
    setReferrer: React.Dispatch<React.SetStateAction<string>>;
}

const useHashup = (): UseHashupOutput => {
    const { isEthereumLoading, isNetworkValid, network, account, walletInstalled, signer } = useEthereum();

    const [buyingStage, setBuyingStage] = useState(BuyStage.NOT_STARTED);
    const [referrer, setReferrer] = useState(ethers.constants.AddressZero);
    const [marketplace, setMarketplace] = useState(hashupMarketplace);

    const paymentTokenContract = useMemo(
      () => new ethers.Contract(paymentTokenAddress[network], USDC_ABI, signer!),
      [signer, network]
    );
    const hashupStoreV0Contract = useMemo(
      () => new ethers.Contract(hashupStoreV0Address[network], HashupStoreV0_ABI, signer!),
      [signer, network]
    );
    const hashupStoreV1Contract = useMemo(
      () => new ethers.Contract(hashupStoreV1Address[network], HashupStoreV1_ABI, signer!),
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
        console.log('passing in', address,
          amount.toString(),
          referrer);
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
     */
    const buyGame = async (address: string, amount: string = '100') => {
        const v1price: string = await hashupStoreV1Contract.getLicensePrice(address);
        const v0price = await hashupStoreV0Contract.getCartridgePrice(address);
        const isDeprecationMode = !(Number(v1price) > 0);
        const price = Number(v1price) > 0 ? v1price : v0price;

        try {
            const buyTransaction = await _getPurchaseTx(address, price, amount, isDeprecationMode);

            setBuyingStage(BuyStage.BUYING);
            await buyTransaction.wait();
            setBuyingStage(BuyStage.BOUGHT);
        } catch (error) {
            const _error = error as any;
            if (_error.reason === 'execution reverted: ERC20: transfer amount exceeds balance') {
                setBuyingStage(BuyStage.APPROVED);
                return _error.reason;
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
        buyingStage
    };
};

export default useHashup;
