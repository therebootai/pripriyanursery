"use client";

import { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { useCustomer } from "@/context/CustomerContext";
import toast from "react-hot-toast";

type AddressType = "Home" | "Office" | "Others";

const isValidMobile = (v: string) => /^\d{10}$/.test(v)
const isValidPin = (v: string) => /^\d{6}$/.test(v);

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
  const { customer, refreshCustomer } = useCustomer();

  const [forms, setForms] = useState<Address[]>([]);
  const addresses = customer?.addresses || [];


  const updateAddresses = async (updated: Address[]) => {
    if (!customer?._id) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/customer/${customer._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ addresses: updated }),
      }
    );

    if (!res.ok) {
      toast.error("Failed to update addresses");
      return;
    }

    const data = await res.json();
    await refreshCustomer();
    toast.success("Address updated");
  };


  const addNewForm = () => {
    setForms([emptyForm, ...forms]);
  };


 const saveAll = async () => {
   if (!forms.length) return;

   for (const f of forms) {
     if (!f.name || !f.mobile || !f.pin || !f.area || !f.city || !f.state) {
       toast.error("Please fill all required address fields");
       return;
     }


  if (!isValidMobile(f.mobile)) {
    toast.error("Mobile must be 10 digits");
    return;
  }

  if (f.alternateMobile && !isValidMobile(f.alternateMobile)) {
    toast.error("Alternate mobile must be 10 digits");
    return;
  }


     if (!isValidPin(f.pin)) {
       toast.error("Pin code must be 6 digits");
       return;
     }
   }

   await updateAddresses([...forms, ...(addresses as Address[])]);
   setForms([]);
 };


  const removeAddress = async (id?: string) => {
    const updated = addresses.filter((a : Address) => a._id !== id) as Address[];
    await updateAddresses(updated);
  };


  const editAddress = (addr: Address) => {
    setForms([addr, ...forms]);
    removeAddress(addr._id);
  };

useEffect(() => {
  if (addresses.length === 0 && forms.length === 0) {
    setForms([emptyForm]);
  }
}, [addresses]);


  return (
    <div className="bg-white rounded-md lg:p-6 space-y-8">
      <button
        onClick={addNewForm}
        className="text-sm font-medium text-white rounded-xl bg-defined-green py-2 px-4 mb-4"
      >
        + Add Address
      </button>

      {/* FORMS */}
      {forms.map((form, idx) => (
        <div
          key={idx}
          className="border-[0.3px] border-gray-200 rounded-md p-4"
        >
          <AddressForm
            form={form}
            onChange={(f) =>
              setForms((prev) => prev.map((p, i) => (i === idx ? f : p)))
            }
          />
        </div>
      ))}

      {forms.length > 0 && (
        <button
          onClick={saveAll}
          className="bg-defined-green text-white px-5 py-2 rounded-md text-sm"
        >
          Save Address
        </button>
      )}

      {/* SAVED ADDRESSES */}
      <div className="space-y-4">
        {addresses.map((addr : Address) => (
          <div
            key={addr._id}
            className="border-[0.3px] border-gray-200 rounded-md p-4 flex justify-between gap-4"
          >
            <div className="space-y-1">
              <span className="inline-block text-xs bg-defined-green text-white px-2 py-0.5 rounded">
                {addr.type}
              </span>

              <p className="text-gray-800 font-semibold">
                {addr.name}
                {addr.mobile && (
                  <span className="text-sm text-gray-500 ml-2">
                    | {addr.mobile}
                  </span>
                )}
              </p>

              <p className="text-sm text-gray-600 leading-relaxed">
                {[addr.area, addr.city, addr.state, addr.pin]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              {addr.alternateMobile && (
                <p className="text-xs text-gray-500">
                  Alternate: {addr.alternateMobile}
                </p>
              )}
            </div>

            <div className="flex gap-3 shrink-0">
              <Trash2
                size={16}
                className="text-red-500 cursor-pointer"
                onClick={() => removeAddress(addr._id)}
              />
              <Pencil
                size={16}
                className="text-green-600 cursor-pointer"
                onClick={() => editAddress({ ...addr, type: addr.type as AddressType })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- FORM ---------------- */

function AddressForm({
  form,
  onChange,
}: {
  form: Address;
  onChange: (v: Address) => void;
}) {
  const update = (k: keyof Address, v: any) => onChange({ ...form, [k]: v });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">        
        <Input
          placeholder="Name"
          value={form.name}
          onChange={(v) => update("name", v)}
        />
        <Input
          placeholder="Mobile Number"
          value={form.mobile}
          onChange={(v) => update("mobile", v)}
        />
        <Input
          placeholder="Pin Code"
          value={form.pin}
          onChange={(v) => update("pin", v)}
        />
        <Input
          placeholder="Area"
          value={form.area}
          onChange={(v) => update("area", v)}
        />
        <Input
          placeholder="City"
          value={form.city}
          onChange={(v) => update("city", v)}
        />
        <Input
          placeholder="State"
          value={form.state}
          onChange={(v) => update("state", v)}
        />
        <Input
          placeholder="LandMark"
          value={form.landmark}
          onChange={(v) => update("landmark", v)}
        />
        <Input
          placeholder="Alternative Phone"
          value={form.alternateMobile}
          onChange={(v) => update("alternateMobile", v)}
        />
      </div>

      <div className="mt-4 flex gap-6 text-sm text-defined-green">
        {(["Home", "Office", "Others"] as AddressType[]).map((t) => (
          <label key={t} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={form.type === t}
              onChange={() => update("type", t)}
            />
            {t}
          </label>
        ))}
      </div>
    </>
  );
}

/* ---------------- INPUT ---------------- */

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
      className="border-[0.3px] border-gray-200 outline-none rounded-md px-4 py-3 text-sm w-full"
    />
  );
}
