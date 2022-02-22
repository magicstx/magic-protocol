import { ClarityAbi } from '@clarigen/core';

// prettier-ignore
export const XbtcInterface: ClarityAbi = {
  "functions": [
    {
      "access": "public",
      "args": [],
      "name": "get-token-uri",
      "outputs": {
        "type": {
          "response": {
            "error": "none",
            "ok": {
              "optional": {
                "string-utf8": {
                  "length": 19
                }
              }
            }
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
        },
        {
          "name": "sender",
          "type": "principal"
        },
        {
          "name": "recipient",
          "type": "principal"
        },
        {
          "name": "memo",
          "type": {
            "optional": {
              "buffer": {
                "length": 34
              }
            }
          }
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
      "access": "read_only",
      "args": [
        {
          "name": "owner",
          "type": "principal"
        }
      ],
      "name": "get-balance",
      "outputs": {
        "type": {
          "response": {
            "error": "none",
            "ok": "uint128"
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [],
      "name": "get-decimals",
      "outputs": {
        "type": {
          "response": {
            "error": "none",
            "ok": "uint128"
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [],
      "name": "get-name",
      "outputs": {
        "type": {
          "response": {
            "error": "none",
            "ok": {
              "string-ascii": {
                "length": 4
              }
            }
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [],
      "name": "get-symbol",
      "outputs": {
        "type": {
          "response": {
            "error": "none",
            "ok": {
              "string-ascii": {
                "length": 4
              }
            }
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [],
      "name": "get-total-supply",
      "outputs": {
        "type": {
          "response": {
            "error": "none",
            "ok": "uint128"
          }
        }
      }
    }
  ],
  "fungible_tokens": [
    {
      "name": "xbtc"
    }
  ],
  "maps": [],
  "non_fungible_tokens": [],
  "variables": []
};
