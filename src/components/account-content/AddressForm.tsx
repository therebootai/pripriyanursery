import React from "react";
import { Address } from "./ManageAddress";

type AddressType = "Home" | "Office" | "Others";

function AddressForm({
  form,
  onChange,
}: {
  form: Address;
  onChange: (v: Address) => void;
}) {
  const update = (k: keyof Address, v: any) => onChange({ ...form, [k]: v });

  // Helper to handle numeric inputs (Mobile & Pin)
  // This ensures ONLY numbers are typed and enforces Max Length
  const handleNumericChange = (
    key: keyof Address,
    value: string,
    maxLength: number,
  ) => {
    // Regex: Only allow digits (0-9)
    const isNumeric = /^\d*$/.test(value);

    if (isNumeric && value.length <= maxLength) {
      update(key, value);
    }
  };

  async function fetchFromPin(e: React.ChangeEvent<HTMLInputElement>) {
    const pin = e.target.value;

    // Update the pin first
    update("pin", pin);

    try {
      if (pin.length !== 6) {
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pickup/location/${pin}`,
      );

      if (res.ok) {
        const data = await res.json();
        if (data.PostOffice && data.PostOffice.length > 0) {
          // Update both city and state from the API response
          update("city", data.PostOffice[0]?.District);
          update("state", data.PostOffice[0]?.State);
        }
      } else {
        console.error("Failed to fetch location data");
      }
    } catch (err) {
      console.error("Error fetching pin code details:", err);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <Input
          placeholder="Name *"
          value={form.name}
          onChange={(v) => update("name", v)}
        />

        {/* Mobile Number - Max 10, Numbers Only */}
        <div>
          <Input
            placeholder="Mobile Number *"
            value={form.mobile}
            maxLength={10}
            inputMode="numeric"
            onChange={(v) => handleNumericChange("mobile", v, 10)}
          />
          {/* Validation Error */}
          {form.mobile && form.mobile.length < 10 && (
            <p className="text-xs text-red-500 mt-1">Must be 10 digits</p>
          )}
        </div>

        {/* Pin Code - Max 6, Numbers Only */}
        <div>
          <Input
            placeholder="Pin Code *"
            value={form.pin}
            maxLength={6}
            inputMode="numeric"
            onChange={(v) => handleNumericChange("pin", v, 6)}
            onBlur={fetchFromPin}
          />
          {/* Validation Error */}
          {form.pin && form.pin.length < 6 && (
            <p className="text-xs text-red-500 mt-1">Must be 6 digits</p>
          )}
        </div>

        <Input
          placeholder="Area *"
          value={form.area}
          onChange={(v) => update("area", v)}
        />
        <Input
          placeholder="City *"
          value={form.city}
          onChange={(v) => update("city", v)}
        />
        <Input
          placeholder="State *"
          value={form.state}
          onChange={(v) => update("state", v)}
        />
        <Input
          placeholder="LandMark *"
          value={form.landmark}
          onChange={(v) => update("landmark", v)}
        />

        {/* Alternate Mobile - Max 10, Numbers Only */}
        <div>
          <Input
            placeholder="Alternative Phone"
            value={form.alternateMobile || ""}
            maxLength={10}
            inputMode="numeric"
            onChange={(v) => handleNumericChange("alternateMobile", v, 10)}
          />
          {/* Validation Error (Only show if user has started typing) */}
          {form.alternateMobile &&
            form.alternateMobile.length > 0 &&
            form.alternateMobile.length < 10 && (
              <p className="text-xs text-red-500 mt-1">Must be 10 digits</p>
            )}
        </div>
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

export default AddressForm;

// Updated Input Component to support maxLength and numeric keyboard
function Input({
  placeholder,
  value,
  onChange,
  maxLength,
  inputMode,
  onBlur,
}: {
  placeholder: string;
  value?: string;
  onChange: (v: string) => void;
  maxLength?: number;
  inputMode?: "text" | "numeric" | "tel" | "search" | "email" | "url";
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      maxLength={maxLength} // Prevents typing past limit
      inputMode={inputMode} // Shows number pad on mobile devices
      className="border-[0.3px] border-gray-200 outline-none rounded-md px-4 py-3 text-sm w-full"
    />
  );
}
