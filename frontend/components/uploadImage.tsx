import { useState } from "react";
import { supabase } from "../utils/supabase";
import { useAccount } from "wagmi";

//Upload image to public folder for use as the nft metadata

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

const UploadImage = ({ onUpload }: { onUpload: (url: string) => void }) => {
  const [uploading, setUploading] = useState(false);
  const { address } = useAccount();
  const uploadImage: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
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

      let { error: uploadError } = await supabase.storage
        .from("public")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(`${supabase_url}/storage/v1/object/public/public/${filePath}`);
    } catch (error) {
      alert("Error uploading avatar!");
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <label
        // htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-primary border-dashed rounded-lg cursor-pointer"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            aria-hidden="true"
            className="w-10 h-10 mb-3 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p className="mb-2 text-sm text-black">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-black">PDF, SVG, PNG, JPG or GIF</p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={uploadImage}
        />
      </label>
    </div>
  );
};

export default UploadImage;
