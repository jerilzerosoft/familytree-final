"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Logo from "@/assets/images/logo.png";
import Search from "@/assets/images/search-icon.png";
import Galary from "@/assets/images/galary.png";
import profile from "@/assets/images/user-icon.png";

export default function Header({ onSearch = null }) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("username");
    }
    router.push("/login"); 
  };
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlegallary = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      router.push("/familygallary");
    } else {
      setShowLoginModal(true);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearchSubmit = () => {
    const query = searchInputRef.current?.value.trim();
    if (query) {
      if (onSearch && typeof onSearch === 'function') {

        onSearch(query);
        setIsSearchOpen(false);
      } else {

        localStorage.setItem('headerSearchQuery', query);
        router.push('/familydetails');
      }


      if (searchInputRef.current) {
        searchInputRef.current.value = "";
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        isSearchOpen
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src={Logo}
              onClick={handleLogoClick}
              alt="Family Legacy Logo"
              width={90}
              height={90}
              className="rounded-full cursor-pointer"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div
              ref={searchContainerRef}
              className={`flex items-center transition-all duration-300 ease-in-out overflow-hidden ${isSearchOpen ? "bg-white rounded-full shadow-md px-2" : "bg-transparent"
                }`}
            >

              {isSearchOpen && (
                <div
                  className="flex items-center justify-center cursor-pointer text-black"
                  onClick={() => {
                    setIsSearchOpen(false);
                    if (searchInputRef.current) {
                      searchInputRef.current.value = "";
                    }
                  }}
                >
                  ✕
                </div>
              )}

              {!isSearchOpen && (
                <div
                  className="header-icon-search flex items-center justify-center cursor-pointer hover:bg-white/20 rounded-full transition-all text-black duration-300"
                  onClick={handleSearch}
                >
                  <Image
                    src={Search}
                    alt="Search Icon"
                    width={24}
                    height={24}
                    className="transition-transform duration-300"
                  />
                </div>
              )}

              <div
                className={`relative transition-all duration-300 ease-in-out ${isSearchOpen ? "w-40 sm:w-56 md:w-64 opacity-100" : "w-0 opacity-0"
                  }`}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  className="w-full h-8 text-black focus:outline-none text-sm pr-8 pl-2 rounded-full h-12"
                  onKeyPress={handleKeyPress}
                />

                <div
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={handleSearchSubmit}
                >
                  <Image
                    src={Search}
                    alt="Search Submit Icon"
                    width={16}
                    height={16}
                  />
                </div>
              </div>
            </div>

            <div className="header-icon hover:bg-white/20 h-10 w-10 rounded-full flex items-center justify-center">
              <Image
                onClick={handlegallary}
                src={Galary}
                alt="Gallery Icon"
                width={25}
                height={30}
                className="cursor-pointer"
              />
            </div>

            <div className="relative" ref={dropdownRef}>
              {isLoggedIn ? (
                <>
                  <button
                    onClick={toggleDropdown}
                    className="bg-white text-black p-2 rounded-full text-sm shadow-md flex items-center gap-2"
                  >
                    <Image src={profile} alt="Profile Icon" width={28} height={28} className="rounded-full" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-black hover:bg-gray-100 text-sm"
                      >
                        View Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-centre px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  className="bg-white text-black p-4 rounded-full text-sm shadow-md"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(10,7,7,0.6)]">
          <div className="bg-white rounded-lg p-6 w-[300px] text-center shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Please log in</h2>
            <p className="mb-6 text-sm text-gray-600">You need to log in to access the gallery.</p>
            <button
              onClick={() => router.push("/login")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full mb-2"
            >
              Go to Login
            </button>

            <button
              onClick={() => setShowLoginModal(false)}
              className="text-gray-500 text-sm hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}