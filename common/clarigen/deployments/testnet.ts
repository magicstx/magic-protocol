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
            'requirement-publish': {
              'contract-id': 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.restricted-token-trait',
              'remap-sender': 'ST2WBR71TSWP5S3WZYFC3VERBS3P134FB69QJXSFJ',
              'remap-principals': {},
              cost: 5480,
              path: '/Users/hankstoever/magic/bridge/.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.restricted-token-trait.clar',
            },
          },
          {
            'requirement-publish': {
              'contract-id': 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.ft-trait',
              'remap-sender': 'ST2WBR71TSWP5S3WZYFC3VERBS3P134FB69QJXSFJ',
              'remap-principals': {},
              cost: 8350,
              path: '/Users/hankstoever/magic/bridge/.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.ft-trait.clar',
            },
          },
          {
            'requirement-publish': {
              'contract-id': 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin',
              'remap-sender': 'ST2WBR71TSWP5S3WZYFC3VERBS3P134FB69QJXSFJ',
              'remap-principals': {},
              cost: 104220,
              path: '/Users/hankstoever/magic/bridge/.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar',
            },
          },
          {
            'contract-publish': {
              'contract-name': 'clarity-bitcoin',
              'expected-sender': 'ST2WBR71TSWP5S3WZYFC3VERBS3P134FB69QJXSFJ',
              cost: 412540,
              path: '/Users/hankstoever/magic/bridge/contracts/clarity-bitcoin.clar',
            },
          },
          {
            'contract-publish': {
              'contract-name': 'bridge',
              'expected-sender': 'ST2WBR71TSWP5S3WZYFC3VERBS3P134FB69QJXSFJ',
              cost: 302020,
              path: '/Users/hankstoever/magic/bridge/contracts/bridge.clar',
            },
          },
          {
            'contract-publish': {
              'contract-name': 'ft-trait',
              'expected-sender': 'ST2WBR71TSWP5S3WZYFC3VERBS3P134FB69QJXSFJ',
              cost: 8400,
              path: '/Users/hankstoever/magic/bridge/contracts/ft-trait.clar',
            },
          },
          {
            'contract-publish': {
              'contract-name': 'xbtc',
              'expected-sender': 'ST2WBR71TSWP5S3WZYFC3VERBS3P134FB69QJXSFJ',
              cost: 11570,
              path: '/Users/hankstoever/magic/bridge/contracts/xbtc.clar',
            },
          },
          {
            'contract-publish': {
              'contract-name': 'supplier-wrapper',
              'expected-sender': 'ST2WBR71TSWP5S3WZYFC3VERBS3P134FB69QJXSFJ',
              cost: 23340,
              path: '/Users/hankstoever/magic/bridge/contracts/supplier-wrapper.clar',
            },
          },
          {
            'contract-publish': {
              'contract-name': 'test-utils',
              'expected-sender': 'ST2WBR71TSWP5S3WZYFC3VERBS3P134FB69QJXSFJ',
              cost: 4970,
              path: '/Users/hankstoever/magic/bridge/contracts/test/test-utils.clar',
            },
          },
        ],
      },
    ],
  },
} as const;
