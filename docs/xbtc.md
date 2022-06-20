
# xbtc

[`xbtc.clar`](../contracts/xbtc.clar)



**Public functions:**

- [`transfer`](#transfer)
- [`get-token-uri`](#get-token-uri)

**Read-only functions:**

- [`get-balance`](#get-balance)
- [`get-total-supply`](#get-total-supply)
- [`get-name`](#get-name)
- [`get-symbol`](#get-symbol)
- [`get-decimals`](#get-decimals)

**Private functions:**



## Functions

### get-balance

[View in file](../contracts/xbtc.clar#L6)

`(define-read-only (get-balance ((owner principal)) (response uint none))`

get the token balance of owner

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-balance (owner principal))
  (begin
    (ok (ft-get-balance xbtc owner))))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| owner | principal |  |

### get-total-supply

[View in file](../contracts/xbtc.clar#L11)

`(define-read-only (get-total-supply () (response uint none))`

returns the total number of tokens

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-total-supply)
  (ok (ft-get-supply xbtc)))
```
</details>




### get-name

[View in file](../contracts/xbtc.clar#L15)

`(define-read-only (get-name () (response (string-ascii 4) none))`

returns the token name

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-name)
  (ok "xBTC"))
```
</details>




### get-symbol

[View in file](../contracts/xbtc.clar#L19)

`(define-read-only (get-symbol () (response (string-ascii 4) none))`

the symbol or "ticker" for this token

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-symbol)
  (ok "xBTC"))
```
</details>




### get-decimals

[View in file](../contracts/xbtc.clar#L23)

`(define-read-only (get-decimals () (response uint none))`

the number of decimals used

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-decimals)
  (ok u8))
```
</details>




### transfer

[View in file](../contracts/xbtc.clar#L27)

`(define-public (transfer ((amount uint) (sender principal) (recipient principal) (memo (optional (buff 34)))) (response bool uint))`

Transfers tokens to a recipient

<details>
  <summary>Source code:</summary>

```clarity
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (if (is-eq tx-sender sender)
    (begin
      (try! (ft-transfer? xbtc amount sender recipient))
      ;; (print memo)
      (ok true)
    )
    (err u4)))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| amount | uint |  |
| sender | principal |  |
| recipient | principal |  |
| memo | (optional (buff 34)) |  |

### get-token-uri

[View in file](../contracts/xbtc.clar#L36)

`(define-public (get-token-uri () (response (optional (string-utf8 19)) none))`



<details>
  <summary>Source code:</summary>

```clarity
(define-public (get-token-uri)
  (ok (some u"https://example.com")))
```
</details>



