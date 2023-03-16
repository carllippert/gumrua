import { gnosisChiado, hardhat } from "wagmi/chains";

export const GUMRUA_PRODUCT_ADDRESS: { [chainId: number]: string } = {
  [hardhat.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [gnosisChiado.id]: "0x07B9837e81b917451690f2eF4752AC5F1434450B",
};
