import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/images/logo.png";
import Search from "@/assets/images/search-icon.png";

export default function Header() {
  return (
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src={Logo}
                alt="Family Legacy Logo"
                width={90}
                height={90}
                className="rounded-full"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="header-icon hover:bg-white/20">
                <Image src={Search} alt="Search Icon" width={24} height={24} />
              </div>
              {/* <div className="header-icon hover:bg-white/20">
                <Image src={User} alt="User Icon" width={24} height={20} />
              </div> */}
              <div className="">
                <Link
                  href="/login"
                  className="bg-white text-black p-4 rounded-full text-sm shadow-md"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
  );
}
