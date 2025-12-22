'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ShoppingCart, User, Headphones, Menu, X } from 'lucide-react'
import Image from 'next/image'
// import CustomerLogin from '../customer/CustomerLogin'
import { ChevronDown } from 'lucide-react'
import CustomerAuthModal from '../customer/CustomerAuthModal'


export default function Header() {
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  // const [isLoginOpen, setIsLoginOpen] = useState(false)

  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [language, setLanguage] = useState('ENG')

  const languages = [
    { label: 'English', code: 'ENG' },
    { label: 'Bengali', code: 'BEN' },
    { label: 'Hindi', code: 'HIN' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="mx-auto max-w-[1300px] px-4">
        <div className="flex md:h-20  h-14 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="block">
            <Image
              src="/assets/Pri Priya Nursery Logo.png"
              alt="Pri Priya Nursery Logo"
              width={80}
              height={80}
              priority
              className="object-contain 
               w-[55px] h-[55px] 
               sm:w-[65px] sm:h-[65px] 
               md:w-[80px] md:h-[80px]"
            />
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-defined-green"
                size={18}
              />
              <input
                type="text"
                placeholder="Search"
                className="w-full rounded-full text-defined-green placeholder:text-defined-green bg-gray-100 py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 rounded-full bg-gray-100 text-defined-green font-bold px-4 py-2 text-sm"
              >
                <Image
                  src="/assets/globals/indianflag.png"
                  alt="India"
                  width={20}
                  height={14}
                />
                <span>{language}</span>

                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 text-defined-green ${
                    langOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {langOpen && (
                <ul className="absolute left-0 top-full mt-2 w-40 rounded-md bg-white text-defined-green shadow-lg z-50">
                  {languages.map((lang) => (
                    <li key={lang.code}>
                      <button
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {lang.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              className="flex items-center gap-2 rounded-full bg-gray-100 px-6 py-3 text-sm text-defined-green font-bold"
              onClick={() => setIsSignupOpen(true)}
            >
              Login <User size={18} />
            </button>

            <Link
              href="/cart"
              className="flex items-center gap-2 rounded-full bg-gray-100 px-6 py-3 text-sm text-defined-green font-bold"
            >
              Cart <ShoppingCart size={18} />
            </Link>

            <Link
              href=""
              className="flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm text-white text-defined-green font-bold"
            >
              Support <Headphones size={18} />
            </Link>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden">
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <div className="md:hidden space-y-4 pb-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-lg bg-gray-100 px-4 py-2 text-sm"
            />

            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex w-full items-center justify-between rounded-lg bg-gray-100 px-4 py-3 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src="/assets/globals/indianflag.png"
                    alt="India"
                    width={20}
                    height={14}
                  />
                  <span>{language}</span>
                </div>

                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    langOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {langOpen && (
                <ul className="absolute left-0 top-full mt-2 w-full rounded-md bg-white shadow-lg z-50">
                  {languages.map((lang) => (
                    <li key={lang.code}>
                      <button
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangOpen(false);
                          setOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {lang.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {/* Mobile Login */}
              <button
                onClick={() => {
                  setIsSignupOpen(true);
                  setOpen(false);
                }}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-3 text-sm text-defined-green font-bold"
              >
                Login <User size={18} />
              </button>

              {/* Cart */}
              <Link
                href=""
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-3 text-sm text-defined-green font-bold"
              >
                Cart <ShoppingCart size={18} />
              </Link>

              {/* Support */}
              <Link
                href=""
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm text-white"
              >
                Support <Headphones size={18} />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Signup Popup */}
      <CustomerAuthModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
      />

      {/* Login Popup */}
      {/* <CustomerLogin
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        openSignup={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
      /> */}
    </header>
  );
}
