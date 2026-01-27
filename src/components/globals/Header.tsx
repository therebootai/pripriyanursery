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
  Heart,
} from "lucide-react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useCustomer } from "@/context/CustomerContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import CustomerAuthModal from "../customer/CustomerAuthModal";
import { BsBoxSeam, BsBoxSeamFill } from "react-icons/bs";
import LoadingAnimation from "./LoadingAnimation";
import { useGlobalUI } from "@/context/GlobalUIContext";

type SearchItem = {
  type: "product" | "category" | "brand" | "attribute";
  name: string;
  slug?: string;
  image?: string;
};

export default function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const [results, setResults] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const inputRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [language, setLanguage] = useState("ENG");

  const { customer, loading, logoutCustomer,clearCustomer } = useCustomer();
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState(-1);
const [isLoggingOut, setIsLoggingOut] = useState(false);
  const languages = [
    { label: "English", code: "ENG" },
    { label: "Bengali", code: "BEN" },
    { label: "Hindi", code: "HIN" },
  ];

  const openLogin = () => {
    const fullPath =
      pathname + (searchParams.toString() ? `?${searchParams}` : "");

    localStorage.setItem("redirectAfterLogin", fullPath);

    setIsSignupOpen(true); // this opens CustomerLoginModal
  };

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
      `${process.env.NEXT_PUBLIC_API_URL}/search/suggestions`,
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

    setTimeout(() => {
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
          router.push(`/products?attribute=${encodeURIComponent(item.name)}`);
          break;
      }
    }, 0);
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

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  function getName(name = "") {
    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0][0]?.toUpperCase() || "";
    }

    return (
      parts[0][0]?.toUpperCase() + parts[parts.length - 1][0]?.toUpperCase()
    );
  }

