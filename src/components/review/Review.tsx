"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";
import { ProductType } from "@/types/types";
import { useCustomer } from "@/context/CustomerContext";

interface FileWithPreview extends File {
  preview?: string;
}

export default function ReviewPage({
  productDetails,
}: {
  productDetails: ProductType | null;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [supportingFiles, setSupportingFiles] = useState<FileWithPreview[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { customer } = useCustomer();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const filesArray: FileWithPreview[] = Array.from(selectedFiles);

    // Create preview URLs for images and videos
    const filesWithPreviews = filesArray.map((file) => {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        const fileWithPreview: FileWithPreview = file;
        fileWithPreview.preview = URL.createObjectURL(file);
        return fileWithPreview;
      }
      return file;
    });

    setSupportingFiles((prev) => [...prev, ...filesWithPreviews]);

    // Reset input to allow selecting same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove single file
  const removeFile = (index: number) => {
    const fileToRemove = supportingFiles[index];

    // Revoke object URL to prevent memory leaks
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    setSupportingFiles((prev) => prev.filter((_, i) => i !== index));
  };
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Get file icon based on type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return "🖼️";
    if (file.type.startsWith("video/")) return "🎬";
    return "📄";
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      supportingFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);

  async function handleSubmit() {
    try {
      if (!productDetails) return alert("Product not found");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("rating", rating.toString());

      supportingFiles.forEach((file) => {
        formData.append("supporting_files", file);
      });
      formData.append("productId", productDetails?._id ?? "");
      formData.append("customerId", customer?._id ?? "");

      const { status, ok } = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/review`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (status === 201 && ok) {
        alert("Review submitted successfully");
        setSupportingFiles([]);
        setTitle("");
        setDescription("");
        setRating(0);
        setHover(0);
        return;
      }
      throw new Error("Failed to submit review");
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className="max-w-225 mx-auto bg-white px-4 rounded-md shadow-sm py-8 md:my-6">
      {/* PRODUCT INFO */}
      <div className="flex gap-4 border-b border-gray-300 pb-4">
        <div className="relative w-24 h-24 border border-gray-300 rounded">
          <Image
            src={productDetails?.coverImage?.url ?? ""} // product image
            alt="Product"
            fill
            className="object-cover"
          />
        </div>

        <div>
          <p className="font-medium text-gray-800">{productDetails?.name}</p>
          <p className="text-sm text-gray-500">{productDetails?.brand?.name}</p>
        </div>
      </div>

      {/* RATING */}
      <div className="mt-6">
        <p className="font-medium mb-2">Rate this product</p>

        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              <Star
                size={28}
                className={`${
                  star <= (hover || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* REVIEW TITLE */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-1">Review title</label>
        <input
          type="text"
          placeholder="Eg: Very good product"
          className="w-full border   border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
      </div>

      {/* REVIEW TEXT */}
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Your review</label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Share details of your experience"
          className="w-full border  border-gray-300  rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* IMAGE UPLOAD */}
      <div className="mt-4">
        <p className="text-sm font-medium mb-1">
          Supported Files &#40;optional&#41;
        </p>

        <label className="inline-flex items-center gap-2 px-4 py-2 border  border-gray-300 rounded cursor-pointer text-sm hover:bg-gray-50">
          <input
            type="file"
            ref={fileInputRef}
            multiple
            hidden
            accept="image/*,video/*"
            onChange={handleFileChange}
          />
          📷 Upload Photos / Videos
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
          {supportingFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-50 hover:bg-gray-100 transition-all"
            >
              {/* Dismiss button */}
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 z-10 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                aria-label={`Remove ${file.name}`}
              >
                ×
              </button>

              {/* File preview/thumbnail */}
              <div className="aspect-square flex items-center justify-center">
                {file.type.startsWith("image/") && file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : file.type.startsWith("video/") && file.preview ? (
                  <div className="relative w-full h-full">
                    <video
                      src={file.preview}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl">🎬</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4">
                    <span className="text-2xl mb-2">{getFileIcon(file)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUBMIT */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          className="
              mt-3 sm:mt-auto flex items-center justify-center gap-2
              text-white font-semibold
              text-xs sm:text-sm md:text-[15px]
              px-3 py-1.5 sm:px-4 sm:py-2 md:px-5
              rounded-full
              bg-linear-to-r from-green-500 to-emerald-600
              shadow-md shadow-green-500/30
              transition-all duration-300
              hover:from-emerald-600 hover:to-green-500
              hover:shadow-lg hover:scale-[1.03]
              active:scale-95
              w-full sm:w-fit
            "
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}
