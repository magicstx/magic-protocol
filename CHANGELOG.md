# bridge-ui

## 0.5.0

### Minor Changes

- [`6e076a7`](https://github.com/magicstx/bridge/commit/6e076a7d503e61199ed7c426f1682c8c1edccdc9) Thanks [@dumbledope](https://github.com/dumbledope)! - Fixed an issue where validating outbound swap expiry used `block-height` instead of `burn-block-height`.

  In `bridge.clar`, outbound swaps have a `created-at` field which is set when the swap is initiated. This field represents the **burn** block height where the swap transaction was confirmed.

  In the `revoke-outbound-swap` function, there is validation to ensure that the swap has expired (200 blocks have passed). Unfortunately, this function was checking the **Stacks** block height, not the burn block height.

  While not exploitable, this unfortunately would prevent users from revoking outbound swaps in production environments. This is because a Stacks block height is thousands of blocks lower than burn chain heights - meaning it would take years for a swap to "expire".

  The fix was to change line 759 in `bridge.clar` to use `burn-block-height` instead of `block-height`.

* [`3027586`](https://github.com/magicstx/bridge/commit/3027586805ec3e0eb73230dcce7e77da7cbfcd9f) Thanks [@dumbledope](https://github.com/dumbledope)! - Added better `print` events to major contract calls, which allows for better off-chain monitoring.

- [`515f698`](https://github.com/magicstx/bridge/commit/515f698fbfe88e49e9621ff2ad6b83006f8af473) Thanks [@dumbledope](https://github.com/dumbledope)! - Updated the project to use the official xBTC contract, using Clarinet requirements for development.

## 0.4.0

### Minor Changes

- [#10](https://github.com/magicstx/bridge/pull/10) [`6a90055`](https://github.com/magicstx/bridge/commit/6a90055fe41b0faaf575a32c1ecce92551f34a1b) Thanks [@dumbledope](https://github.com/dumbledope)! - Removed `name` from the supplier registry

* [#11](https://github.com/magicstx/bridge/pull/11) [`30d6fd4`](https://github.com/magicstx/bridge/commit/30d6fd42134371e98615b9eb5c07223652151be4) Thanks [@dumbledope](https://github.com/dumbledope)! - In `escrow-swap`, validate that the tx-sender is equal to the swapper. This ensures that `min-to-receive` is specified by the end user.

### Patch Changes

- [`af53850`](https://github.com/magicstx/bridge/commit/af53850bcf2b67308fae0a36189da29fdecc9424) Thanks [@dumbledope](https://github.com/dumbledope)! - Adds a `revoke-expired-inbound` function. This is used after an inbound swap is expired and not finalized. It will mark the swap as finalized and move funds from escrow back to the supplier.

* [`ac0e1bf`](https://github.com/magicstx/bridge/commit/ac0e1bfd4574252fa4830ee9627a1690048982a4) Thanks [@dumbledope](https://github.com/dumbledope)! - Adds a script to run electrum_server via docker

- [#9](https://github.com/magicstx/bridge/pull/9) [`eb2df29`](https://github.com/magicstx/bridge/commit/eb2df2917b2c2b373dbdad8898541b33fad94580) Thanks [@dumbledope](https://github.com/dumbledope)! - Adds fee validation to the `update-supplier-fees` method

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
