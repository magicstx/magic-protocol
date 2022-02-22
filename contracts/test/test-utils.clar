;; (define-public (mined-txs))
(define-map mined-txs (buff 32) bool)

(define-public (set-mined (txid (buff 32)))
  (ok (map-insert mined-txs txid true))
)

(define-read-only (was-mined (txid (buff 32)))
  (map-get? mined-txs txid)
)