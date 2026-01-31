"use client";

import Facebook from "@/svg/Facebook";
import Instagram from "@/svg/Instagram";
import Linkedin from "@/svg/Linkedin";
import Youtube from "@/svg/Youtube";
import { Phone, Mail, MapPin, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/" },
  { icon: Instagram, href: "https://www.instagram.com/" },
  { icon: Youtube, href: "https://www.youtube.com/" },
  { icon: Facebook, href: "https://www.facebook.com/pripriyanursery" },
];

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Category", href: "/category" },
  { label: "All Category", href: "/categories" },
  { label: "My Account", href: "/my-account" },
  // { label: "Our Services", href: "" },
  // { label: "Why Us", href: "" },
  // { label: "Contact Us", href: "" },
];

const quickLinks2 = [
  { label: "Invoice Help", href: "" },
  { label: "Our CSR", href: "" },
];

const quickLinks3 = [
  { label: "Terms & Condition", href: "/terms_condition" },
  { label: "Privacy Policy", href: "/privacy_policy" },

  { label: "Shiping Policy", href: "/shiping_policy" },
  { label: "Refund Policy", href: "/refund_policy" },
];

export default function Footer() {
  const [formData, setFormData] = useState<{ message: string }>({
    message: "",
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const whatsappMessage = `I need help on shopping`;

    const encodedMessage = encodeURIComponent(whatsappMessage);

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const whatsappUrl = isDesktop
      ? `https://web.whatsapp.com/send?phone=+917586891753&text=${encodedMessage}`
      : `https://api.whatsapp.com/send?phone=+917586891753&text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");

    setFormData({
      message: "",
    });
  };

  return (
    <footer
      className="relative w-full bg-cover bg-center"
      style={{
        backgroundImage: "url('/assets/globals/footerbg.png')",
      }}
    >
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/85" />

      {/* CALLBACK BAR */}
      <div className="relative z-10 pb-6 pt-12">
        <div className="mx-auto max-w-[1300px] px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded bg-white/10 backdrop-blur-md px-4 lg:px-6 py-4">
            <p className="text-[17px] text-white">
              Get a call back within 15 minutes. WhatsApp us 24x7
              <br className=" max-md:hidden "></br> between 9:00 AM and 8:00 PM.
            </p>

            <div className="flex w-full md:w-auto md:border md:border-white rounded-[40px]">
              <form action="" onSubmit={handleSubmit}>
                <div className="flex w-full md:w-[550px]  md:px-0">
                  {/* Input Field */}
                  <div className="flex items-center   backdrop-blur-md rounded-l-[40px] px-3 w-full">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.5"
                        y="0.5"
                        width="27"
                        height="27"
                        rx="13.5"
                        fill="url(#paint0_radial_2_873)"
                      />
                      <rect
                        x="0.5"
                        y="0.5"
                        width="27"
                        height="27"
                        rx="13.5"
                        stroke="#34A853"
                      />
                      <path
                        d="M14.0015 8H13.9985C10.6903 8 8 10.691 8 14C8 15.3125 8.423 16.529 9.14225 17.5168L8.3945 19.7458L10.7008 19.0085C11.6495 19.637 12.7812 20 14.0015 20C17.3097 20 20 17.3083 20 14C20 10.6918 17.3097 8 14.0015 8ZM17.4928 16.4728C17.348 16.8815 16.7735 17.2205 16.3153 17.3195C16.0017 17.3862 15.5923 17.4395 14.2138 16.868C12.4505 16.1375 11.315 14.3457 11.2265 14.2295C11.1418 14.1133 10.514 13.2808 10.514 12.4198C10.514 11.5588 10.9513 11.1395 11.1275 10.9595C11.2723 10.8117 11.5115 10.7443 11.741 10.7443C11.8152 10.7443 11.882 10.748 11.942 10.751C12.1183 10.7585 12.2067 10.769 12.323 11.0473C12.4678 11.396 12.8203 12.257 12.8623 12.3455C12.905 12.434 12.9478 12.554 12.8878 12.6703C12.8315 12.7903 12.782 12.8435 12.6935 12.9455C12.605 13.0475 12.521 13.1255 12.4325 13.235C12.3515 13.3303 12.26 13.4323 12.362 13.6085C12.464 13.781 12.8165 14.3562 13.3355 14.8183C14.0053 15.4145 14.5482 15.605 14.7425 15.686C14.8872 15.746 15.0598 15.7318 15.1655 15.6193C15.2998 15.4745 15.4655 15.2345 15.6343 14.9983C15.7543 14.8288 15.9058 14.8077 16.0648 14.8677C16.2268 14.924 17.084 15.3478 17.2603 15.4355C17.4365 15.524 17.5527 15.566 17.5955 15.6403C17.6375 15.7145 17.6375 16.0633 17.4928 16.4728Z"
                        fill="#34A853"
                      />
                      <defs>
                        <radialGradient
                          id="paint0_radial_2_873"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(14 14) rotate(90) scale(14)"
                        >
                          <stop
                            offset="0.322115"
                            stopColor="#34A853"
                            stopOpacity="0"
                          />
                          <stop
                            offset="1"
                            stopColor="#34A853"
                            stopOpacity="0.6"
                          />
                        </radialGradient>
                      </defs>
                    </svg>

                    <input
                      type="text"
                      placeholder="Message"
                      className=" text-white px-4 py-3 w-full focus:outline-none rounded-l-[40px] placeholder-gray-400"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Button */}
                  <button className="bg-white text-gray-900 px-6 py-3 rounded-r-[40px] font-semibold hover:bg-gray-200 transition flex items-center justify-center whitespace-nowrap">
                    Chat With
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10">
        <div className="mx-auto max-w-[1300px] px-4 pb-12 pt-6">
          <div className="text-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
              {/* BRAND – BIG */}
              <div className="lg:col-span-3">
                <Link href="/" className=" ">
                  <Image
                    src="/icons/new_logo_2.svg"
                    alt="Pri Priya Nursery Logo"
                    width={2048}
                    height={234}
                    className="w-full h-[2rem] "
                  />
                </Link>
                <p className="mt-4 text-sm leading-relaxed">
                  Pri Priya Nursery is a trusted wholesaler, manufacturer, and
                  supplier of quality live plants across India, with special
                  focus on North East regions. We provide healthy, carefully
                  nurtured plants, reliable delivery, and dedicated customer
                  support for gardeners, landscapers, and plant lovers.
                </p>
              </div>

              {/* QUICK LINK 1 – SMALL */}
              <div className="lg:col-span-2 md:pl-[60px]">
                <h4 className="mb-4 font-semibold text-white text-[22px]">
                  Quick Link
                </h4>
                <ul className="space-y-3 text-[17px]">
                  {quickLinks.map((link) => (
                    <li key={link.label} className="flex items-center gap-2">
                      <Check size={14} />
                      <Link
                        href={link.href}
                        className="hover:text-green-500 transition"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* QUICK LINK 2 – SMALL */}
              <div className="lg:col-span-2 md:pl-[30px]">
                <h4 className="mb-4 font-semibold text-white text-[22px]">
                  Quick Link
                </h4>
                <ul className="space-y-3 text-[17px]">
                  {quickLinks2.map((link) => (
                    <li key={link.label} className="flex items-center gap-2">
                      <Check size={14} />
                      <Link
                        href={link.href}
                        className="hover:text-green-500 transition"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* QUICK LINK 3 – SMALL */}
              <div className="lg:col-span-2 md:pl-[30px]">
                <h4 className="mb-4 font-semibold text-white text-[22px]">
                  Quick Link
                </h4>
                <ul className="space-y-3 text-[17px]">
                  {quickLinks3.map((link) => (
                    <li key={link.label} className="flex items-center gap-2">
                      <Check size={14} />
                      <Link
                        href={link.href}
                        className="hover:text-green-500 transition"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CONTACT – BIG */}
              <div className="lg:col-span-3">
                <h4 className="mb-4 font-semibold text-white text-[22px]">
                  Contact Information
                </h4>
                <ul className="space-y-4 text-[17px]">
                  {/* Phone */}
                  <li className="flex items-center gap-2">
                    <Phone size={16} />
                    <Link
                      href="tel:+917586891753"
                      className="hover:text-green-500 transition"
                    >
                      +91 75868 91753
                    </Link>
                  </li>

                  {/* Email */}
                  <li className="flex items-center gap-2">
                    <Mail size={16} />
                    <Link
                      href="mailto:pripriyanursery@gmail.com"
                      className="hover:text-green-500 transition"
                    >
                      pripriyanursery@gmail.com
                    </Link>
                  </li>

                  {/* Address */}
                  <li className="flex items-start gap-2">
                    <MapPin size={16} className="shrink-0" />
                    <Link
                      href="https://maps.app.goo.gl/HDFP8hN6nWyEAaJ6A"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-green-500 transition"
                    >
                      Simulpukur, Gangadhar shishu niketan, Simulpukur, Ukrah,
                      Nadia, West Bengal, 741257
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* footer bottom  */}

      <div className="mx-auto max-w-[1300px] px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded bg-white/10 backdrop-blur-md px-6 py-4">
          {/* LEFT: WE ACCEPT + IMAGES */}
          <div className="flex items-center gap-3">
            <p className="text-white text-sm whitespace-nowrap">We Accept</p>

            {/* IMAGE BOXES */}
            <div className="flex items-center gap-2">
              {[
                "/icons/visa.jpg",
                "/icons/mastercrd.jpg",
                "/icons/rupay.jpg",
                "/icons/upi.jpg",
              ].map((src) => (
                <div
                  key={src}
                  className="flex items-center justify-center rounded bg-white px-1 py-1"
                >
                  <Image
                    src={src}
                    alt="payment"
                    width={120}
                    height={52}
                    className="h-8 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* CENTER */}
          <p className="text-white text-sm text-center md:pr-[100px]">
            © Nursery Plants – 2026 | All Right Reserved
          </p>

          {/* RIGHT */}
          <div className="flex gap-4">
            {socialLinks.map(({ icon: Icon, href }, i) => (
              <Link
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="  ">
                  <Icon />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* DEVELOPER */}
      <div className="relative z-10 py-8 flex items-center justify-center gap-2 text-xs text-gray-400">
        <span className="text-[16px]">Developed By - </span>

        <Link
          href="https://rebootai.in/"
          target="_blank"
          className="inline-flex items-center"
        >
          <Image
            src="/assets/reboots.png"
            alt="Raboot AI"
            width={80}
            height={24}
            className="h-4 w-auto object-contain opacity-90 hover:opacity-100 transition"
          />
        </Link>
      </div>
    </footer>
  );
}
