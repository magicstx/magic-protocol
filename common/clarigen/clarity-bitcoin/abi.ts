import { ClarityAbi } from '@clarigen/core';

// prettier-ignore
export const ClarityBitcoinInterface: ClarityAbi = {
  "functions": [
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
          "name": "tx",
          "type": {
            "buffer": {
              "length": 1024
            }
          }
        }
      ],
      "name": "get-reversed-txid",
      "outputs": {
        "type": {
          "buffer": {
            "length": 32
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "tx",
          "type": {
            "buffer": {
              "length": 1024
            }
          }
        }
      ],
      "name": "get-txid",
      "outputs": {
        "type": {
          "buffer": {
            "length": 32
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "target-index",
          "type": "uint128"
        },
        {
          "name": "state",
          "type": {
            "tuple": [
              {
                "name": "hash-input",
                "type": {
                  "buffer": {
                    "length": 32
                  }
                }
              },
              {
                "name": "hash-output",
                "type": {
                  "buffer": {
                    "length": 32
                  }
                }
              }
            ]
          }
        }
      ],
      "name": "inner-buff32-permutation",
      "outputs": {
        "type": {
          "tuple": [
            {
              "name": "hash-input",
              "type": {
                "buffer": {
                  "length": 32
                }
              }
            },
            {
              "name": "hash-output",
              "type": {
                "buffer": {
                  "length": 32
                }
              }
            }
          ]
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "ctr",
          "type": "uint128"
        },
        {
          "name": "state",
          "type": {
            "tuple": [
              {
                "name": "cur-hash",
                "type": {
                  "buffer": {
                    "length": 32
                  }
                }
              },
              {
                "name": "path",
                "type": "uint128"
              },
              {
                "name": "proof-hashes",
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
                "name": "root-hash",
                "type": {
                  "buffer": {
                    "length": 32
                  }
                }
              },
              {
                "name": "tree-depth",
                "type": "uint128"
              },
              {
                "name": "verified",
                "type": "bool"
              }
            ]
          }
        }
      ],
      "name": "inner-merkle-proof-verify",
      "outputs": {
        "type": {
          "tuple": [
            {
              "name": "cur-hash",
              "type": {
                "buffer": {
                  "length": 32
                }
              }
            },
            {
              "name": "path",
              "type": "uint128"
            },
            {
              "name": "proof-hashes",
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
              "name": "root-hash",
              "type": {
                "buffer": {
                  "length": 32
                }
              }
            },
            {
              "name": "tree-depth",
              "type": "uint128"
            },
            {
              "name": "verified",
              "type": "bool"
            }
          ]
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "chunk_size",
          "type": "uint128"
        },
        {
          "name": "input",
          "type": {
            "tuple": [
              {
                "name": "acc",
                "type": {
                  "buffer": {
                    "length": 1024
                  }
                }
              },
              {
                "name": "buffer",
                "type": {
                  "buffer": {
                    "length": 1024
                  }
                }
              },
              {
                "name": "index",
                "type": "uint128"
              },
              {
                "name": "remaining",
                "type": "uint128"
              }
            ]
          }
        }
      ],
      "name": "inner-read-slice",
      "outputs": {
        "type": {
          "tuple": [
            {
              "name": "acc",
              "type": {
                "buffer": {
                  "length": 1024
                }
              }
            },
            {
              "name": "buffer",
              "type": {
                "buffer": {
                  "length": 1024
                }
              }
            },
            {
              "name": "index",
              "type": "uint128"
            },
            {
              "name": "remaining",
              "type": "uint128"
            }
          ]
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "ignored",
          "type": "bool"
        },
        {
          "name": "input",
          "type": {
            "tuple": [
              {
                "name": "acc",
                "type": {
                  "buffer": {
                    "length": 1024
                  }
                }
              },
              {
                "name": "data",
                "type": {
                  "buffer": {
                    "length": 1024
                  }
                }
              },
              {
                "name": "index",
                "type": "uint128"
              }
            ]
          }
        }
      ],
      "name": "inner-read-slice-1024",
      "outputs": {
        "type": {
          "tuple": [
            {
              "name": "acc",
              "type": {
                "buffer": {
                  "length": 1024
                }
              }
            },
            {
              "name": "data",
              "type": {
                "buffer": {
                  "length": 1024
                }
              }
            },
            {
              "name": "index",
              "type": "uint128"
            }
          ]
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "val",
          "type": "uint128"
        },
        {
          "name": "bit",
          "type": "uint128"
        }
      ],
      "name": "is-bit-set",
      "outputs": {
        "type": "bool"
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "headerbuff",
          "type": {
            "buffer": {
              "length": 80
            }
          }
        }
      ],
      "name": "parse-block-header",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": {
              "tuple": [
                {
                  "name": "merkle-root",
                  "type": {
                    "buffer": {
                      "length": 32
                    }
                  }
                },
                {
                  "name": "nbits",
                  "type": "uint128"
                },
                {
                  "name": "nonce",
                  "type": "uint128"
                },
                {
                  "name": "parent",
                  "type": {
                    "buffer": {
                      "length": 32
                    }
                  }
                },
                {
                  "name": "timestamp",
                  "type": "uint128"
                },
                {
                  "name": "version",
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
          "name": "tx",
          "type": {
            "buffer": {
              "length": 1024
            }
          }
        }
      ],
      "name": "parse-tx",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": {
              "tuple": [
                {
                  "name": "ins",
                  "type": {
                    "list": {
                      "length": 8,
                      "type": {
                        "tuple": [
                          {
                            "name": "outpoint",
                            "type": {
                              "tuple": [
                                {
                                  "name": "hash",
                                  "type": {
                                    "buffer": {
                                      "length": 32
                                    }
                                  }
                                },
                                {
                                  "name": "index",
                                  "type": "uint128"
                                }
                              ]
                            }
                          },
                          {
                            "name": "scriptSig",
                            "type": {
                              "buffer": {
                                "length": 256
                              }
                            }
                          },
                          {
                            "name": "sequence",
                            "type": "uint128"
                          }
                        ]
                      }
                    }
                  }
                },
                {
                  "name": "locktime",
                  "type": "uint128"
                },
                {
                  "name": "outs",
                  "type": {
                    "list": {
                      "length": 8,
                      "type": {
                        "tuple": [
                          {
                            "name": "scriptPubKey",
                            "type": {
                              "buffer": {
                                "length": 128
                              }
                            }
                          },
                          {
                            "name": "value",
                            "type": "uint128"
                          }
                        ]
                      }
                    }
                  }
                },
                {
                  "name": "version",
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
          "name": "old-ctx",
          "type": {
            "tuple": [
              {
                "name": "index",
                "type": "uint128"
              },
              {
                "name": "txbuff",
                "type": {
                  "buffer": {
                    "length": 1024
                  }
                }
              }
            ]
          }
        }
      ],
      "name": "read-hashslice",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": {
              "tuple": [
                {
                  "name": "ctx",
                  "type": {
                    "tuple": [
                      {
                        "name": "index",
                        "type": "uint128"
                      },
                      {
                        "name": "txbuff",
                        "type": {
                          "buffer": {
                            "length": 1024
                          }
                        }
                      }
                    ]
                  }
                },
                {
                  "name": "hashslice",
                  "type": {
                    "buffer": {
                      "length": 32
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
          "name": "ignored",
          "type": "bool"
        },
        {
          "name": "state-res",
          "type": {
            "response": {
              "error": "uint128",
              "ok": {
                "tuple": [
                  {
                    "name": "ctx",
                    "type": {
                      "tuple": [
                        {
                          "name": "index",
                          "type": "uint128"
                        },
                        {
                          "name": "txbuff",
                          "type": {
                            "buffer": {
                              "length": 1024
                            }
                          }
                        }
                      ]
                    }
                  },
                  {
                    "name": "remaining",
                    "type": "uint128"
                  },
                  {
                    "name": "txins",
                    "type": {
                      "list": {
                        "length": 8,
                        "type": {
                          "tuple": [
                            {
                              "name": "outpoint",
                              "type": {
                                "tuple": [
                                  {
                                    "name": "hash",
                                    "type": {
                                      "buffer": {
                                        "length": 32
                                      }
                                    }
                                  },
                                  {
                                    "name": "index",
                                    "type": "uint128"
                                  }
                                ]
                              }
                            },
                            {
                              "name": "scriptSig",
                              "type": {
                                "buffer": {
                                  "length": 256
                                }
                              }
                            },
                            {
                              "name": "sequence",
                              "type": "uint128"
                            }
                          ]
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      ],
      "name": "read-next-txin",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": {
              "tuple": [
                {
                  "name": "ctx",
                  "type": {
                    "tuple": [
                      {
                        "name": "index",
                        "type": "uint128"
                      },
                      {
                        "name": "txbuff",
                        "type": {
                          "buffer": {
                            "length": 1024
                          }
                        }
                      }
                    ]
                  }
                },
                {
                  "name": "remaining",
                  "type": "uint128"
                },
                {
                  "name": "txins",
                  "type": {
                    "list": {
                      "length": 8,
                      "type": {
                        "tuple": [
                          {
                            "name": "outpoint",
                            "type": {
                              "tuple": [
                                {
                                  "name": "hash",
                                  "type": {
                                    "buffer": {
                                      "length": 32
                                    }
                                  }
                                },
                                {
                                  "name": "index",
                                  "type": "uint128"
                                }
                              ]
                            }
                          },
                          {
                            "name": "scriptSig",
                            "type": {
                              "buffer": {
                                "length": 256
                              }
                            }
                          },
                          {
                            "name": "sequence",
                            "type": "uint128"
                          }
                        ]
                      }
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
          "name": "ignored",
          "type": "bool"
        },
        {
          "name": "state-res",
          "type": {
            "response": {
              "error": "uint128",
              "ok": {
                "tuple": [
                  {
                    "name": "ctx",
                    "type": {
                      "tuple": [
                        {
                          "name": "index",
                          "type": "uint128"
                        },
                        {
                          "name": "txbuff",
                          "type": {
                            "buffer": {
                              "length": 1024
                            }
                          }
                        }
                      ]
                    }
                  },
                  {
                    "name": "remaining",
                    "type": "uint128"
                  },
                  {
                    "name": "txouts",
                    "type": {
                      "list": {
                        "length": 8,
                        "type": {
                          "tuple": [
                            {
                              "name": "scriptPubKey",
                              "type": {
                                "buffer": {
                                  "length": 128
                                }
                              }
                            },
                            {
                              "name": "value",
                              "type": "uint128"
                            }
                          ]
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      ],
      "name": "read-next-txout",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": {
              "tuple": [
                {
                  "name": "ctx",
                  "type": {
                    "tuple": [
                      {
                        "name": "index",
                        "type": "uint128"
                      },
                      {
                        "name": "txbuff",
                        "type": {
                          "buffer": {
                            "length": 1024
                          }
                        }
                      }
                    ]
                  }
                },
                {
                  "name": "remaining",
                  "type": "uint128"
                },
                {
                  "name": "txouts",
                  "type": {
                    "list": {
                      "length": 8,
                      "type": {
                        "tuple": [
                          {
                            "name": "scriptPubKey",
                            "type": {
                              "buffer": {
                                "length": 128
                              }
                            }
                          },
                          {
                            "name": "value",
                            "type": "uint128"
                          }
                        ]
                      }
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
          "name": "data",
          "type": {
            "buffer": {
              "length": 1024
            }
          }
        },
        {
          "name": "offset",
          "type": "uint128"
        },
        {
          "name": "size",
          "type": "uint128"
        }
      ],
      "name": "read-slice",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": {
              "buffer": {
                "length": 1024
              }
            }
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "input",
          "type": {
            "tuple": [
              {
                "name": "data",
                "type": {
                  "buffer": {
                    "length": 1024
                  }
                }
              },
              {
                "name": "index",
                "type": "uint128"
              }
            ]
          }
        }
      ],
      "name": "read-slice-1",
      "outputs": {
        "type": {
          "buffer": {
            "length": 1024
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "input",
          "type": {
            "tuple": [
              {
                "name": "data",
                "type": {
                  "buffer": {
                    "length": 1024
                  }
                }
              },
              {
                "name": "index",
                "type": "uint128"
              }
            ]
          }
        }
      ],
      "name": "read-slice-128",
      "outputs": {
        "type": {
          "buffer": {
            "length": 1024
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "input",
          "type": {
            "tuple": [
              {
                "name": "data",
                "type": {
                  "buffer": {
                    "length": 1024
                  }
                }
              },
              {
                "name": "index",
                "type": "uint128"
              }
            ]
          }
        }
      ],
      "name": "read-slice-16",
      "outputs": {
        "type": {
          "buffer": {
            "length": 1024
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "input",
          "type": {
            "tuple": [
              {
                "name": "data",
                "type": {
                  "buffer": {
                    "length": 1024
                  }
                }
              },
              {
                "name": "index",
                "type": "uint128"
              }
            ]
          }
        }
      ],
      "name": "read-slice-2",
      "outputs": {
        "type": {
          "buffer": {
            "length": 1024
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "input",
          "type": {
            "tuple": [
              {
                "name": "data",
                "type": {
                  "buffer": {
                    "length": 1024
                  }
                }
              },
              {
                "name": "index",
                "type": "uint128"
              }
            ]
          }
        }
      ],
      "name": "read-slice-256",
      "outputs": {
        "type": {
          "buffer": {
            "length": 1024
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "input",
          "type": {
            "tuple": [
              {
                "name": "data",
                "type": {
                  "buffer": {
                    "length": 1024
                  }
                }
              },
              {
                "name": "index",
                "type": "uint128"
              }
            ]
          }
        }
      ],
      "name": "read-slice-32",
      "outputs": {
        "type": {
          "buffer": {
            "length": 1024
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "input",
          "type": {
            "tuple": [
              {
                "name": "data",
                "type": {
                  "buffer": {
                    "length": 1024
                  }
                }
              },
              {
                "name": "index",
                "type": "uint128"
              }
            ]
          }
        }
      ],
      "name": "read-slice-4",
      "outputs": {
        "type": {
          "buffer": {
            "length": 1024
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "input",
          "type": {
            "tuple": [
              {
                "name": "data",
                "type": {
                  "buffer": {
                    "length": 1024
                  }
                }
              },
              {
                "name": "index",
                "type": "uint128"
              }
            ]
          }
        }
      ],
      "name": "read-slice-512",
      "outputs": {
        "type": {
          "buffer": {
            "length": 1024
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "input",
          "type": {
            "tuple": [
              {
                "name": "data",
                "type": {
                  "buffer": {
                    "length": 1024
                  }
                }
              },
              {
                "name": "index",
                "type": "uint128"
              }
            ]
          }
        }
      ],
      "name": "read-slice-64",
      "outputs": {
        "type": {
          "buffer": {
            "length": 1024
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "input",
          "type": {
            "tuple": [
              {
                "name": "data",
                "type": {
                  "buffer": {
                    "length": 1024
                  }
                }
              },
              {
                "name": "index",
                "type": "uint128"
              }
            ]
          }
        }
      ],
      "name": "read-slice-8",
      "outputs": {
        "type": {
          "buffer": {
            "length": 1024
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "ctx",
          "type": {
            "tuple": [
              {
                "name": "index",
                "type": "uint128"
              },
              {
                "name": "txbuff",
                "type": {
                  "buffer": {
                    "length": 1024
                  }
                }
              }
            ]
          }
        }
      ],
      "name": "read-txins",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": {
              "tuple": [
                {
                  "name": "ctx",
                  "type": {
                    "tuple": [
                      {
                        "name": "index",
                        "type": "uint128"
                      },
                      {
                        "name": "txbuff",
                        "type": {
                          "buffer": {
                            "length": 1024
                          }
                        }
                      }
                    ]
                  }
                },
                {
                  "name": "remaining",
                  "type": "uint128"
                },
                {
                  "name": "txins",
                  "type": {
                    "list": {
                      "length": 8,
                      "type": {
                        "tuple": [
                          {
                            "name": "outpoint",
                            "type": {
                              "tuple": [
                                {
                                  "name": "hash",
                                  "type": {
                                    "buffer": {
                                      "length": 32
                                    }
                                  }
                                },
                                {
                                  "name": "index",
                                  "type": "uint128"
                                }
                              ]
                            }
                          },
                          {
                            "name": "scriptSig",
                            "type": {
                              "buffer": {
                                "length": 256
                              }
                            }
                          },
                          {
                            "name": "sequence",
                            "type": "uint128"
                          }
                        ]
                      }
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
          "name": "ctx",
          "type": {
            "tuple": [
              {
                "name": "index",
                "type": "uint128"
              },
              {
                "name": "txbuff",
                "type": {
                  "buffer": {
                    "length": 1024
                  }
                }
              }
            ]
          }
        }
      ],
      "name": "read-txouts",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": {
              "tuple": [
                {
                  "name": "ctx",
                  "type": {
                    "tuple": [
                      {
                        "name": "index",
                        "type": "uint128"
                      },
                      {
                        "name": "txbuff",
                        "type": {
                          "buffer": {
                            "length": 1024
                          }
                        }
                      }
                    ]
                  }
                },
                {
                  "name": "remaining",
                  "type": "uint128"
                },
                {
                  "name": "txouts",
                  "type": {
                    "list": {
                      "length": 8,
                      "type": {
                        "tuple": [
                          {
                            "name": "scriptPubKey",
                            "type": {
                              "buffer": {
                                "length": 128
                              }
                            }
                          },
                          {
                            "name": "value",
                            "type": "uint128"
                          }
                        ]
                      }
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
          "name": "ctx",
          "type": {
            "tuple": [
              {
                "name": "index",
                "type": "uint128"
              },
              {
                "name": "txbuff",
                "type": {
                  "buffer": {
                    "length": 1024
                  }
                }
              }
            ]
          }
        }
      ],
      "name": "read-uint16",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": {
              "tuple": [
                {
                  "name": "ctx",
                  "type": {
                    "tuple": [
                      {
                        "name": "index",
                        "type": "uint128"
                      },
                      {
                        "name": "txbuff",
                        "type": {
                          "buffer": {
                            "length": 1024
                          }
                        }
                      }
                    ]
                  }
                },
                {
                  "name": "uint16",
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
          "name": "ctx",
          "type": {
            "tuple": [
              {
                "name": "index",
                "type": "uint128"
              },
              {
                "name": "txbuff",
                "type": {
                  "buffer": {
                    "length": 1024
                  }
                }
              }
            ]
          }
        }
      ],
      "name": "read-uint32",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": {
              "tuple": [
                {
                  "name": "ctx",
                  "type": {
                    "tuple": [
                      {
                        "name": "index",
                        "type": "uint128"
                      },
                      {
                        "name": "txbuff",
                        "type": {
                          "buffer": {
                            "length": 1024
                          }
                        }
                      }
                    ]
                  }
                },
                {
                  "name": "uint32",
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
          "name": "ctx",
          "type": {
            "tuple": [
              {
                "name": "index",
                "type": "uint128"
              },
              {
                "name": "txbuff",
                "type": {
                  "buffer": {
                    "length": 1024
                  }
                }
              }
            ]
          }
        }
      ],
      "name": "read-uint64",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": {
              "tuple": [
                {
                  "name": "ctx",
                  "type": {
                    "tuple": [
                      {
                        "name": "index",
                        "type": "uint128"
                      },
                      {
                        "name": "txbuff",
                        "type": {
                          "buffer": {
                            "length": 1024
                          }
                        }
                      }
                    ]
                  }
                },
                {
                  "name": "uint64",
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
          "name": "ctx",
          "type": {
            "tuple": [
              {
                "name": "index",
                "type": "uint128"
              },
              {
                "name": "txbuff",
                "type": {
                  "buffer": {
                    "length": 1024
                  }
                }
              }
            ]
          }
        }
      ],
      "name": "read-varint",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": {
              "tuple": [
                {
                  "name": "ctx",
                  "type": {
                    "tuple": [
                      {
                        "name": "index",
                        "type": "uint128"
                      },
                      {
                        "name": "txbuff",
                        "type": {
                          "buffer": {
                            "length": 1024
                          }
                        }
                      }
                    ]
                  }
                },
                {
                  "name": "varint",
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
          "name": "old-ctx",
          "type": {
            "tuple": [
              {
                "name": "index",
                "type": "uint128"
              },
              {
                "name": "txbuff",
                "type": {
                  "buffer": {
                    "length": 1024
                  }
                }
              }
            ]
          }
        }
      ],
      "name": "read-varslice",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": {
              "tuple": [
                {
                  "name": "ctx",
                  "type": {
                    "tuple": [
                      {
                        "name": "index",
                        "type": "uint128"
                      },
                      {
                        "name": "txbuff",
                        "type": {
                          "buffer": {
                            "length": 1024
                          }
                        }
                      }
                    ]
                  }
                },
                {
                  "name": "varslice",
                  "type": {
                    "buffer": {
                      "length": 1024
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
          "name": "input",
          "type": {
            "buffer": {
              "length": 32
            }
          }
        }
      ],
      "name": "reverse-buff32",
      "outputs": {
        "type": {
          "buffer": {
            "length": 32
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "headerbuff",
          "type": {
            "buffer": {
              "length": 80
            }
          }
        },
        {
          "name": "expected-block-height",
          "type": "uint128"
        }
      ],
      "name": "verify-block-header",
      "outputs": {
        "type": "bool"
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "reversed-txid",
          "type": {
            "buffer": {
              "length": 32
            }
          }
        },
        {
          "name": "merkle-root",
          "type": {
            "buffer": {
              "length": 32
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
        }
      ],
      "name": "verify-merkle-proof",
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
          "name": "block",
          "type": {
            "buffer": {
              "length": 80
            }
          }
        },
        {
          "name": "parent",
          "type": {
            "buffer": {
              "length": 80
            }
          }
        }
      ],
      "name": "verify-prev-block",
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
          "name": "block",
          "type": {
            "buffer": {
              "length": 80
            }
          }
        },
        {
          "name": "prev-blocks",
          "type": {
            "list": {
              "length": 10,
              "type": {
                "buffer": {
                  "length": 80
                }
              }
            }
          }
        }
      ],
      "name": "verify-prev-blocks",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": {
              "buffer": {
                "length": 80
              }
            }
          }
        }
      }
    },
    {
      "access": "read_only",
      "args": [
        {
          "name": "parent",
          "type": {
            "buffer": {
              "length": 80
            }
          }
        },
        {
          "name": "next-resp",
          "type": {
            "response": {
              "error": "uint128",
              "ok": {
                "buffer": {
                  "length": 80
                }
              }
            }
          }
        }
      ],
      "name": "verify-prev-blocks-fold",
      "outputs": {
        "type": {
          "response": {
            "error": "uint128",
            "ok": {
              "buffer": {
                "length": 80
              }
            }
          }
        }
      }
    },
    {
      "access": "read_only",
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
          "name": "prev-blocks",
          "type": {
            "list": {
              "length": 10,
              "type": {
                "buffer": {
                  "length": 80
                }
              }
            }
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
        }
      ],
      "name": "was-tx-mined-prev?",
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
        }
      ],
      "name": "was-tx-mined?",
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
      "name": "ERR-BAD-HEADER",
      "type": "uint128"
    },
    {
      "access": "constant",
      "name": "ERR-INVALID-PARENT",
      "type": "uint128"
    },
    {
      "access": "constant",
      "name": "ERR-OUT-OF-BOUNDS",
      "type": "uint128"
    },
    {
      "access": "constant",
      "name": "ERR-PROOF-TOO-SHORT",
      "type": "uint128"
    },
    {
      "access": "constant",
      "name": "ERR-TOO-MANY-TXINS",
      "type": "uint128"
    },
    {
      "access": "constant",
      "name": "ERR-TOO-MANY-TXOUTS",
      "type": "uint128"
    },
    {
      "access": "constant",
      "name": "ERR-VARSLICE-TOO-LONG",
      "type": "uint128"
    },
    {
      "access": "constant",
      "name": "LIST_128",
      "type": {
        "list": {
          "length": 128,
          "type": "bool"
        }
      }
    },
    {
      "access": "constant",
      "name": "LIST_16",
      "type": {
        "list": {
          "length": 16,
          "type": "bool"
        }
      }
    },
    {
      "access": "constant",
      "name": "LIST_256",
      "type": {
        "list": {
          "length": 256,
          "type": "bool"
        }
      }
    },
    {
      "access": "constant",
      "name": "LIST_32",
      "type": {
        "list": {
          "length": 32,
          "type": "bool"
        }
      }
    },
    {
      "access": "constant",
      "name": "LIST_512",
      "type": {
        "list": {
          "length": 512,
          "type": "bool"
        }
      }
    },
    {
      "access": "constant",
      "name": "LIST_64",
      "type": {
        "list": {
          "length": 64,
          "type": "bool"
        }
      }
    }
  ]
};
