import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useEthereum } from './useEthereum';

import StoreV1_ABI from '../abi/HashupStoreV1.json';

import ERC20_ABI from '../abi/ERC20.json';

const STORE_ADDRESS = '0xB1d734e63e4462161C5d98BD2d296E5cBdd12Bf7';
const MARKETPLACE = '0xf55c1D51326f8FfFc025F35BC85dF4b49fc7dE37';

const useHashup = () => {
    const { isLoading, isNetworkValid } = useEthereum();

    const [storeContract, setStoreContract] = useState<ethers.Contract | null>();
    const [paymentTokenContract, setPaymentTokenContract] =
      useState<ethers.Contract | null>();
    const [contractsLoaded, setContractsLoaded] = useState<boolean>(false);

    useEffect(() => {
        if (!isLoading && isNetworkValid) {
            let provider = new ethers.providers.Web3Provider(window.ethereum, 'any');

            provider.getSigner();

            const newStoreContract = new ethers.Contract(
              STORE_ADDRESS,
              StoreV1_ABI,
              provider.getSigner()
            );

            console.log(newStoreContract);

            const newPaymentTokenContract = new ethers.Contract(
              '0xf4A8Cd66edc3C5A8327bF19Ad23d4E547C2D5E72',
              ERC20_ABI,
              provider.getSigner()
            );

            setPaymentTokenContract(newPaymentTokenContract);
            setStoreContract(newStoreContract);
        }
    }, [isNetworkValid, isLoading]);

    useEffect(() => {
        if (isNetworkValid && storeContract) {
            setContractsLoaded(true);
        }
    }, [isLoading, storeContract, isNetworkValid]);

    const buyGame = async (address: string, amount: number) => {
        if (contractsLoaded && storeContract && paymentTokenContract) {
            const price = await storeContract.getLicensePrice(address);

            console.log('LicensePrice:', price, '(6 dec) USDC');

            const totalPrice = price * amount * 100;

            await paymentTokenContract
              .approve(STORE_ADDRESS, totalPrice)
              .then(async (tx: any) => {
                  console.log('Approve TX: ' + tx.hash);
                  await tx.wait();

                  await storeContract
                    .buyLicense(
                      address,
                      amount * 100,
                      MARKETPLACE,
                      ethers.constants.AddressZero
                    )(address)
                    .then((res: any) => {
                    })
                    .catch((e2: any) => {
                        console.log(e2);
                    });
              })
              .catch((e: any) => {
                  console.log('Error during approval transaction', e);
              });
        }
    };

    return {
        isLoading,
        isNetworkValid,
        buyGame,
        contractsLoaded
    };
};

export default { useHashup };
