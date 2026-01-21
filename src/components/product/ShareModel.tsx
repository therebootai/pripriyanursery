"use client";

import { X, Link2 } from "lucide-react";
import {
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  open,
  onClose,
  url,
}) => {
  if (!open) return null;

  const share = (platform: "whatsapp" | "facebook" | "instagram" | "copy") => {
    if (platform === "whatsapp") {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(url)}`,
        "_blank"
      );
    }

    if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        "_blank"
      );
    }

    if (platform === "instagram") {
      navigator.clipboard.writeText(url);
      alert("Link copied for Instagram");
    }

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      alert("Link copied");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/40 flex items-end md:items-center justify-center">
      {/* Modal */}
      <div className="bg-white w-full md:w-[360px] rounded-t-2xl md:rounded-2xl p-5 animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-defined-black">
            Share Product
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Share Options */}
        <div className="grid grid-cols-4 gap-4 text-center">
          {/* WhatsApp */}
          <button
            onClick={() => share("whatsapp")}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white">
              <FaWhatsapp size={22} />
            </div>
            <span className="text-xs">WhatsApp</span>
          </button>

          {/* Facebook */}
          <button
            onClick={() => share("facebook")}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <FaFacebookF size={20} />
            </div>
            <span className="text-xs">Facebook</span>
          </button>

          {/* Instagram */}
          <button
            onClick={() => share("instagram")}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-400 flex items-center justify-center text-white">
              <FaInstagram size={20} />
            </div>
            <span className="text-xs">Instagram</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={() => share("copy")}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
              <Link2 size={20} />
            </div>
            <span className="text-xs">Copy</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
