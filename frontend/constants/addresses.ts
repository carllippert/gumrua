import { gnosisChiado, hardhat } from "wagmi/chains";

export const GUMRUA_PRODUCT_ADDRESS: { [chainId: number]: `0x${string}` } = {
  [hardhat.id]: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  [gnosisChiado.id]: "0x40eEd878c6125160ab8c4c931FcFd083D0511AF1",
};

export const EURE_TOKEN_ADDRESS: { [chainId: number]: `0x${string}` } = {
  [hardhat.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [gnosisChiado.id]: "0xb106ed7587365a16b6691a3D4B2A734f4E8268a2",
};
