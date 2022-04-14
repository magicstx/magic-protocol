import { ClarityAbi } from '@clarigen/core';

// prettier-ignore
export const SupplierWrapperInterface: ClarityAbi = {
  "functions": [
    {
      "access": "private",
      "args": [
        {
          "name": "amount",
          "type": "uint128"
        }
      ],
      "name": "withdraw-funds",
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
                  "name": "supplier",
                  "type": "uint128"
                },
                {
                  "name": "swapper",
                  "type": "uint128"
                },
                {
                  "name": "swapper-principal",
                  "type": "principal"
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
      "name": "register-supplier",
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
          "name": "new-owner",
          "type": "principal"
        }
      ],
      "name": "transfer-owner",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": "principal"
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
      "name": "update-supplier",
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
      "args": [],
      "name": "get-owner",
      "outputs": {
        "type": "principal"
      }
    },
    {
      "access": "read_only",
      "args": [],
      "name": "validate-owner",
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
  "maps": [],
  "non_fungible_tokens": [],
  "variables": [
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
      "name": "ERR_UNAUTHORIZED",
      "type": {
        "response": {
          "error": "uint128",
          "ok": "none"
        }
      }
    },
    {
      "access": "variable",
      "name": "owner",
      "type": "principal"
    }
  ]
};
