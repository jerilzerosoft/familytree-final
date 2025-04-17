"use client"; // only if using Next.js App Router and fetch inside component

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Facebook from "@/assets/images/facebook-icon.png";
import Twitter from "@/assets/images/twitter.png";
import Instagram from "@/assets/images/instagram.png";

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
  });

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const res = await fetch("http://localhost:8000/admin/adminprofile/");
        const data = await res.json();

        setSocialLinks({
          facebook: data.facebook || "",
          twitter: data.twitter || "",
          instagram: data.instagram || "",
        });
      } catch (error) {
        console.error("Error fetching social links:", error);
      }
    };

    fetchAdminProfile();
  }, []);

  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        {/* Copyright Text */}
        <p className="text-black text-sm">
          Copyright © 2025. DBAK Family | All Rights Reserved.
        </p>

        
        <div className="flex space-x-3 mt-3 md:mt-0">
          {socialLinks.facebook && (
            <Link
              href={socialLinks.facebook}
              target="_blank"
              className="social-media-icons hover:bg-gray-400 p-1 rounded"
            >
              <Image src={Facebook} alt="Facebook" className="w-4 h-6" />
            </Link>
          )}
          {socialLinks.twitter && (
            <Link
              href={socialLinks.twitter}
              target="_blank"
              className="social-media-icons hover:bg-gray-400 p-1 rounded"
            >
              <Image src={Twitter} alt="Twitter" className="w-6 h-6" />
            </Link>
          )}
          {socialLinks.instagram && (
            <Link
              href={socialLinks.instagram}
              target="_blank"
              className="social-media-icons hover:bg-gray-400 p-1 rounded"
            >
              <Image src={Instagram} alt="Instagram" className="w-6 h-6" />
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
