---
'bridge-ui': minor
---

- We’ve extended the `clarity-bitcoin` contract to enable validating BTC transactions that occurred during a Stacks block
  - The new function is called `was-tx-mined-prev?`
  - Previously, this would lead to users or suppliers being “stuck” in some situations
  - Updated the bridge contract to support this new functionality
- Tests and code for recovering an inbound swap
  - In rare scenarios, an inbound swap can fail at the “escrow” phase if the supplier runs out of liquidity before the escrow is completed. In this scenario, the swapper needs to wait 500 blocks before recovering their BTC.
- Contract code for recovering an outbound swap (`revoke-expired-outbound-swap`)
  - If the supplier never sends BTC to a swapper, a user can recover their xBTC after waiting 1 day.
- Renamed all `operator` contract variables to `supplier`
