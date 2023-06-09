import { supabase } from "./supabase";

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

export const uploadFile = async (
  file: File,
  filePath: string,
  bucket: "public" | "private"
) => {
  let { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    return undefined;
  }

  return filePath;
};

export const uploadImage = async (file: File) => {
  const fileExt = file.name.split(".").pop();
  //just creating a random number to add to the file name
  const linuxTimestamp = Math.floor(Date.now() / 1000);
  const min = 1000;
  const max = 9999;
  const randomFourDigitNumber =
    Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(randomFourDigitNumber);
  const fileName = `${linuxTimestamp}${randomFourDigitNumber}.${fileExt}`;
  const filePath = `${fileName}`;

  const resultFilePath = await uploadFile(file, filePath, "public");
  return `${supabase_url}/storage/v1/object/public/public/${resultFilePath}`;
};

export const uploadPdf = async (file: File, slug: string) => {
  await uploadFile(file, `${slug}.pdf`, "private");
};
