(impl-trait .ft-trait.sip-010-trait)

(define-fungible-token xbtc)

;; get the token balance of owner
(define-read-only (get-balance (owner principal))
  (begin
    (ok (ft-get-balance xbtc owner))))

;; returns the total number of tokens
(define-read-only (get-total-supply)
  (ok (ft-get-supply xbtc)))

;; returns the token name
(define-read-only (get-name)
  (ok "xBTC"))

;; the symbol or "ticker" for this token
(define-read-only (get-symbol)
  (ok "xBTC"))

;; the number of decimals used
(define-read-only (get-decimals)
  (ok u8))

;; Transfers tokens to a recipient
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (if (is-eq tx-sender sender)
    (begin
      (try! (ft-transfer? xbtc amount sender recipient))
      ;; (print memo)
      (ok true)
    )
    (err u4)))

(define-public (get-token-uri)
  (ok (some u"https://example.com")))

;; Mint this token to a few people when deployed
(ft-mint? xbtc u100000000000000 'ST1H49Q7KM36Z82MHHWCQ92YANMGPPKSHEC0DW9RW)
(ft-mint? xbtc u100000000000000 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5)
(ft-mint? xbtc u100000000000000 tx-sender)