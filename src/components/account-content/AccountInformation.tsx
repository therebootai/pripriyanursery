"use client";

import { useEffect, useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import Image from "next/image";
import { useCustomer } from "@/context/CustomerContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { logout } from "@/library/api";
import ConfirmModal from "../ui/ConfirmModal";


type EditableFieldProps = {
  value: string;
  placeholder?: string;
  fieldKey: string;
  onSave: (key: string, value: string) => Promise<void>;
};

function EditableField({
  value,
  placeholder,
  fieldKey,
  onSave,
}: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave(fieldKey, text);
      setEditing(false);
    } catch {
      setText(value);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-md px-4 py-3">
      {!editing ? (
        <>
          <span className="text-sm text-gray-700">{text || placeholder}</span>
          <Pencil
            size={16}
            className="text-gray-500 cursor-pointer"
            onClick={() => setEditing(true)}
          />
        </>
      ) : (
        <>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-sm"
          />

          <div className="flex items-center gap-2">
            <Check
              size={16}
              className={`cursor-pointer ${
                loading ? "opacity-50" : "text-green-600"
              }`}
              onClick={!loading ? handleSave : undefined}
            />
            <X
              size={16}
              className="text-red-500 cursor-pointer"
              onClick={() => {
                setText(value);
                setEditing(false);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}


export default function AccountInformation() {  
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
   const { customer, setCustomer } = useCustomer();
    const [gender, setGender] = useState(customer?.gender || "male");
  
  const updateField = async (key: string, value: string) => {
    if (!customer?._id || !value.trim()) return;

     if (key === "mobile" && !value.startsWith("91")) {
       toast.error("Mobile number should start with 91");
       throw new Error("Invalid phone");
     }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/customer/${customer._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ [key]: value }),
      }
    );

    if (!res.ok) {
      toast.error("Update failed");
      return;
    }

    const data = await res.json();

    setCustomer(data.data);
    localStorage.setItem("customer", JSON.stringify(data.data));

    toast.success("Update successful");
  };

  const deleteAccount = async () => {
    if (!customer?._id) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/customer/${customer._id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!res.ok) {
      toast.error("Failed to delete account");
      return;
    }

    toast.success("Account deleted");
    await logout();
    router.replace("/");
  };

const deactivateAccount = async () => {
  try {
    await updateField("status", "false");
    toast.success("Account deactivated");
    await logout();
    router.replace("/");
  } catch {}
};

  
    useEffect(() => {
      if (!customer) return;

      updateField("gender", gender);
    }, [gender]);


  return (
    <div className="bg-white rounded-md p-6 md:p-8 md:pb-30 relative overflow-hidden">
      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Your Personal Information
      </h2>

      {/* Editable Fields */}
      <div className="space-y-4 max-w-xl text-gray-700">
        <EditableField
          value={customer?.name || ""}
          fieldKey="name"
          placeholder="Your name"
          onSave={updateField}
        />

        <EditableField
          value={customer?.mobile || ""}
          fieldKey="mobile"
          placeholder="Your mobile number"
          onSave={updateField}
        />

        <EditableField
          value={customer?.email || ""}
          fieldKey="email"
          placeholder="Your email address"
          onSave={updateField}
        />
      </div>

      {/* Gender */}
      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Your Gender</p>

        <div className="flex items-center gap-6 text-sm ">
          {["male", "female", "others"].map((g) => (
            <label
              key={g}
              className="flex items-center gap-2 cursor-pointer text-gray-700"
            >
              <input
                type="radio"
                name="gender"
                checked={gender === g}
                onChange={() => setGender(g as "male" | "female" | "others")}
                className="accent-defined-green"
              />
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          className="px-4 py-2 rounded-md text-sm bg-red-100 text-red-600 hover:bg-red-200"
          onClick={() => setDeleteOpen(true)}
        >
          Delete Account
        </button>

        <button
          className="px-4 py-2 rounded-md text-sm bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
          onClick={() => setDeactivateOpen(true)}
        >
          De-active Account
        </button>
      </div>

      <div className="hidden md:block absolute right-6 bottom-0 opacity-70 ">
        <Image
          src="/assets/globals/login.png"
          alt="login"
          width={1000}
          height={1000}
        />
      </div>
      <ConfirmModal
        open={deleteOpen}
        title="Delete Account"
        description="This action is permanent. Your account will be deleted."
        confirmText="Delete"
        onCancel={() => setDeleteOpen(false)}
        onConfirm={deleteAccount}
      />

      <ConfirmModal
        open={deactivateOpen}
        title="Deactivate Account"
        description="You can reactivate later by contacting support."
        confirmText="Deactivate"
        onCancel={() => setDeactivateOpen(false)}
        onConfirm={deactivateAccount}
      />
    </div>
  );
}
