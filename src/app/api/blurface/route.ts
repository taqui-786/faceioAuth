import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;
    if (!file) {
      return NextResponse.json(
        { message: "No image Provided!" },
        { status: 400 }
      );
    }
    // CONVETING TO BUFFER AND THEN BUFFER TO BLOB
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const toBlob = new Blob([buffer], { type: file.type });

    // Api 1 =>  UPLOADING TO PIXLAB AWS
    const formData = new FormData();
    formData.append("file", toBlob, file.name);
    formData.append("key", process.env.NEXT_PUBLIC_BLUR_IMAGE_KEY || "");
    const uploadImg = await fetch(`https://api.pixlab.io/store`, {
      method: "POST",

      body: formData,
    });

    const finalRes = await uploadImg.json();

    if (finalRes.status !== 200) {
      return NextResponse.json(
        { message: "Uploading Failed to pixlab" },
        { status: 400 }
      );
    }

    // Api 2 => GETTING COORDIANATES OF THE FACES IN IMAGE

    const getCordinate = await axios.get("https://api.pixlab.io/facedetect", {
      params: {
        img: finalRes.link,
        key: process.env.NEXT_PUBLIC_BLUR_IMAGE_KEY,
      },
    });
    //   console.log(getCordinate.data);
    if (getCordinate.data.faces.length === 0) {
      return NextResponse.json(
        { message: "No faces Found! Try another" },
        { status: 400 }
      );
    }

    // Api 3 =>  FINALLY GENERATING IMAGE FACES BLURED

    const blurFaces = await axios.post("https://api.pixlab.io/mogrify", {
      img: finalRes.link,
      key: process.env.NEXT_PUBLIC_BLUR_IMAGE_KEY,
      cord: getCordinate.data.faces,
    });

    const blurImgUrl = await blurFaces.data;

    if (blurImgUrl.status !== 200) {
      return NextResponse.json(
        { message: "Falied to Blur Faces! Try again" },
        { status: 400 }
      );
    }

    return NextResponse.json({ blurImgUrl }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error server" }, { status: 500 });
  }
}
