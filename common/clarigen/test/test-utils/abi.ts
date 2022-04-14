import { ClarityAbi } from '@clarigen/core';

// prettier-ignore
export const TestUtilsInterface: ClarityAbi = {
  "functions": [
    {
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
      "name": "set-burn-header",
      "outputs": {
        "type": {
          "response": {
            "error": "none",
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
        }
      ],
      "name": "set-mined",
      "outputs": {
        "type": {
          "response": {
            "error": "none",
            "ok": "bool"
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "height",
          "type": "uint128"
        }
      ],
      "name": "burn-block-header",
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
      "name": "was-mined",
      "outputs": {
        "type": {
          "optional": "bool"
        }
      }
    }
  ],
  "fungible_tokens": [],
  "maps": [
    {
      "key": "uint128",
      "name": "burn-block-headers",
      "value": {
        "buffer": {
          "length": 80
        }
      }
    },
    {
      "key": {
        "buffer": {
          "length": 32
        }
      },
      "name": "mined-txs",
      "value": "bool"
    }
  ],
  "non_fungible_tokens": [],
  "variables": []
};
