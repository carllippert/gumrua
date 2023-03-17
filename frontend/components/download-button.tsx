import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { Button, ButtonProps } from "./basic/button";

export interface DownloadButtonProps extends ButtonProps {
  slug: string;
}

export const DownloadButton = ({ slug, ...props }: DownloadButtonProps) => {
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
          a.download = `${slug}.pdf`; // the filename you want
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
      let res = await fetch(`/api/files/${chain?.id}/${slug}`);
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
    <Button disabled={loading} onClick={download} loading={loading} {...props}>
      {fetching ? "Fetching..." : "Download"}
    </Button>
  );
};
