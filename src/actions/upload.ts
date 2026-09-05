"use server";

import { auth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

type UploadResult =
  | { success: true; url: string; publicId: string }
  | { success: false; error: string };

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const file = formData.get("file") as File | null;

  if (!file) {
    return { success: false, error: "No file provided" };
  }

  if (!file.type.startsWith("image/")) {
    return { success: false, error: "File must be an image" };
  }

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    return { success: false, error: "Image must be under 5MB" };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "noor-al-haramain/posts",
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result) {
              reject(error ?? new Error("Upload failed"));
              return;
            }
            resolve({ secure_url: result.secure_url, public_id: result.public_id });
          }
        );
        uploadStream.end(buffer);
      }
    );

    return { success: true, url: result.secure_url, publicId: result.public_id };
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return { success: false, error: "Upload failed. Please try again." };
  }
}