"use client";

import React, { useState } from "react";
import Image from "next/image";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import Imagebg from "@/assets/images/login-banner.jpg";

export default function FamilyGalleryPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const galleryImages = Array(9).fill(Imagebg.src);

    const openImagePreview = (imageSrc: string): void => {
        setSelectedImage(imageSrc);
        setIsModalOpen(true);
    };

    const closeImagePreview = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    return (
        <div className="bg-gray-100">
            <div className="text-white text-center inner-banner">
                <Header />
                <div className="flex justify-center items-center">
                    <h1 className="text-2xl md:text-5xl font-bold shadow-md">Gallery</h1>
                </div>
            </div>

            <main className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {galleryImages.map((image, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                onClick={() => openImagePreview(image)}
                            >
                                <div className="relative h-64 w-full">
                                    <Image
                                        src={image}
                                        alt={`Gallery image ${index + 1}`}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        className="transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

          
            {isModalOpen && (
                <div className=" flex items-center justify-center fixed inset-0 bg-[rgba(10,7,7,0.6)]">
                    <div className="relative bg-white rounded-lg p-4 shadow-lg max-w-4xl w-full">
                        <button
                            className="absolute top-4 right-4 bg-gray-200 rounded-full p-2 text-gray-800 hover:bg-gray-300"
                            onClick={closeImagePreview}
                        >
                            ✕
                        </button>
                        <div className="flex justify-center p-4">
                            {selectedImage && (
                                <div className="relative w-full max-w-3xl">
                                    <Image
                                        src={selectedImage}
                                        alt="Enlarged gallery image"
                                        width={800}
                                        height={600}
                                        style={{ objectFit: "contain" }}
                                        className="w-full h-auto rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
