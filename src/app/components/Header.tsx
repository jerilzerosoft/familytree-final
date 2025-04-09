"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Logo from "@/assets/images/logo.png";
import Search from "@/assets/images/search-icon.png";
import Galary from "@/assets/images/galary.png";
import profile from "@/assets/images/user-icon.png";

export default function Header() {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check token in localStorage (or you can use cookies)
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogoClick = () => {
    router.push("/");
  };

  const handlegallary = () => {
    router.push("/familygallary");
  };

  const handleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };
  
  const handleSearchSubmit = () => {
    const query = searchInputRef.current?.value.trim();
    if (query) {
      router.push(`/familydetails?search=${encodeURIComponent(query)}`);
    }
  };

  // Handle key press events for search input
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
            className={`flex items-center transition-all duration-300 ease-in-out overflow-hidden ${
              isSearchOpen ? "bg-white rounded-full shadow-md px-2" : "bg-transparent"
            }`}
          >
            {/* Close X Icon - Only when search is open */}
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
              className={`relative transition-all duration-300 ease-in-out ${
                isSearchOpen ? "w-40 sm:w-56 md:w-64 opacity-100" : "w-0 opacity-0"
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
          
          <div>
            {isLoggedIn ? (
              <Link
                href="/profile"
                className="bg-white text-black p-3 rounded-full text-sm shadow-md flex items-center gap-2"
              >
                <Image src={profile} alt="Profile Icon" width={20} height={20} />
              </Link>
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
  );
}