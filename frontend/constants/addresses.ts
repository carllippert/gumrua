import { gnosisChiado, hardhat } from "wagmi/chains";

export const GUMRUA_PRODUCT_ADDRESS: { [chainId: number]: string } = {
  [hardhat.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [gnosisChiado.id]: "0xe393fb46C545AAd9dC4F37b6D149D3401863baC5",
};
