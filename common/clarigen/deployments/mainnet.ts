export const mainnetDeployment = {
  id: 0,
  name: 'Mainnet deployment',
  network: 'mainnet',
  'stacks-node': 'http://stacks-node-api.mainnet.stacks.co',
  'bitcoin-node': 'http://blockstack:blockstacksystem@bitcoin.blockstack.com:8332',
  plan: {
    batches: [
      {
        id: 0,
        transactions: [
          {
            'contract-publish': {
              'contract-name': 'clarity-bitcoin',
              'expected-sender': 'SP3NHG9CBN9SPH68HD8HGPS7F7499KCAEC9K20NZZ',
              cost: 4125400,
              path: 'contracts/clarity-bitcoin.clar',
            },
          },
          {
            'contract-publish': {
              'contract-name': 'bridge',
              'expected-sender': 'SP3NHG9CBN9SPH68HD8HGPS7F7499KCAEC9K20NZZ',
              cost: 3071600,
              path: 'contracts/bridge.clar',
            },
          },
        ],
      },
    ],
  },
} as const;