const { setShowLoader } = useGlobalUI();
const handleLogoutClick = async () => {
  try {
    setShowLoader(true);
    setAccountOpen(false);
    setOpen(false);

    await logoutCustomer();
    clearCustomer();

    router.replace("/");
  } catch (error) {
    console.error("Logout failed", error);
    setShowLoader(false);
  }
};

  useEffect(() => {
  setShowLoader(false);
}, [pathname]);
  const list = query ? results : suggestions;

  return (
    <>
    {isLoggingOut &&  <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
    <LoadingAnimation />
  </div>}
   
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="mx-auto max-w-[1200px] xl:max-w-[1300px] xxl:max-w-[1600px] xxxl:max-w-[1800px] lg:px-8 px-6">
        {/* TOP BAR */}
        <div className="flex h-16 md:h-20 items-center justify-between gap-3">
          {/* Logo */}
          {!mobileSearchOpen && (
            <Link href="/" className="">
              <Image
                src="/icons/logo.png"
                alt="Pri Priya Nursery Logo"
                width={1280}
                height={146}
                priority
                className="w-fit h-[1rem] md:h-[1.5rem] "
              />
            </Link>
          )}

          {/* SEARCH (always visible) */}
          <div ref={inputRef} className="flex-1 max-w-md hidden md:block">
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
                placeholder="Search for Products, Brands and More"
                className="w-full rounded-full text-defined-green text-xs placeholder:text-defined-green bg-gray-100 py-4 pl-10 pr-4 outline-none"
              />
            </div>
            {show && (
              <div
                ref={dropdownRef}
                className="absolute z-50 mt-2 w-[50rem] rounded-lg bg-white shadow-lg"
              >
                {/* 🔥 RANDOM / POPULAR SUGGESTIONS */}
                {!query && suggestions.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500">
                      Suggestions
                    </div>

                    {suggestions.map((item, idx) => (
                      <button
                        key={`suggest-${idx}`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSearchClick(item);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2 hover:bg-gray-100 text-left cursor-pointer"
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
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSearchClick(item);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2 hover:bg-gray-100 text-left cursor-pointer"
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
                className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-3 text-sm font-bold text-defined-green"
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
                onClick={() => {
                  setIsSignupOpen(true);
                  openLogin();
                }}
                className="rounded-full bg-gray-100 px-6 py-3 text-sm font-bold text-defined-green  flex gap-1 cursor-pointer"
              >
                Login <User size={16} />
              </button>
            ) : (
              <div onMouseEnter={() => setAccountOpen(true)} 
  onMouseLeave={() => setAccountOpen(false)} className="relative h-fit z-50">
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center gap-2"
                >
                  {customer ? (
                    <>
                      <div className="px-6 py-3 text-sm rounded-full text-white bg-defined-green font-bold flex items-center justify-center gap-1">
                        <User size={16} />
                        {getName(customer.name)}
                        <ChevronDown size={16} />
                      </div>
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-defined-green">
                      User
                      <ChevronDown size={16} />
                    </span>
                  )}
                </button>

                {accountOpen && (
                  <div className="absolute right-0  top-full pt-2 w-44">
                  <div className=" rounded-md bg-white shadow-lg border border-gray-200">
                    <Link
                      href="/my-account"
                      className="flex items-center gap-2 px-4 py-3 text-defined-green  hover:bg-gray-100"
                    >
                      <UserIcon size={16} /> My Account
                    </Link>
                    <Link
                      href="/my-orders"
                      className="flex items-center gap-2 px-4 py-3 text-defined-green  hover:bg-gray-100"
                    >
                      <BsBoxSeam size={16} /> My Orders
                    </Link>
                    <Link
                      href="/my-wishlist"
                      className="flex items-center gap-2 px-4 py-3 text-defined-green  hover:bg-gray-100"
                    >
                      <Heart size={16} /> My Wishlist
                    </Link>
                    <Link
                      href="/my-cart"
                      className="flex items-center gap-2 px-4 py-3 text-defined-green  hover:bg-gray-100"
                    >
                      <ShoppingCart size={16} /> My Cart
                    </Link>

                    <button
                     onClick={handleLogoutClick}
                      className="flex w-full items-center gap-2 px-4 py-3 text-red-600 hover:bg-gray-100 cursor-pointer"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => {
                if (!customer) {
                  setIsSignupOpen(true);
                  return;
                }
                router.push("/my-wishlist");
              }}
              className="cursor-pointer rounded-full bg-gray-100 p-3 text-sm text-defined-green  font-bold flex gap-1"
            >
              <div className="relative">
                <Heart size={18} />
                <span className="absolute -top-1 -right-2 size-3 rounded-full bg-defined-green text-[10px] font-bold text-white flex items-center justify-center">
                  {customer?.wishlist?.length ?? 0}
                </span>
              </div>
            </button>
            <button
              onClick={() => {
                if (!customer) {
                  setIsSignupOpen(true);
                  return;
                }
                router.push("/my-cart");
              }}
              className="cursor-pointer rounded-full bg-gray-100 p-3 text-sm text-defined-green  font-bold flex gap-1"
            >
              <div className="relative">
                <ShoppingCart size={18} />
                <span className="absolute -top-1 -right-2 size-3 rounded-full bg-defined-green text-[10px] font-bold text-white flex items-center justify-center">
                  {customer?.cart?.length ?? 0}
                </span>
              </div>
            </button>
            <Link
              href="/my-orders"
              className="rounded-full bg-green-600 px-6 py-3 text-sm font-bold text-white  flex gap-1 items-center"
            >
              <BsBoxSeam size={18} /> My Orders
            </Link>
          </div>

          {/* MOBILE FULL SEARCH MODE */}

          {/* MOBILE SEARCH + MENU */}
          <div className="md:hidden flex items-center gap-4">
            {!mobileSearchOpen && (
              <button
                onClick={() => {
                  if (!customer) {
                    setIsSignupOpen(true);
                    return;
                  }
                  router.push("/my-wishlist");
                }}
                className="relative text-defined-green"
              >
                <Heart size={22} />

                <span className="absolute -top-1 -right-2 size-3 rounded-full bg-defined-green text-[10px] font-bold text-white flex items-center justify-center">
                  {customer?.wishlist?.length ?? 0}
                </span>
              </button>
            )}
            {!mobileSearchOpen && (
              <button
                onClick={() => {
                  if (!customer) {
                    setIsSignupOpen(true);
                    return;
                  }
                  router.push("/my-cart");
                }}
                className="relative text-defined-green"
              >
                <ShoppingCart size={22} />

                <span className="absolute -top-1 -right-2 size-3 rounded-full bg-defined-green text-[10px] font-bold text-white flex items-center justify-center">
                  {customer?.cart?.length ?? 0}
                </span>
              </button>
            )}

          {/* Replace this specific button inside your MOBILE SEARCH + MENU section */}

<div className="relative"> {/* Added relative wrapper for positioning */}
  <button
    onClick={() => {
      if (!customer) {
        setIsSignupOpen(true);
        return;
      }
      // Toggle the dropdown logic here
      setAccountOpen(!accountOpen);
    }}
    className="text-defined-green flex items-center"
  >
    {customer ? (
      <div className="size-8 text-xs rounded-full text-white bg-defined-green font-bold flex items-center justify-center">
        {getName(customer.name)}
      </div>
    ) : (
      <UserIcon size={20} />
    )}
  </button>

  {/* DROPDOWN LOGIC (Copied from Desktop and adjusted for Mobile) */}
  {accountOpen && customer && (
    <div className="absolute right-0 top-full mt-2 w-48 z-50">
      <div className="rounded-md bg-white shadow-lg border border-gray-200 overflow-hidden">
        <Link
          href="/my-account"
          onClick={() => setAccountOpen(false)} // Close on click
          className="flex items-center gap-2 px-4 py-3 text-defined-green hover:bg-gray-100 text-sm"
        >
          <UserIcon size={16} /> My Account
        </Link>
        <Link
          href="/my-orders"
          onClick={() => setAccountOpen(false)}
          className="flex items-center gap-2 px-4 py-3 text-defined-green hover:bg-gray-100 text-sm"
        >
          <BsBoxSeam size={16} /> My Orders
        </Link>
        <Link
          href="/my-wishlist"
          onClick={() => setAccountOpen(false)}
          className="flex items-center gap-2 px-4 py-3 text-defined-green hover:bg-gray-100 text-sm"
        >
          <Heart size={16} /> My Wishlist
        </Link>
        <Link
          href="/my-cart"
          onClick={() => setAccountOpen(false)}
          className="flex items-center gap-2 px-4 py-3 text-defined-green hover:bg-gray-100 text-sm"
        >
          <ShoppingCart size={16} /> My Cart
        </Link>

        <button
          onClick={handleLogoutClick}
          className="flex w-full items-center gap-2 px-4 py-3 text-red-600 hover:bg-gray-100 text-sm cursor-pointer"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  )}
</div>
          </div>
        </div>

 
      </div>

      {/* MOBILE STICKY SEARCH (ALWAYS VISIBLE) */}
      <div className="md:hidden px-3 pb-2">
        <div ref={inputRef} className="relative">
          <div className="flex items-center gap-2 bg-white border border-defined-green rounded-full px-3 py-2">
            <Search size={16} className="text-defined-green" />

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
              placeholder="Search for products"
              className="flex-1 text-sm outline-none"
            />

            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setShow(false);
                }}
                className="text-gray-500"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Suggestions / Results */}
          {show && (
            <div
              ref={dropdownRef}
              className="absolute left-0 right-0 z-50 mt-2 rounded-lg bg-white shadow-lg"
            >
              {list.map((item, idx) => (
                <button
                  key={idx}
                  onMouseDown={(e) => {e.preventDefault(); handleSearchClick(item)}}
                  className="flex w-full items-center gap-3 px-4 py-2 hover:bg-gray-100 text-left"
                >
                  <span className="text-sm">
                    <b>{item.name}</b>
                    <span className="ml-2 text-xs text-gray-500">
                      {item.type}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <CustomerAuthModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
      />
    </header>
     </>
  );
}
