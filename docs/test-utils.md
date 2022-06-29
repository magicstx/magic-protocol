
# test-utils

[`test-utils.clar`](../contracts/test/test-utils.clar)

(define-public (mined-txs))

**Public functions:**

- [`set-mined`](#set-mined)
- [`set-burn-header`](#set-burn-header)

**Read-only functions:**

- [`was-mined`](#was-mined)
- [`burn-block-header`](#burn-block-header)

**Private functions:**



## Functions

### set-mined

[View in file](../contracts/test/test-utils.clar#L4)

`(define-public (set-mined ((txid (buff 32))) (response bool none))`



<details>
  <summary>Source code:</summary>

```clarity
(define-public (set-mined (txid (buff 32)))
  (ok (map-insert mined-txs txid true))
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| txid | (buff 32) |  |

### was-mined

[View in file](../contracts/test/test-utils.clar#L8)

`(define-read-only (was-mined ((txid (buff 32))) (optional bool))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (was-mined (txid (buff 32)))
  (map-get? mined-txs txid)
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| txid | (buff 32) |  |

### set-burn-header

[View in file](../contracts/test/test-utils.clar#L14)

`(define-public (set-burn-header ((height uint) (header (buff 80))) (response bool none))`



<details>
  <summary>Source code:</summary>

```clarity
(define-public (set-burn-header (height uint) (header (buff 80)))
  (ok (map-insert burn-block-headers height header))
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| height | uint |  |
| header | (buff 80) |  |

### burn-block-header

[View in file](../contracts/test/test-utils.clar#L18)

`(define-read-only (burn-block-header ((height uint)) (optional (buff 80)))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (burn-block-header (height uint))
  (map-get? burn-block-headers height)
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| height | uint |  |
