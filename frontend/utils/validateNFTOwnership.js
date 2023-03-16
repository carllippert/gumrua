import { GumruaAbi } from "../abis/gumrua.ts";
import { ethers } from "ethers";

export const validateNFTOwnership = async (address) => {
  try {
    const contractAddress = "0x_NFT_CONTRACT_ADDRESS_HERE";
    const provider = await new ethers.providers.JsonRpcProvider(
      process.env.ALCHEMY_ENDPOINT
    );
    const contract = await new ethers.Contract(
      contractAddress,
      GumruaAbi(),
      provider
    );
    const balance = await contract.balanceOf(address);
    if (balance.toString() !== "0") {
      return true;
    }

    return false;
  } catch (error) {
    console.log(error);
    return null;
  }
};
