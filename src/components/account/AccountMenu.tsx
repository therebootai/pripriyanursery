"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

type MenuSection = {
  title: string;
  items: string[];
};

const MENU: MenuSection[] = [
  {
    title: "Account Settings",
    items: ["Account Information", "Manage Address"],
  },
  {
    title: "Payments",
    items: ["UPI", "Cards", "Net Banking"],
  },
  {
    title: "My Integration",
    items: ["Payment API", "WhatsApp API"],
  },
];

export default function AccountMenu() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "Account Settings": true,
    Payments: true,
    "My Integration": true,
  });

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div className="mt-4 space-y-3">
      {MENU.map((section) => (
        <div key={section.title} className="rounded-md overflow-hidden">
          {/* Header */}
          <button
            onClick={() => toggleSection(section.title)}
            className="w-full flex justify-between items-center px-4 py-3 bg-green-100 text-green-800 font-medium"
          >
            {section.title}
            <ChevronDown
              size={16}
              className={`transition ${
                openSections[section.title] ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Items */}
          {openSections[section.title] && (
            <ul className="bg-white">
              {section.items.map((item) => (
                <li
                  key={item}
                  className="px-5 py-2 text-sm text-gray-700 hover:bg-green-50 cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
