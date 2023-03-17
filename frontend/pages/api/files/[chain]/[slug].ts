import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../../../utils/supabaseServer";
import { getToken } from "next-auth/jwt";
import { ethers } from "ethers";
import { GUMRUA_PRODUCT_ADDRESS } from "../../../../constants/addresses";
import { gnosisChiado, hardhat } from "wagmi/chains";
import { GumruaAbi } from "../../../../abis/gumrua";

const secret = process.env.NEXTAUTH_SECRET;
const rpc = process.env.GNOSIS_RPC_ENDPOINT || "";

export type Data = {
  results: any;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    //get slug
    const { slug, chain } = req.query;

    const fileSlug = slug;

    if (Number(chain) !== hardhat.id && Number(chain) !== gnosisChiado.id) {
      console.log("Chain Not Supported");
      throw new Error("Chain not supported");
    } else {
      const token = await getToken({ req, secret });

      console.log("token", token);
      if (token && token.sub) {
        const wallet_address = token.sub;
        console.log("wallet_address", wallet_address);
        //check user purchased this file on smart contract
        const provider = new ethers.providers.JsonRpcProvider(rpc);
        console.log("Chain", chain);
        const contractAddress = GUMRUA_PRODUCT_ADDRESS[Number(chain)];
        console.log("contractAddress", contractAddress);
        const contractAbi = GumruaAbi;
        const contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          provider
        );

        const productId = await contract.slugToId(fileSlug);
        if (productId.eq(0)) {
          throw new Error("Product not found");
        }

        const balance = await contract.balanceOf(wallet_address, productId);

        if (balance.eq(1)) {
          // get signed file from supabase
          const { data, error } = await supabaseServer.storage
            .from("private")
            .createSignedUrl(`/${slug}.pdf`, 60); //1 minutes

          if (error) {
            console.error("Error from Supabase", error);
            throw error;
          }

          res.status(200).json({
            results: { file: data.signedUrl, data: JSON.stringify(data) },
          });
        } else {
          console.error("Not purchased - balance does not equal 1");
          throw new Error("Not purchased");
        }
      } else {
        console.error("Not signed in");
        throw new Error("Not signed in");
      }
    }
  } catch (e) {
    res.status(200).json({ results: JSON.stringify(e) });
  }
};

export default handler;
