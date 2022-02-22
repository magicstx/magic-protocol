import { ClarityAbi } from '@clarigen/core';

// prettier-ignore
export const TestUtilsInterface: ClarityAbi = {
  "functions": [
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
