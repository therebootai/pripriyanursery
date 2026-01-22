import React from 'react'

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


export default AddressForm;


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