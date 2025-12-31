"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  User,
  Headphones,
  Menu,
  X,
  LogOut,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import CustomerAuthModal from "../customer/CustomerAuthModal";
import { useCustomer } from "@/context/CustomerContext";
import { usePathname, useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

type SearchItem = {
  type: "product" | "category" | "brand" | "attribute";
  name: string;
  slug?: string;
  image?: string;
};

export default function Header() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const [results, setResults] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
const inputRef = useRef<HTMLDivElement>(null);
const dropdownRef = useRef<HTMLDivElement>(null);

  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [language, setLanguage] = useState("ENG");

  const { customer, loading, logoutCustomer } = useCustomer();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(-1);

  const languages = [
    { label: "English", code: "ENG" },
    { label: "Bengali", code: "BEN" },
    { label: "Hindi", code: "HIN" },
  ];

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/search?q=${debouncedQuery}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setResults(data.results);
          setShow(true);
        }
      });
  }, [debouncedQuery]);

  const fetchSuggestions = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/search/suggestions`
    );
    const data = await res.json();
    if (data.success) {
      setSuggestions(data.results);
    }
  };

  const rankResults = (items: SearchItem[]) => {
    const priority = {
      product: 1,
      category: 2,
      brand: 3,
      attribute: 4,
    } as Record<string, number>;

    return [...items].sort((a, b) => priority[a.type] - priority[b.type]);
  };

  const handleSearchClick = (item: any) => {
    setShow(false);
    setQuery("");

    switch (item.type) {
      case "product":
        router.push(`/product/${item.slug}`);
        break;

      case "category":
        router.push(`/products?category=${encodeURIComponent(item.name)}`);
        break;

      case "brand":
        router.push(`/products?brand=${encodeURIComponent(item.name)}`);
        break;

      case "attribute":
        router.push(`/products?attributes=${encodeURIComponent(item.name)}`);
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!show) return;

    const list = query ? results : suggestions;
    if (!list.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % list.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + list.length) % list.length);
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSearchClick(list[activeIndex]);
    }

    if (e.key === "Escape") {
      setShow(false);
    }
  };

  /* ================= OUTSIDE CLICK ================= */

useEffect(() => {
  const handler = (e: MouseEvent) => {
    const target = e.target as Node;

    if (
      inputRef.current?.contains(target) ||
      dropdownRef.current?.contains(target)
    ) {
      return;
    }

    setShow(false);
    setActiveIndex(-1);
  };

   document.addEventListener("pointerdown", handler, true); 
  return () => {
    document.removeEventListener("pointerdown", handler, true);
  };
}, []);


  /* ================= RENDER ================= */

  const list = query ? results : suggestions;

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="mx-auto max-w-[1300px] px-4">
        {/* TOP BAR */}
        <div className="flex h-14 md:h-20 items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/assets/Pri Priya Nursery Logo.png"
              alt="Pri Priya Nursery Logo"
              width={80}
              height={80}
              priority
              className="w-[55px] h-[55px] md:w-[80px] md:h-[80px] p-2"
            />
          </Link>

          {/* SEARCH (always visible) */}
          <div ref={inputRef} className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-defined-green "
                size={18}
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  if (!query) {
                    fetchSuggestions();
                    setShow(true);
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search products..."
                className="w-full rounded-full text-defined-green placeholder:text-defined-green bg-gray-100 py-2 pl-10 pr-4 text-sm outline-none"
              />
            </div>
            {show && (
              <div ref={dropdownRef} className="absolute z-50 mt-2 w-[50rem] rounded-lg bg-white shadow-lg">
                {/* 🔥 RANDOM / POPULAR SUGGESTIONS */}
                {!query && suggestions.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500">
                      Suggestions
                    </div>

                    {suggestions.map((item, idx) => (
                      <button
                        key={`suggest-${idx}`}
                        onClick={() => handleSearchClick(item)}
                        className="flex w-full items-center gap-3 px-4 py-2 hover:bg-gray-100 text-left"
                      >
                        {item.type === "product" && item.image && (
                          <Image
                            src={item.image}
                            alt=""
                            width={32}
                            height={32}
                          />
                        )}

                        <span className="text-sm text-gray-500">
                          <b>{item.name}</b>
                          <span className="ml-2 text-xs text-gray-500">
                            {item.type}
                          </span>
                        </span>
                      </button>
                    ))}
                  </>
                )}

                {/* 🔎 LIVE SEARCH RESULTS */}
                {query && results.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500">
                      Results
                    </div>

                    {results.map((item, idx) => (
                      <button
                        key={`result-${idx}`}
                        onClick={() => handleSearchClick(item)}
                        className="flex w-full items-center gap-3 px-4 py-2 hover:bg-gray-100 text-left"
                      >
                        {item.type === "product" && item.image && (
                          <Image
                            src={item.image}
                            alt=""
                            width={32}
                            height={32}
                          />
                        )}

                        <span className="text-sm text-gray-500">
                          <b>{item.name}</b>
                          <span className="ml-2 text-xs text-gray-500">
                            {item.type}
                          </span>
                        </span>
                      </button>
                    ))}
                  </>
                )}

                {/* ❌ NO RESULTS */}
                {query && results.length === 0 && (
                  <div className="px-4 py-3 text-sm text-gray-400">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-defined-green"
              >
                <Image
                  src="/assets/globals/indianflag.png"
                  alt="India"
                  width={20}
                  height={14}
                />
                {language}
                <ChevronDown size={16} />
              </button>

              {langOpen && (
                <ul className="absolute mt-2 w-40 rounded-md text-defined-green  bg-white shadow-lg">
                  {languages.map((lang) => (
                    <li key={lang.code}>
                      <button
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-defined-green  hover:bg-gray-100"
                      >
                        {lang.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* AUTH */}
            {!customer ? (
              <button
                onClick={() => setIsSignupOpen(true)}
                className="rounded-full bg-gray-100 px-6 py-3 text-sm font-bold text-defined-green  flex gap-1"
              >
                Login <User size={16} />
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="rounded-full bg-gray-100 px-6 py-3 text-sm font-bold text-defined-green flex items-center gap-1"
                >
                  {customer?.name ? customer.name : "User"}{" "}
                  <ChevronDown size={16} />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-md bg-white shadow-lg border">
                    <Link
                      href="/my-account"
                      className="flex items-center gap-2 px-4 py-3 text-defined-green  hover:bg-gray-100"
                    >
                      <UserIcon size={16} /> My Account
                    </Link>

                    <button
                      onClick={async () => {
                        await logoutCustomer();
                        router.push("/");
                      }}
                      className="flex w-full items-center gap-2 px-4 py-3 text-red-600 hover:bg-gray-100"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <Link
              href="/cart"
              className="rounded-full bg-gray-100 px-6 py-3 text-sm text-defined-green  font-bold flex gap-1"
            >
              Cart <ShoppingCart size={16} />
            </Link>

            <Link
              href="#"
              className="rounded-full bg-green-600 px-6 py-3 text-sm font-bold text-white  flex gap-1 items-center"
            >
              Support <Headphones size={16} />
            </Link>
          </div>

          {/* MOBILE MENU ICON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-defined-green "
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden space-y-4 mt-2 pb-4 text-defined-green">
            {/* Mobile Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2"
                size={18}
              />
              <input
                placeholder="Search"
                className="w-full rounded-lg bg-gray-100 text-defined-green py-2 pl-10 pr-4 outline-none"
              />
            </div>

            {!loading && !customer && (
              <button
                onClick={() => setIsSignupOpen(true)}
                className="w-full rounded-full bg-gray-100 py-3 font-bold"
              >
                Login
              </button>
            )}

            {!loading && customer && (
              <>
                <Link
                  href="/my-account"
                  className="block rounded-full bg-gray-100 py-3 text-center font-bold"
                >
                  My Account
                </Link>

                <button
                  onClick={async () => {
                    await logoutCustomer();
                    router.replace("/");
                  }}
                  className="w-full rounded-full bg-red-100 py-3 font-bold text-red-600"
                >
                  Logout
                </button>
              </>
            )}

            <Link
              href="/cart"
              className="block rounded-lg bg-gray-100 py-3 text-center"
            >
              Cart
            </Link>

            <Link
              href="#"
              className="block rounded-lg bg-green-600 py-3 text-center text-white"
            >
              Support
            </Link>
          </div>
        )}
      </div>

      <CustomerAuthModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
      />
    </header>
  );
}
