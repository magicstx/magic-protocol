import { ClarityAbi } from '@clarigen/core';

// prettier-ignore
export const BridgeInterface: ClarityAbi = {
  "functions": [
    {
      "access": "private",
      "args": [
        {
          "name": "b",
          "type": {
            "buffer": {
              "length": 32
            }
          }
        },
        {
          "name": "result",
          "type": {
            "buffer": {
              "length": 192
            }
          }
        }
      ],
      "name": "concat-buffs-fold",
      "outputs": {
        "type": {
          "buffer": {
            "length": 192
          }
        }
      }
    },
    {
      "access": "private",
      "args": [
        {
          "name": "amount",
          "type": "uint128"
        },
        {
          "name": "sender",
          "type": "principal"
        },
        {
          "name": "recipient",
          "type": "principal"
        }
      ],
      "name": "transfer",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "bool"
          }
        }
      }
    },
    {
      "access": "private",
      "args": [
        {
          "name": "user",
          "type": "principal"
        },
        {
          "name": "amount",
          "type": "uint128"
        }
      ],
      "name": "update-user-inbound-volume",
      "outputs": {
        "type": "bool"
      }
    },
    {
      "access": "private",
      "args": [
        {
          "name": "user",
          "type": "principal"
        },
        {
          "name": "amount",
          "type": "uint128"
        }
      ],
      "name": "update-user-outbound-volume",
      "outputs": {
        "type": "bool"
      }
    },
    {
      "access": "public",
      "args": [
        {
          "name": "amount",
          "type": "uint128"
        }
      ],
      "name": "add-funds",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "uint128"
          }
        }
      }
    },
    {
      "access": "public",
      "args": [
        {
          "name": "block",
          "type": {
            "tuple": [
              {
                "name": "header",
                "type": {
                  "buffer": {
                    "length": 80
                  }
                }
              },
              {
                "name": "height",
                "type": "uint128"
              }
            ]
          }
        },
        {
          "name": "tx",
          "type": {
            "buffer": {
              "length": 1024
            }
          }
        },
        {
          "name": "proof",
          "type": {
            "tuple": [
              {
                "name": "hashes",
                "type": {
                  "list": {
                    "length": 12,
                    "type": {
                      "buffer": {
                        "length": 32
                      }
                    }
                  }
                }
              },
              {
                "name": "tree-depth",
                "type": "uint128"
              },
              {
                "name": "tx-index",
                "type": "uint128"
              }
            ]
          }
        },
        {
          "name": "output-index",
          "type": "uint128"
        },
        {
          "name": "sender",
          "type": {
            "buffer": {
              "length": 33
            }
          }
        },
        {
          "name": "recipient",
          "type": {
            "buffer": {
              "length": 33
            }
          }
        },
        {
          "name": "expiration-buff",
          "type": {
            "buffer": {
              "length": 4
            }
          }
        },
        {
          "name": "hash",
          "type": {
            "buffer": {
              "length": 32
            }
          }
        },
        {
          "name": "swapper-buff",
          "type": {
            "buffer": {
              "length": 4
            }
          }
        },
        {
          "name": "operator-id",
          "type": "uint128"
        }
      ],
      "name": "escrow-swap",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": {
              "tuple": [
                {
                  "name": "csv",
                  "type": "uint128"
                },
                {
                  "name": "output-index",
                  "type": "uint128"
                },
                {
                  "name": "redeem-script",
                  "type": {
                    "buffer": {
                      "length": 120
                    }
                  }
                },
                {
                  "name": "sats",
                  "type": "uint128"
                },
                {
                  "name": "sender-public-key",
                  "type": {
                    "buffer": {
                      "length": 33
                    }
                  }
                }
              ]
            }
          }
        }
      }
    },
    {
      "access": "public",
      "args": [
        {
          "name": "block",
          "type": {
            "tuple": [
              {
                "name": "header",
                "type": {
                  "buffer": {
                    "length": 80
                  }
                }
              },
              {
                "name": "height",
                "type": "uint128"
              }
            ]
          }
        },
        {
          "name": "tx",
          "type": {
            "buffer": {
              "length": 1024
            }
          }
        },
        {
          "name": "proof",
          "type": {
            "tuple": [
              {
                "name": "hashes",
                "type": {
                  "list": {
                    "length": 12,
                    "type": {
                      "buffer": {
                        "length": 32
                      }
                    }
                  }
                }
              },
              {
                "name": "tree-depth",
                "type": "uint128"
              },
              {
                "name": "tx-index",
                "type": "uint128"
              }
            ]
          }
        },
        {
          "name": "output-index",
          "type": "uint128"
        },
        {
          "name": "swap-id",
          "type": "uint128"
        }
      ],
      "name": "finalize-outbound-swap",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "bool"
          }
        }
      }
    },
    {
      "access": "public",
      "args": [
        {
          "name": "txid",
          "type": {
            "buffer": {
              "length": 32
            }
          }
        },
        {
          "name": "preimage",
          "type": {
            "buffer": {
              "length": 128
            }
          }
        }
      ],
      "name": "finalize-swap",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "bool"
          }
        }
      }
    },
    {
      "access": "public",
      "args": [],
      "name": "initialize-swapper",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "uint128"
          }
        }
      }
    },
    {
      "access": "public",
      "args": [
        {
          "name": "xbtc",
          "type": "uint128"
        },
        {
          "name": "btc-version",
          "type": {
            "buffer": {
              "length": 1
            }
          }
        },
        {
          "name": "btc-hash",
          "type": {
            "buffer": {
              "length": 20
            }
          }
        },
        {
          "name": "operator-id",
          "type": "uint128"
        }
      ],
      "name": "initiate-outbound-swap",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "uint128"
          }
        }
      }
    },
    {
      "access": "public",
      "args": [
        {
          "name": "public-key",
          "type": {
            "buffer": {
              "length": 33
            }
          }
        },
        {
          "name": "inbound-fee",
          "type": {
            "optional": "int128"
          }
        },
        {
          "name": "outbound-fee",
          "type": {
            "optional": "int128"
          }
        },
        {
          "name": "outbound-base-fee",
          "type": "int128"
        },
        {
          "name": "inbound-base-fee",
          "type": "int128"
        },
        {
          "name": "name",
          "type": {
            "string-ascii": {
              "length": 18
            }
          }
        },
        {
          "name": "funds",
          "type": "uint128"
        }
      ],
      "name": "register-operator",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "uint128"
          }
        }
      }
    },
    {
      "access": "public",
      "args": [
        {
          "name": "amount",
          "type": "uint128"
        }
      ],
      "name": "remove-funds",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "uint128"
          }
        }
      }
    },
    {
      "access": "public",
      "args": [
        {
          "name": "public-key",
          "type": {
            "buffer": {
              "length": 33
            }
          }
        },
        {
          "name": "inbound-fee",
          "type": {
            "optional": "int128"
          }
        },
        {
          "name": "outbound-fee",
          "type": {
            "optional": "int128"
          }
        },
        {
          "name": "outbound-base-fee",
          "type": "int128"
        },
        {
          "name": "inbound-base-fee",
          "type": "int128"
        },
        {
          "name": "name",
          "type": {
            "string-ascii": {
              "length": 18
            }
          }
        }
      ],
      "name": "update-operator",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": {
              "tuple": [
                {
                  "name": "controller",
                  "type": "principal"
                },
                {
                  "name": "inbound-base-fee",
                  "type": "int128"
                },
                {
                  "name": "inbound-fee",
                  "type": {
                    "optional": "int128"
                  }
                },
                {
                  "name": "name",
                  "type": {
                    "string-ascii": {
                      "length": 18
                    }
                  }
                },
                {
                  "name": "outbound-base-fee",
                  "type": "int128"
                },
                {
                  "name": "outbound-fee",
                  "type": {
                    "optional": "int128"
                  }
                },
                {
                  "name": "public-key",
                  "type": {
                    "buffer": {
                      "length": 33
                    }
                  }
                }
              ]
            }
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "byte",
          "type": {
            "buffer": {
              "length": 1
            }
          }
        }
      ],
      "name": "buff-to-u8",
      "outputs": {
        "type": "uint128"
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "bytes",
          "type": {
            "buffer": {
              "length": 4
            }
          }
        }
      ],
      "name": "bytes-len",
      "outputs": {
        "type": {
          "buffer": {
            "length": 1
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "buffs",
          "type": {
            "list": {
              "length": 6,
              "type": {
                "buffer": {
                  "length": 32
                }
              }
            }
          }
        }
      ],
      "name": "concat-buffs",
      "outputs": {
        "type": {
          "buffer": {
            "length": 192
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "sender",
          "type": {
            "buffer": {
              "length": 33
            }
          }
        },
        {
          "name": "recipient",
          "type": {
            "buffer": {
              "length": 33
            }
          }
        },
        {
          "name": "expiration",
          "type": {
            "buffer": {
              "length": 4
            }
          }
        },
        {
          "name": "hash",
          "type": {
            "buffer": {
              "length": 32
            }
          }
        },
        {
          "name": "swapper",
          "type": {
            "buffer": {
              "length": 4
            }
          }
        }
      ],
      "name": "generate-htlc-script",
      "outputs": {
        "type": {
          "buffer": {
            "length": 120
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "sender",
          "type": {
            "buffer": {
              "length": 33
            }
          }
        },
        {
          "name": "recipient",
          "type": {
            "buffer": {
              "length": 33
            }
          }
        },
        {
          "name": "expiration",
          "type": {
            "buffer": {
              "length": 4
            }
          }
        },
        {
          "name": "hash",
          "type": {
            "buffer": {
              "length": 32
            }
          }
        },
        {
          "name": "swapper",
          "type": {
            "buffer": {
              "length": 4
            }
          }
        }
      ],
      "name": "generate-htlc-script-hash",
      "outputs": {
        "type": {
          "buffer": {
            "length": 23
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "version",
          "type": {
            "buffer": {
              "length": 1
            }
          }
        },
        {
          "name": "hash",
          "type": {
            "buffer": {
              "length": 20
            }
          }
        }
      ],
      "name": "generate-output",
      "outputs": {
        "type": {
          "buffer": {
            "length": 25
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "hash",
          "type": {
            "buffer": {
              "length": 20
            }
          }
        }
      ],
      "name": "generate-p2pkh-output",
      "outputs": {
        "type": {
          "buffer": {
            "length": 25
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "hash",
          "type": {
            "buffer": {
              "length": 20
            }
          }
        }
      ],
      "name": "generate-p2sh-output",
      "outputs": {
        "type": {
          "buffer": {
            "length": 23
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "script",
          "type": {
            "buffer": {
              "length": 120
            }
          }
        }
      ],
      "name": "generate-script-hash",
      "outputs": {
        "type": {
          "buffer": {
            "length": 23
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "amount",
          "type": "uint128"
        },
        {
          "name": "fee-rate",
          "type": "int128"
        }
      ],
      "name": "get-amount-with-fee-rate",
      "outputs": {
        "type": "int128"
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "txid",
          "type": {
            "buffer": {
              "length": 32
            }
          }
        }
      ],
      "name": "get-completed-outbound-swap-by-txid",
      "outputs": {
        "type": {
          "optional": "uint128"
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "id",
          "type": "uint128"
        }
      ],
      "name": "get-completed-outbound-swap-txid",
      "outputs": {
        "type": {
          "optional": {
            "buffer": {
              "length": 32
            }
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "id",
          "type": "uint128"
        }
      ],
      "name": "get-escrow",
      "outputs": {
        "type": {
          "optional": "uint128"
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "txid",
          "type": {
            "buffer": {
              "length": 32
            }
          }
        }
      ],
      "name": "get-full-inbound",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": {
              "tuple": [
                {
                  "name": "csv",
                  "type": "uint128"
                },
                {
                  "name": "expiration",
                  "type": "uint128"
                },
                {
                  "name": "hash",
                  "type": {
                    "buffer": {
                      "length": 32
                    }
                  }
                },
                {
                  "name": "operator",
                  "type": "uint128"
                },
                {
                  "name": "output-index",
                  "type": "uint128"
                },
                {
                  "name": "redeem-script",
                  "type": {
                    "buffer": {
                      "length": 120
                    }
                  }
                },
                {
                  "name": "sats",
                  "type": "uint128"
                },
                {
                  "name": "sender-public-key",
                  "type": {
                    "buffer": {
                      "length": 33
                    }
                  }
                },
                {
                  "name": "swapper",
                  "type": "uint128"
                },
                {
                  "name": "xbtc",
                  "type": "uint128"
                }
              ]
            }
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "id",
          "type": "uint128"
        }
      ],
      "name": "get-full-operator",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": {
              "tuple": [
                {
                  "name": "controller",
                  "type": "principal"
                },
                {
                  "name": "escrow",
                  "type": "uint128"
                },
                {
                  "name": "funds",
                  "type": "uint128"
                },
                {
                  "name": "inbound-base-fee",
                  "type": "int128"
                },
                {
                  "name": "inbound-fee",
                  "type": {
                    "optional": "int128"
                  }
                },
                {
                  "name": "name",
                  "type": {
                    "string-ascii": {
                      "length": 18
                    }
                  }
                },
                {
                  "name": "outbound-base-fee",
                  "type": "int128"
                },
                {
                  "name": "outbound-fee",
                  "type": {
                    "optional": "int128"
                  }
                },
                {
                  "name": "public-key",
                  "type": {
                    "buffer": {
                      "length": 33
                    }
                  }
                }
              ]
            }
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "id",
          "type": "uint128"
        }
      ],
      "name": "get-funds",
      "outputs": {
        "type": "uint128"
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "txid",
          "type": {
            "buffer": {
              "length": 32
            }
          }
        }
      ],
      "name": "get-inbound-meta",
      "outputs": {
        "type": {
          "optional": {
            "tuple": [
              {
                "name": "csv",
                "type": "uint128"
              },
              {
                "name": "output-index",
                "type": "uint128"
              },
              {
                "name": "redeem-script",
                "type": {
                  "buffer": {
                    "length": 120
                  }
                }
              },
              {
                "name": "sats",
                "type": "uint128"
              },
              {
                "name": "sender-public-key",
                "type": {
                  "buffer": {
                    "length": 33
                  }
                }
              }
            ]
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "txid",
          "type": {
            "buffer": {
              "length": 32
            }
          }
        }
      ],
      "name": "get-inbound-swap",
      "outputs": {
        "type": {
          "optional": {
            "tuple": [
              {
                "name": "expiration",
                "type": "uint128"
              },
              {
                "name": "hash",
                "type": {
                  "buffer": {
                    "length": 32
                  }
                }
              },
              {
                "name": "operator",
                "type": "uint128"
              },
              {
                "name": "swapper",
                "type": "uint128"
              },
              {
                "name": "xbtc",
                "type": "uint128"
              }
            ]
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [],
      "name": "get-next-operator-id",
      "outputs": {
        "type": "uint128"
      }
    },
    {
      "access": "read_only",
      "args": [],
      "name": "get-next-outbound-id",
      "outputs": {
        "type": "uint128"
      }
    },
    {
      "access": "read_only",
      "args": [],
      "name": "get-next-swapper-id",
      "outputs": {
        "type": "uint128"
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "id",
          "type": "uint128"
        }
      ],
      "name": "get-operator",
      "outputs": {
        "type": {
          "optional": {
            "tuple": [
              {
                "name": "controller",
                "type": "principal"
              },
              {
                "name": "inbound-base-fee",
                "type": "int128"
              },
              {
                "name": "inbound-fee",
                "type": {
                  "optional": "int128"
                }
              },
              {
                "name": "name",
                "type": {
                  "string-ascii": {
                    "length": 18
                  }
                }
              },
              {
                "name": "outbound-base-fee",
                "type": "int128"
              },
              {
                "name": "outbound-fee",
                "type": {
                  "optional": "int128"
                }
              },
              {
                "name": "public-key",
                "type": {
                  "buffer": {
                    "length": 33
                  }
                }
              }
            ]
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "name",
          "type": {
            "string-ascii": {
              "length": 18
            }
          }
        }
      ],
      "name": "get-operator-by-name",
      "outputs": {
        "type": {
          "optional": "uint128"
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "controller",
          "type": "principal"
        }
      ],
      "name": "get-operator-id-by-controller",
      "outputs": {
        "type": {
          "optional": "uint128"
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "public-key",
          "type": {
            "buffer": {
              "length": 33
            }
          }
        }
      ],
      "name": "get-operator-id-by-public-key",
      "outputs": {
        "type": {
          "optional": "uint128"
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "id",
          "type": "uint128"
        }
      ],
      "name": "get-outbound-swap",
      "outputs": {
        "type": {
          "optional": {
            "tuple": [
              {
                "name": "created-at",
                "type": "uint128"
              },
              {
                "name": "hash",
                "type": {
                  "buffer": {
                    "length": 20
                  }
                }
              },
              {
                "name": "operator",
                "type": "uint128"
              },
              {
                "name": "sats",
                "type": "uint128"
              },
              {
                "name": "swapper",
                "type": "principal"
              },
              {
                "name": "version",
                "type": {
                  "buffer": {
                    "length": 1
                  }
                }
              },
              {
                "name": "xbtc",
                "type": "uint128"
              }
            ]
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "txid",
          "type": {
            "buffer": {
              "length": 32
            }
          }
        }
      ],
      "name": "get-preimage",
      "outputs": {
        "type": {
          "optional": {
            "buffer": {
              "length": 128
            }
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "amount",
          "type": "uint128"
        },
        {
          "name": "fee-rate",
          "type": "int128"
        },
        {
          "name": "base-fee",
          "type": "int128"
        }
      ],
      "name": "get-swap-amount",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "uint128"
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "swapper",
          "type": "principal"
        }
      ],
      "name": "get-swapper-id",
      "outputs": {
        "type": {
          "optional": "uint128"
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "id",
          "type": "uint128"
        }
      ],
      "name": "get-swapper-principal",
      "outputs": {
        "type": {
          "optional": "principal"
        }
      }
    },
    {
      "access": "read_only",
      "args": [],
      "name": "get-total-inbound-volume",
      "outputs": {
        "type": "uint128"
      }
    },
    {
      "access": "read_only",
      "args": [],
      "name": "get-total-outbound-volume",
      "outputs": {
        "type": "uint128"
      }
    },
    {
      "access": "read_only",
      "args": [],
      "name": "get-total-volume",
      "outputs": {
        "type": "uint128"
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "user",
          "type": "principal"
        }
      ],
      "name": "get-user-inbound-volume",
      "outputs": {
        "type": "uint128"
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "user",
          "type": "principal"
        }
      ],
      "name": "get-user-outbound-volume",
      "outputs": {
        "type": "uint128"
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "user",
          "type": "principal"
        }
      ],
      "name": "get-user-total-volume",
      "outputs": {
        "type": "uint128"
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "num",
          "type": {
            "buffer": {
              "length": 4
            }
          }
        },
        {
          "name": "length",
          "type": "uint128"
        }
      ],
      "name": "read-uint32",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "uint128"
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "version",
          "type": {
            "buffer": {
              "length": 1
            }
          }
        },
        {
          "name": "hash",
          "type": {
            "buffer": {
              "length": 20
            }
          }
        }
      ],
      "name": "validate-btc-addr",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "bool"
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "expiration",
          "type": "uint128"
        },
        {
          "name": "mined-height",
          "type": "uint128"
        }
      ],
      "name": "validate-expiration",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "bool"
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "fee-opt",
          "type": {
            "optional": "int128"
          }
        }
      ],
      "name": "validate-fee",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "bool"
          }
        }
      }
    }
  ],
  "fungible_tokens": [],
  "maps": [
    {
      "key": {
        "buffer": {
          "length": 32
        }
      },
      "name": "completed-outbound-swap-txids",
      "value": "uint128"
    },
    {
      "key": "uint128",
      "name": "completed-outbound-swaps",
      "value": {
        "buffer": {
          "length": 32
        }
      }
    },
    {
      "key": {
        "buffer": {
          "length": 32
        }
      },
      "name": "inbound-meta",
      "value": {
        "tuple": [
          {
            "name": "csv",
            "type": "uint128"
          },
          {
            "name": "output-index",
            "type": "uint128"
          },
          {
            "name": "redeem-script",
            "type": {
              "buffer": {
                "length": 120
              }
            }
          },
          {
            "name": "sats",
            "type": "uint128"
          },
          {
            "name": "sender-public-key",
            "type": {
              "buffer": {
                "length": 33
              }
            }
          }
        ]
      }
    },
    {
      "key": {
        "buffer": {
          "length": 32
        }
      },
      "name": "inbound-preimages",
      "value": {
        "buffer": {
          "length": 128
        }
      }
    },
    {
      "key": {
        "buffer": {
          "length": 32
        }
      },
      "name": "inbound-swaps",
      "value": {
        "tuple": [
          {
            "name": "expiration",
            "type": "uint128"
          },
          {
            "name": "hash",
            "type": {
              "buffer": {
                "length": 32
              }
            }
          },
          {
            "name": "operator",
            "type": "uint128"
          },
          {
            "name": "swapper",
            "type": "uint128"
          },
          {
            "name": "xbtc",
            "type": "uint128"
          }
        ]
      }
    },
    {
      "key": "principal",
      "name": "operator-by-controller",
      "value": "uint128"
    },
    {
      "key": "uint128",
      "name": "operator-by-id",
      "value": {
        "tuple": [
          {
            "name": "controller",
            "type": "principal"
          },
          {
            "name": "inbound-base-fee",
            "type": "int128"
          },
          {
            "name": "inbound-fee",
            "type": {
              "optional": "int128"
            }
          },
          {
            "name": "name",
            "type": {
              "string-ascii": {
                "length": 18
              }
            }
          },
          {
            "name": "outbound-base-fee",
            "type": "int128"
          },
          {
            "name": "outbound-fee",
            "type": {
              "optional": "int128"
            }
          },
          {
            "name": "public-key",
            "type": {
              "buffer": {
                "length": 33
              }
            }
          }
        ]
      }
    },
    {
      "key": {
        "string-ascii": {
          "length": 18
        }
      },
      "name": "operator-by-name",
      "value": "uint128"
    },
    {
      "key": {
        "buffer": {
          "length": 33
        }
      },
      "name": "operator-by-public-key",
      "value": "uint128"
    },
    {
      "key": "uint128",
      "name": "operator-escrow",
      "value": "uint128"
    },
    {
      "key": "uint128",
      "name": "operator-funds",
      "value": "uint128"
    },
    {
      "key": "uint128",
      "name": "outbound-swaps",
      "value": {
        "tuple": [
          {
            "name": "created-at",
            "type": "uint128"
          },
          {
            "name": "hash",
            "type": {
              "buffer": {
                "length": 20
              }
            }
          },
          {
            "name": "operator",
            "type": "uint128"
          },
          {
            "name": "sats",
            "type": "uint128"
          },
          {
            "name": "swapper",
            "type": "principal"
          },
          {
            "name": "version",
            "type": {
              "buffer": {
                "length": 1
              }
            }
          },
          {
            "name": "xbtc",
            "type": "uint128"
          }
        ]
      }
    },
    {
      "key": "uint128",
      "name": "swapper-by-id",
      "value": "principal"
    },
    {
      "key": "principal",
      "name": "swapper-by-principal",
      "value": "uint128"
    },
    {
      "key": "principal",
      "name": "user-inbound-volume-map",
      "value": "uint128"
    },
    {
      "key": "principal",
      "name": "user-outbound-volume-map",
      "value": "uint128"
    }
  ],
  "non_fungible_tokens": [],
  "variables": [
    {
      "access": "constant",
      "name": "BUFF_TO_BYTE",
      "type": {
        "list": {
          "length": 256,
          "type": {
            "buffer": {
              "length": 1
            }
          }
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_ADD_FUNDS",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_ALREADY_FINALIZED",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_ESCROW_EXPIRED",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_FEE_INVALID",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_INSUFFICIENT_AMOUNT",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_INSUFFICIENT_FUNDS",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_INVALID_BTC_ADDR",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_INVALID_ESCROW",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_INVALID_EXPIRATION",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_INVALID_HASH",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_INVALID_OPERATOR",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_INVALID_OUTPUT",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_INVALID_PREIMAGE",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_INVALID_TX",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_OPERATOR_EXISTS",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_OPERATOR_NOT_FOUND",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_PANIC",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_READ_UINT",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_SWAPPER_EXISTS",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_SWAPPER_NOT_FOUND",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_SWAP_NOT_FOUND",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_TRANSFER",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_TXID_USED",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_TX_NOT_MINED",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ERR_UNAUTHORIZED",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "constant",
      "name": "ESCROW_EXPIRATION",
      "type": "uint128"
    },
    {
      "access": "constant",
      "name": "MIN_EXPIRATION",
      "type": "uint128"
    },
    {
      "access": "constant",
      "name": "OUTBOUND_EXPIRATION",
      "type": "uint128"
    },
    {
      "access": "constant",
      "name": "P2PKH_VERSION",
      "type": {
        "buffer": {
          "length": 1
        }
      }
    },
    {
      "access": "constant",
      "name": "P2SH_VERSION",
      "type": {
        "buffer": {
          "length": 1
        }
      }
    },
    {
      "access": "variable",
      "name": "next-operator-id",
      "type": "uint128"
    },
    {
      "access": "variable",
      "name": "next-outbound-id",
      "type": "uint128"
    },
    {
      "access": "variable",
      "name": "next-swapper-id",
      "type": "uint128"
    },
    {
      "access": "variable",
      "name": "total-inbound-volume-var",
      "type": "uint128"
    },
    {
      "access": "variable",
      "name": "total-outbound-volume-var",
      "type": "uint128"
    }
  ]
};
