import { gnosisChiado, hardhat } from "wagmi/chains";

export const GUMRUA_PRODUCT_ADDRESS: { [chainId: number]: `0x${string}` } = {
  [hardhat.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [gnosisChiado.id]: "0xe393fb46C545AAd9dC4F37b6D149D3401863baC5",
};

export const EURE_TOKEN_ADDRESS: { [chainId: number]: `0x${string}` } = {
  [gnosisChiado.id]: "0xb106ed7587365a16b6691a3D4B2A734f4E8268a2",
};
