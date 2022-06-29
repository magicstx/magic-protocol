export const testnetDeployment = {
  id: 0,
  name: 'Testnet deployment',
  network: 'testnet',
  'stacks-node': 'http://stacks-node-api.testnet.stacks.co',
  'bitcoin-node': 'http://blockstack:blockstacksystem@bitcoind.testnet.stacks.co:18332',
  plan: {
    batches: [
      {
        id: 0,
        transactions: [
          {
            'contract-publish': {
              'contract-name': 'clarity-bitcoin',
              'expected-sender': 'ST2YG2RWHD3H38304MW0K06BQ2SEEWP38EFXY5CRV',
              cost: 412540,
              path: '/Users/hankstoever/magic/bridge/contracts/clarity-bitcoin.clar',
            },
          },
          {
            'contract-publish': {
              'contract-name': 'ft-trait',
              'expected-sender': 'ST2YG2RWHD3H38304MW0K06BQ2SEEWP38EFXY5CRV',
              cost: 8400,
              path: '/Users/hankstoever/magic/bridge/contracts/ft-trait.clar',
            },
          },
          {
            'contract-publish': {
              'contract-name': 'xbtc',
              'expected-sender': 'ST2YG2RWHD3H38304MW0K06BQ2SEEWP38EFXY5CRV',
              cost: 11570,
              path: '/Users/hankstoever/magic/bridge/contracts/xbtc.clar',
            },
          },
          {
            'contract-publish': {
              'contract-name': 'bridge',
              'expected-sender': 'ST2YG2RWHD3H38304MW0K06BQ2SEEWP38EFXY5CRV',
              cost: 301490,
              path: '/Users/hankstoever/magic/bridge/contracts/bridge.clar',
            },
          },
        ],
      },
    ],
  },
} as const;
