export const devnetDeployment = {
  id: 0,
  name: 'Devnet deployment',
  network: 'devnet',
  'stacks-node': 'http://localhost:20443',
  'bitcoin-node': 'http://devnet:devnet@0.0.0.0:18443',
  plan: {
    batches: [
      {
        id: 0,
        transactions: [
          {
            'requirement-publish': {
              'contract-id': 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.restricted-token-trait',
              'remap-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
              'remap-principals': {},
              cost: 5480,
              path: '/Users/hankstoever/magic/bridge/.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.restricted-token-trait.clar',
            },
          },
          {
            'requirement-publish': {
              'contract-id': 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.ft-trait',
              'remap-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
              'remap-principals': {},
              cost: 8350,
              path: '/Users/hankstoever/magic/bridge/.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.ft-trait.clar',
            },
          },
          {
            'requirement-publish': {
              'contract-id': 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin',
              'remap-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
              'remap-principals': {},
              cost: 104220,
              path: '/Users/hankstoever/magic/bridge/.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar',
            },
          },
          {
            'contract-publish': {
              'contract-name': 'ft-trait',
              'expected-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
              cost: 8400,
              path: '/Users/hankstoever/magic/bridge/contracts/ft-trait.clar',
            },
          },
          {
            'contract-publish': {
              'contract-name': 'xbtc',
              'expected-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
              cost: 11570,
              path: '/Users/hankstoever/magic/bridge/contracts/xbtc.clar',
            },
          },
          {
            'contract-publish': {
              'contract-name': 'clarity-bitcoin',
              'expected-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
              cost: 412540,
              path: '/Users/hankstoever/magic/bridge/contracts/clarity-bitcoin.clar',
            },
          },
          {
            'contract-publish': {
              'contract-name': 'bridge',
              'expected-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
              cost: 301490,
              path: '/Users/hankstoever/magic/bridge/contracts/bridge.clar',
            },
          },
        ],
      },
      {
        id: 1,
        transactions: [
          {
            'contract-call': {
              'contract-id': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.Wrapped-Bitcoin',
              method: 'initialize',
              'expected-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
              cost: 100000,
              parameters: [
                'Wrapped Bitcoin',
                'xBTC',
                'u8',
                "'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
              ],
            },
          },
          {
            'contract-call': {
              'contract-id': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.Wrapped-Bitcoin',
              method: 'add-principal-to-role',
              'expected-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
              cost: 100000,
              parameters: ['u1', "'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"],
            },
          },
          {
            'contract-call': {
              'contract-id': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.Wrapped-Bitcoin',
              method: 'mint-tokens',
              'expected-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
              cost: 100000,
              parameters: ['u100000000000000', "'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5"],
            },
          },
          {
            'contract-call': {
              'contract-id': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.Wrapped-Bitcoin',
              method: 'mint-tokens',
              'expected-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
              parameters: ['u1000000000', "'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG"],
              cost: 1000000,
            },
          },
        ],
      },
    ],
  },
} as const;
