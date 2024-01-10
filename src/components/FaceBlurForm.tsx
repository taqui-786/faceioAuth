"use client";

import { ArrowUpFromLine, Loader2, MoveRight } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
type Props = {};

const MAX_FILE_SIZE_MB = 4;

const FaceBlurForm: React.FC<Props> = ({}) => {
  const [myImage, setMyImage] = useState<string | null>(null);
  const [bluredImage, setBluredImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // HANDLE IMAGE UPLOAD FUNCTION
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setBluredImage(null);
      setLoading(true);
      const file = e.target?.files?.[0];

      if (file) {
        const fileSizeMB = file.size / (1024 * 1024); // Here i am Converting bytes to megabytes
        if (fileSizeMB > MAX_FILE_SIZE_MB) {
          toast.error(`File size exceeds the limit of ${MAX_FILE_SIZE_MB}MB`);
          setLoading(false);
          return;
        }

        const imageUrl = URL.createObjectURL(file);
        setMyImage(imageUrl);

        const imgFile = new File([file], "testing.png", { type: "image/png" });

        const formData = new FormData();
        formData.append("file", imgFile);

        const upload = await fetch("http://localhost:3000/api/blurface", {
          method: "POST",
          body: formData,
        });
        const response = await upload.json();
        if (upload.status === 200) {
          setBluredImage(response.blurImgUrl.link);
        } else {
          setMyImage(null);
          toast.error(response.message);
        }
      }
    } catch (error) {
      console.log("Client Side Error :" + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className=" w-full flex flex-row items-center justify-center mb-4">
        <div className=" h-36  grid place-content-center aspect-video bg-gray-300 relative border">
          {myImage ? (
            <Image src={myImage} alt="My Image" fill={true} />
          ) : (
            <span className="text-sm text-primary">
              Max Upload Image size is 4MB
            </span>
          )}
        </div>
        <div className="h-full flex flex-grow items-center justify-center p-4">
          {loading ? (
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          ) : (
            <MoveRight className="h-10 w-10" />
          )}
        </div>
        {/* GENERATED IMAGE WILL BE SHOWN HERE  */}
        <div className=" h-36 grid place-content-center aspect-video bg-gray-300 relative">
          {bluredImage ? (
            <Image
              src={bluredImage}
              alt="My Image"
              fill={true}
              unoptimized={true}
            />
          ) : (
            <span className="text-sm text-primary">
              Blured Image will be shown here..
            </span>
          )}
        </div>
      </div>
      <div className="w-full flex flex-col gap-3 justify-center items-center">
        <span
          className={cn(
            buttonVariants({ variant: "default" }),
            "cursor-pointer relative w-fit"
          )}
        >
          {loading ? "Please Wait" : "Upload"}{" "}
          <ArrowUpFromLine className="ml-2 h-4 w-4" />
          <input
            disabled={loading}
            type="file"
            accept=".jpeg, .jpg, .png"
            className="absolute h-full w-full opacity-0 z-50"
            onChange={handleImageUpload}
          />
        </span>
        <Link
          href="https://pixlab.io/cmd?id=mogrify"
          target="_blank"
          className="text-primary text-sm underline"
        >
          Check out Documentation
        </Link>
      </div>
    </>
  );
};
export default FaceBlurForm;
