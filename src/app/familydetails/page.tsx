"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import Avator from "@/assets/images/user.png";
import { Person } from "@/app/components/Utils/interface";
import PopupProfile from "@/app/components/Popup-profile";
import { IoIosCall, IoMdMail } from "react-icons/io";
import { BASE_URL } from "@/app/components/Utils/apis"

export default function DetailsPage() {
    const [nameQuery, setNameQuery] = useState('');
    const [pathQuery, setPathQuery] = useState('');
    const [results, setResults] = useState<Person[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);


 
useEffect(() => {
    
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('authToken');
      setToken(storedToken);
    }
  }, []);
    const handleHeaderSearch = (query) => {
        if (query) {
            setNameQuery(query);
            setPathQuery('');
            setCurrentPage(1);
            fetchProfiles(query, '');
        }
    };


    const debounce = (func: Function, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };


    const debouncedSearch = useCallback(
        debounce(() => {
            setCurrentPage(1);
            fetchProfiles(nameQuery, pathQuery);
        }, 500),
        [nameQuery, pathQuery]
    );


    useEffect(() => {
        if (nameQuery !== '' || pathQuery !== '') {
            debouncedSearch();
        }
    }, [nameQuery, pathQuery, debouncedSearch]);


    useEffect(() => {
        fetchProfiles(nameQuery, pathQuery);
    }, [currentPage, pageSize]);


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedQuery = localStorage.getItem('headerSearchQuery');
            if (storedQuery) {
                setNameQuery(storedQuery);
                localStorage.removeItem('headerSearchQuery');
                setCurrentPage(1);
                fetchProfiles(storedQuery, '');
            }
        }
    }, []);


    const fetchProfiles = async (name = nameQuery, path = pathQuery) => {
        setLoading(true);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

            let url = `${BASE_URL}/admin/get-profiles/?page=${currentPage}&size=${pageSize}`;

            if (name || path) {
                const searchTerm = name && path ? `${name} ${path}` : name || path;
                url += `&search=${encodeURIComponent(searchTerm)}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                const profiles = data.profiles.map((profile: any) => {
                    let avatarUrl = profile.profile_picture || '';

                    if (avatarUrl && !avatarUrl.startsWith('http') && !avatarUrl.startsWith('data:')) {
                        avatarUrl = `${BASE_URL}${avatarUrl}`;
                    }

                    if (!avatarUrl || avatarUrl.trim() === '') {
                        avatarUrl = Avator; 
                    }

                    return {
                        id: profile.id,
                        user_id: profile.user_id,
                        name: profile.full_name,
                        phone: profile.phone || "N/A",
                        email: profile.email,
                        avatar: avatarUrl,
                        date_of_birth: profile.date_of_birth || "N/A",
                        place_of_birth: profile.place_of_birth || "N/A",
                        address: profile.home_address || "N/A",
                        country: profile.nationality || "N/A",
                        pin_code: profile.postcode || "N/A",
                        fathers_name: profile.fathers_name || "N/A",
                        mothers_name: profile.mothers_name || "N/A",
                        nation: profile.nationality || "N/A",
                        career: profile.occupation || "N/A",
                        employment: profile.occupation || "N/A",
                        work_address: profile.work_address || "N/A",
                        additional_info: profile.additional_info || "N/A",
                        mykad_number: profile.mykad_number
                    };
                });

                setResults(profiles);
                setTotalPages(data.pagination.total_pages);
                setTotalItems(data.pagination.total_items);
            } else {
                console.error("Failed to fetch profiles:", data.error);
            }

        } catch (error) {
            console.error("Error fetching profiles:", error);
        } finally {
            setLoading(false);
        }
    };


    const handleSearch = () => {
        setCurrentPage(1);
        fetchProfiles(nameQuery, pathQuery);
    };


    const handleReset = () => {
        setNameQuery('');
        setPathQuery('');
        setCurrentPage(1);
        fetchProfiles('', '');
    };


    const openModal = (person: Person): void => {
        setSelectedPerson(person);
        setIsModalOpen(true);
    };


    const closeModal = () => {
        setIsModalOpen(false);
    };


    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };


    const renderPagination = () => {
        const pages = [];

        pages.push(
            <button
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 mx-1 cursor-pointer rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-gray-300 hover:bg-gray-400'}`}
            >
                &laquo;
            </button>
        );

        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, startPage + 4);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 mx-1 cursor-pointer rounded ${currentPage === i ? 'bg-green-700 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                    {i}
                </button>
            );
        }

        pages.push(
            <button
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 mx-1 cursor-pointer rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-gray-300 hover:bg-gray-400'}`}
            >
                &raquo;
            </button>
        );

        return pages;
    };

    return (
        <div className="bg-gray-100">
            <div className="text-white text-center inner-banner">
                <Header onSearch={handleHeaderSearch} />
                <div className="flex justify-center items-center">
                    <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold shadow-md">
                        Family Members
                    </h1>
                </div>
            </div>

            <div className="py-6 md:py-8 lg:py-10 px-4 container mx-auto w-full mt-4 md:mt-6 lg:mt-8">
                <div className='border-1 border-gray-400 rounded-lg p-4 md:p-5 lg:p-6'>
                    <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">Search</h2>
                    <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 md:gap-4">
                        <input
                            type="text"
                            placeholder="First Name"
                            className="w-full sm:w-[calc(50%-8px)] lg:w-1/3 border-1 border-gray-500 rounded-xl h-12 p-2"
                            value={nameQuery}
                            onChange={(e) => setNameQuery(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Last Name/Email"
                            className="w-full sm:w-[calc(50%-8px)] lg:w-1/3 border-1 border-gray-500 rounded-xl h-12 p-2"
                            value={pathQuery}
                            onChange={(e) => setPathQuery(e.target.value)}
                        />
                        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                            <button
                                onClick={handleSearch}
                                className="w-full sm:w-auto px-6 md:px-8 py-3 bg-green-700 cursor-pointer text-white rounded-4xl hover:bg-green-800"
                            >
                                Search
                            </button>
                            <button
                                onClick={handleReset}
                                className="w-full sm:w-auto px-6 md:px-8 py-3 bg-gray-400 cursor-pointer text-white rounded-4xl hover:bg-gray-500"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pb-12 md:pb-16 px-4 container mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6">
                    <h2 className="text-lg md:text-xl font-semibold mb-2 sm:mb-0">Search Results</h2>
                    <p className="text-sm text-gray-600">
                        Showing {results.length} of {totalItems} Results
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-2">
                            {results.length > 0 ? (
                                results.map((person) => (
                                    <div
                                        key={person.id}
                                        className="border border-gray-400 rounded-lg p-4 md:p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-lg"
                                    >
                                        <div className="relative w-16 h-16 flex-shrink-0 mx-auto sm:mx-0">
                                            <Image
                                                src={person.avatar}
                                                alt="Profile"
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-full"
                                            />
                                        </div>
                                        <div className="flex-grow text-center sm:text-left">
                                            <h3 className="font-bold text-lg">{person.name}</h3>
                                            <div className="flex items-center text-sm mt-1 justify-center sm:justify-start">
                                                <IoIosCall className="text-black mr-2" />
                                                <span>Telephone (C): {person.phone}</span>
                                            </div>
                                            <div className="flex items-center text-sm mt-1 justify-center sm:justify-start">
                                                <IoMdMail className="text-black mr-2" />
                                                <span>Email (D): {person.email}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => openModal(person)}
                                            className="bg-yellow-300 text-black px-4 sm:px-6 py-3 sm:py-4 cursor-pointer rounded-full text-sm font-medium hover:bg-yellow-400 w-full sm:w-auto"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-1 lg:col-span-2 text-center py-8">
                                    <p className="text-gray-500">No results found. Please try a different search term.</p>
                                </div>
                            )}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center mt-6 md:mt-8">
                                {renderPagination()}
                            </div>
                        )}
                    </>
                )}
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