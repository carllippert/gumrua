import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useState } from "react";
import Container from "../components/container";
import Layout from "../components/layout";
import { useCreateProduct } from "../hooks/use-create-product";
import slugify from "slugify";
import { Input } from "../components/basic/input";
import { Label } from "../components/basic/label";
import { Button } from "../components/basic/button";
import { TextArea } from "../components/basic/textarea";

import { useForm } from "react-hook-form";
import UploadFile from "../components/basic/upload-file";
import Navbar from "../components/navbar";

interface LoginFields {
  name: string;
  price: string;
  description: string;
}

const Create = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFields>();

  const [image, setImage] = useState<File>();
  const [pdf, setPdf] = useState<File>();

  const { mutate: createProduct, isLoading } = useCreateProduct({
    onSuccess(receipt) {
      reset();

      if (!receipt) return;
      const slug = receipt.events?.find((e) => e.event === "ProductCreated")
        ?.args?._slug;

      router.push(`/${slug}`);
    },
  });

  const onSubmit = handleSubmit((data) => {
    if (!image || !pdf) return;
    const { name, description, price } = data;

    createProduct({
      name: data.name,
      slug: slugify(name).toLowerCase(),
      description,
      price: ethers.utils.parseEther(price),
      image,
      pdf,
    });
  });

  return (
    <Layout>
      <Navbar currentPage="create" />
      <Container className="mt-10">
        <h1 className="text-4xl font-bold mb-4">Create new product</h1>
        <form className="flex flex-col gap-2" onSubmit={onSubmit}>
          <Input
            label="Name"
            block
            {...register("name", { required: "Name is required" })}
            error={errors.name?.message}
          />
          <Input
            label="Price (in Euro)"
            type="number"
            step="0.0000001"
            block
            {...register("price", { required: "Price is required" })}
            error={errors.price?.message}
          />
          <TextArea
            label="Description"
            rows={3}
            {...register("description", {
              required: "Description is required",
            })}
            error={errors.description?.message}
          />
          <div>
            <Label>Image</Label>
            <UploadFile
              file={image}
              setFile={setImage}
              fileTypes="PDF, SVG, PNG, JPG or GIF"
              accept="image/*"
            />
          </div>
          <div>
            <Label>Content</Label>
            <UploadFile file={pdf} setFile={setPdf} accept="application/pdf" />
          </div>
          <Button
            className="mt-2 tracking-wider"
            size="lg"
            block
            type="submit"
            loading={isLoading}
            disabled={!image || !pdf || isLoading}
          >
            Publish
          </Button>
        </form>
      </Container>
    </Layout>
  );
};

export default Create;
