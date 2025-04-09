"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Welcome from "@/assets/images/welcome.png";
import HandIcon from "@/assets/images/hand-icon.png";
import Gallery from "@/assets/images/gallery.png";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { useRouter } from "next/navigation";
import { ApiFeature, ApiGalleryFeature, GalleryFeature } from "@/app/components/Utils/interface";

const Home = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  
  
  const staticData = {
    hero: {
      bannerImage: '',
      heading: 'DISCOVER & BUILD YOUR FAMILY LEGACY',
      subheading: "Bring our family's history to life. Track generations, celebrate relationships, and preserve precious memories—all in one beautifully crafted family tree."
    },
    
    about: {
      title: 'About the Family Tree',
      welcomeImage: '',
      heading: "Preserve Your Family's Legacy for Generations to Come.",
      description: "Every family has a story worth telling. With our Family Tree platform, you can bring your family's history to life—track generations, celebrate bonds, and ensure your legacy lives on for the future."
    },
    
    features: [
      {
        id: 1,
        title: "Track Your Family History",
        description: "Effortlessly map out your ancestry and discover hidden connections.",
        icon: HandIcon,
      },
      {
        id: 2,
        title: "Preserve Memories",
        description: "Store photos, stories, and life events in a secure digital space.",
        icon: HandIcon,
      },
      {
        id: 3,
        title: "Strengthen Family Bonds",
        description: "Stay connected with loved ones and celebrate your shared heritage.",
        icon: HandIcon,
      },
      {
        id: 4,
        title: "Easy to Use & Secure",
        description: "Our intuitive interface makes building your family tree simple, safe, and private.",
        icon: HandIcon,
      },
    ],
    
    gallery: {
      title: 'Explore Family Gallery',
      galleryImage: '',
      heading: "Explore Your Family's Timeless Moments.",
      description: "Every photograph tells a story, every memory holds a legacy. The Family Gallery is a place where you can store, explore, and share your family's precious moments. From childhood snapshots to grand celebrations, keep your memories alive for generations to come."
    },
    
    galleryFeatures: [
      {
        id: 1,
        title: "Upload & Organize Photos",
        description: "Store and categorize family pictures effortlessly.",
        icon: HandIcon,
      },
      {
        id: 2,
        title: "Share Videos & Stories",
        description: "Add videos and personal anecdotes to bring memories to life.",
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
    ]
  };
  
  
  const [heroSection, setHeroSection] = useState(staticData.hero);
  const [aboutSection, setAboutSection] = useState(staticData.about);
  const [features, setFeatures] = useState(staticData.features);
  const [gallerySection, setGallerySection] = useState(staticData.gallery);
  const [galleryFeatures, setGalleryFeatures] = useState(staticData.galleryFeatures);

  
  useEffect(() => {
    
    setIsOnline(navigator.onLine);

    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  
  useEffect(() => {
    
    setHeroSection(staticData.hero);
    setAboutSection(staticData.about);
    setFeatures(staticData.features);
    setGallerySection(staticData.gallery);
    setGalleryFeatures(staticData.galleryFeatures);
    
    
    setIsLoading(false);
    
    
    if (isOnline) {
      fetchDataFromAPI();
    } else {
      console.log("Offline mode: Using static data");
    }
  }, [isOnline]);

  const fetchDataFromAPI = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/get/all/');
      const data = response.data;
      
  
      if (data.hero) {
        setHeroSection({
          bannerImage: data.hero.banner_image || staticData.hero.bannerImage,
          heading: data.hero.heading || staticData.hero.heading,
          subheading: data.hero.subheading || staticData.hero.subheading
        });
      }
      
      if (data.about) {
        setAboutSection({
          title: data.about.title || staticData.about.title,
          welcomeImage: data.about.welcome_image || staticData.about.welcomeImage,
          heading: data.about.heading || staticData.about.heading,
          description: data.about.description || staticData.about.description
        });
      }
      
      if (data.features && data.features.length > 0) {
        const apiFeatures = data.features.map((feature: ApiFeature) => ({
          id: feature.id,
          title: feature.title,
          description: feature.description,
          icon: feature.icon ? (feature.icon as unknown as StaticImageData) : HandIcon
        }));
        setFeatures(apiFeatures);
      }
      
      if (data.gallery) {
        setGallerySection({
          title: data.gallery.title || staticData.gallery.title,
          galleryImage: data.gallery.gallery_image || staticData.gallery.galleryImage,
          heading: data.gallery.heading || staticData.gallery.heading,
          description: data.gallery.description || staticData.gallery.description
        });
      }
      
      if (data.gallery_features && data.gallery_features.length > 0) {
        const apiGalleryFeatures: GalleryFeature[] = data.gallery_features.map((feature: ApiGalleryFeature) => ({
          id: feature.id,
          title: feature.title,
          description: feature.description,
          icon: feature.icon ? (feature.icon as unknown as StaticImageData) : HandIcon
        }));
        // setGalleryFeatures(apiGalleryFeatures);
      }
      
    } catch (err) {
      console.error("Error fetching homepage content:", err);
     
    }
  };

  const handlegallary = () => {
    router.push("/familygallary");
  }
  
  const handleFamilyMembers = () => {
    router.push("/familydetails");
  }

  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="spinner-border text-green-700" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100">
      {!isOnline && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 text-center">
          You are currently offline. Showing local content.
        </div>
      )}
      
      <div 
        className="text-white text-center banner-images header-banner"
        style={heroSection.bannerImage ? { backgroundImage: `url(${heroSection.bannerImage})` } : {}}
      >
        <Header />
        <div className="flex h-full justify-center items-center">
          <div className="p-8 rounded-lg shadow-lg">
            <h1 className="text-4xl md:text-5xl font-bold leading-[58px] shadow-md">
              {heroSection.heading}
            </h1>
            <p className="mt-4 text-shadow">
              {heroSection.subheading}
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
          {aboutSection.title}
        </h2>
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="md:w-1/2">
            <h3 className="text-xl font-bold mb-4">
              {aboutSection.heading}
            </h3>
            <p className="text-gray-700 mb-8">
              {aboutSection.description}
            </p>
            <div className="space-y-4">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-start p-4 bg-gradient-to-r from-[#F0ED5C] to-[#FFFFFF] rounded-md"
                >
                  <div className="mr-3 p-2 rounded-full">
                    <Image
                      src={typeof feature.icon === 'string' ? feature.icon : HandIcon}
                      alt={feature.title}
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
                className="inline-block bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-full transition duration-300 cursor-pointer"
              >
                View Family Tree
              </div>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-end items-end">
            <Image 
              src={aboutSection.welcomeImage || Welcome} 
              alt="Family gathering at ancestral house" 
              width={500}
              height={400}
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 container mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-green-700 text-center mb-12">
          {gallerySection.title}
        </h2>

        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="md:w-1/2">
            <h3 className="text-xl font-bold mb-4">
              {gallerySection.heading}
            </h3>
            <p className="text-gray-700 mb-8">
              {gallerySection.description}
            </p>
            <div className="space-y-4">
              {galleryFeatures.map((g) => (
                <div
                  key={g.id}
                  className="flex items-start p-4 bg-gradient-to-r from-[#F0ED5C] to-[#FFFFFF] rounded-md"
                >
                  <div className="mr-3 p-2 rounded-full">
                    <Image
                      src={typeof g.icon === 'string' ? g.icon : HandIcon}
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
                className="inline-block bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-full transition duration-300 cursor-pointer"
              >
                View Gallery
              </div>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-end items-end">
            <Image 
              src={gallerySection.galleryImage || Gallery} 
              alt="Family photo gallery" 
              width={500}
              height={400}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;