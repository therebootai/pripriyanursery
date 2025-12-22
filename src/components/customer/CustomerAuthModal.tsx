"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { sendOtp, verifyOtp } from "@/library/api";
import { useRouter } from "next/navigation";

type Step = "MOBILE" | "OTP";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomerLoginModal({ isOpen, onClose }: Props) {
  const router = useRouter();

  const [step, setStep] = useState<Step>("MOBILE");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // ------------------ HANDLERS ------------------

  const handleSendOtp = async () => {
    if (loading || mobile.length !== 10) return;

    try {
      setLoading(true);
      await sendOtp(mobile);
      setStep("OTP");
    } catch {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

 const handleVerifyOtp = async () => {
   if (loading || otp.length !== 6) return;

   try {
     setLoading(true);
     const res = await verifyOtp(mobile, otp);

     localStorage.setItem("customer", JSON.stringify(res.customer));

     setMobile("");
     setOtp("");
     setStep("MOBILE");

     onClose();
     router.push("/myaccount");
   } catch {
     alert("Invalid or expired OTP");
   } finally {
     setLoading(false);
   }
 };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-[820px] mx-4">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:-top-4 md:-right-10 text-white z-10"
        >
          <X size={22} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_2.8fr] rounded-xl overflow-hidden bg-white">
          {/* LEFT */}
          <div className="hidden md:flex bg-defined-green text-white p-10 flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-3">
                {step === "MOBILE" ? "Welcome Back" : "Verify OTP"}
              </h2>
              <p className="text-sm opacity-90 leading-relaxed">
                {step === "MOBILE"
                  ? "Login or sign up instantly using your mobile number"
                  : `OTP sent to +91 ${mobile}`}
              </p>
            </div>

            <Image
              src="/assets/globals/login.png"
              alt="login"
              width={420}
              height={420}
              className="mt-8"
            />
          </div>

          {/* RIGHT */}
          <div className="p-8 md:p-10">
            {step === "MOBILE" && (
              <>
                <h3 className="text-lg font-semibold text-gray-800">
                  Enter Mobile Number
                </h3>

                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  className="w-full border text-defined-green placeholder:text-defined-green border-gray-300 rounded-md px-4 py-3 mt-5 outline-none"
                />

                <p className="text-xs text-gray-500 mt-3">
                  You’ll receive an OTP on WhatsApp
                </p>

                <button
                  onClick={handleSendOtp}
                  disabled={loading || mobile.length !== 10}
                  className="w-full bg-defined-green text-white py-3 rounded-md mt-6 disabled:opacity-60"
                >
                  {loading ? "Sending OTP..." : "Continue"}
                </button>
              </>
            )}

            {step === "OTP" && (
              <>
                <h3 className="text-lg font-semibold text-gray-800">
                  Enter OTP
                </h3>

                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-defined-green placeholder:text-defined-green border border-gray-300 rounded-md px-4 py-3 mt-5 outline-none"
                />

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-defined-green text-white py-3 rounded-md mt-6 disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify & Continue"}
                </button>

                <button
                  onClick={() => setStep("MOBILE")}
                  className="block text-sm text-green-600 mt-4 underline text-center"
                >
                  Change mobile number
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
