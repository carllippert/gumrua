import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

import dotenv from 'dotenv';

dotenv.config();

const mnemonic = process.env.MNEMONIC;
if (!mnemonic) {
  throw new Error('Please set your MNEMONIC in a .env file');
}

const accounts = {
  mnemonic,
  count: 100,
};

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  networks: {
    gnosis: {
      url: 'https://rpc.gnosischain.com',
      accounts,
    },
    chiado: {
      url: 'https://rpc.chiadochain.net',
      gasPrice: 1000000000,
      accounts,
    },
    'mantle-testnet': {
      url: 'https://rpc.testnet.mantle.xyz/',
      accounts,
    },
  },
  etherscan: {
    customChains: [
      {
        network: 'chiado',
        chainId: 10200,
        urls: {
          //Blockscout
          apiURL: 'https://blockscout.com/gnosis/chiado/api',
          browserURL: 'https://blockscout.com/gnosis/chiado',
        },
      },
      {
        network: 'gnosis',
        chainId: 100,
        urls: {
          // 3) Select to what explorer verify the contracts
          // Gnosisscan
          apiURL: 'https://api.gnosisscan.io/api',
          browserURL: 'https://gnosisscan.io/',
          // Blockscout
          //apiURL: "https://blockscout.com/xdai/mainnet/api",
          //browserURL: "https://blockscout.com/xdai/mainnet",
        },
      },
    ],
    apiKey: {
      //4) Insert your Gnosisscan API key
      //blockscout explorer verification does not require keys
      chiado: process.env.GNOSISSCAN_API_KEY || '',
      gnosis: process.env.GNOSISSCAN_API_KEY || '',
    },
  },
};

export default config;
