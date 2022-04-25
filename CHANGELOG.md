# bridge-ui

## 0.3.0

### Minor Changes

- [`dd7c72e`](https://github.com/magicstx/bridge/commit/dd7c72ef3bf21dcc7f545ed7acbd952b9f72b0bc) Thanks [@dumbledope](https://github.com/dumbledope)! - Removed the `update-supplier` method in favor of 3 separate methods: `update-supplier-fees`, `update-supplier-name`, and `update-supplier-public-key`.

  Also added docs for the main public-facing functions in the bridge contract.

## 0.2.0

### Minor Changes

- [#1](https://github.com/magicstx/bridge/pull/1) [`a965339`](https://github.com/magicstx/bridge/commit/a96533936e0bd5cc72c4e412d14ad257e01bba49) Thanks [@dumbledope](https://github.com/dumbledope)! - - We’ve extended the `clarity-bitcoin` contract to enable validating BTC transactions that occurred during a Stacks block
  - The new function is called `was-tx-mined-prev?`
  - Previously, this would lead to users or suppliers being “stuck” in some situations
  - Updated the bridge contract to support this new functionality
  - Tests and code for recovering an inbound swap
    - In rare scenarios, an inbound swap can fail at the “escrow” phase if the supplier runs out of liquidity before the escrow is completed. In this scenario, the swapper needs to wait 500 blocks before recovering their BTC.
  - Contract code for recovering an outbound swap (`revoke-expired-outbound-swap`)
    - If the supplier never sends BTC to a swapper, a user can recover their xBTC after waiting 1 day.
  - Renamed all `operator` contract variables to `supplier`

## 0.1.1

### Patch Changes

- First version!
