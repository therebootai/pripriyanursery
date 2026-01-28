"use client";
import { useState, useEffect, useRef } from "react";
import { Star, X } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface FileWithPreview extends File {
  preview?: string;
}

interface ExistingFile {
  url: string;
  public_id: string;
  name?: string;
  type?: string;
}

interface ReviewData {
  _id: string;
  rating: number;
  title: string;
  description: string;
  supporting_files: { url: string; public_id: string }[];
}

export default function ReviewEdit({
  review,
  onClose,
  onUpdate,
}: {
  review: ReviewData;
  onClose?: () => void;
  onUpdate?: (updatedReview: ReviewData) => void;
}) {
  // Initialize state with existing review data
  const [rating, setRating] = useState(review.rating);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState(review.title);
  const [description, setDescription] = useState(review.description);
  const [supportingFiles, setSupportingFiles] = useState<FileWithPreview[]>([]);
  const [existingFiles, setExistingFiles] = useState<ExistingFile[]>(
    review.supporting_files.map((file) => ({
      ...file,
      name: file.url.split("/").pop() || "",
      type: getFileTypeFromUrl(file.url),
    })),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const nav = useRouter();

  // Helper function to determine file type from URL
  function getFileTypeFromUrl(url: string): string {
    const extension = url.split(".").pop()?.toLowerCase();
    if (
      ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")
    ) {
      return "image/*";
    }
    if (["mp4", "webm", "ogg", "mov", "avi"].includes(extension || "")) {
      return "video/*";
    }
    return "application/octet-stream";
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const filesArray: FileWithPreview[] = Array.from(selectedFiles);

    const filesWithPreviews = filesArray.map((file) => {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        const fileWithPreview: FileWithPreview = file;
        fileWithPreview.preview = URL.createObjectURL(file);
        return fileWithPreview;
      }
      return file;
    });

    setSupportingFiles((prev) => [...prev, ...filesWithPreviews]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove newly uploaded file
  const removeNewFile = (index: number) => {
    const fileToRemove = supportingFiles[index];

    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    setSupportingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove existing file
  const removeExistingFile = (publicId: string) => {
    setExistingFiles((prev) =>
      prev.filter((file) => file.public_id !== publicId),
    );
  };

  const getFileIcon = (file: File | ExistingFile) => {
    const fileType = "type" in file ? file.type : file.type;
    if (fileType?.startsWith("image/")) return "🖼️";
    if (fileType?.startsWith("video/")) return "🎬";
    return "📄";
  };

  const getFileName = (file: File | ExistingFile) => {
    return "name" in file ? file.name : file.name || "file";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || rating === 0) {
      alert("Please fill in all required fields and provide a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("rating", rating.toString());

      // Append existing files that should remain
      // The backend expects existing files with public_id to be included
      const remainingFiles = existingFiles.map((file) => ({
        url: file.url,
        public_id: file.public_id,
      }));

      // Convert to JSON string since FormData can't handle arrays directly
      formData.append("images", JSON.stringify(remainingFiles));

      // Append new files as images (matches backend expectation)
      supportingFiles.forEach((file) => {
        formData.append("images", file); // Note: same field name as existing files JSON
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/review/${review._id}`,
        {
          method: "PUT",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error(`Failed to update review: ${response.statusText}`);
      }

      const updatedReview = await response.json();

      alert("Review updated successfully!");

      // Cleanup preview URLs
      supportingFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    } catch (error: any) {
      console.error("Error updating review:", error);
      alert(error.message || "Failed to update review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Alternative handleSubmit for backend expecting different format
  const handleSubmitAlternative = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || rating === 0 ) {
      toast.error("Please fill in all required fields and provide a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("rating", rating.toString());

      // Since your backend looks for req.files.images, we need to append new files
      supportingFiles.forEach((file) => {
        formData.append("images", file);
      });

      // For existing files, we need to append them differently
      // Your backend looks for req.body.images for existing files
      // Let's send them as a JSON string
      if (existingFiles.length > 0) {
        const existingFilesData = existingFiles.map((file) => ({
          url: file.url,
          public_id: file.public_id,
        }));
        formData.append("images", JSON.stringify(existingFilesData));
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/review/${review._id}`,
        {
          method: "PUT",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to update review: ${response.statusText}`);
      }

      const updatedReview = await response.json();

      toast.success("Review updated successfully!");

      if (onUpdate) {
        onUpdate(updatedReview);
      }

      if (onClose) {
        onClose();
      }

      // Cleanup preview URLs
      supportingFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });

      nav.push("/my-reviews");
    } catch (error: any) {
      console.error("Error updating review:", error);
      toast.error(
        error.message || "Failed to update review. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
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

  // Reset form when review changes
  useEffect(() => {
    setRating(review.rating);
    setTitle(review.title);
    setDescription(review.description);
    setExistingFiles(
      review.supporting_files.map((file) => ({
        ...file,
        name: file.url.split("/").pop() || "",
        type: getFileTypeFromUrl(file.url),
      })),
    );
    setSupportingFiles([]);
  }, [review]);

  return (
    <form
      className="max-w-225 mx-auto bg-white px-4 rounded-md shadow-sm py-8 md:my-6"
      onSubmit={handleSubmitAlternative} // Using alternative for testing
    >
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
        <label className="block text-sm font-medium mb-1">Review title *</label>
        <input
          type="text"
          placeholder="Eg: Very good product"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
        />
      </div>

      {/* REVIEW TEXT */}
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Your review *</label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Share details of your experience"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      {/* EXISTING FILES */}
      {existingFiles.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-1">Current Files</p>
          <p className="text-xs text-gray-500 mb-2">
            Remove files you want to delete from the review
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {existingFiles.map((file) => (
              <div
                key={`existing-${file.public_id}`}
                className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-50 hover:bg-gray-100 transition-all"
              >
                <button
                  type="button"
                  onClick={() => removeExistingFile(file.public_id)}
                  className="absolute top-1 right-1 z-10 w-6 h-6 text-red-500 rounded-full flex items-center justify-center text-xs hover:text-red-600 transition-colors"
                  aria-label={`Remove ${getFileName(file)}`}
                >
                  <X />
                </button>
                <div className="aspect-square flex items-center justify-center">
                  {file.type?.startsWith("image/") ? (
                    <img
                      src={file.url}
                      alt={getFileName(file)}
                      className="w-full h-full object-cover"
                    />
                  ) : file.type?.startsWith("video/") ? (
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl">🎬</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4">
                      <span className="text-2xl mb-2">{getFileIcon(file)}</span>
                      <span className="text-xs text-center break-words px-2">
                        {getFileName(file)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW FILE UPLOAD */}
      <div className="mt-6">
        <p className="text-sm font-medium mb-1">Add More Files (optional)</p>
        <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded cursor-pointer text-sm hover:bg-gray-50">
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

        {supportingFiles.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-1">
              New Files to Upload ({supportingFiles.length})
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {supportingFiles.map((file, index) => (
                <div
                  key={`new-${file.name}-${index}`}
                  className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-50 hover:bg-gray-100 transition-all"
                >
                  {/* <button
                    type="button"
                    onClick={() => removeNewFile(index)}
                    className="absolute top-1 right-1 z-10 w-6 h-6 text-red-500 flex items-center justify-center text-xs hover:text-red-600 transition-colors"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X />
                  </button> */}
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
                        <span className="text-2xl mb-2">
                          {getFileIcon(file)}
                        </span>
                        <span className="text-xs text-center break-words px-2">
                          {file.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
             mt-3 sm:mt-auto flex items-center justify-center gap-2
              text-white font-semibold
              text-xs sm:text-sm md:text-[15px]
              px-3 py-1.5 sm:px-4 sm:py-2 md:px-5
              rounded-full
              bg-linear-to-r
              shadow-md shadow-green-500/30
              transition-all duration-300
              hover:from-emerald-600 hover:to-green-500
              hover:shadow-lg hover:scale-[1.03]
              active:scale-95
              w-full sm:w-fit
            ${
              isSubmitting
                ? "from-emerald-600 hover:to-green-500 cursor-not-allowed"
                : "from-green-500 to-emerald-600"
            }
          `}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Updating...
            </>
          ) : (
            "Update Review"
          )}
        </button>
      </div>
    </form>
  );
}
