"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import AddressForm, { Address } from "./AddressForm";
import { useCustomer } from "@/context/CustomerContext";

interface Props {
  onClose: () => void;
  onSuccess: (addressId: string) => void;
}

const emptyForm: Address = {
  name: "",
  mobile: "",
  alternateMobile: "",
  pin: "",
  area: "",
  city: "",
  state: "",
  landmark: "",
  type: "Home",
};

export default function AddAddressModal({ onClose, onSuccess }: Props) {
  const { customer } = useCustomer();
  const [form, setForm] = useState<Address>(emptyForm);
  const [loading, setLoading] = useState(false);

  const isValidMobile = (v: string) => /^\d{10}$/.test(v);
  const isValidPin = (v: string) => /^\d{6}$/.test(v);

  const handleSave = async () => {
    if (!customer?._id) return;

    // 🔐 Validation
    if (
      !form.name ||
      !form.mobile ||
      !form.pin ||
      !form.area ||
      !form.city ||
      !form.state
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!isValidMobile(form.mobile)) {
      toast.error("Mobile must be 10 digits");
      return;
    }

    if (form.alternateMobile && !isValidMobile(form.alternateMobile)) {
      toast.error("Alternate mobile must be 10 digits");
      return;
    }

    if (!isValidPin(form.pin)) {
      toast.error("Pin code must be 6 digits");
      return;
    }

    try {
      setLoading(true);

const existing = customer.addresses || [];

const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/customer/${customer._id}/address`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(form),
  }
);

const data = await res.json();

if (!res.ok || !data.address?._id) {
  throw new Error("Failed to add address");
}

toast.success("Address added");

// 🔥 auto-select new address
onSuccess(data.address._id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-2xl rounded-md p-6 relative animate-fadeIn">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-defined-black">
            Add New Address
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <AddressForm
          form={form}
          onChange={(f) => setForm(f)}
        />

        {/* ACTIONS */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md text-sm border border-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-6 py-2 rounded-md text-sm text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-defined-green hover:bg-green-700"
            }`}
          >
            {loading ? "Saving..." : "Save & Deliver Here"}
          </button>
        </div>
      </div>
    </div>
  );
}
