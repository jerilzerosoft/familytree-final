"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import Avator from "@/assets/images/456322.webp";
import { Person } from "@/app/components/Utils/interface";
import PopupProfile from "@/app/components/Popup-profile";
import { IoIosCall, IoMdMail } from "react-icons/io";

const peopleData = [
    {
        id: 1,
        name: "Ahmad bin Abdullah (A)",
        phone: "012-345 6789",
        email: "ahmad@example.com",
        avatar: Avator
      
    },
    {
        id: 2,
        name: "Ahmad bin Abdullah (A)",
        phone: "012-345 6789",
        email: "ahmad@example.com",
        avatar: Avator
    },
    {
        id: 3,
        name: "Ahmad bin Abdullah (A)",
        phone: "012-345 6789",
        email: "ahmad@example.com",
        avatar: Avator
    },
    {
        id: 4,
        name: "Ahmad bin Abdullah (A)",
        phone: "012-345 6789",
        email: "ahmad@example.com",
        avatar: Avator
    },
    {
        id: 5,
        name: "Ahmad bin Abdullah (A)",
        phone: "012-345 6789",
        email: "ahmad@example.com",
        avatar: Avator
    },
    {
        id: 6,
        name: "Ahmad bin Abdullah (A)",
        phone: "012-345 6789",
        email: "ahmad@example.com",
        avatar: Avator
    }

];

export default function   DetailsPage() {
    const [nameQuery, setNameQuery] = useState('');
    const [pathQuery, setPathQuery] = useState('');
    const [results, setResults] = useState(peopleData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);


    const handleSearch = () => {
        const filteredResults = peopleData.filter(person => {
            return (
                person.name.toLowerCase().includes(nameQuery.toLowerCase()) &&
                person.phone.toLowerCase().includes(pathQuery.toLowerCase())
            );
        });
        setResults(filteredResults);
        setResults(peopleData);
    };
    const handleReset = () => {
        setNameQuery('');
        setPathQuery('');
        setResults(peopleData);
    };

    const openModal = (person: Person): void => {
        setSelectedPerson(person);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="bg-gray-100">
            <div className="text-white text-center inner-banner">
                <Header />
                <div className="flex justify-center items-center">
                    <h1 className="text-2xl md:text-5xl font-bold shadow-md">
                        Search Family Members
                    </h1>
                </div>
            </div>

            <div className="py-10 px-4 container mx-auto w-full mt-8 ">
                <div className='border-1 border-gray-400 rounded-lg p-6'>
                    <h2 className="text-2xl font-semibold mb-4">Search</h2>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <input
                            type="text"
                            placeholder="First Name"
                            className="w-full md:w-1/3 border-1 border-gray-500 rounded-xl h-12 p-2"
                            value={nameQuery}
                            onChange={(e) => setNameQuery(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            className="w-full md:w-1/3 border-1 border-gray-500 rounded-xl  h-12 p-2"
                            value={pathQuery}
                            onChange={(e) => setPathQuery(e.target.value)}
                        />
                        <button
                            onClick={handleSearch}
                            className="px-8 py-3 bg-green-700 text-white rounded-4xl  hover:bg-green-800"
                        >
                            Search
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-8 py-3 bg-gray-400 text-white rounded-4xl hover:bg-gray-500"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            <div className="pb-16 px-4 container mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Search Results</h2>
                    <p className="text-sm text-gray-600">Showing {results.length} Results</p>
                </div>

                <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                    {results.map((person) => (
                        <div
                            key={person.id}
                            className="border  border-gray-400 rounded-lg p-8 flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 shadow-lg"
                        >
                            <div className="relative w-16 h-16 flex-shrink-0">
                                <Image
                                    src={person.avatar}
                                    alt="Profile"
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-full"
                                />
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-bold text-lg">{person.name}</h3>
                                <div className="flex items-center text-sm mt-1">
                                    <IoIosCall className="text-black mr-2" />
                                    <span>Telephone (C) : {person.phone}</span>
                                </div>
                                <div className="flex items-center text-sm mt-1">
                                    <IoMdMail className="text-black mr-2" />
                                    <span>Email (D) : {person.email}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => openModal(person)}
                                className="bg-yellow-300 text-black px-6 py-4 rounded-full text-sm font-medium hover:bg-yellow-400 w-full md:w-auto"
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />

            <PopupProfile
                isOpen={isModalOpen}
                onClose={closeModal}
                person={selectedPerson}
            />
        </div>
    );
}