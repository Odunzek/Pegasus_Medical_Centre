"use client";

import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { TbCircleArrowUpRightFilled } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "motion/react";

const navLinks = ["Service", "Our Team", "Location", "About", "Contact"];

const BookingIcon = () => (
  <TbCircleArrowUpRightFilled
    className="text-[40px]"
    style={{
      color: "#8FBC8F",
      borderRadius: "50%",
    }}
  />
);

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#003D3A] text-white relative z-50">
      <div className="flex justify-between items-center py-2 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/pegasus-horizontal.png"
            alt="Pegasus Medical Centre"
            className="size-13"
          />
          <div className="flex flex-col items-center leading-none">
            <h1 className="text-[11px] font-semibold tracking-widest">
              PEGASUS
            </h1>
            <p className="text-[#8FBC8F] text-[5.7px] tracking-widest">
              MEDICAL CENTRE
            </p>
          </div>
        </div>

        {/* Desktop Nav — visible lg+ */}
        <div className="hidden lg:flex items-center gap-10">
          <ul className="flex items-center gap-7">
            {navLinks.map((link, i) => (
              <motion.li
                key={link}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
              >
                <a
                  href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm font-medium tracking-wide hover:text-[#8FBC8F] transition-colors duration-200"
                >
                  {link}
                </a>
              </motion.li>
            ))}
          </ul>

          <motion.a
            href="#book"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1 text-white font-semibold text-sm"
          >
            Book an appointment
            <BookingIcon />
          </motion.a>
        </div>

        {/* Right side — Languages + Hamburger */}
        <div className="flex items-center gap-6 lg:gap-8">
          <div className="flex items-center gap-3 text-xl font-bold tracking-wider">
            <span className="underline underline-offset-4">EN</span>
            <span className="hidden md:inline opacity-60 hover:opacity-100 cursor-pointer transition-opacity duration-200">
              FR
            </span>
            <span className="hidden md:inline opacity-60 hover:opacity-100 cursor-pointer transition-opacity duration-200">
              PT
            </span>
          </div>

          {/* Hamburger — hidden lg+ */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 border border-white rounded-full lg:hidden cursor-pointer"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  <IoClose className="size-8" />
                </motion.span>
              ) : (
                <motion.span
                  key="burger"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  <GiHamburgerMenu className="size-8" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Fullscreen Mobile / Tablet Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 3rem) 0%)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 3rem) 0%)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 3rem) 0%)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden fixed inset-0 top-0 bg-[#003D3A] z-40 flex flex-col"
          >
            {/* Top bar mirror so close button stays in place */}
            <div className="flex justify-between items-center py-2 px-4">
              <div className="flex items-center">
                <img
                  src="/pegasus-horizontal.png"
                  alt="Pegasus Medical Centre"
                  className="size-13"
                />
                <div className="flex flex-col items-center leading-none">
                  <h1 className="text-[11px] font-semibold tracking-widest">
                    PEGASUS
                  </h1>
                  <p className="text-[#8FBC8F] text-[5.7px] tracking-widest">
                    MEDICAL CENTRE
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 text-xl font-bold tracking-wider">
                  <span className="underline underline-offset-4">EN</span>
                  <span className="hidden md:inline opacity-60">FR</span>
                  <span className="hidden md:inline opacity-60">PT</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 border border-white rounded-full cursor-pointer"
                  aria-label="Close menu"
                >
                  <IoClose className="size-8" />
                </motion.button>
              </div>
            </div>

            {/* Nav links — centered */}
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link}
                  href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{
                    delay: 0.15 + i * 0.08,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={() => setIsOpen(false)}
                  className="text-3xl sm:text-4xl font-semibold tracking-wide hover:text-[#8FBC8F] transition-colors duration-200"
                >
                  {link}
                </motion.a>
              ))}

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  delay: 0.55,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-4"
              >
                <motion.a
                  href="#book"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-1 text-white font-semibold text-2xl"
                >
                  Book an appointment
                  <TbCircleArrowUpRightFilled
                    className="text-[55px]"
                    style={{
                      color: "#8FBC8F",
                      borderRadius: "50%",
                    }}
                  />
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
