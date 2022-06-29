import { ClarityAbi } from '@clarigen/core';

// prettier-ignore
export const TestUtilsInterface: ClarityAbi = {
  "functions": [
    {
      "name": "set-burn-header",
      "access": "public",
      "args": [
        {
          "name": "height",
          "type": "uint128"
        },
        {
          "name": "header",
          "type": {
            "buffer": {
              "length": 80
            }
          }
        }
      ],
      "outputs": {
        "type": {
          "response": {
            "ok": "bool",
            "error": "none"
          }
        }
      }
    },
    {
      "name": "set-mined",
      "access": "public",
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
      "outputs": {
        "type": {
          "response": {
            "ok": "bool",
            "error": "none"
          }
        }
      }
    },
    {
      "name": "burn-block-header",
      "access": "read_only",
      "args": [
        {
          "name": "height",
          "type": "uint128"
        }
      ],
      "outputs": {
        "type": {
          "optional": {
            "buffer": {
              "length": 80
            }
          }
        }
      }
    },
    {
      "name": "was-mined",
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
      "outputs": {
        "type": {
          "optional": "bool"
        }
      }
    }
  ],
  "variables": [],
  "maps": [
    {
      "name": "burn-block-headers",
      "key": "uint128",
      "value": {
        "buffer": {
          "length": 80
        }
      }
    },
    {
      "name": "mined-txs",
      "key": {
        "buffer": {
          "length": 32
        }
      },
      "value": "bool"
    }
  ],
  "fungible_tokens": [],
  "non_fungible_tokens": []
};
