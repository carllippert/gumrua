// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export type Data = {
  results: any;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    res.status(200).json({ results: "John Doe" });
  } catch (e) {
    res.status(200).json({ results: JSON.stringify(e) });
  }
};

export default handler;
