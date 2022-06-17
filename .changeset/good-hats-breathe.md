---
'bridge-ui': patch
---

Adds a `revoke-expired-inbound` function. This is used after an inbound swap is expired and not finalized. It will mark the swap as finalized and move funds from escrow back to the supplier.
