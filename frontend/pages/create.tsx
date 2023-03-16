import { BigNumber, ethers } from "ethers";
import { useRouter } from "next/router";
import { useState } from "react";
import Container from "../components/container";
import Layout from "../components/layout";
import UploadImage from "../components/uploadImage";
import UploadPdf from "../components/uploadPdf";
import { useCreateProduct } from "../hooks/use-create-product";

const Create = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  //TODO: add validation
  const { mutate: createProduct } = useCreateProduct({
    onSuccess(receipt) {
      setName("");
      setPrice("");

      if (!receipt) return;
      const productId = receipt.events?.find(
        (e) => e.event === "ProductCreated"
      )?.args?._productId;

      router.push(`/${productId.toNumber()}`);
    },
  });

  const onCreateProduct = async () => {
    createProduct({
      name,
      price: ethers.utils.parseEther(price),
      image: imageUrl,
    });
  };

  return (
    <Layout>
      <Container>
        <h1 className="text-4xl font-bold mb-4">Create new product</h1>
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-bold">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="bg-gray-300 py-2 px-4 rounded-md outline-none text-xl"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <label htmlFor="price" className="font-bold">
            Price
          </label>
          <input
            id="price"
            type="number"
            className="bg-gray-300 py-2 px-4 rounded-md outline-none text-xl"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
            }}
          />
        </div>
        Upload Cover Image
        <UploadImage
          onUpload={(url: string) => {
            console.log("uploaded Image", url);
            setImageUrl(url);
          }}
        />
        Upload PDF
        <UploadPdf
          slug={"test-slug"}
          disabled={true}
          onUpload={(url: string) => {
            console.log("uploaded PDF", url);
            setPdfUrl(url);
          }}
        />
        <button
          className="bg-blue-500 text-lg py-1 px-4 rounded-md mt-4"
          onClick={onCreateProduct}
        >
          Publish
        </button>
      </Container>
    </Layout>
  );
};

export default Create;
