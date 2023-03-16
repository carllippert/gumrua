import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useState } from "react";
import Container from "../components/container";
import Layout from "../components/layout";
import UploadImage from "../components/uploadImage";
import UploadPdf from "../components/uploadPdf";
import { useCreateProduct } from "../hooks/use-create-product";
import slugify from "slugify";
import { Input } from "../components/basic/input";
import { Label } from "../components/basic/label";
import { Button } from "../components/basic/button";
import { TextArea } from "../components/basic/textarea";

const Create = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  //TODO: add validation
  const { mutate: createProduct } = useCreateProduct({
    onSuccess(receipt) {
      setName("");
      setPrice("");

      if (!receipt) return;
      const slug = receipt.events?.find((e) => e.event === "ProductCreated")
        ?.args?._slug;

      router.push(`/${slug}`);
    },
  });

  const onCreateProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createProduct({
      name,
      slug: slugify(name).toLowerCase(),
      description,
      price: ethers.utils.parseEther(price),
      image: imageUrl,
    });
  };

  return (
    <Layout>
      <Container>
        <h1 className="text-4xl font-bold mb-4">Create new product</h1>
        <form className="flex flex-col gap-2" onSubmit={onCreateProduct}>
          <Input label="Name" value={name} onValueChange={setName} block />
          <Input
            label="Price"
            type="number"
            value={price}
            onValueChange={setPrice}
            block
          />

          <TextArea
            label="Description"
            value={description}
            onValueChange={setDescription}
            rows={3}
          />
          <div>
            <Label>Image</Label>
            <UploadImage
              onUpload={(url: string) => {
                setImageUrl(url);
              }}
            />
          </div>
          <div>
            <Label>Content</Label>
            <UploadPdf
              slug={"test-slug"}
              disabled={true}
              onUpload={(url: string) => {
                setPdfUrl(url);
              }}
            />
          </div>
          <Button className="mt-2 tracking-wider" size="lg" block type="submit">
            Publish
          </Button>
        </form>
      </Container>
    </Layout>
  );
};

export default Create;
