"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { BASE_URL } from "@/app/components/Utils/apis";

export default function FamilyGalleryPage() {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async (): Promise<void> => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/gallery/`);
        console.log("API Response:", response.data);

        const imageUrls = response.data.images.map(
          (img: { image: string }) => img.image
        );

        const constructedUrls = imageUrls.map(getImageSource);
        console.log("Full URLs:", constructedUrls);

        setGalleryImages(imageUrls);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching images:", err);
        setError("Failed to load images");
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const getImageSource = (imagePath: string) => {
    return imagePath ? `${BASE_URL}${imagePath}` : "/default-avatar.png";
  };

  const openImagePreview = (imageSrc: string): void => {
    setSelectedImage(imageSrc);
    setIsModalOpen(true);
  };

  const closeImagePreview = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <div className="text-white text-center inner-banner">
        <Header />
        <div className="flex justify-center items-center">
          <h1 className="text-2xl md:text-5xl font-bold shadow-md">Gallery</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-16 bg-gray-50 flex-1">
        <div className="container mx-auto px-4">
          {loading ? (
            <p className="text-center text-gray-500">Loading images...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : galleryImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => openImagePreview(image)}
                >
                  <div className="relative h-64 w-full">
                    <Image
                      src={getImageSource(image)}
                      alt={`Gallery image ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No images available</p>
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && selectedImage && (
        <div className="flex items-center justify-center fixed inset-0 bg-[rgba(10,7,7,0.6)] z-50">
          <div className="relative bg-white rounded-lg p-4 shadow-lg max-w-2xl w-full">
            <button
              className="absolute top-4 right-4 z-1 cursor-pointer bg-gray-200 rounded-full p-2 text-gray-800 hover:bg-gray-300"
              onClick={closeImagePreview}
            >
              ✕
            </button>
            <div className="flex justify-center p-4">
              <div className="relative w-full max-w-3xl">
                <Image
                  src={getImageSource(selectedImage)}
                  alt="Enlarged gallery image"
                  width={800}
                  height={600}
                  style={{ objectFit: "contain" }}
                  className="w-full h-auto rounded-lg z-1"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
