import Image from "next/image";
import Link from "next/link";
import Facebook from "@/assets/images/facebook-icon.png";
import Twitter from "@/assets/images/twitter.png";
import Instagram from "@/assets/images/instagram.png";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        {/* Copyright Text */}
        <p className="text-black text-sm">
          Copyright © 2025. DBAK Family | All Rights Reserved.
        </p>

        {/* Social Media Icons */}
        <div className="flex space-x-3 mt-3 md:mt-0">
          <Link
            href="#"
            className="social-media-icons hover:bg-gray-400"
          >
            <Image src={Facebook} alt="Facebook" className="w-4 h-6" />
          </Link>
          <Link
            href="#"
            className="social-media-icons hover:bg-gray-400"
          >
            <Image src={Twitter} alt="Twitter" className="w-6 h-6"/>
          </Link>
          <Link
            href="#"
            className="social-media-icons hover:bg-gray-400"
          >
            <Image src={Instagram} alt="Instagram" className="w-6 h-6"/>
          </Link>
        </div>
      </div>
    </footer>
  );
}
