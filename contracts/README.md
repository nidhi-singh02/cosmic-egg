# Cosmic Hatchery Smart Contracts

Smart contracts for the Cosmic Egg Hatchery NFT game, built with Foundry and deployed on **Monad Testnet**.

## Network Configuration

**Monad Testnet:**
- Chain ID: `10143`
- RPC URL: `https://testnet-rpc.monad.xyz`
- Currency: MON
- Explorer: `https://testnet.monadexplorer.com`
- Faucet: `https://faucet.monad.xyz`

## Environment Setup

Create a `.env` file with:

```bash
PRIVATE_KEY=your_private_key_here

# Pyth Entropy addresses (check https://docs.pyth.network/entropy/contract-addresses)
ENTROPY_CONTRACT=0x0000000000000000000000000000000000000000
```

## Build

```shell
forge build
```

## Test

```shell
forge test
```

## Deploy to Monad Testnet

```shell
source .env
forge script script/Deploy.s.sol:DeployScript --rpc-url https://testnet-rpc.monad.xyz --broadcast --verify
```

## Verify Contract

```shell
forge verify-contract <CONTRACT_ADDRESS> src/CosmicHatchery.sol:CosmicHatchery --chain-id 10143
```

## Documentation

- [Foundry Book](https://book.getfoundry.sh/)
- [Monad Docs](https://docs.monad.xyz/)
- [Pyth Entropy](https://docs.pyth.network/entropy)
