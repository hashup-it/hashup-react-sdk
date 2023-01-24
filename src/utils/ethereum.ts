const ethereumRequestArrayOfResults_ = async (method: string) =>
  window.ethereum.request
    ? window.ethereum.request({
        method
    })
    : [];

export const fetchAccounts = async () => ethereumRequestArrayOfResults_('eth_requestAccounts');
