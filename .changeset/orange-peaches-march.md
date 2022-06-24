---
'bridge-ui': minor
---

Fixed an issue where validating outbound swap expiry used `block-height` instead of `burn-block-height`.

In `bridge.clar`, outbound swaps have a `created-at` field which is set when the swap is initiated. This field represents the **burn** block height where the swap transaction was confirmed.

In the `revoke-outbound-swap` function, there is validation to ensure that the swap has expired (200 blocks have passed). Unfortunately, this function was checking the **Stacks** block height, not the burn block height.

While not exploitable, this unfortunately would prevent users from revoking outbound swaps in production environments. This is because a Stacks block height is thousands of blocks lower than burn chain heights - meaning it would take years for a swap to "expire".

The fix was to change line 759 in `bridge.clar` to use `burn-block-height` instead of `block-height`.
