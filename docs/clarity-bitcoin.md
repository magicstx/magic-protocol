
# clarity-bitcoin

[`clarity-bitcoin.clar`](../contracts/clarity-bitcoin.clar)

Error codes

**Public functions:**



**Read-only functions:**

- [`buff-to-u8`](#buff-to-u8)
- [`inner-read-slice-1024`](#inner-read-slice-1024)
- [`read-slice-512`](#read-slice-512)
- [`read-slice-256`](#read-slice-256)
- [`read-slice-128`](#read-slice-128)
- [`read-slice-64`](#read-slice-64)
- [`read-slice-32`](#read-slice-32)
- [`read-slice-16`](#read-slice-16)
- [`read-slice-8`](#read-slice-8)
- [`read-slice-4`](#read-slice-4)
- [`read-slice-2`](#read-slice-2)
- [`read-slice-1`](#read-slice-1)
- [`inner-read-slice`](#inner-read-slice)
- [`read-slice`](#read-slice)
- [`read-uint16`](#read-uint16)
- [`read-uint32`](#read-uint32)
- [`read-uint64`](#read-uint64)
- [`read-varint`](#read-varint)
- [`read-varslice`](#read-varslice)
- [`inner-buff32-permutation`](#inner-buff32-permutation)
- [`reverse-buff32`](#reverse-buff32)
- [`read-hashslice`](#read-hashslice)
- [`read-next-txin`](#read-next-txin)
- [`read-txins`](#read-txins)
- [`read-next-txout`](#read-next-txout)
- [`read-txouts`](#read-txouts)
- [`parse-tx`](#parse-tx)
- [`parse-block-header`](#parse-block-header)
- [`verify-block-header`](#verify-block-header)
- [`get-reversed-txid`](#get-reversed-txid)
- [`get-txid`](#get-txid)
- [`is-bit-set`](#is-bit-set)
- [`inner-merkle-proof-verify`](#inner-merkle-proof-verify)
- [`verify-merkle-proof`](#verify-merkle-proof)
- [`verify-prev-block`](#verify-prev-block)
- [`verify-prev-blocks`](#verify-prev-blocks)
- [`verify-prev-blocks-fold`](#verify-prev-blocks-fold)

**Private functions:**



## Functions

### buff-to-u8

[View in file](../contracts/clarity-bitcoin.clar#L118)

`(define-read-only (buff-to-u8 ((byte (buff 1))) uint)`

Convert a 1-byte buff into a uint.

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

### inner-read-slice-1024

[View in file](../contracts/clarity-bitcoin.clar#L122)

`(define-read-only (inner-read-slice-1024 ((ignored bool) (input (tuple (acc (buff 1024)) (data (buff 1024)) (index uint)))) (tuple (acc (buff 1024)) (data (buff 1024)) (index uint)))`

Append a byte at the given index in the given data to acc.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (inner-read-slice-1024 (ignored bool) (input { acc: (buff 1024), data: (buff 1024), index: uint }))
    (let (
        (acc (get acc input))
        (data (get data input))
        (ctr (get index input))
        (byte (unwrap-panic (element-at data ctr)))
    )
    {
        acc: (unwrap-panic (as-max-len? (concat acc byte) u1024)),
        data: data,
        index: (+ u1 ctr)
    })
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| ignored | bool |  |
| input | (tuple (acc (buff 1024)) (data (buff 1024)) (index uint)) |  |

### read-slice-512

[View in file](../contracts/clarity-bitcoin.clar#L137)

`(define-read-only (read-slice-512 ((input (tuple (data (buff 1024)) (index uint)))) (buff 1024))`

Read 512 bytes from data, starting at index.  Return the 512-byte slice.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (read-slice-512 (input { data: (buff 1024), index: uint }))
    (get acc
        (fold inner-read-slice-1024 LIST_512 { acc: 0x, data: (get data input), index: (get index input) })))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| input | (tuple (data (buff 1024)) (index uint)) |  |

### read-slice-256

[View in file](../contracts/clarity-bitcoin.clar#L142)

`(define-read-only (read-slice-256 ((input (tuple (data (buff 1024)) (index uint)))) (buff 1024))`

Read 256 bytes from data, starting at index.  Return the 256-byte slice.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (read-slice-256 (input { data: (buff 1024), index: uint }))
    (get acc
        (fold inner-read-slice-1024 LIST_256 { acc: 0x, data: (get data input), index: (get index input) })))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| input | (tuple (data (buff 1024)) (index uint)) |  |

### read-slice-128

[View in file](../contracts/clarity-bitcoin.clar#L147)

`(define-read-only (read-slice-128 ((input (tuple (data (buff 1024)) (index uint)))) (buff 1024))`

Read 128 bytes from data, starting at index.  Return the 128-byte slice.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (read-slice-128 (input { data: (buff 1024), index: uint }))
    (get acc
        (fold inner-read-slice-1024 LIST_128 { acc: 0x, data: (get data input), index: (get index input) })))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| input | (tuple (data (buff 1024)) (index uint)) |  |

### read-slice-64

[View in file](../contracts/clarity-bitcoin.clar#L152)

`(define-read-only (read-slice-64 ((input (tuple (data (buff 1024)) (index uint)))) (buff 1024))`

Read 64 bytes from data, starting at index.  Return the 64-byte slice.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (read-slice-64 (input { data: (buff 1024), index: uint }))
    (get acc
        (fold inner-read-slice-1024 LIST_64 { acc: 0x, data: (get data input), index: (get index input) })))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| input | (tuple (data (buff 1024)) (index uint)) |  |

### read-slice-32

[View in file](../contracts/clarity-bitcoin.clar#L157)

`(define-read-only (read-slice-32 ((input (tuple (data (buff 1024)) (index uint)))) (buff 1024))`

Read 32 bytes from data, starting at index.  Return the 32-byte slice.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (read-slice-32 (input { data: (buff 1024), index: uint }))
    (get acc
        (fold inner-read-slice-1024 LIST_32 { acc: 0x, data: (get data input), index: (get index input) })))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| input | (tuple (data (buff 1024)) (index uint)) |  |

### read-slice-16

[View in file](../contracts/clarity-bitcoin.clar#L162)

`(define-read-only (read-slice-16 ((input (tuple (data (buff 1024)) (index uint)))) (buff 1024))`

Read 16 bytes from data, starting at index.  Return the 16-byte slice.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (read-slice-16 (input { data: (buff 1024), index: uint }))
    (get acc
        (fold inner-read-slice-1024 LIST_16 { acc: 0x, data: (get data input), index: (get index input) })))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| input | (tuple (data (buff 1024)) (index uint)) |  |

### read-slice-8

[View in file](../contracts/clarity-bitcoin.clar#L167)

`(define-read-only (read-slice-8 ((input (tuple (data (buff 1024)) (index uint)))) (buff 1024))`

Read 8 bytes from data, starting at index.  Return the 8-byte slice.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (read-slice-8 (input { data: (buff 1024), index: uint }))
    (get acc
        (fold inner-read-slice-1024 (list true true true true true true true true) { acc: 0x, data: (get data input), index: (get index input) })))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| input | (tuple (data (buff 1024)) (index uint)) |  |

### read-slice-4

[View in file](../contracts/clarity-bitcoin.clar#L172)

`(define-read-only (read-slice-4 ((input (tuple (data (buff 1024)) (index uint)))) (buff 1024))`

Read 4 bytes from data, starting at index.  Return the 4-byte slice.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (read-slice-4 (input { data: (buff 1024), index: uint }))
    (get acc
        (fold inner-read-slice-1024 (list true true true true) { acc: 0x, data: (get data input), index: (get index input) })))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| input | (tuple (data (buff 1024)) (index uint)) |  |

### read-slice-2

[View in file](../contracts/clarity-bitcoin.clar#L177)

`(define-read-only (read-slice-2 ((input (tuple (data (buff 1024)) (index uint)))) (buff 1024))`

Read 2 bytes from data, starting at index.  Return the 2-byte slice.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (read-slice-2 (input { data: (buff 1024), index: uint }))
    (get acc
        (fold inner-read-slice-1024 (list true true) { acc: 0x, data: (get data input), index: (get index input) })))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| input | (tuple (data (buff 1024)) (index uint)) |  |

### read-slice-1

[View in file](../contracts/clarity-bitcoin.clar#L182)

`(define-read-only (read-slice-1 ((input (tuple (data (buff 1024)) (index uint)))) (buff 1024))`

Read 1 byte from data, starting at index.  Return the 1-byte slice.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (read-slice-1 (input { data: (buff 1024), index: uint }))
    (get acc
        (fold inner-read-slice-1024 (list true) { acc: 0x, data: (get data input), index: (get index input) })))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| input | (tuple (data (buff 1024)) (index uint)) |  |

### inner-read-slice

[View in file](../contracts/clarity-bitcoin.clar#L188)

`(define-read-only (inner-read-slice ((chunk_size uint) (input (tuple (acc (buff 1024)) (buffer (buff 1024)) (index uint) (remaining uint)))) (tuple (acc (buff 1024)) (buffer (buff 1024)) (index uint) (remaining uint)))`

Read a fixed-sized chunk of data from a given buffer (up to remaining bytes), starting at index, and append it to acc.
chunk_size must be a power of 2, up to 1024

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (inner-read-slice (chunk_size uint) (input { acc: (buff 1024), buffer: (buff 1024), index: uint, remaining: uint }))
    (let (
        (ctr (get index input))
        (remaining (get remaining input))
    )
    (if (is-eq u0 remaining)
        ;; done reading
        input
        (let (
            (acc (get acc input))
            (databuff (get buffer input))
        )
        (if (> chunk_size remaining)
            ;; chunk size too big for remainder, so just skip it.
            input
            ;; we have at least chunk_size bytes to read!
            ;; dispatch to the right fixed-size slice reader.
            (if (is-eq chunk_size u512)
                { acc: (unwrap-panic (as-max-len? (concat acc (read-slice-512 { data: databuff, index: ctr })) u1024)), buffer: databuff, index: (+ chunk_size ctr), remaining: (- remaining chunk_size) }
            (if (is-eq chunk_size u256)
                { acc: (unwrap-panic (as-max-len? (concat acc (read-slice-256 { data: databuff, index: ctr })) u1024)), buffer: databuff, index: (+ chunk_size ctr), remaining: (- remaining chunk_size) }
            (if (is-eq chunk_size u128)
                { acc: (unwrap-panic (as-max-len? (concat acc (read-slice-128 { data: databuff, index: ctr })) u1024)), buffer: databuff, index: (+ chunk_size ctr), remaining: (- remaining chunk_size) }
            (if (is-eq chunk_size u64)
                { acc: (unwrap-panic (as-max-len? (concat acc (read-slice-64 { data: databuff, index: ctr })) u1024)), buffer: databuff, index: (+ chunk_size ctr), remaining: (- remaining chunk_size) }
            (if (is-eq chunk_size u32)
                { acc: (unwrap-panic (as-max-len? (concat acc (read-slice-32 { data: databuff, index: ctr })) u1024)), buffer: databuff, index: (+ chunk_size ctr), remaining: (- remaining chunk_size) }
            (if (is-eq chunk_size u16)
                { acc: (unwrap-panic (as-max-len? (concat acc (read-slice-16 { data: databuff, index: ctr })) u1024)), buffer: databuff, index: (+ chunk_size ctr), remaining: (- remaining chunk_size) }
            (if (is-eq chunk_size u8)
                { acc: (unwrap-panic (as-max-len? (concat acc (read-slice-8 { data: databuff, index: ctr })) u1024)), buffer: databuff, index: (+ chunk_size ctr), remaining: (- remaining chunk_size) }
            (if (is-eq chunk_size u4)
                { acc: (unwrap-panic (as-max-len? (concat acc (read-slice-4 { data: databuff, index: ctr })) u1024)), buffer: databuff, index: (+ chunk_size ctr), remaining: (- remaining chunk_size) }
            (if (is-eq chunk_size u2)
                { acc: (unwrap-panic (as-max-len? (concat acc (read-slice-2 { data: databuff, index: ctr })) u1024)), buffer: databuff, index: (+ chunk_size ctr), remaining: (- remaining chunk_size) }
            (if (is-eq chunk_size u1)
                { acc: (unwrap-panic (as-max-len? (concat acc (read-slice-1 { data: databuff, index: ctr })) u1024)), buffer: databuff, index: (+ chunk_size ctr), remaining: (- remaining chunk_size) }
                { acc: acc, buffer: databuff, index: ctr, remaining: remaining }
            ))))))))))
        ))
    ))
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| chunk_size | uint |  |
| input | (tuple (acc (buff 1024)) (buffer (buff 1024)) (index uint) (remaining uint)) |  |

### read-slice

[View in file](../contracts/clarity-bitcoin.clar#L234)

`(define-read-only (read-slice ((data (buff 1024)) (offset uint) (size uint)) (response (buff 1024) uint))`

Top-level function to read a slice of a given size from a given (buff 1024), starting at a given offset.
Returns (ok (buff 1024)) on success, and it contains "buff[offset..(offset+size)]"
Returns (err ERR-OUT-OF-BOUNDS) if the slice offset and/or size would copy a range of bytes outside the given buffer.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (read-slice (data (buff 1024)) (offset uint) (size uint))
    (if (or (>= offset (len data)) (> (+ offset size) (len data)))
        (err ERR-OUT-OF-BOUNDS)
        (begin
        ;;    (print "read slice")
        ;;    (print size)
           (ok
             (get acc
                 (fold inner-read-slice (list u512 u256 u128 u64 u32 u16 u8 u4 u2 u1) { acc: 0x, buffer: data, index: offset, remaining: size }))
           )
        )
    )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| data | (buff 1024) |  |
| offset | uint |  |
| size | uint |  |

### read-uint16

[View in file](../contracts/clarity-bitcoin.clar#L251)

`(define-read-only (read-uint16 ((ctx (tuple (index uint) (txbuff (buff 1024))))) (response (tuple (ctx (tuple (index uint) (txbuff (buff 1024)))) (uint16 uint)) uint))`

Reads the next two bytes from txbuff as a big-endian 16-bit integer, and updates the index.
Returns (ok { uint16: uint, ctx: { txbuff: (buff 1024), index: uint } }) on success.
Returns (err ERR-OUT-OF-BOUNDS) if we read past the end of txbuff

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (read-uint16 (ctx { txbuff: (buff 1024), index: uint }))
    (let (
        (data (get txbuff ctx))
        (base (get index ctx))
        (byte-1 (buff-to-u8 (unwrap! (element-at data base) (err ERR-OUT-OF-BOUNDS))))
        (byte-2 (buff-to-u8 (unwrap! (element-at data (+ u1 base)) (err ERR-OUT-OF-BOUNDS))))
        (ret (+ (* byte-2 u256) byte-1))
    )
    (begin
    ;;    (print "read uint16")
    ;;    (print ret)
       (ok {
           uint16: ret,
           ctx: { txbuff: data, index: (+ u2 base) }
       })
    ))
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| ctx | (tuple (index uint) (txbuff (buff 1024))) |  |

### read-uint32

[View in file](../contracts/clarity-bitcoin.clar#L272)

`(define-read-only (read-uint32 ((ctx (tuple (index uint) (txbuff (buff 1024))))) (response (tuple (ctx (tuple (index uint) (txbuff (buff 1024)))) (uint32 uint)) uint))`

Reads the next four bytes from txbuff as a big-endian 32-bit integer, and updates the index.
Returns (ok { uint32: uint, ctx: { txbuff: (buff 1024), index: uint } }) on success.
Returns (err ERR-OUT-OF-BOUNDS) if we read past the end of txbuff

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (read-uint32 (ctx { txbuff: (buff 1024), index: uint }))
    (let (
        (data (get txbuff ctx))
        (base (get index ctx))
        (byte-1 (buff-to-u8 (unwrap! (element-at data base) (err ERR-OUT-OF-BOUNDS))))
        (byte-2 (buff-to-u8 (unwrap! (element-at data (+ u1 base)) (err ERR-OUT-OF-BOUNDS))))
        (byte-3 (buff-to-u8 (unwrap! (element-at data (+ u2 base)) (err ERR-OUT-OF-BOUNDS))))
        (byte-4 (buff-to-u8 (unwrap! (element-at data (+ u3 base)) (err ERR-OUT-OF-BOUNDS))))
        (ret (+ (* byte-4 u16777216) (* byte-3 u65536) (* byte-2 u256) byte-1))
    )
    (begin
    ;;    (print "read uint32")
    ;;    (print ret)
       (ok {
           uint32: ret,
           ctx: { txbuff: data, index: (+ u4 base) }
       })
    ))
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| ctx | (tuple (index uint) (txbuff (buff 1024))) |  |

### read-uint64

[View in file](../contracts/clarity-bitcoin.clar#L295)

`(define-read-only (read-uint64 ((ctx (tuple (index uint) (txbuff (buff 1024))))) (response (tuple (ctx (tuple (index uint) (txbuff (buff 1024)))) (uint64 uint)) uint))`

Reads the next eight bytes from txbuff as a big-endian 64-bit integer, and updates the index.
Returns (ok { uint64: uint, ctx: { txbuff: (buff 1024), index: uint } }) on success.
Returns (err ERR-OUT-OF-BOUNDS) if we read past the end of txbuff

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (read-uint64 (ctx { txbuff: (buff 1024), index: uint }))
    (let (
        (data (get txbuff ctx))
        (base (get index ctx))
        (byte-1 (buff-to-u8 (unwrap! (element-at data base) (err ERR-OUT-OF-BOUNDS))))
        (byte-2 (buff-to-u8 (unwrap! (element-at data (+ u1 base)) (err ERR-OUT-OF-BOUNDS))))
        (byte-3 (buff-to-u8 (unwrap! (element-at data (+ u2 base)) (err ERR-OUT-OF-BOUNDS))))
        (byte-4 (buff-to-u8 (unwrap! (element-at data (+ u3 base)) (err ERR-OUT-OF-BOUNDS))))
        (byte-5 (buff-to-u8 (unwrap! (element-at data (+ u4 base)) (err ERR-OUT-OF-BOUNDS))))
        (byte-6 (buff-to-u8 (unwrap! (element-at data (+ u5 base)) (err ERR-OUT-OF-BOUNDS))))
        (byte-7 (buff-to-u8 (unwrap! (element-at data (+ u6 base)) (err ERR-OUT-OF-BOUNDS))))
        (byte-8 (buff-to-u8 (unwrap! (element-at data (+ u7 base)) (err ERR-OUT-OF-BOUNDS))))
        (ret (+ 
           (* byte-8 u72057594037927936)
           (* byte-7 u281474976710656)
           (* byte-6 u1099511627776)
           (* byte-5 u4294967296)
           (* byte-4 u16777216)
           (* byte-3 u65536)
           (* byte-2 u256)
           byte-1))
    )
    (begin
    ;;    (print "read uint64")
    ;;    (print ret)
       (ok {
           uint64: ret,
           ctx: { txbuff: data, index: (+ u8 base) }
       })
    ))
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| ctx | (tuple (index uint) (txbuff (buff 1024))) |  |

### read-varint

[View in file](../contracts/clarity-bitcoin.clar#L330)

`(define-read-only (read-varint ((ctx (tuple (index uint) (txbuff (buff 1024))))) (response (tuple (ctx (tuple (index uint) (txbuff (buff 1024)))) (varint uint)) uint))`

Reads the next varint from txbuff, and updates the index.
Returns (ok { varint: uint, ctx: { txbuff: (buff 1024), index: uint } }) on success
Returns (err ERR-OUT-OF-BOUNDS) if we read past the end of txbuff.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (read-varint (ctx { txbuff: (buff 1024), index: uint }))
    (let (
        (ptr (get index ctx))
        (tx (get txbuff ctx))
        (byte (buff-to-u8 (unwrap! (element-at tx ptr)
                            (err ERR-OUT-OF-BOUNDS))))
    )
    (if (<= byte u252)
        (begin
        ;;    (print "varint 1")
        ;;    (print byte)
           ;; given byte is the varint
           (ok { varint: byte, ctx: { txbuff: tx, index: (+ u1 ptr) }})
        )
        (if (is-eq byte u253)
            (let (
                ;; next two bytes is the varint
                (parsed-u16 (try! (read-uint16 { txbuff: tx, index: (+ u1 ptr) })))
            )
            (begin
                ;; (print "varint 2")
                ;; (print (get uint16 parsed-u16))
                (ok { varint: (get uint16 parsed-u16), ctx: (get ctx parsed-u16) })
            ))
            (if (is-eq byte u254)
                (let (
                    ;; next four bytes is the varint
                    (parsed-u32 (try! (read-uint32 { txbuff: tx, index: (+ u1 ptr) })))
                )
                (begin
                    ;; (print "varint 4")
                    ;; (print (get uint32 parsed-u32))
                    (ok { varint: (get uint32 parsed-u32), ctx: (get ctx parsed-u32) })
                ))
                (let (
                    ;; next eight bytes is the varint
                    (parsed-u64 (try! (read-uint64 { txbuff: tx, index: (+ u1 ptr) })))
                )
                (begin
                    ;; (print "varint 8")
                    ;; (print (get uint64 parsed-u64))
                    (ok { varint: (get uint64 parsed-u64), ctx: (get ctx parsed-u64) })
                ))
            )
        )
    ))
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| ctx | (tuple (index uint) (txbuff (buff 1024))) |  |

### read-varslice

[View in file](../contracts/clarity-bitcoin.clar#L381)

`(define-read-only (read-varslice ((old-ctx (tuple (index uint) (txbuff (buff 1024))))) (response (tuple (ctx (tuple (index uint) (txbuff (buff 1024)))) (varslice (buff 1024))) uint))`

Reads a varint-prefixed byte slice from txbuff, and updates the index to point to the byte after the varint and slice.
Returns (ok { varslice: (buff 1024), ctx: { txbuff: (buff 1024), index: uint } }) on success, where varslice has the length of the varint prefix.
Returns (err ERR-OUT-OF-BOUNDS) if we read past the end of txbuff.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (read-varslice (old-ctx { txbuff: (buff 1024), index: uint }))
    (let (
        (parsed (try! (read-varint old-ctx)))
        (slice-len (get varint parsed))
        (ctx (get ctx parsed))
        (slice-2 (try! (read-slice (get txbuff ctx) (get index ctx) slice-len)))
    )
    (ok {
        varslice: slice-2,
        ctx: { txbuff: (get txbuff ctx), index: (+ (len slice-2) (get index ctx)) }
    }))
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| old-ctx | (tuple (index uint) (txbuff (buff 1024))) |  |

### inner-buff32-permutation

[View in file](../contracts/clarity-bitcoin.clar#L396)

`(define-read-only (inner-buff32-permutation ((target-index uint) (state (tuple (hash-input (buff 32)) (hash-output (buff 32))))) (tuple (hash-input (buff 32)) (hash-output (buff 32))))`

Generate a permutation of a given 32-byte buffer, appending the element at target-index to hash-output.
The target-index decides which index in hash-input gets appended to hash-output.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (inner-buff32-permutation (target-index uint) (state { hash-input: (buff 32), hash-output: (buff 32) }))
    {
        hash-input: (get hash-input state),
        hash-output: (unwrap-panic
            (as-max-len? (concat
                (get hash-output state)
                (unwrap-panic
                    (as-max-len?
                        (unwrap-panic
                            (element-at (get hash-input state) target-index))
                    u32)))
            u32))
    }
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| target-index | uint |  |
| state | (tuple (hash-input (buff 32)) (hash-output (buff 32))) |  |

### reverse-buff32

[View in file](../contracts/clarity-bitcoin.clar#L412)

`(define-read-only (reverse-buff32 ((input (buff 32))) (buff 32))`

Reverse the byte order of a 32-byte buffer.  Returns the (buff 32).

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (reverse-buff32 (input (buff 32)))
    (get hash-output
         (fold inner-buff32-permutation
             (list u31 u30 u29 u28 u27 u26 u25 u24 u23 u22 u21 u20 u19 u18 u17 u16 u15 u14 u13 u12 u11 u10 u9 u8 u7 u6 u5 u4 u3 u2 u1 u0)
             { hash-input: input, hash-output: 0x }))
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| input | (buff 32) |  |

### read-hashslice

[View in file](../contracts/clarity-bitcoin.clar#L422)

`(define-read-only (read-hashslice ((old-ctx (tuple (index uint) (txbuff (buff 1024))))) (response (tuple (ctx (tuple (index uint) (txbuff (buff 1024)))) (hashslice (buff 32))) uint))`

Reads a big-endian hash -- consume the next 32 bytes, and reverse them.
Returns (ok { hashslice: (buff 32), ctx: { txbuff: (buff 1024), index: uint } }) on success, and updates the index.
Returns (err ERR-OUT-OF-BOUNDS) if we read past the end of txbuff.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (read-hashslice (old-ctx { txbuff: (buff 1024), index: uint }))
    (let (
        (hash-le (unwrap-panic
                    (as-max-len? (try!
                                    (read-slice (get txbuff old-ctx) (get index old-ctx) u32))
                    u32)))
    )
    (ok {
        hashslice: (reverse-buff32 hash-le),
        ctx: { txbuff: (get txbuff old-ctx), index: (+ u32 (get index old-ctx)) }
    }))
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| old-ctx | (tuple (index uint) (txbuff (buff 1024))) |  |

### read-next-txin

[View in file](../contracts/clarity-bitcoin.clar#L441)

`(define-read-only (read-next-txin ((ignored bool) (state-res (response (tuple (ctx (tuple (index uint) (txbuff (buff 1024)))) (remaining uint) (txins (list 8 (tuple (outpoint (tuple (hash (buff 32)) (index uint))) (scriptSig (buff 256)) (sequence uint))))) uint))) (response (tuple (ctx (tuple (index uint) (txbuff (buff 1024)))) (remaining uint) (txins (list 8 (tuple (outpoint (tuple (hash (buff 32)) (index uint))) (scriptSig (buff 256)) (sequence uint))))) uint))`

Inner fold method to read the next tx input from txbuff. 
The index in ctx will be updated to point to the next tx input if all goes well (or to the start of the outputs)
Returns (ok { ... }) on success.
Returns (err ERR-OUT-OF-BOUNDS) if we read past the end of txbuff.
Returns (err ERR-VARSLICE-TOO-LONG) if we find a scriptSig that's too long to parse.
Returns (err ERR-TOO-MANY-TXINS) if there are more than eight inputs to read.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (read-next-txin (ignored bool)
                                  (state-res (response {
                                    ctx: { txbuff: (buff 1024), index: uint },
                                    remaining: uint,
                                    txins: (list 8 {
                                        outpoint: {
                                            hash: (buff 32),
                                            index: uint
                                        },
                                        scriptSig: (buff 256),      ;; just big enough to hold a 2-of-3 multisig script
                                        sequence: uint
                                    })
                                  } uint)))
    (match state-res
        state
            (if (< u0 (get remaining state))
                (let (
                   (remaining (get remaining state))
                   (ctx (get ctx state))
                   (parsed-hash (try! (read-hashslice ctx)))
                   (parsed-index (try! (read-uint32 (get ctx parsed-hash))))
                   (parsed-scriptSig (try! (read-varslice (get ctx parsed-index))))
                   (parsed-sequence (try! (read-uint32 (get ctx parsed-scriptSig))))
                   (new-ctx (get ctx parsed-sequence))
                )
                (ok {
                   ctx: new-ctx,
                   remaining: (- remaining u1),
                   txins: (unwrap!
                     (as-max-len?
                         (append (get txins state)
                             {
                                 outpoint: {
                                    hash: (get hashslice parsed-hash),
                                    index: (get uint32 parsed-index)
                                 },
                                 scriptSig: (unwrap! (as-max-len? (get varslice parsed-scriptSig) u256) (err ERR-VARSLICE-TOO-LONG)),
                                 sequence: (get uint32 parsed-sequence)
                             })
                     u8)
                     (err ERR-TOO-MANY-TXINS))
                }))
                (ok state)
            )
        error
            (err error)
    )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| ignored | bool |  |
| state-res | (response (tuple (ctx (tuple (index uint) (txbuff (buff 1024)))) (remaining uint) (txins (list 8 (tuple (outpoint (tuple (hash (buff 32)) (index uint))) (scriptSig (buff 256)) (sequence uint))))) uint) |  |

### read-txins

[View in file](../contracts/clarity-bitcoin.clar#L495)

`(define-read-only (read-txins ((ctx (tuple (index uint) (txbuff (buff 1024))))) (response (tuple (ctx (tuple (index uint) (txbuff (buff 1024)))) (remaining uint) (txins (list 8 (tuple (outpoint (tuple (hash (buff 32)) (index uint))) (scriptSig (buff 256)) (sequence uint))))) uint))`

Read a transaction's inputs.
Returns (ok { txins: (list { ... }), remaining: uint, ctx: { txbuff: (buff 1024), index: uint } }) on success, and updates the index in ctx to point to the start of the tx outputs.
Returns (err ERR-OUT-OF-BOUNDS) if we read past the end of txbuff.
Returns (err ERR-VARSLICE-TOO-LONG) if we find a scriptSig that's too long to parse.
Returns (err ERR-TOO-MANY-TXINS) if there are more than eight inputs to read.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (read-txins (ctx { txbuff: (buff 1024), index: uint }))
    (let (
        (parsed-num-txins (try! (read-varint ctx)))
        (num-txins (get varint parsed-num-txins))
        (new-ctx (get ctx parsed-num-txins))
    )
    (if (> num-txins u8)
        (err ERR-TOO-MANY-TXINS)
        (fold read-next-txin (list true true true true true true true true) (ok { ctx: new-ctx, remaining: num-txins, txins: (list ) }))
    ))
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| ctx | (tuple (index uint) (txbuff (buff 1024))) |  |

### read-next-txout

[View in file](../contracts/clarity-bitcoin.clar#L512)

`(define-read-only (read-next-txout ((ignored bool) (state-res (response (tuple (ctx (tuple (index uint) (txbuff (buff 1024)))) (remaining uint) (txouts (list 8 (tuple (scriptPubKey (buff 128)) (value uint))))) uint))) (response (tuple (ctx (tuple (index uint) (txbuff (buff 1024)))) (remaining uint) (txouts (list 8 (tuple (scriptPubKey (buff 128)) (value uint))))) uint))`

Read the next transaction output, and update the index in ctx to point to the next output.
Returns (ok { ... }) on success
Returns (err ERR-OUT-OF-BOUNDS) if we read past the end of txbuff.
Returns (err ERR-VARSLICE-TOO-LONG) if we find a scriptPubKey that's too long to parse.
Returns (err ERR-TOO-MANY-TXOUTS) if there are more than eight outputs to read.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (read-next-txout (ignored bool)
                                   (state-res (response {
                                    ctx: { txbuff: (buff 1024), index: uint },
                                    remaining: uint,
                                    txouts: (list 8 {
                                        value: uint,
                                        scriptPubKey: (buff 128)
                                    })
                                   } uint)))
    (match state-res
        state
            (if (< u0 (get remaining state))
                (let (
                    (remaining (get remaining state))
                    (parsed-value (try! (read-uint64 (get ctx state))))
                    (parsed-script (try! (read-varslice (get ctx parsed-value))))
                    (new-ctx (get ctx parsed-script))
                )
                (ok {
                    ctx: new-ctx,
                    remaining: (- remaining u1),
                    txouts: (unwrap!
                        (as-max-len?
                            (append (get txouts state)
                                {
                                    value: (get uint64 parsed-value),
                                    scriptPubKey: (unwrap! (as-max-len? (get varslice parsed-script) u128) (err ERR-VARSLICE-TOO-LONG))
                                })
                        u8) 
                        (err ERR-TOO-MANY-TXOUTS))
                }))
                (ok state)
            )
        error
            (err error)
    )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| ignored | bool |  |
| state-res | (response (tuple (ctx (tuple (index uint) (txbuff (buff 1024)))) (remaining uint) (txouts (list 8 (tuple (scriptPubKey (buff 128)) (value uint))))) uint) |  |

### read-txouts

[View in file](../contracts/clarity-bitcoin.clar#L555)

`(define-read-only (read-txouts ((ctx (tuple (index uint) (txbuff (buff 1024))))) (response (tuple (ctx (tuple (index uint) (txbuff (buff 1024)))) (remaining uint) (txouts (list 8 (tuple (scriptPubKey (buff 128)) (value uint))))) uint))`

Read all transaction outputs in a transaction.  Update the index to point to the first byte after the outputs, if all goes well.
Returns (ok { txouts: (list { ... }), remaining: uint, ctx: { txbuff: (buff 1024), index: uint } }) on success, and updates the index in ctx to point to the start of the tx outputs.
Returns (err ERR-OUT-OF-BOUNDS) if we read past the end of txbuff.
Returns (err ERR-VARSLICE-TOO-LONG) if we find a scriptPubKey that's too long to parse.
Returns (err ERR-TOO-MANY-TXOUTS) if there are more than eight outputs to read.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (read-txouts (ctx { txbuff: (buff 1024), index: uint }))
    (let (
        (parsed-num-txouts (try! (read-varint ctx)))
        (num-txouts (get varint parsed-num-txouts))
        (new-ctx (get ctx parsed-num-txouts))
    )
    (if (> num-txouts u8)
        (err ERR-TOO-MANY-TXOUTS)
        (fold read-next-txout (list true true true true true true true true) (ok { ctx: new-ctx, remaining: num-txouts, txouts: (list ) }))
    ))
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| ctx | (tuple (index uint) (txbuff (buff 1024))) |  |

### parse-tx

[View in file](../contracts/clarity-bitcoin.clar#L591)

`(define-read-only (parse-tx ((tx (buff 1024))) (response (tuple (ins (list 8 (tuple (outpoint (tuple (hash (buff 32)) (index uint))) (scriptSig (buff 256)) (sequence uint)))) (locktime uint) (outs (list 8 (tuple (scriptPubKey (buff 128)) (value uint)))) (version uint)) uint))`

Parse a Bitcoin transaction, with up to 8 inputs and 8 outputs, with scriptSigs of up to 256 bytes each, and with scriptPubKeys up to 128 bytes.
Returns a tuple structured as follows on success:
(ok {
version: uint,                      ;; tx version
ins: (list 8
{
outpoint: {                 ;; pointer to the utxo this input consumes
hash: (buff 32),
index: uint
},
scriptSig: (buff 256),      ;; spending condition script
sequence: uint
}),
outs: (list 8
{
value: uint,                ;; satoshis sent
scriptPubKey: (buff 128)    ;; parse this to get an address
}),
locktime: uint
})
Returns (err ERR-OUT-OF-BOUNDS) if we read past the end of txbuff.
Returns (err ERR-VARSLICE-TOO-LONG) if we find a scriptPubKey or scriptSig that's too long to parse.
Returns (err ERR-TOO-MANY-TXOUTS) if there are more than eight inputs to read.
Returns (err ERR-TOO-MANY-TXINS) if there are more than eight outputs to read.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (parse-tx (tx (buff 1024)))
    (let (
        (ctx { txbuff: tx, index: u0 })
        (parsed-version (try! (read-uint32 ctx)))
        (parsed-txins (try! (read-txins (get ctx parsed-version))))
        (parsed-txouts (try! (read-txouts (get ctx parsed-txins))))
        (parsed-locktime (try! (read-uint32 (get ctx parsed-txouts))))
    )
    (ok {
        version: (get uint32 parsed-version),
        ins: (get txins parsed-txins),
        outs: (get txouts parsed-txouts),
        locktime: (get uint32 parsed-locktime)
    }))
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| tx | (buff 1024) |  |

### parse-block-header

[View in file](../contracts/clarity-bitcoin.clar#L618)

`(define-read-only (parse-block-header ((headerbuff (buff 80))) (response (tuple (merkle-root (buff 32)) (nbits uint) (nonce uint) (parent (buff 32)) (timestamp uint) (version uint)) uint))`

Parse a Bitcoin block header.
Returns a tuple structured as folowed on success:
(ok {
version: uint,                  ;; block version,
parent: (buff 32),              ;; parent block hash,
merkle-root: (buff 32),         ;; merkle root for all this block's transactions
timestamp: uint,                ;; UNIX epoch timestamp of this block, in seconds
nbits: uint,                    ;; compact block difficulty representation
nonce: uint                     ;; PoW solution
})
Returns (err ERR-BAD-HEADER) if the header buffer isn't actually 80 bytes long.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (parse-block-header (headerbuff (buff 80)))
    (let (
        (ctx { txbuff: (unwrap! (as-max-len? headerbuff u1024) (err ERR-BAD-HEADER)), index: u0 })

        ;; none of these should fail, since they're all fixed-length fields whose lengths sum to 80
        (parsed-version (unwrap-panic (read-uint32 ctx)))
        (parsed-parent-hash (unwrap-panic (read-hashslice (get ctx parsed-version))))
        (parsed-merkle-root (unwrap-panic (read-hashslice (get ctx parsed-parent-hash))))
        (parsed-timestamp (unwrap-panic (read-uint32 (get ctx parsed-merkle-root))))
        (parsed-nbits (unwrap-panic (read-uint32 (get ctx parsed-timestamp))))
        (parsed-nonce (unwrap-panic (read-uint32 (get ctx parsed-nbits))))
    )
    (ok {
        version: (get uint32 parsed-version),
        parent: (get hashslice parsed-parent-hash),
        merkle-root: (get hashslice parsed-merkle-root),
        timestamp: (get uint32 parsed-timestamp),
        nbits: (get uint32 parsed-nbits),
        nonce: (get uint32 parsed-nonce)
    }))
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| headerbuff | (buff 80) |  |

### verify-block-header

[View in file](../contracts/clarity-bitcoin.clar#L642)

`(define-read-only (verify-block-header ((headerbuff (buff 80)) (expected-block-height uint)) bool)`

Verify that a block header hashes to a burnchain header hash at a given height.
Returns true if so; false if not.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (verify-block-header (headerbuff (buff 80)) (expected-block-height uint))
    (match (get-block-info? burnchain-header-hash expected-block-height)
        bhh (is-eq bhh (reverse-buff32 (sha256 (sha256 headerbuff))))
        false
    )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| headerbuff | (buff 80) |  |
| expected-block-height | uint |  |

### get-reversed-txid

[View in file](../contracts/clarity-bitcoin.clar#L651)

`(define-read-only (get-reversed-txid ((tx (buff 1024))) (buff 32))`

Get the txid of a transaction, but big-endian.
This is the reverse of what you see on block explorers.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-reversed-txid (tx (buff 1024)))
    (sha256 (sha256 tx)))
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| tx | (buff 1024) |  |

### get-txid

[View in file](../contracts/clarity-bitcoin.clar#L656)

`(define-read-only (get-txid ((tx (buff 1024))) (buff 32))`

Get the txid of a transaction.
This is what you see on block explorers.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (get-txid (tx (buff 1024)))
    (reverse-buff32 (get-reversed-txid tx))
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| tx | (buff 1024) |  |

### is-bit-set

[View in file](../contracts/clarity-bitcoin.clar#L661)

`(define-read-only (is-bit-set ((val uint) (bit uint)) bool)`

Determine if the ith bit in a uint is set to 1

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (is-bit-set (val uint) (bit uint))
    (is-eq (mod (/ val (pow u2 bit)) u2) u1)
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| val | uint |  |
| bit | uint |  |

### inner-merkle-proof-verify

[View in file](../contracts/clarity-bitcoin.clar#L671)

`(define-read-only (inner-merkle-proof-verify ((ctr uint) (state (tuple (cur-hash (buff 32)) (path uint) (proof-hashes (list 12 (buff 32))) (root-hash (buff 32)) (tree-depth uint) (verified bool)))) (tuple (cur-hash (buff 32)) (path uint) (proof-hashes (list 12 (buff 32))) (root-hash (buff 32)) (tree-depth uint) (verified bool)))`

Verify the next step of a Merkle proof.
This hashes cur-hash against the ctr-th hash in proof-hashes, and uses that as the next cur-hash.
The path is a bitfield describing the walk from the txid up to the merkle root:
* if the ith bit is 0, then cur-hash is hashed before the next proof-hash (cur-hash is "left").
* if the ith bit is 1, then the next proof-hash is hashed before cur-hash (cur-hash is "right").
The proof verifies if cur-hash is equal to root-hash, and we're out of proof-hashes to check.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (inner-merkle-proof-verify (ctr uint) (state { path: uint, root-hash: (buff 32), proof-hashes: (list 12 (buff 32)), tree-depth: uint, cur-hash: (buff 32), verified: bool }))
    (if (get verified state)
        state
        (if (>= ctr (get tree-depth state))
            (begin
                ;; (print "ctr exceeds proof length or tree depth")
                ;; (print ctr)
                ;; (print (get tree-depth state))
                ;; (print (len (get proof-hashes state)))
                (merge state { verified: false })
            )
            (let (
                (path (get path state))
                (is-left (is-bit-set path ctr))
                (proof-hashes (get proof-hashes state))
                (cur-hash (get cur-hash state))
                (root-hash (get root-hash state))

                (h1 (if is-left (unwrap-panic (element-at proof-hashes ctr)) cur-hash))
                (h2 (if is-left cur-hash (unwrap-panic (element-at proof-hashes ctr))))
                (next-hash (sha256 (sha256 (concat h1 h2))))
                (is-verified (and (is-eq (+ u1 ctr) (len proof-hashes)) (is-eq next-hash root-hash)))
            )
            (begin
                ;; (print "cur-hash")
                ;; (print cur-hash)
                ;; (print "next-hash")
                ;; (print h1)
                ;; (print h2)
                ;; (print next-hash)
                (merge state { cur-hash: next-hash, verified: is-verified })
            ))
        )
    )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| ctr | uint |  |
| state | (tuple (cur-hash (buff 32)) (path uint) (proof-hashes (list 12 (buff 32))) (root-hash (buff 32)) (tree-depth uint) (verified bool)) |  |

### verify-merkle-proof

[View in file](../contracts/clarity-bitcoin.clar#L717)

`(define-read-only (verify-merkle-proof ((reversed-txid (buff 32)) (merkle-root (buff 32)) (proof (tuple (hashes (list 12 (buff 32))) (tree-depth uint) (tx-index uint)))) (response bool uint))`

Verify a Merkle proof, given the _reversed_ txid of a transaction, the merkle root of its block, and a proof consisting of:
* The index in the block where the transaction can be found (starting from 0),
* The list of hashes that link the txid to the merkle root,
* The depth of the block's merkle tree (required because Bitcoin does not identify merkle tree nodes as being leaves or intermediates).
The _reversed_ txid is required because that's the order (big-endian) processes them in.
The tx-index is required because it tells us the left/right traversals we'd make if we were walking down the tree from root to transaction, 
and is thus used to deduce the order in which to hash the intermediate hashes with one another to link the txid to the merkle root.
Returns (ok true) if the proof is valid.
Returns (ok false) if the proof is invalid.
Returns (err ERR-PROOF-TOO-SHORT) if the proof's hashes aren't long enough to link the txid to the merkle root.

<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (verify-merkle-proof (reversed-txid (buff 32)) (merkle-root (buff 32)) (proof { tx-index: uint, hashes: (list 12 (buff 32)), tree-depth: uint }))
    (if (> (get tree-depth proof) (len (get hashes proof)))
        (err ERR-PROOF-TOO-SHORT)
        (ok
          (get verified
              (fold inner-merkle-proof-verify
                  (list u0 u1 u2 u3 u4 u5 u6 u7 u8 u9 u10 u11)
                  { path: (+ (pow u2 (get tree-depth proof)) (get tx-index proof)), root-hash: merkle-root, proof-hashes: (get hashes proof), cur-hash: reversed-txid, tree-depth: (get tree-depth proof), verified: false }))
        )
    )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| reversed-txid | (buff 32) |  |
| merkle-root | (buff 32) |  |
| proof | (tuple (hashes (list 12 (buff 32))) (tree-depth uint) (tx-index uint)) |  |

### verify-prev-block

[View in file](../contracts/clarity-bitcoin.clar#L759)

`(define-read-only (verify-prev-block ((block (buff 80)) (parent (buff 80))) (response bool uint))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (verify-prev-block (block (buff 80)) (parent (buff 80)))
  (let
    (
      (parent-hash (sha256 (sha256 parent)))
      (parent-reversed (reverse-buff32 parent-hash))
      (parsed (try! (parse-block-header block)))
      (parsed-parent (get parent parsed))
    )
    (asserts! (is-eq parsed-parent parent-reversed) (err ERR-INVALID-PARENT))
    (ok true)
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| block | (buff 80) |  |
| parent | (buff 80) |  |

### verify-prev-blocks

[View in file](../contracts/clarity-bitcoin.clar#L772)

`(define-read-only (verify-prev-blocks ((block (buff 80)) (prev-blocks (list 10 (buff 80)))) (response (buff 80) uint))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (verify-prev-blocks (block (buff 80)) (prev-blocks (list 10 (buff 80))))
  (let
    (
      (iterator (ok block))
      (fold-resp (fold verify-prev-blocks-fold prev-blocks iterator))
      (last-block (try! fold-resp))
    )
    (ok last-block)
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| block | (buff 80) |  |
| prev-blocks | (list 10 (buff 80)) |  |

### verify-prev-blocks-fold

[View in file](../contracts/clarity-bitcoin.clar#L783)

`(define-read-only (verify-prev-blocks-fold ((parent (buff 80)) (next-resp (response (buff 80) uint))) (response (buff 80) uint))`



<details>
  <summary>Source code:</summary>

```clarity
(define-read-only (verify-prev-blocks-fold 
    (parent (buff 80))
    (next-resp (response (buff 80) uint))
  )
  (let
    (
      (next (try! next-resp))
      (is-valid (try! (verify-prev-block next parent)))
    )
    (ok parent)
  )
)
```
</details>


**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| parent | (buff 80) |  |
| next-resp | (response (buff 80) uint) |  |
