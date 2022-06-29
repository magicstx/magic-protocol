
# Wrapped-Bitcoin

[`SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar`](../.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar)

Implement the `ft-trait` trait defined in the `ft-trait` contract - SIP 10
This can use sugared syntax in real deployment (unit tests do not allow)

**Public functions:**

- [`transfer`](#transfer)
- [`add-principal-to-role`](#add-principal-to-role)
- [`remove-principal-from-role`](#remove-principal-from-role)
- [`set-token-uri`](#set-token-uri)
- [`mint-tokens`](#mint-tokens)
- [`burn-tokens`](#burn-tokens)
- [`revoke-tokens`](#revoke-tokens)
- [`update-blacklisted`](#update-blacklisted)
- [`initialize`](#initialize)

**Read-only functions:**

- [`get-balance`](#get-balance)
- [`get-name`](#get-name)
- [`get-symbol`](#get-symbol)
- [`get-decimals`](#get-decimals)
- [`get-total-supply`](#get-total-supply)
- [`has-role`](#has-role)
- [`get-token-uri`](#get-token-uri)
- [`is-blacklisted`](#is-blacklisted)
- [`detect-transfer-restriction`](#detect-transfer-restriction)
- [`message-for-restriction`](#message-for-restriction)

**Private functions:**



## Functions

### get-balance

[View in file](../.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar#L29)

`(define-read-only (get-balance ((owner principal)) (response uint none))`

Get the token balance of the specified owner in base units

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-balance (owner principal))
  (ok (ft-get-balance wrapped-bitcoin owner)))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| owner | principal |  |

### get-name

[View in file](../.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar#L33)

`(define-read-only (get-name () (response (string-ascii 32) none))`

Returns the token name

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-name)
  (ok (var-get token-name)))
```
</details>




### get-symbol

[View in file](../.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar#L37)

`(define-read-only (get-symbol () (response (string-ascii 32) none))`

Returns the symbol or "ticker" for this token

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-symbol)
  (ok (var-get token-symbol)))
```
</details>




### get-decimals

[View in file](../.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar#L41)

`(define-read-only (get-decimals () (response uint none))`

Returns the number of decimals used

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-decimals)
  (ok (var-get token-decimals)))
```
</details>




### get-total-supply

[View in file](../.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar#L45)

`(define-read-only (get-total-supply () (response uint none))`

Returns the total number of tokens that currently exist

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-total-supply)
  (ok (ft-get-supply wrapped-bitcoin)))
```
</details>




### transfer

[View in file](../.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar#L56)

`(define-public (transfer ((amount uint) (sender principal) (recipient principal) (memo (optional (buff 34)))) (response bool uint))`



<details>
  <summary>Source code:</summary>

```clarity
(define-public (transfer (amount uint) (sender principal) (recipient principal ) (memo (optional (buff 34) )))
  (begin
    (try! (detect-transfer-restriction amount sender recipient)) ;; Ensure there is no restriction
    (asserts! (is-eq tx-sender sender) (err u4)) ;; Ensure the originator is the sender principal
    (print (default-to 0x memo))
    (ft-transfer? wrapped-bitcoin amount sender recipient) ) ) ;; Transfer
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| amount | uint |  |
| sender | principal |  |
| recipient | principal |  |
| memo | (optional (buff 34)) |  |

### has-role

[View in file](../.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar#L80)

`(define-read-only (has-role ((role-to-check uint) (principal-to-check principal)) bool)`

Checks if an account has the specified role

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (has-role (role-to-check uint) (principal-to-check principal))
  (default-to false (get allowed (map-get? roles {role: role-to-check, account: principal-to-check}))))  
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| role-to-check | uint |  |
| principal-to-check | principal |  |

### add-principal-to-role

[View in file](../.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar#L85)

`(define-public (add-principal-to-role ((role-to-add uint) (principal-to-add principal)) (response bool uint))`

Add a principal to the specified role
Only existing principals with the OWNER_ROLE can modify roles

<details>
  <summary>Source code:</summary>

```clarity
(define-public (add-principal-to-role (role-to-add uint) (principal-to-add principal))   
   (begin
    ;; Check the contract-caller to verify they have the owner role
    (asserts! (has-role OWNER_ROLE contract-caller) (err PERMISSION_DENIED_ERROR))
    ;; Print the action for any off chain watchers
    (print { action: "add-principal-to-role", role-to-add: role-to-add, principal-to-add: principal-to-add })
    (ok (map-set roles { role: role-to-add, account: principal-to-add } { allowed: true }))))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| role-to-add | uint |  |
| principal-to-add | principal |  |

### remove-principal-from-role

[View in file](../.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar#L96)

`(define-public (remove-principal-from-role ((role-to-remove uint) (principal-to-remove principal)) (response bool uint))`

Remove a principal from the specified role
Only existing principals with the OWNER_ROLE can modify roles
WARN: Removing all owners will irrevocably lose all ownership permissions

<details>
  <summary>Source code:</summary>

```clarity
(define-public (remove-principal-from-role (role-to-remove uint) (principal-to-remove principal))   
   (begin
    ;; Check the contract-caller to verify they have the owner role
    (asserts! (has-role OWNER_ROLE contract-caller) (err PERMISSION_DENIED_ERROR))
    ;; Print the action for any off chain watchers
    (print { action: "remove-principal-from-role", role-to-remove: role-to-remove, principal-to-remove: principal-to-remove })
    (ok (map-set roles { role: role-to-remove, account: principal-to-remove } { allowed: false }))))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| role-to-remove | uint |  |
| principal-to-remove | principal |  |

### get-token-uri

[View in file](../.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar#L112)

`(define-read-only (get-token-uri () (response (optional (string-utf8 256)) none))`

Public getter for the URI

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-token-uri)
  (ok (some (var-get uri))))
```
</details>




### set-token-uri

[View in file](../.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar#L116)

`(define-public (set-token-uri ((updated-uri (string-utf8 256))) (response bool uint))`

Setter for the URI - only the owner can set it

<details>
  <summary>Source code:</summary>

```clarity
(define-public (set-token-uri (updated-uri (string-utf8 256)))
  (begin
    (asserts! (has-role OWNER_ROLE contract-caller) (err PERMISSION_DENIED_ERROR))
    ;; Print the action for any off chain watchers
    (print { action: "set-token-uri", updated-uri: updated-uri })
    (ok (var-set uri updated-uri))))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| updated-uri | (string-utf8 256) |  |

### mint-tokens

[View in file](../.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar#L129)

`(define-public (mint-tokens ((mint-amount uint) (mint-to principal)) (response bool uint))`

Mint tokens to the target address
Only existing principals with the MINTER_ROLE can mint tokens

<details>
  <summary>Source code:</summary>

```clarity
(define-public (mint-tokens (mint-amount uint) (mint-to principal) )
  (begin
    (asserts! (has-role MINTER_ROLE contract-caller) (err PERMISSION_DENIED_ERROR))
    ;; Print the action for any off chain watchers
    (print { action: "mint-tokens", mint-amount: mint-amount, mint-to: mint-to  })
    (ft-mint? wrapped-bitcoin mint-amount mint-to)))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| mint-amount | uint |  |
| mint-to | principal |  |

### burn-tokens

[View in file](../.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar#L138)

`(define-public (burn-tokens ((burn-amount uint) (burn-from principal)) (response bool uint))`

Burn tokens from the target address
Only existing principals with the BURNER_ROLE can mint tokens

<details>
  <summary>Source code:</summary>

```clarity
(define-public (burn-tokens (burn-amount uint) (burn-from principal) )
  (begin
    (asserts! (has-role BURNER_ROLE contract-caller) (err PERMISSION_DENIED_ERROR))
    ;; Print the action for any off chain watchers
    (print { action: "burn-tokens", burn-amount: burn-amount, burn-from : burn-from  })
    (ft-burn? wrapped-bitcoin burn-amount burn-from)))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| burn-amount | uint |  |
| burn-from | principal |  |

### revoke-tokens

[View in file](../.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar#L151)

`(define-public (revoke-tokens ((revoke-amount uint) (revoke-from principal) (revoke-to principal)) (response bool uint))`

Moves tokens from one account to another
Only existing principals with the REVOKER_ROLE can revoke tokens

<details>
  <summary>Source code:</summary>

```clarity
(define-public (revoke-tokens (revoke-amount uint) (revoke-from principal) (revoke-to principal) )
  (begin
    (asserts! (has-role REVOKER_ROLE contract-caller) (err PERMISSION_DENIED_ERROR))
    ;; Print the action for any off chain watchers
    (print { action: "revoke-tokens", revoke-amount: revoke-amount, revoke-from: revoke-from, revoke-to: revoke-to })
    (ft-transfer? wrapped-bitcoin revoke-amount revoke-from revoke-to)))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| revoke-amount | uint |  |
| revoke-from | principal |  |
| revoke-to | principal |  |

### is-blacklisted

[View in file](../.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar#L165)

`(define-read-only (is-blacklisted ((principal-to-check principal)) bool)`

Checks if an account is blacklisted

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (is-blacklisted (principal-to-check principal))
  (default-to false (get blacklisted (map-get? blacklist { account: principal-to-check }))))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| principal-to-check | principal |  |

### update-blacklisted

[View in file](../.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar#L170)

`(define-public (update-blacklisted ((principal-to-update principal) (set-blacklisted bool)) (response bool uint))`

Updates an account's blacklist status
Only existing principals with the BLACKLISTER_ROLE can update blacklist status

<details>
  <summary>Source code:</summary>

```clarity
(define-public (update-blacklisted (principal-to-update principal) (set-blacklisted bool))
  (begin
    (asserts! (has-role BLACKLISTER_ROLE contract-caller) (err PERMISSION_DENIED_ERROR))
    ;; Print the action for any off chain watchers
    (print { action: "update-blacklisted", principal-to-update: principal-to-update, set-blacklisted: set-blacklisted })
    (ok (map-set blacklist { account: principal-to-update } { blacklisted: set-blacklisted }))))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| principal-to-update | principal |  |
| set-blacklisted | bool |  |

### detect-transfer-restriction

[View in file](../.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar#L183)

`(define-read-only (detect-transfer-restriction ((amount uint) (sender principal) (recipient principal)) (response uint uint))`

Checks to see if a transfer should be restricted.  If so returns an error code that specifies restriction type.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (detect-transfer-restriction (amount uint) (sender principal) (recipient principal))
  (if (or (is-blacklisted sender) (is-blacklisted recipient))
    (err RESTRICTION_BLACKLIST)
    (ok RESTRICTION_NONE)))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| amount | uint |  |
| sender | principal |  |
| recipient | principal |  |

### message-for-restriction

[View in file](../.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar#L189)

`(define-read-only (message-for-restriction ((restriction-code uint)) (response (string-ascii 70) none))`

Returns the user viewable string for a specific transfer restriction

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (message-for-restriction (restriction-code uint))
  (if (is-eq restriction-code RESTRICTION_NONE)
    (ok "No Restriction Detected")
    (if (is-eq restriction-code RESTRICTION_BLACKLIST)
      (ok "Sender or recipient is on the blacklist and prevented from transacting")
      (ok "Unknown Error Code"))))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| restriction-code | uint |  |

### initialize

[View in file](../.clarinet/SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin.clar#L202)

`(define-public (initialize ((name-to-set (string-ascii 32)) (symbol-to-set (string-ascii 32)) (decimals-to-set uint) (initial-owner principal)) (response bool uint))`

Check to ensure that the same account that deployed the contract is initializing it
Only allow this funtion to be called once by checking "is-initialized"

<details>
  <summary>Source code:</summary>

```clarity
(define-public (initialize (name-to-set (string-ascii 32)) (symbol-to-set (string-ascii 32) ) (decimals-to-set uint) (initial-owner principal))
  (begin
    (asserts! (is-eq tx-sender (var-get deployer-principal)) (err PERMISSION_DENIED_ERROR))
    (asserts! (not (var-get is-initialized)) (err PERMISSION_DENIED_ERROR))
    (var-set is-initialized true) ;; Set to true so that this can't be called again
    (var-set token-name name-to-set)
    (var-set token-symbol symbol-to-set)
    (var-set token-decimals decimals-to-set)
    (map-set roles { role: OWNER_ROLE, account: initial-owner } { allowed: true })
    (ok true)))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| name-to-set | (string-ascii 32) |  |
| symbol-to-set | (string-ascii 32) |  |
| decimals-to-set | uint |  |
| initial-owner | principal |  |
