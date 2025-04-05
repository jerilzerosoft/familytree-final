"use client";

import Image from "next/image";
import Link from "next/link";
import Welcome from "@/assets/images/welcome.png";
import HandIcon from "@/assets/images/hand-icon.png";
import Gallery from "@/assets/images/gallery.png";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { useRouter } from "next/navigation";
const Home = () => {
  const router = useRouter();
  const features = [
    {
      id: 1,
      title: "Track Your Family History",
      description:
        "Effortlessly map out your ancestry and discover hidden connections.",
      icon: HandIcon,
    },
    {
      id: 2,
      title: "Preserve Memories",
      description:
        "Store photos, stories, and life events in a secure digital space.",
      icon: HandIcon,
    },
    {
      id: 3,
      title: "Strengthen Family Bonds",
      description:
        "Stay connected with loved ones and celebrate your shared heritage.",
      icon: HandIcon,
    },
    {
      id: 4,
      title: "Easy to Use & Secure",
      description:
        "Our intuitive interface makes building your family tree simple, safe, and private.",
      icon: HandIcon,
    },
  ];

  const gallery = [
    {
      id: 1,
      title: "Upload & Organize Photos",
      description: "Store and categorize family pictures effortlessly.",
      icon: HandIcon,
    },
    {
      id: 2,
      title: "Share Videos & Stories",
      description:
        "Add videos and personal anecdotes to bring memories to life.",
      icon: HandIcon,
    },
    {
      id: 3,
      title: "Create Family Albums",
      description: "Curate and customize albums for special occasions.",
      icon: HandIcon,
    },
    {
      id: 4,
      title: "Search & Discover",
      description: "Easily find old memories with advanced search filters.",
      icon: HandIcon,
    },
  ];
  const handlegallary = () => {
    router.push("/familygallary");
  }
  const handleFamilyMembers = () => {
    router.push("/familydetails");
  }
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <div className="text-white text-center banner-images header-banner">
        <Header />
        <div className="flex h-full justify-center items-center">
          <div className="p-8 rounded-lg shadow-lg">
            <h1 className="text-4xl md:text-5xl font-bold leading-[58px] shadow-md">
              DISCOVER & BUILD YOUR <br /> FAMILY LEGACY
            </h1>
            <p className="mt-4 text-shadow">
              {"Bring your family's history to life. Track generations, celebrate relationships, and preserve"}
              <br />


              {"recious memories—all in one beautifully crafted family tree."}
            </p>
            <div className="mt-6 space-x-4">
              <Link
                href="/familydetails"
                className="bg-white hover:bg-amber-100 text-black p-4 rounded-full text-sm shadow-md"
              >
                View Family Members
              </Link>
            </div>
          </div>
        </div>
      </div>
      <section className="py-16 px-4 container mx-auto bg-white">
        <h2 className="text-3xl md:text-4xl font-semibold text-green-700 text-center mb-12">
          About the Family Tree
        </h2>
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="md:w-1/2">
            <h3 className="text-xl font-bold mb-4">
              {"Preserve Your Family's Legacy for Generations to Come."}
            </h3>
            <p className="text-gray-700 mb-8">
              {
                "Every family has a story worth telling. With our Family Tree platform, you can bring your family's history to life—track generations, celebrate bonds, and ensure your legacy lives on for the future."
              }
            </p>
            <div className="space-y-4">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-start p-4 bg-gradient-to-r from-[#F0ED5C] to-[#FFFFFF] rounded-md"
                >
                  <div className="mr-3 p-2 rounded-full">
                    <Image
                      src={feature.icon}
                      alt="Family gathering at ancestral house"
                      width={22}
                      height={19}
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{feature.title}</h4>
                    <p className="text-sm text-gray-700">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <div
                onClick={handleFamilyMembers}
                className="inline-block bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-full transition duration-300"
              >
                View Family Tree
              </div>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-end items-end">
            <Image src={Welcome} alt="Family gathering at ancestral house" />
          </div>
        </div>

      </section>
      <section className="py-16 px-4 container mx-auto">
  <h2 className="text-3xl md:text-4xl font-semibold text-green-700 text-center mb-12">
    Explore Family Gallery
  </h2>

  <div className="flex flex-col md:flex-row justify-between items-start gap-8">
    {/* Text Section */}
    <div className="md:w-1/2">
      <h3 className="text-xl font-bold mb-4">
        Explore Your Family’s Timeless Moments.
      </h3>
      <p className="text-gray-700 mb-8">
        {
          "Every photograph tells a story, every memory holds a legacy. The Family Gallery is a place where you can store, explore, and share your family's precious moments. From childhood snapshots to grand celebrations, keep your memories alive for generations to come."
        }
      </p>
      <div className="space-y-4">
        {gallery.map((g) => (
          <div
            key={g.id}
            className="flex items-start p-4 bg-gradient-to-r from-[#F0ED5C] to-[#FFFFFF] rounded-md"
          >
            <div className="mr-3 p-2 rounded-full">
              <Image
                src={g.icon}
                alt="Gallery icon"
                width={22}
                height={19}
                className="rounded-lg"
              />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">{g.title}</h4>
              <p className="text-sm text-gray-700">{g.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <div
          onClick={handlegallary}
          className="inline-block bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-full transition duration-300"
        >
          View Gallery
        </div>
      </div>
    </div>

    {/* Image Section */}
    <div className="md:w-1/2 flex justify-end items-end">
      <Image src={Gallery} alt="Family gathering at ancestral house" />
    </div>
  </div>
</section>

      <Footer />
    </div>
  );
};
export default Home;
