"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import Image from "next/image";

type EditableFieldProps = {
  label?: string;
  value: string;
  placeholder?: string;
};

function EditableField({ value, placeholder }: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);

  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-md px-4 py-3">
      {!editing ? (
        <>
          <span className="text-sm text-gray-700">
            {text || placeholder}
          </span>
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
            className="flex-1  bg-transparent outline-none text-sm  border-gray-200"
          />

          <div className="flex items-center gap-2">
            <Check
              size={16}
              className="text-green-600 cursor-pointer"
              onClick={() => setEditing(false)}
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
  const [gender, setGender] = useState<"male" | "female" | "others">("male");

  return (
    <div className="bg-white rounded-md p-6 md:p-8 md:pb-30 relative overflow-hidden">
      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Your Personal Information
      </h2>

      {/* Editable Fields */}
      <div className="space-y-4 max-w-xl text-gray-700">
        <EditableField value="Abul Hasan" />
        <EditableField placeholder="Your mobile number" value="123456789" />
        <EditableField placeholder="Your email address" value="abc@gmail.com" />
      </div>

      {/* Gender */}
      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Your Gender
        </p>

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
                onChange={() =>
                  setGender(g as "male" | "female" | "others")
                }
                className="accent-green-600"
              />
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </label>
          ))}
        </div>
      </div>

    
      <div className="mt-8 flex flex-wrap gap-4">
        <button className="px-4 py-2 rounded-md text-sm bg-red-100 text-red-600 hover:bg-red-200">
          Delete Account
        </button>

        <button className="px-4 py-2 rounded-md text-sm bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
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
    </div>
  );
}
