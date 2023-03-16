import { BigNumber } from "ethers";

export interface Product {
  id: number;
  seller: `0x${string}`;
  name: string;
  slug: string;
  description: string;
  price: BigNumber;
  image: string;
}
