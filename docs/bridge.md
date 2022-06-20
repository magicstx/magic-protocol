
# bridge

[`bridge.clar`](../contracts/bridge.clar)



**Public functions:**

- [`register-supplier`](#register-supplier)
- [`add-funds`](#add-funds)
- [`remove-funds`](#remove-funds)
- [`update-supplier-fees`](#update-supplier-fees)
- [`update-supplier-public-key`](#update-supplier-public-key)
- [`initialize-swapper`](#initialize-swapper)
- [`escrow-swap`](#escrow-swap)
- [`finalize-swap`](#finalize-swap)
- [`revoke-expired-inbound`](#revoke-expired-inbound)
- [`initiate-outbound-swap`](#initiate-outbound-swap)
- [`finalize-outbound-swap`](#finalize-outbound-swap)
- [`revoke-expired-outbound`](#revoke-expired-outbound)

**Read-only functions:**

- [`get-supplier-id-by-controller`](#get-supplier-id-by-controller)
- [`get-supplier-id-by-public-key`](#get-supplier-id-by-public-key)
- [`get-supplier`](#get-supplier)
- [`get-funds`](#get-funds)
- [`get-escrow`](#get-escrow)
- [`get-inbound-swap`](#get-inbound-swap)
- [`get-preimage`](#get-preimage)
- [`get-outbound-swap`](#get-outbound-swap)
- [`get-completed-outbound-swap-txid`](#get-completed-outbound-swap-txid)
- [`get-completed-outbound-swap-by-txid`](#get-completed-outbound-swap-by-txid)
- [`get-swapper-id`](#get-swapper-id)
- [`get-swapper-principal`](#get-swapper-principal)
- [`get-next-supplier-id`](#get-next-supplier-id)
- [`get-next-swapper-id`](#get-next-swapper-id)
- [`get-next-outbound-id`](#get-next-outbound-id)
- [`get-full-supplier`](#get-full-supplier)
- [`get-inbound-meta`](#get-inbound-meta)
- [`get-full-inbound`](#get-full-inbound)
- [`get-user-inbound-volume`](#get-user-inbound-volume)
- [`get-total-inbound-volume`](#get-total-inbound-volume)
- [`get-user-outbound-volume`](#get-user-outbound-volume)
- [`get-total-outbound-volume`](#get-total-outbound-volume)
- [`get-user-total-volume`](#get-user-total-volume)
- [`get-total-volume`](#get-total-volume)
- [`concat-buffs`](#concat-buffs)
- [`get-swap-amount`](#get-swap-amount)
- [`get-amount-with-fee-rate`](#get-amount-with-fee-rate)
- [`validate-expiration`](#validate-expiration)
- [`validate-fee`](#validate-fee)
- [`validate-btc-addr`](#validate-btc-addr)
- [`validate-outbound-revocable`](#validate-outbound-revocable)
- [`generate-htlc-script`](#generate-htlc-script)
- [`generate-script-hash`](#generate-script-hash)
- [`generate-htlc-script-hash`](#generate-htlc-script-hash)
- [`generate-p2pkh-output`](#generate-p2pkh-output)
- [`generate-p2sh-output`](#generate-p2sh-output)
- [`generate-output`](#generate-output)
- [`bytes-len`](#bytes-len)
- [`read-uint32`](#read-uint32)
- [`buff-to-u8`](#buff-to-u8)

**Private functions:**

- [`transfer`](#transfer)
- [`concat-buffs-fold`](#concat-buffs-fold)
- [`update-user-inbound-volume`](#update-user-inbound-volume)
- [`update-user-outbound-volume`](#update-user-outbound-volume)

## Functions

### register-supplier

[View in file](../contracts/bridge.clar#L120)

`(define-public (register-supplier ((public-key (buff 33)) (inbound-fee (optional int)) (outbound-fee (optional int)) (outbound-base-fee int) (inbound-base-fee int) (funds uint)) (response uint uint))`

Register a supplier and add funds.
Validates that the public key and "controller" (STX address) are not
in use for another controller.

@returns the newly generated supplier ID.


<details>
  <summary>Source code:</summary>

```clarity
(define-public (register-supplier
    (public-key (buff 33))
    (inbound-fee (optional int))
    (outbound-fee (optional int))
    (outbound-base-fee int)
    (inbound-base-fee int)
    (funds uint)
  )
  (let
    (
      (id (var-get next-supplier-id))
      (supplier { 
        inbound-fee: inbound-fee, 
        outbound-fee: outbound-fee, 
        public-key: public-key, 
        controller: tx-sender, 
        outbound-base-fee: outbound-base-fee,
        inbound-base-fee: inbound-base-fee,
      })
    )
    (asserts! (map-insert supplier-by-id id supplier) ERR_PANIC)
    (asserts! (map-insert supplier-funds id u0) ERR_PANIC)
    (asserts! (map-insert supplier-escrow id u0) ERR_PANIC)
    (try! (validate-fee inbound-fee))
    (try! (validate-fee outbound-fee))

    ;; validate that the public key and controller do not exist
    (asserts! (map-insert supplier-by-public-key public-key id) ERR_SUPPLIER_EXISTS)
    (asserts! (map-insert supplier-by-controller tx-sender id) ERR_SUPPLIER_EXISTS)
    (var-set next-supplier-id (+ id u1))
    (try! (add-funds funds))
    (ok id)
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| public-key | (buff 33) | the public key used in HTLCs |
| inbound-fee | (optional int) | optional fee (in basis points) for inbound swaps |
| outbound-fee | (optional int) | optional fee (in basis points) for outbound |
| outbound-base-fee | int | fixed fee applied to outbound swaps (in xBTC sats) |
| inbound-base-fee | int | fixed fee for inbound swaps (in BTC/sats) |
| funds | uint | amount of xBTC (sats) to initially supply |

### add-funds

[View in file](../contracts/bridge.clar#L161)

`(define-public (add-funds ((amount uint)) (response uint uint))`

As a supplier, add funds.
The `supplier-id` is automatically looked up from the `contract-caller` (tx-sender).

@returns the new amount of funds pooled for this supplier


<details>
  <summary>Source code:</summary>

```clarity
(define-public (add-funds (amount uint))
  (let
    (
      (supplier-id (unwrap! (get-supplier-id-by-controller contract-caller) ERR_UNAUTHORIZED))
      (existing-funds (get-funds supplier-id))
      (new-funds (+ amount existing-funds))
    )
    (try! (transfer amount tx-sender (as-contract tx-sender)))
    (map-set supplier-funds supplier-id new-funds)
    (ok new-funds)
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| amount | uint | the amount of funds to add (in xBTC/sats) |

### remove-funds

[View in file](../contracts/bridge.clar#L179)

`(define-public (remove-funds ((amount uint)) (response uint uint))`

As a supplier, remove funds.

@returns the new amount of funds pooled for this supplier.


<details>
  <summary>Source code:</summary>

```clarity
(define-public (remove-funds (amount uint))
  (let
    (
      (supplier-id (unwrap! (get-supplier-id-by-controller contract-caller) ERR_UNAUTHORIZED))
      (existing-funds (get-funds supplier-id))
      (amount-ok (asserts! (>= existing-funds amount) ERR_INSUFFICIENT_FUNDS))
      (new-funds (- existing-funds amount))
      (controller contract-caller)
    )
    (try! (as-contract (transfer amount tx-sender controller)))
    (map-set supplier-funds supplier-id new-funds)
    (ok new-funds)
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| amount | uint | the amount of funds to remove (in xBTC/sats) |

### update-supplier-fees

[View in file](../contracts/bridge.clar#L202)

`(define-public (update-supplier-fees ((inbound-fee (optional int)) (outbound-fee (optional int)) (outbound-base-fee int) (inbound-base-fee int)) (response (tuple (controller principal) (inbound-base-fee int) (inbound-fee (optional int)) (outbound-base-fee int) (outbound-fee (optional int)) (public-key (buff 33))) uint))`

Update fees for a supplier

@returns new metadata for supplier


<details>
  <summary>Source code:</summary>

```clarity
(define-public (update-supplier-fees
    (inbound-fee (optional int))
    (outbound-fee (optional int))
    (outbound-base-fee int)
    (inbound-base-fee int)
  )
  (let
    (
      (supplier-id (unwrap! (get-supplier-id-by-controller contract-caller) ERR_UNAUTHORIZED))
      (existing-supplier (unwrap! (get-supplier supplier-id) ERR_PANIC))
      (new-supplier (merge existing-supplier {
        inbound-fee: inbound-fee, 
        outbound-fee: outbound-fee, 
        outbound-base-fee: outbound-base-fee,
        inbound-base-fee: inbound-base-fee,
      }))
    )
    (try! (validate-fee inbound-fee))
    (try! (validate-fee outbound-fee))
    (map-set supplier-by-id supplier-id new-supplier)
    (ok new-supplier)
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| inbound-fee | (optional int) | optional fee (in basis points) for inbound swaps |
| outbound-fee | (optional int) | optional fee (in basis points) for outbound |
| outbound-base-fee | int | fixed fee applied to outbound swaps (in xBTC sats) |
| inbound-base-fee | int | fixed fee for inbound swaps (in BTC/sats) |

### update-supplier-public-key

[View in file](../contracts/bridge.clar#L231)

`(define-public (update-supplier-public-key ((public-key (buff 33))) (response (tuple (controller principal) (inbound-base-fee int) (inbound-fee (optional int)) (outbound-base-fee int) (outbound-fee (optional int)) (public-key (buff 33))) uint))`

Update the public-key for a supplier

@returns new metadata for the supplier


<details>
  <summary>Source code:</summary>

```clarity
(define-public (update-supplier-public-key (public-key (buff 33)))
  (let
    (
      (supplier-id (unwrap! (get-supplier-id-by-controller contract-caller) ERR_UNAUTHORIZED))
      (existing-supplier (unwrap! (get-supplier supplier-id) ERR_PANIC))
      (new-supplier (merge existing-supplier {
        public-key: public-key,
      }))
    )
    (asserts! (map-insert supplier-by-public-key public-key supplier-id) ERR_SUPPLIER_EXISTS)
    (asserts! (map-delete supplier-by-public-key (get public-key existing-supplier)) ERR_PANIC)
    (map-set supplier-by-id supplier-id new-supplier)
    (ok new-supplier)
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| public-key | (buff 33) | the public key used in HTLCs |

### initialize-swapper

[View in file](../contracts/bridge.clar#L253)

`(define-public (initialize-swapper () (response uint uint))`

As a swapper, register with the contract to generate your `swapper-id`.
This is required to generate BTC deposit addresses that include metadata
that point to a specific STX address as the swapper.

@returns the newly generated swapper ID.

<details>
  <summary>Source code:</summary>

```clarity
(define-public (initialize-swapper)
  (let
    (
      (swapper tx-sender)
      (id (var-get next-swapper-id))
    )
    (asserts! (map-insert swapper-by-id id swapper) ERR_PANIC)
    (asserts! (map-insert swapper-by-principal swapper id) ERR_SWAPPER_EXISTS)
    (var-set next-swapper-id (+ id u1))
    (ok id)
  )
)
```
</details>




### escrow-swap

[View in file](../contracts/bridge.clar#L291)

`(define-public (escrow-swap ((block (tuple (header (buff 80)) (height uint))) (prev-blocks (list 10 (buff 80))) (tx (buff 1024)) (proof (tuple (hashes (list 12 (buff 32))) (tree-depth uint) (tx-index uint))) (output-index uint) (sender (buff 33)) (recipient (buff 33)) (expiration-buff (buff 4)) (hash (buff 32)) (swapper-buff (buff 4)) (supplier-id uint) (min-to-receive uint)) (response (tuple (csv uint) (output-index uint) (redeem-script (buff 120)) (sats uint) (sender-public-key (buff 33))) uint))`

Escrow funds for a supplier after sending BTC during an inbound swap.
Validates that the BTC tx is valid by re-constructing the HTLC script
and comparing it to the BTC tx.
Validates that the HTLC data (like expiration) is valid.

`tx-sender` must be equal to the swapper embedded in the HTLC. This ensures
that the `min-to-receive` parameter is provided by the end-user.

@returns metadata regarding this inbound swap (see `inbound-meta` map)


<details>
  <summary>Source code:</summary>

```clarity
(define-public (escrow-swap
    (block { header: (buff 80), height: uint })
    (prev-blocks (list 10 (buff 80)))
    (tx (buff 1024))
    (proof { tx-index: uint, hashes: (list 12 (buff 32)), tree-depth: uint })
    (output-index uint)
    (sender (buff 33))
    (recipient (buff 33))
    (expiration-buff (buff 4))
    (hash (buff 32))
    (swapper-buff (buff 4))
    (supplier-id uint)
    (min-to-receive uint)
  )
  (let
    (
      (was-mined-bool (unwrap! (contract-call? .clarity-bitcoin was-tx-mined-prev? block prev-blocks tx proof) ERR_TX_NOT_MINED))
      (was-mined (asserts! was-mined-bool ERR_TX_NOT_MINED))
      (mined-height (get height block))
      (htlc-redeem (generate-htlc-script sender recipient expiration-buff hash swapper-buff))
      (htlc-output (generate-script-hash htlc-redeem))
      (parsed-tx (unwrap! (contract-call? .clarity-bitcoin parse-tx tx) ERR_INVALID_TX))
      (output (unwrap! (element-at (get outs parsed-tx) output-index) ERR_INVALID_TX))
      (output-script (get scriptPubKey output))
      (supplier (unwrap! (map-get? supplier-by-id supplier-id) ERR_INVALID_SUPPLIER))
      (sats (get value output))
      (fee-rate (unwrap! (get inbound-fee supplier) ERR_INVALID_SUPPLIER))
      (xbtc (try! (get-swap-amount sats fee-rate (get inbound-base-fee supplier))))
      (funds (get-funds supplier-id))
      (funds-ok (asserts! (>= funds xbtc) ERR_INSUFFICIENT_FUNDS))
      (escrowed (unwrap! (map-get? supplier-escrow supplier-id) ERR_PANIC))
      (new-funds (- funds xbtc))
      (new-escrow (+ escrowed xbtc))
      (expiration (try! (read-uint32 expiration-buff (len expiration-buff))))
      (swapper-id (try! (read-uint32 swapper-buff u4)))
      (txid (contract-call? .clarity-bitcoin get-txid tx))
      (expiration-ok (try! (validate-expiration expiration mined-height)))
      (escrow {
        swapper: swapper-id,
        supplier: supplier-id,
        xbtc: xbtc,
        expiration: (+ mined-height (- expiration ESCROW_EXPIRATION)),
        hash: hash,
      })
      (meta {
        sender-public-key: sender,
        output-index: output-index,
        csv: expiration,
        redeem-script: htlc-redeem,
        sats: sats,
      })
      (event (merge escrow meta))
    )
    ;; assert tx-sender is swapper
    (asserts! (is-eq tx-sender (unwrap! (map-get? swapper-by-id swapper-id) ERR_SWAPPER_NOT_FOUND)) ERR_UNAUTHORIZED)
    (asserts! (is-eq (get public-key supplier) recipient) ERR_INVALID_OUTPUT)
    (asserts! (is-eq output-script htlc-output) ERR_INVALID_OUTPUT)
    (asserts! (is-eq (len hash) u32) ERR_INVALID_HASH)
    (asserts! (map-insert inbound-swaps txid escrow) ERR_TXID_USED)
    (asserts! (map-insert inbound-meta txid meta) ERR_PANIC)
    (asserts! (>= xbtc min-to-receive) ERR_INCONSISTENT_FEES)
    (map-set supplier-funds supplier-id new-funds)
    (map-set supplier-escrow supplier-id new-escrow)
    (print (merge event { topic: "escrow" }))
    (ok meta)
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| block | (tuple (header (buff 80)) (height uint)) | a tuple containing `header` (the Bitcoin block header) and the `height` (Stacks height)
where the BTC tx was confirmed. |
| prev-blocks | (list 10 (buff 80)) | because Clarity contracts can't get Bitcoin headers when there is no Stacks block,
this param allows users to specify the chain of block headers going back to the block where the
BTC tx was confirmed. |
| tx | (buff 1024) | the hex data of the BTC tx |
| proof | (tuple (hashes (list 12 (buff 32))) (tree-depth uint) (tx-index uint)) | a merkle proof to validate inclusion of this tx in the BTC block |
| output-index | uint | the index of the HTLC output in the BTC tx |
| sender | (buff 33) | The swapper's public key used in the HTLC |
| recipient | (buff 33) | The supplier's public key used in the HTLC |
| expiration-buff | (buff 4) | A 4-byte integer the indicated the expiration of the HTLC |
| hash | (buff 32) | a hash of the `preimage` used in this swap |
| swapper-buff | (buff 4) | a 4-byte integer that indicates the `swapper-id` |
| supplier-id | uint | the supplier used in this swap |
| min-to-receive | uint | minimum receivable calculated off-chain to avoid the supplier front-run the swap by adjusting fees |

### finalize-swap

[View in file](../contracts/bridge.clar#L367)

`(define-public (finalize-swap ((txid (buff 32)) (preimage (buff 128))) (response (tuple (expiration uint) (hash (buff 32)) (supplier uint) (swapper uint) (xbtc uint)) uint))`

Finalize an inbound swap by revealing the preimage.
Validates that `sha256(preimage)` is equal to the `hash` provided when
escrowing the swap.

@returns metadata relating to the swap (see `inbound-swaps` map)


<details>
  <summary>Source code:</summary>

```clarity
(define-public (finalize-swap (txid (buff 32)) (preimage (buff 128)))
  (match (map-get? inbound-preimages txid)
    existing ERR_ALREADY_FINALIZED
    (let
      (
        (swap (unwrap! (map-get? inbound-swaps txid) ERR_INVALID_ESCROW))
        (stored-hash (get hash swap))
        (preimage-ok (asserts! (is-eq (sha256 preimage) stored-hash) ERR_INVALID_PREIMAGE))
        (supplier-id (get supplier swap))
        (xbtc (get xbtc swap))
        (escrowed (unwrap! (map-get? supplier-escrow supplier-id) ERR_PANIC))
        (swapper (unwrap! (get-swapper-principal (get swapper swap)) ERR_PANIC))
      )
      (map-insert inbound-preimages txid preimage)
      (try! (as-contract (transfer xbtc tx-sender swapper)))
      (asserts! (>= (get expiration swap) block-height) ERR_ESCROW_EXPIRED)
      (map-set supplier-escrow supplier-id (- escrowed xbtc))
      (update-user-inbound-volume swapper xbtc)
      (ok swap)
    )
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| txid | (buff 32) | the txid of the BTC tx used for this inbound swap |
| preimage | (buff 128) | the preimage that hashes to the swap's `hash` |

### revoke-expired-inbound

[View in file](../contracts/bridge.clar#L404)

`(define-public (revoke-expired-inbound ((txid (buff 32))) (response (tuple (expiration uint) (hash (buff 32)) (supplier uint) (swapper uint) (xbtc uint)) uint))`

Revoke an expired inbound swap.

If an inbound swap has expired, and is not finalized, then the `xbtc`
amount of the swap is "stuck" in escrow. Calling this function will:

- Update the supplier's funds and escrow
- Mark the swap as finalized

To finalize the swap, the pre-image stored for the swap is the constant
REVOKED_INBOUND_PREIMAGE (0x00).

@returns the swap's metadata


<details>
  <summary>Source code:</summary>

```clarity
(define-public (revoke-expired-inbound (txid (buff 32)))
  (match (map-get? inbound-preimages txid)
    existing ERR_REVOKE_INBOUND_IS_FINALIZED
    (let
      (
        (swap (unwrap! (map-get? inbound-swaps txid) ERR_INVALID_ESCROW))
        (xbtc (get xbtc swap))
        (supplier-id (get supplier swap))
        (funds (get-funds supplier-id))
        (escrowed (unwrap! (get-escrow supplier-id) ERR_PANIC))
        (new-funds (+ funds xbtc))
        (new-escrow (- escrowed xbtc))
      )
      (asserts! (<= (get expiration swap) block-height) ERR_REVOKE_INBOUND_NOT_EXPIRED)
      (map-insert inbound-preimages txid REVOKED_INBOUND_PREIMAGE)
      (map-set supplier-escrow supplier-id new-escrow)
      (map-set supplier-funds supplier-id new-funds)
      (ok swap)
    )
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| txid | (buff 32) | the txid of the BTC tx used for this inbound swap |

### initiate-outbound-swap

[View in file](../contracts/bridge.clar#L437)

`(define-public (initiate-outbound-swap ((xbtc uint) (btc-version (buff 1)) (btc-hash (buff 20)) (supplier-id uint)) (response uint uint))`

Initiate an outbound swap.
Swapper provides the amount of xBTC and their withdraw address.

@returns the auto-generated swap-id of this swap


<details>
  <summary>Source code:</summary>

```clarity
(define-public (initiate-outbound-swap (xbtc uint) (btc-version (buff 1)) (btc-hash (buff 20)) (supplier-id uint))
  (let
    (
      (supplier (unwrap! (map-get? supplier-by-id supplier-id) ERR_INVALID_SUPPLIER))
      (fee-rate (unwrap! (get outbound-fee supplier) ERR_INVALID_SUPPLIER))
      (sats (try! (get-swap-amount xbtc fee-rate (get outbound-base-fee supplier))))
      (swap {
        sats: sats,
        xbtc: xbtc,
        supplier: supplier-id,
        version: btc-version,
        hash: btc-hash,
        created-at: burn-block-height,
        swapper: tx-sender,
      })
      (swap-id (var-get next-outbound-id))
    )
    (try! (validate-btc-addr btc-version btc-hash))
    (try! (transfer xbtc tx-sender (as-contract tx-sender)))
    (asserts! (map-insert outbound-swaps swap-id swap) ERR_PANIC)
    (var-set next-outbound-id (+ swap-id u1))
    (ok swap-id)
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| xbtc | uint | amount of xBTC (sats) to swap |
| btc-version | (buff 1) | the address version for the swapper's BTC address |
| btc-hash | (buff 20) | the hash for the swapper's BTC address |
| supplier-id | uint | the supplier used for this swap |

### finalize-outbound-swap

[View in file](../contracts/bridge.clar#L476)

`(define-public (finalize-outbound-swap ((block (tuple (header (buff 80)) (height uint))) (prev-blocks (list 10 (buff 80))) (tx (buff 1024)) (proof (tuple (hashes (list 12 (buff 32))) (tree-depth uint) (tx-index uint))) (output-index uint) (swap-id uint)) (response bool uint))`

Finalize an outbound swap.
This method is called by the supplier after they've sent the swapper BTC.

@returns true


<details>
  <summary>Source code:</summary>

```clarity
(define-public (finalize-outbound-swap
    (block { header: (buff 80), height: uint })
    (prev-blocks (list 10 (buff 80)))
    (tx (buff 1024))
    (proof { tx-index: uint, hashes: (list 12 (buff 32)), tree-depth: uint })
    (output-index uint)
    (swap-id uint)
  )
  (let
    (
      (was-mined-bool (unwrap! (contract-call? .clarity-bitcoin was-tx-mined-prev? block prev-blocks tx proof) ERR_TX_NOT_MINED))
      (was-mined (asserts! was-mined-bool ERR_TX_NOT_MINED))
      (swap (unwrap! (get-outbound-swap swap-id) ERR_SWAP_NOT_FOUND))
      (expected-output (generate-output (get version swap) (get hash swap)))
      (parsed-tx (unwrap! (contract-call? .clarity-bitcoin parse-tx tx) ERR_INVALID_TX))
      (output (unwrap! (element-at (get outs parsed-tx) output-index) ERR_INVALID_TX))
      (output-script (get scriptPubKey output))
      (txid (contract-call? .clarity-bitcoin get-txid tx))
      (output-sats (get value output))
      (xbtc (get xbtc swap))
      (supplier (get supplier swap))
      (funds-before (get-funds supplier))
    )
    (map-set supplier-funds supplier (+ funds-before xbtc))
    (asserts! (is-eq output-script expected-output) ERR_INVALID_OUTPUT)
    (asserts! (map-insert completed-outbound-swaps swap-id txid) ERR_ALREADY_FINALIZED)
    (asserts! (map-insert completed-outbound-swap-txids txid swap-id) ERR_TXID_USED)
    (asserts! (>= output-sats (get sats swap)) ERR_INSUFFICIENT_AMOUNT)
    (update-user-outbound-volume (get swapper swap) xbtc)
    (ok true)
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| block | (tuple (header (buff 80)) (height uint)) | a tuple containing `header` (the Bitcoin block header) and the `height` (Stacks height)
where the BTC tx was confirmed. |
| prev-blocks | (list 10 (buff 80)) | because Clarity contracts can't get Bitcoin headers when there is no Stacks block,
this param allows users to specify the chain of block headers going back to the block where the
BTC tx was confirmed. |
| tx | (buff 1024) | the hex data of the BTC tx |
| proof | (tuple (hashes (list 12 (buff 32))) (tree-depth uint) (tx-index uint)) | a merkle proof to validate inclusion of this tx in the BTC block |
| output-index | uint | the index of the HTLC output in the BTC tx |
| swap-id | uint | the outbound swap ID they're finalizing |

### revoke-expired-outbound

[View in file](../contracts/bridge.clar#L516)

`(define-public (revoke-expired-outbound ((swap-id uint)) (response (tuple (created-at uint) (hash (buff 20)) (sats uint) (supplier uint) (swapper principal) (version (buff 1)) (xbtc uint)) uint))`

Revoke an expired outbound swap.
After an outbound swap has expired without finalizing, a swapper may call this function
to receive the xBTC escrowed.

@returns the metadata regarding the outbound swap


<details>
  <summary>Source code:</summary>

```clarity
(define-public (revoke-expired-outbound (swap-id uint))
  (let
    (
      (swap (try! (validate-outbound-revocable swap-id)))
      (xbtc (get xbtc swap))
      (swapper (get swapper swap))
    )
    (try! (as-contract (transfer xbtc tx-sender swapper)))
    (asserts! (map-insert completed-outbound-swaps swap-id REVOKED_OUTBOUND_TXID) ERR_PANIC)
    (ok swap)
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| swap-id | uint | the ID of the outbound swap being revoked. |

### get-supplier-id-by-controller

[View in file](../contracts/bridge.clar#L531)

`(define-read-only (get-supplier-id-by-controller ((controller principal)) (optional uint))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-supplier-id-by-controller (controller principal))
  (map-get? supplier-by-controller controller)
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| controller | principal |  |

### get-supplier-id-by-public-key

[View in file](../contracts/bridge.clar#L535)

`(define-read-only (get-supplier-id-by-public-key ((public-key (buff 33))) (optional uint))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-supplier-id-by-public-key (public-key (buff 33)))
  (map-get? supplier-by-public-key public-key)
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| public-key | (buff 33) |  |

### get-supplier

[View in file](../contracts/bridge.clar#L539)

`(define-read-only (get-supplier ((id uint)) (optional (tuple (controller principal) (inbound-base-fee int) (inbound-fee (optional int)) (outbound-base-fee int) (outbound-fee (optional int)) (public-key (buff 33)))))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-supplier (id uint))
  (map-get? supplier-by-id id)
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| id | uint |  |

### get-funds

[View in file](../contracts/bridge.clar#L543)

`(define-read-only (get-funds ((id uint)) uint)`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-funds (id uint))
  (default-to u0 (map-get? supplier-funds id))
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| id | uint |  |

### get-escrow

[View in file](../contracts/bridge.clar#L547)

`(define-read-only (get-escrow ((id uint)) (optional uint))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-escrow (id uint))
  (map-get? supplier-escrow id)
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| id | uint |  |

### get-inbound-swap

[View in file](../contracts/bridge.clar#L551)

`(define-read-only (get-inbound-swap ((txid (buff 32))) (optional (tuple (expiration uint) (hash (buff 32)) (supplier uint) (swapper uint) (xbtc uint))))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-inbound-swap (txid (buff 32)))
  (map-get? inbound-swaps txid)
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| txid | (buff 32) |  |

### get-preimage

[View in file](../contracts/bridge.clar#L555)

`(define-read-only (get-preimage ((txid (buff 32))) (optional (buff 128)))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-preimage (txid (buff 32)))
  (map-get? inbound-preimages txid)
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| txid | (buff 32) |  |

### get-outbound-swap

[View in file](../contracts/bridge.clar#L559)

`(define-read-only (get-outbound-swap ((id uint)) (optional (tuple (created-at uint) (hash (buff 20)) (sats uint) (supplier uint) (swapper principal) (version (buff 1)) (xbtc uint))))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-outbound-swap (id uint))
  (map-get? outbound-swaps id)
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| id | uint |  |

### get-completed-outbound-swap-txid

[View in file](../contracts/bridge.clar#L563)

`(define-read-only (get-completed-outbound-swap-txid ((id uint)) (optional (buff 32)))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-completed-outbound-swap-txid (id uint))
  (map-get? completed-outbound-swaps id)
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| id | uint |  |

### get-completed-outbound-swap-by-txid

[View in file](../contracts/bridge.clar#L567)

`(define-read-only (get-completed-outbound-swap-by-txid ((txid (buff 32))) (optional uint))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-completed-outbound-swap-by-txid (txid (buff 32)))
  (map-get? completed-outbound-swap-txids txid)
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| txid | (buff 32) |  |

### get-swapper-id

[View in file](../contracts/bridge.clar#L571)

`(define-read-only (get-swapper-id ((swapper principal)) (optional uint))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-swapper-id (swapper principal))
  (map-get? swapper-by-principal swapper)
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| swapper | principal |  |

### get-swapper-principal

[View in file](../contracts/bridge.clar#L575)

`(define-read-only (get-swapper-principal ((id uint)) (optional principal))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-swapper-principal (id uint))
  (map-get? swapper-by-id id)
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| id | uint |  |

### get-next-supplier-id

[View in file](../contracts/bridge.clar#L579)

`(define-read-only (get-next-supplier-id () uint)`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-next-supplier-id) (var-get next-supplier-id))
```
</details>




### get-next-swapper-id

[View in file](../contracts/bridge.clar#L580)

`(define-read-only (get-next-swapper-id () uint)`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-next-swapper-id) (var-get next-swapper-id))
```
</details>




### get-next-outbound-id

[View in file](../contracts/bridge.clar#L581)

`(define-read-only (get-next-outbound-id () uint)`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-next-outbound-id) (var-get next-outbound-id))
```
</details>




### get-full-supplier

[View in file](../contracts/bridge.clar#L583)

`(define-read-only (get-full-supplier ((id uint)) (response (tuple (controller principal) (escrow uint) (funds uint) (inbound-base-fee int) (inbound-fee (optional int)) (outbound-base-fee int) (outbound-fee (optional int)) (public-key (buff 33))) uint))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-full-supplier (id uint))
  (let
    (
      (supplier (unwrap! (get-supplier id) ERR_INVALID_SUPPLIER))
      (funds (get-funds id))
      (escrow (unwrap! (get-escrow id) ERR_PANIC))
    )
    (ok (merge supplier { funds: funds, escrow: escrow }))
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| id | uint |  |

### get-inbound-meta

[View in file](../contracts/bridge.clar#L594)

`(define-read-only (get-inbound-meta ((txid (buff 32))) (optional (tuple (csv uint) (output-index uint) (redeem-script (buff 120)) (sats uint) (sender-public-key (buff 33)))))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-inbound-meta (txid (buff 32)))
  (map-get? inbound-meta txid)
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| txid | (buff 32) |  |

### get-full-inbound

[View in file](../contracts/bridge.clar#L598)

`(define-read-only (get-full-inbound ((txid (buff 32))) (response (tuple (csv uint) (expiration uint) (hash (buff 32)) (output-index uint) (redeem-script (buff 120)) (sats uint) (sender-public-key (buff 33)) (supplier uint) (swapper uint) (swapper-principal principal) (xbtc uint)) uint))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-full-inbound (txid (buff 32)))
  (let
    (
      (swap (unwrap! (get-inbound-swap txid) ERR_INVALID_ESCROW))
      (meta (unwrap! (get-inbound-meta txid) ERR_INVALID_ESCROW))
      (swapper-principal (unwrap! (get-swapper-principal (get swapper swap)) ERR_PANIC))
    )
    (ok (merge { swapper-principal: swapper-principal } (merge swap meta)))
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| txid | (buff 32) |  |

### get-user-inbound-volume

[View in file](../contracts/bridge.clar#L609)

`(define-read-only (get-user-inbound-volume ((user principal)) uint)`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-user-inbound-volume (user principal))
  (match (map-get? user-inbound-volume-map user)
    vol vol
    u0
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| user | principal |  |

### get-total-inbound-volume

[View in file](../contracts/bridge.clar#L616)

`(define-read-only (get-total-inbound-volume () uint)`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-total-inbound-volume) (var-get total-inbound-volume-var))
```
</details>




### get-user-outbound-volume

[View in file](../contracts/bridge.clar#L618)

`(define-read-only (get-user-outbound-volume ((user principal)) uint)`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-user-outbound-volume (user principal))
  (match (map-get? user-outbound-volume-map user)
    vol vol
    u0
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| user | principal |  |

### get-total-outbound-volume

[View in file](../contracts/bridge.clar#L625)

`(define-read-only (get-total-outbound-volume () uint)`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-total-outbound-volume) (var-get total-outbound-volume-var))
```
</details>




### get-user-total-volume

[View in file](../contracts/bridge.clar#L627)

`(define-read-only (get-user-total-volume ((user principal)) uint)`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-user-total-volume (user principal))
  (+ (get-user-inbound-volume user) (get-user-outbound-volume user))
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| user | principal |  |

### get-total-volume

[View in file](../contracts/bridge.clar#L631)

`(define-read-only (get-total-volume () uint)`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-total-volume)
  (+ (get-total-inbound-volume) (get-total-outbound-volume))
)
```
</details>




### transfer

[View in file](../contracts/bridge.clar#L637)

`(define-private (transfer ((amount uint) (sender principal) (recipient principal)) (response bool uint))`



<details>
  <summary>Source code:</summary>

```clarity
(define-private (transfer (amount uint) (sender principal) (recipient principal))
  (match (contract-call? .xbtc transfer amount sender recipient none)
    success (ok success)
    error (begin
      (print { transfer-error: error })
      ERR_TRANSFER
    )
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| amount | uint |  |
| sender | principal |  |
| recipient | principal |  |

### concat-buffs

[View in file](../contracts/bridge.clar#L647)

`(define-read-only (concat-buffs ((buffs (list 6 (buff 32)))) (buff 192))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (concat-buffs (buffs (list 6 (buff 32))))
  (let
    (
      (initial-buff 0x)
      (final (fold concat-buffs-fold buffs initial-buff))
    )
    final
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| buffs | (list 6 (buff 32)) |  |

### concat-buffs-fold

[View in file](../contracts/bridge.clar#L657)

`(define-private (concat-buffs-fold ((b (buff 32)) (result (buff 192))) (buff 192))`



<details>
  <summary>Source code:</summary>

```clarity
(define-private (concat-buffs-fold (b (buff 32)) (result (buff 192)))
  (let
    (
      (next-buff (concat result b))
      (next-buff-min (as-max-len? next-buff u192))
    )
    (match next-buff-min
      min-buff min-buff
      result ;; if using `concat-buffs`, this should never happen.
    )
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| b | (buff 32) |  |
| result | (buff 192) |  |

### get-swap-amount

[View in file](../contracts/bridge.clar#L670)

`(define-read-only (get-swap-amount ((amount uint) (fee-rate int) (base-fee int)) (response uint uint))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-swap-amount (amount uint) (fee-rate int) (base-fee int))
  (let
    (
      (with-bps-fee (get-amount-with-fee-rate amount fee-rate))
    )
    (if (>= base-fee with-bps-fee)
      ERR_INSUFFICIENT_AMOUNT
      (ok (to-uint (- with-bps-fee base-fee)))
    )
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| amount | uint |  |
| fee-rate | int |  |
| base-fee | int |  |

### get-amount-with-fee-rate

[View in file](../contracts/bridge.clar#L682)

`(define-read-only (get-amount-with-fee-rate ((amount uint) (fee-rate int)) int)`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-amount-with-fee-rate (amount uint) (fee-rate int))
  (let
    (
      (numerator (* (to-int amount) (- 10000 fee-rate)))
      (final (/ numerator 10000))
    )
    final
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| amount | uint |  |
| fee-rate | int |  |

### update-user-inbound-volume

[View in file](../contracts/bridge.clar#L692)

`(define-private (update-user-inbound-volume ((user principal) (amount uint)) bool)`



<details>
  <summary>Source code:</summary>

```clarity
(define-private (update-user-inbound-volume (user principal) (amount uint))
  (let
    (
      (user-total (get-user-inbound-volume user))
      (total (get-total-inbound-volume))
    )
    (map-set user-inbound-volume-map user (+ user-total amount))
    (var-set total-inbound-volume-var (+ total amount))
    true
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| user | principal |  |
| amount | uint |  |

### update-user-outbound-volume

[View in file](../contracts/bridge.clar#L704)

`(define-private (update-user-outbound-volume ((user principal) (amount uint)) bool)`



<details>
  <summary>Source code:</summary>

```clarity
(define-private (update-user-outbound-volume (user principal) (amount uint))
  (let
    (
      (user-total (get-user-outbound-volume user))
      (total (get-total-outbound-volume))
    )
    (map-set user-outbound-volume-map user (+ user-total amount))
    (var-set total-outbound-volume-var (+ total amount))
    true
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| user | principal |  |
| amount | uint |  |

### validate-expiration

[View in file](../contracts/bridge.clar#L718)

`(define-read-only (validate-expiration ((expiration uint) (mined-height uint)) (response bool uint))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (validate-expiration (expiration uint) (mined-height uint))
  (if (> expiration (+ (- block-height mined-height) MIN_EXPIRATION))
    (ok true)
    ERR_INVALID_EXPIRATION
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| expiration | uint |  |
| mined-height | uint |  |

### validate-fee

[View in file](../contracts/bridge.clar#L725)

`(define-read-only (validate-fee ((fee-opt (optional int))) (response bool uint))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (validate-fee (fee-opt (optional int)))
  (match fee-opt
    fee (let
      (
        (max-fee 10000)
        (within-upper (< fee max-fee))
        (within-lower (> fee (* -1 max-fee)))
      )
      (asserts! (and within-upper within-lower) ERR_FEE_INVALID)
      (ok true)
    )
    (ok true)
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| fee-opt | (optional int) |  |

### validate-btc-addr

[View in file](../contracts/bridge.clar#L740)

`(define-read-only (validate-btc-addr ((version (buff 1)) (hash (buff 20))) (response bool uint))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (validate-btc-addr (version (buff 1)) (hash (buff 20)))
  (let
    (
      (valid-hash (is-eq (len hash) u20))
      (valid-version (or (is-eq version P2PKH_VERSION) (is-eq version P2SH_VERSION)))
    )
    (asserts! (and valid-hash valid-version) ERR_INVALID_BTC_ADDR)
    (ok true)
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| version | (buff 1) |  |
| hash | (buff 20) |  |

### validate-outbound-revocable

[View in file](../contracts/bridge.clar#L753)

`(define-read-only (validate-outbound-revocable ((swap-id uint)) (response (tuple (created-at uint) (hash (buff 20)) (sats uint) (supplier uint) (swapper principal) (version (buff 1)) (xbtc uint)) uint))`

lookup an outbound swap and validate that it is revocable.
to be revoked, it must be expired and not finalized

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (validate-outbound-revocable (swap-id uint))
  (let
    (
      (swap (unwrap! (get-outbound-swap swap-id) ERR_SWAP_NOT_FOUND))
      (finalize-txid (get-completed-outbound-swap-txid swap-id))
      (swap-expiration (+ (get created-at swap) OUTBOUND_EXPIRATION))
      (is-expired (>= block-height swap-expiration))
      (is-not-finalized (is-none finalize-txid))
    )
    (asserts! is-expired ERR_REVOKE_OUTBOUND_NOT_EXPIRED)
    (asserts! is-not-finalized ERR_REVOKE_OUTBOUND_IS_FINALIZED)
    (ok swap)
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| swap-id | uint |  |

### generate-htlc-script

[View in file](../contracts/bridge.clar#L770)

`(define-read-only (generate-htlc-script ((sender (buff 33)) (recipient (buff 33)) (expiration (buff 4)) (hash (buff 32)) (swapper (buff 4))) (buff 120))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (generate-htlc-script
    (sender (buff 33))
    (recipient (buff 33))
    (expiration (buff 4))
    (hash (buff 32))
    (swapper (buff 4))
  )
  (let
    (
      (swapper-id (concat 0x04 swapper))
      (b10 (concat swapper-id 0x7563a820))
      (b1 (concat b10 hash))
      (b2 (concat b1 0x8821))
      (b3 (concat b2 recipient))
      (b4 (concat b3 0x67))
      (exp-len (bytes-len expiration))
      (b9 (concat b4 exp-len))
      (b5 (concat b9 expiration))
      (b6 (concat b5 0xb27521))
      (b7 (concat b6 sender))
      (b8 (concat b7 0x68ac))
    )
    b8
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| sender | (buff 33) |  |
| recipient | (buff 33) |  |
| expiration | (buff 4) |  |
| hash | (buff 32) |  |
| swapper | (buff 4) |  |

### generate-script-hash

[View in file](../contracts/bridge.clar#L796)

`(define-read-only (generate-script-hash ((script (buff 120))) (buff 23))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (generate-script-hash (script (buff 120)))
  (generate-p2sh-output (hash160 script))
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| script | (buff 120) |  |

### generate-htlc-script-hash

[View in file](../contracts/bridge.clar#L800)

`(define-read-only (generate-htlc-script-hash ((sender (buff 33)) (recipient (buff 33)) (expiration (buff 4)) (hash (buff 32)) (swapper (buff 4))) (buff 23))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (generate-htlc-script-hash
    (sender (buff 33))
    (recipient (buff 33))
    (expiration (buff 4))
    (hash (buff 32))
    (swapper (buff 4))
  )
  (generate-script-hash (generate-htlc-script sender recipient expiration hash swapper))
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| sender | (buff 33) |  |
| recipient | (buff 33) |  |
| expiration | (buff 4) |  |
| hash | (buff 32) |  |
| swapper | (buff 4) |  |

### generate-p2pkh-output

[View in file](../contracts/bridge.clar#L810)

`(define-read-only (generate-p2pkh-output ((hash (buff 20))) (buff 25))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (generate-p2pkh-output (hash (buff 20)))
  (concat (concat 0x76a914 hash) 0x88ac)
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| hash | (buff 20) |  |

### generate-p2sh-output

[View in file](../contracts/bridge.clar#L814)

`(define-read-only (generate-p2sh-output ((hash (buff 20))) (buff 23))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (generate-p2sh-output (hash (buff 20)))
  (concat (concat 0xa914 hash) 0x87)
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| hash | (buff 20) |  |

### generate-output

[View in file](../contracts/bridge.clar#L822)

`(define-read-only (generate-output ((version (buff 1)) (hash (buff 20))) (buff 25))`

generate an output, given btc address.
assumes that if the version is not p2sh, it's p2pkh.
for outbound swaps, the version is validated when initiated,
so it should only ever be these two.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (generate-output (version (buff 1)) (hash (buff 20)))
  (if (is-eq version P2SH_VERSION)
    (generate-p2sh-output hash)
    (generate-p2pkh-output hash)
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| version | (buff 1) |  |
| hash | (buff 20) |  |

### bytes-len

[View in file](../contracts/bridge.clar#L829)

`(define-read-only (bytes-len ((bytes (buff 4))) (buff 1))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (bytes-len (bytes (buff 4)))
  (unwrap-panic (element-at BUFF_TO_BYTE (len bytes)))
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| bytes | (buff 4) |  |

### read-uint32

[View in file](../contracts/bridge.clar#L836)

`(define-read-only (read-uint32 ((num (buff 4)) (length uint)) (response uint uint))`

little-endian

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (read-uint32 (num (buff 4)) (length uint))
  (let
    (
      (byte-1 (buff-to-u8 (unwrap! (element-at num u0) ERR_READ_UINT)))
      (byte-2 (if (> length u1) (buff-to-u8 (unwrap! (element-at num u1) ERR_READ_UINT)) u0))
      (byte-3 (if (> length u2) (buff-to-u8 (unwrap! (element-at num u2) ERR_READ_UINT)) u0))
      (byte-4 (if (> length u3) (buff-to-u8 (unwrap! (element-at num u3) ERR_READ_UINT)) u0))
    )
    (ok (+ (* byte-4 u16777216) (* byte-3 u65536) (* byte-2 u256) byte-1))
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| num | (buff 4) |  |
| length | uint |  |

### buff-to-u8

[View in file](../contracts/bridge.clar#L848)

`(define-read-only (buff-to-u8 ((byte (buff 1))) uint)`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (buff-to-u8 (byte (buff 1)))
    (unwrap-panic (index-of BUFF_TO_BYTE byte)))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| byte | (buff 1) |  |
