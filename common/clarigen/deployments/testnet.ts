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
              'contract-id': 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.ft-trait',
              'remap-sender': 'ST2ZTY9KK9H0FA0NVN3K8BGVN6R7GYVFG6BE7TAR1',
              'remap-principals': {
                SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR:
                  'ST2ZTY9KK9H0FA0NVN3K8BGVN6R7GYVFG6BE7TAR1',
              },
              cost: 8350,
              path: '.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.ft-trait.clar',
            },
          },
          {
            'requirement-publish': {
              'contract-id': 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.restricted-token-trait',
              'remap-sender': 'ST2ZTY9KK9H0FA0NVN3K8BGVN6R7GYVFG6BE7TAR1',
              'remap-principals': {
                SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR:
                  'ST2ZTY9KK9H0FA0NVN3K8BGVN6R7GYVFG6BE7TAR1',
              },
              cost: 5480,
              path: '.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.restricted-token-trait.clar',
            },
          },
          {
            'requirement-publish': {
              'contract-id': 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin',
              'remap-sender': 'ST2ZTY9KK9H0FA0NVN3K8BGVN6R7GYVFG6BE7TAR1',
              'remap-principals': {
                SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR:
                  'ST2ZTY9KK9H0FA0NVN3K8BGVN6R7GYVFG6BE7TAR1',
              },
              cost: 104220,
              path: '.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar',
            },
          },
          {
            'contract-publish': {
              'contract-name': 'clarity-bitcoin',
              'expected-sender': 'ST2ZTY9KK9H0FA0NVN3K8BGVN6R7GYVFG6BE7TAR1',
              cost: 412540,
              path: 'contracts/clarity-bitcoin.clar',
            },
          },
          {
            'contract-publish': {
              'contract-name': 'bridge',
              'expected-sender': 'ST2ZTY9KK9H0FA0NVN3K8BGVN6R7GYVFG6BE7TAR1',
              cost: 307160,
              path: 'contracts/bridge.clar',
            },
          },
        ],
      },
    ],
  },
} as const;
