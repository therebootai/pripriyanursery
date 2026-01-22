"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { useCustomer } from "@/context/CustomerContext";
import toast from "react-hot-toast";
import AddressForm from "./AddressForm";

type AddressType = "Home" | "Office" | "Others";

export type Address = {
  _id?: string;
  name: string;
  mobile: string;
  alternateMobile?: string;
  pin: string;
  area: string;
  city: string;
  state: string;
  landmark?: string;
  type: AddressType;
};

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

export default function ManageAddress() {
  const { customer } = useCustomer();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState<Address | null>(null);
  const initialized = useRef(false);

  /* ================= INIT ================= */
  useEffect(() => {
    if (!customer?.addresses) return;
    if (!initialized.current) {
      setAddresses(customer.addresses as Address[]);
      initialized.current = true;
    }
  }, [customer?._id]);

  /* ================= CREATE ================= */
  const createAddress = async () => {
    if (!customer?._id || !form) return;

    try {
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
      if (!res.ok || !data.address) throw new Error();

      setAddresses((prev) => [...prev, data.address]);
      toast.success("Address added");
      setForm(null);
    } catch {
      toast.error("Failed to add address");
    }
  };

  /* ================= UPDATE ================= */
  const updateAddress = async () => {
    if (!customer?._id || !form?._id) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customer/${customer._id}/address/${form._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.address) throw new Error();

      setAddresses((prev) =>
        prev.map((a) => (a._id === form._id ? data.address : a))
      );
      toast.success("Address updated");
      setForm(null);
    } catch {
      toast.error("Failed to update address");
    }
  };

  /* ================= DELETE ================= */
  const removeAddress = async (id?: string) => {
    if (!customer?._id || !id) return;

    const prev = addresses;
    setAddresses((a) => a.filter((x) => x._id !== id));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customer/${customer._id}/address/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error();
      toast.success("Address removed");
    } catch {
      setAddresses(prev);
      toast.error("Failed to remove address");
    }
  };

  return (
    <div className="bg-white rounded-md lg:p-6 space-y-6">
      <button
        onClick={() => setForm({ ...emptyForm })}
        className="bg-defined-green text-white px-4 py-2 rounded-md text-sm"
      >
        + Add Address
      </button>

      {/* FORM */}
      {form && (
        <div className="border border-gray-200 rounded-md p-4 space-y-4">
          <AddressForm form={form} onChange={setForm} />

          <div className="flex gap-3">
            <button
              onClick={form._id ? updateAddress : createAddress}
              className="bg-defined-green text-white px-5 py-2 rounded-md text-sm"
            >
              {form._id ? "Update Address" : "Save Address"}
            </button>

            <button
              onClick={() => setForm(null)}
              className="border px-5 py-2 rounded-md text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* SAVED ADDRESSES */}
      <div className="space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="border border-gray-200 rounded-md p-4 flex justify-between"
          >
            <div>
              <span className="text-xs bg-defined-green text-white px-2 py-0.5 rounded">
                {addr.type}
              </span>

              <p className="font-semibold mt-1">
                {addr.name}{" "}
                <span className="text-sm text-gray-500">| {addr.mobile}</span>
              </p>

              <p className="text-sm text-gray-600">
                {[addr.area, addr.city, addr.state, addr.pin]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>

            <div className="flex gap-3">
              <Pencil
                size={16}
                className="text-green-600 cursor-pointer"
                onClick={() => setForm(addr)}
              />
              <Trash2
                size={16}
                className="text-red-500 cursor-pointer"
                onClick={() => removeAddress(addr._id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
