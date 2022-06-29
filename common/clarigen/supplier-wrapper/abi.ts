import { ClarityAbi } from '@clarigen/core';

// prettier-ignore
export const SupplierWrapperInterface: ClarityAbi = {
  "functions": [
    {
      "name": "withdraw-funds",
      "access": "private",
      "args": [
        {
          "name": "amount",
          "type": "uint128"
        }
      ],
      "outputs": {
        "type": {
          "response": {
            "ok": "uint128",
            "error": "uint128"
          }
        }
      }
    },
    {
      "name": "add-funds",
      "access": "public",
      "args": [
        {
          "name": "amount",
          "type": "uint128"
        }
      ],
      "outputs": {
        "type": {
          "response": {
            "ok": "uint128",
            "error": "uint128"
          }
        }
      }
    },
    {
      "name": "finalize-swap",
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
      "outputs": {
        "type": {
          "response": {
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
            },
            "error": "uint128"
          }
        }
      }
    },
    {
      "name": "register-supplier",
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
          "name": "funds",
          "type": "uint128"
        }
      ],
      "outputs": {
        "type": {
          "response": {
            "ok": "uint128",
            "error": "uint128"
          }
        }
      }
    },
    {
      "name": "remove-funds",
      "access": "public",
      "args": [
        {
          "name": "amount",
          "type": "uint128"
        }
      ],
      "outputs": {
        "type": {
          "response": {
            "ok": "uint128",
            "error": "uint128"
          }
        }
      }
    },
    {
      "name": "transfer-owner",
      "access": "public",
      "args": [
        {
          "name": "new-owner",
          "type": "principal"
        }
      ],
      "outputs": {
        "type": {
          "response": {
            "ok": "principal",
            "error": "uint128"
          }
        }
      }
    },
    {
      "name": "update-supplier",
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
        }
      ],
      "outputs": {
        "type": {
          "response": {
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
            },
            "error": "uint128"
          }
        }
      }
    },
    {
      "name": "get-owner",
      "access": "read_only",
      "args": [],
      "outputs": {
        "type": "principal"
      }
    },
    {
      "name": "validate-owner",
      "access": "read_only",
      "args": [],
      "outputs": {
        "type": {
          "response": {
            "ok": "bool",
            "error": "uint128"
          }
        }
      }
    }
  ],
  "variables": [
    {
      "name": "ERR_PANIC",
      "type": {
        "response": {
          "ok": "none",
          "error": "uint128"
        }
      },
      "access": "constant"
    },
    {
      "name": "ERR_UNAUTHORIZED",
      "type": {
        "response": {
          "ok": "none",
          "error": "uint128"
        }
      },
      "access": "constant"
    },
    {
      "name": "owner",
      "type": "principal",
      "access": "variable"
    }
  ],
  "maps": [],
  "fungible_tokens": [],
  "non_fungible_tokens": []
};
