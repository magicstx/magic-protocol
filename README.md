# Magic Protocol

This repository is the codebase for the Magic Protocol contracts and web application.

Check out the [Magic docs](https://docs.magic.fun) for more information about how Magic works.

## Contracts

The main contract for Magic is [./contracts/bridge.clar](`bridge.clar`), where all protocol-specific logic is handled. You can find tests for this contract under the `test` directory.

## Development setup

First, install dependencies by running `yarn`.

Copy the `.env.example` file to `.env.local`. The example configuration will work for public testnet configurations.

Finally, run the app with `yarn dev`. The app will be available at [localhost:4444](http://localhost:4444).
