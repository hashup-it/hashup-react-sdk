export const HashupStoreV0_ABI = [
    {
        inputs: [
            {
                internalType: 'address',
                name: '_cartridgeAddress',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: '_amount',
                type: 'uint256'
            }
        ],
        name: 'buyCartridge',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_cartridgeAddress',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: '_amount',
                type: 'uint256'
            },
            {
                internalType: 'address',
                name: '_referrer',
                type: 'address'
            }
        ],
        name: 'buyCartridge',
        outputs: [
            {
                internalType: 'bool',
                name: 'success',
                type: 'bool'
            }
        ],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'paymentToken_',
                type: 'address'
            }
        ],
        stateMutability: 'nonpayable',
        type: 'constructor'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'cartridgeAddress',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'price',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            }
        ],
        name: 'CartridgesBought',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'cartridgeAddress',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            }
        ],
        name: 'CartridgesWithdrawn',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address'
            }
        ],
        name: 'OwnershipTransferred',
        type: 'event'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'cartridgeAddress',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'price',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            }
        ],
        name: 'sendCartridgeToStore',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'cartridgeAddress',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'symbol',
                type: 'string'
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'name',
                type: 'string'
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'color',
                type: 'string'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'price',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'media',
                type: 'string'
            }
        ],
        name: 'SentToStore',
        type: 'event'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newCreator',
                type: 'address'
            }
        ],
        name: 'transferCreatorship',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_cartridgeAddress',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: '_amount',
                type: 'uint256'
            }
        ],
        name: 'withdrawCartridges',
        outputs: [
            {
                internalType: 'uint256',
                name: 'withdrawnAmount',
                type: 'uint256'
            }
        ],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'creator',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_totalValue',
                type: 'uint256'
            }
        ],
        name: 'distributePayment',
        outputs: [
            {
                internalType: 'uint256',
                name: 'toCreator',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'toPlatform',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'toReferrer',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'cartridgeAddress',
                type: 'address'
            }
        ],
        name: 'getCartridgePrice',
        outputs: [
            {
                internalType: 'uint256',
                name: 'price',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'paymentToken',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'platformFee',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'raisedAmount',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'reflinkAmount',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'reflinkFee',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    }
];
