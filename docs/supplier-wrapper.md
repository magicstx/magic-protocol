
# supplier-wrapper

[`supplier-wrapper.clar`](../contracts/supplier-wrapper.clar)



**Public functions:**

- [`finalize-swap`](#finalize-swap)
- [`register-supplier`](#register-supplier)
- [`add-funds`](#add-funds)
- [`remove-funds`](#remove-funds)
- [`update-supplier`](#update-supplier)
- [`transfer-owner`](#transfer-owner)

**Read-only functions:**

- [`validate-owner`](#validate-owner)
- [`get-owner`](#get-owner)

**Private functions:**

- [`withdraw-funds`](#withdraw-funds)

## Functions

### finalize-swap

[View in file](../contracts/supplier-wrapper.clar#L6)

`(define-public (finalize-swap ((txid (buff 32)) (preimage (buff 128))) (response (tuple (csv uint) (expiration uint) (hash (buff 32)) (output-index uint) (redeem-script (buff 120)) (sats uint) (sender-public-key (buff 33)) (supplier uint) (swapper uint) (swapper-principal principal) (xbtc uint)) uint))`



<details>
  <summary>Source code:</summary>

```clarity
(define-public (finalize-swap (txid (buff 32)) (preimage (buff 128)))
  (let
    (
      (swap-resp (try! (contract-call? .bridge finalize-swap txid preimage)))
      (swap (try! (contract-call? .bridge get-full-inbound txid)))
      (sats (get sats swap))
      (xbtc (get xbtc swap))
      (fee (- sats xbtc))
      (updated-funds (try! (withdraw-funds fee)))
      (swapper (get swapper-principal swap))
    )
    ;; here, you can do special logic to move funds into a sub-protocol

    ;; refunding fees:
    (try! (as-contract (contract-call? 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin transfer fee tx-sender swapper none)))
    (ok swap)
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| txid | (buff 32) |  |
| preimage | (buff 128) |  |

### register-supplier

[View in file](../contracts/supplier-wrapper.clar#L27)

`(define-public (register-supplier ((public-key (buff 33)) (inbound-fee (optional int)) (outbound-fee (optional int)) (outbound-base-fee int) (inbound-base-fee int) (funds uint)) (response uint uint))`



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
  (begin
    (try! (validate-owner))
    (as-contract (contract-call? .bridge register-supplier public-key inbound-fee outbound-fee outbound-base-fee inbound-base-fee funds))
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| public-key | (buff 33) |  |
| inbound-fee | (optional int) |  |
| outbound-fee | (optional int) |  |
| outbound-base-fee | int |  |
| inbound-base-fee | int |  |
| funds | uint |  |

### add-funds

[View in file](../contracts/supplier-wrapper.clar#L41)

`(define-public (add-funds ((amount uint)) (response uint uint))`



<details>
  <summary>Source code:</summary>

```clarity
(define-public (add-funds (amount uint))
  (begin
    (try! (validate-owner))
    (as-contract (contract-call? .bridge add-funds amount))
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| amount | uint |  |

### remove-funds

[View in file](../contracts/supplier-wrapper.clar#L48)

`(define-public (remove-funds ((amount uint)) (response uint uint))`



<details>
  <summary>Source code:</summary>

```clarity
(define-public (remove-funds (amount uint))
  (begin
    (try! (validate-owner))
    (as-contract (contract-call? .bridge remove-funds amount))
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| amount | uint |  |

### update-supplier

[View in file](../contracts/supplier-wrapper.clar#L55)

`(define-public (update-supplier ((public-key (buff 33)) (inbound-fee (optional int)) (outbound-fee (optional int)) (outbound-base-fee int) (inbound-base-fee int)) (response (tuple (controller principal) (inbound-base-fee int) (inbound-fee (optional int)) (outbound-base-fee int) (outbound-fee (optional int)) (public-key (buff 33))) uint))`



<details>
  <summary>Source code:</summary>

```clarity
(define-public (update-supplier
    (public-key (buff 33))
    (inbound-fee (optional int))
    (outbound-fee (optional int))
    (outbound-base-fee int)
    (inbound-base-fee int)
  )
  (begin
    (try! (validate-owner))
    (try! (as-contract (contract-call? .bridge update-supplier-fees inbound-fee outbound-fee outbound-base-fee inbound-base-fee)))
    (as-contract (contract-call? .bridge update-supplier-public-key public-key))
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| public-key | (buff 33) |  |
| inbound-fee | (optional int) |  |
| outbound-fee | (optional int) |  |
| outbound-base-fee | int |  |
| inbound-base-fee | int |  |

### transfer-owner

[View in file](../contracts/supplier-wrapper.clar#L69)

`(define-public (transfer-owner ((new-owner principal)) (response principal uint))`



<details>
  <summary>Source code:</summary>

```clarity
(define-public (transfer-owner (new-owner principal))
  (begin
    (try! (validate-owner))
    (var-set owner new-owner)
    (ok new-owner)
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| new-owner | principal |  |

### withdraw-funds

[View in file](../contracts/supplier-wrapper.clar#L79)

`(define-private (withdraw-funds ((amount uint)) (response uint uint))`



<details>
  <summary>Source code:</summary>

```clarity
(define-private (withdraw-funds (amount uint))
  (as-contract (contract-call? .bridge remove-funds amount))
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| amount | uint |  |

### validate-owner

[View in file](../contracts/supplier-wrapper.clar#L85)

`(define-read-only (validate-owner () (response bool uint))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (validate-owner)
  (if (is-eq contract-caller (get-owner))
    (ok true)
    ERR_UNAUTHORIZED
  )
)
```
</details>




### get-owner

[View in file](../contracts/supplier-wrapper.clar#L92)

`(define-read-only (get-owner () principal)`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-owner) (var-get owner))
```
</details>



