"use client";

import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";

type AddressType = "Home" | "Officez" | "Others";

type Address = {
  id: number;
  name: string;
  mobile: string;
  altMobile?: string;
  pincode: string;
  area: string;
  city: string;
  state: string;
  country: string;
  type: AddressType;
};

const emptyForm: Address = {
  id: 0,
  name: "",
  mobile: "",
  altMobile: "",
  pincode: "",
  area: "",
  city: "",
  state: "",
  country: "",
  type: "Home",
};

export default function ManageAddress() {
  const [form, setForm] = useState<Address>(emptyForm);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const handleChange = (key: keyof Address, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const saveAddress = () => {
    if (!form.name || !form.mobile) return;

    setAddresses([
      ...addresses,
      { ...form, id: Date.now() },
    ]);
    setForm(emptyForm);
  };

  const removeAddress = (id: number) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  return (
    <div className="bg-white rounded-md p-6 space-y-8">
      {/* ADD ADDRESS */}
      <div className="border-[0.3px] border-gray-200 rounded-md p-4">
        <p className="text-sm font-medium text-gray-700 mb-4">
          + Add Address
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(v) => handleChange("name", v)}
          />
          <Input
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={(v) => handleChange("mobile", v)}
          />
          <Input
            placeholder="Pin Code"
            value={form.pincode}
            onChange={(v) => handleChange("pincode", v)}
          />
          <Input
            placeholder="Area and Street/Landmark"
            value={form.area}
            onChange={(v) => handleChange("area", v)}
          />
          <Input
            placeholder="City"
            value={form.city}
            onChange={(v) => handleChange("city", v)}
          />
          <Input
            placeholder="State"
            value={form.state}
            onChange={(v) => handleChange("state", v)}
          />
          <Input
            placeholder="Country"
            value={form.country}
            onChange={(v) => handleChange("country", v)}
          />
          <Input
            placeholder="Alternative Phone Number"
            value={form.altMobile}
            onChange={(v) => handleChange("altMobile", v)}
          />
        </div>

        {/* Address Type */}
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Address type
          </p>

          <div className="flex gap-6 text-sm">
            {(["Home", "Office", "Others"] as AddressType[]).map(
              (type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    checked={form.type === type}
                    onChange={() =>
                      setForm({ ...form, type })
                    }
                    className="accent-green-600"
                  />
                  {type}
                </label>
              )
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={saveAddress}
            className="bg-green-600 text-white px-5 py-2 rounded-md text-sm hover:bg-green-700"
          >
            Save Address
          </button>

          <button
            onClick={() => setForm(emptyForm)}
            className="bg-yellow-400 text-black px-5 py-2 rounded-md text-sm hover:bg-yellow-500"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* SAVED ADDRESSES */}
      <div className="space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="border-[0.3px] border-gray-200 rounded-md p-4 flex justify-between items-start"
          >
            <div>
              <span className="inline-block text-xs bg-define-green text-white px-2 py-[2px] rounded">
                {addr.type}
              </span>

              <p className="font-medium mt-2">
                {addr.name}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                {addr.area}, {addr.city}, {addr.state} -{" "}
                {addr.pincode}, {addr.country}
              </p>
            </div>

            <div className="flex gap-3">
              <Trash2
                size={16}
                className="text-red-500 cursor-pointer"
                onClick={() => removeAddress(addr.id)}
              />
              <Pencil
                size={16}
                className="text-green-600 cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* INPUT COMPONENT */
function Input({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border-[0.3px] border-gray-200 rounded-md px-4 py-3 text-sm w-full focus:outline-none focus:border-gray-200"
    />
  );
}
