import { useEffect, useState } from "react";
import Image from "next/image";
import { useAccount, useNetwork } from "wagmi";
import { Product } from "../types/products";
import { Button } from "./basic/button";
import { CopyButton } from "./copy-button";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const [link, setlink] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);

  const download = async () => {
    try {
      setLoading(true);
      if (!link) return;
      await fetch(link, {
        method: "GET",
      })
        .then((resp) => resp.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = `${product.slug}.pdf`; // the filename you want
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        });
    } catch (error) {
      console.log("download_error", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFile = async () => {
    try {
      setLoading(true);
      setFetching(true);
      let res = await fetch(`/api/files/${chain?.id}/${product.slug}`);
      let data = await res.json();
      console.log("fetch_link_data", data);
      console.log("File", data.results.file);
      setlink(data.results.file);
    } catch (error) {
      console.log("fetch_link_error", error);
    } finally {
      setLoading(false);
      setFetching(false);
    }
  };
  useEffect(() => {
    fetchFile();
  }, []);

  return (
    <div key={product.id} className="flex flex-col justify-between">
      <div className="mb-4">
        <div className="relative h-40 rounded-box overflow-hidden">
          <Image
            src={product.image}
            layout="fill"
            objectFit="cover"
            alt="Product"
            priority
          />
        </div>
        <h4 className="font-semibold text-xl mt-3">{product.name}</h4>
        <p className="mt-2 text-base-content/80">{product.description}</p>
      </div>

      {address === product.seller ? (
        <CopyButton
          text={`${window.location.origin}/${product.slug}`}
          // className="mt-2"
          // size="lg"
          block
          label="Copy link"
        />
      ) : (
        // <a
        //   href={link ? link : ""}
        //   target="_blank"
        //   rel="noopener noreferrer"
        //   // download={`${product.slug}`}
        //   // download
        // >
        <Button disabled={loading} onClick={download} loading={loading}>
          {fetching ? "Fetching..." : "Download"}
        </Button>
        // </a>
      )}
    </div>
  );
};
