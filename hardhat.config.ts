import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-deploy';
import * as dotenv from 'dotenv';

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? '0x...';
const SEPOLIA_RPC = process.env.SEPOLIA_RPC_URL ?? '';
const MAINNET_RPC = process.env.MAINNET_RPC_URL ?? '';

const config: HardhatUserConfig = {
    defaultNetwork: 'hardhat',
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
    networks: {
        hardhat: {
            chainId: 31337,
        },
        localhost: {
            url: 'http://127.0.0.1:8545',
            chainId: 31337,
        },
        sepolia: {
            url: SEPOLIA_RPC,
            chainId: 11155111,
            accounts: [PRIVATE_KEY],
        },
        mainnet: {
            url: MAINNET_RPC,
            chainId: 1,
            accounts: [PRIVATE_KEY],
        },
    },
    solidity: {
        version: '0.8.24',
        settings: {optimizer: {enabled: true, runs: 200}},
    },
};

export default config;