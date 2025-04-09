//  @typescript-eslint/no-explicit-any
//  @typescript-eslint/no-unused-vars
// @typescript-eslint/no-unused-vars

"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import Avator from "@/assets/images/user.png";
import { Person } from "@/app/components/Utils/interface";
import PopupProfile from "@/app/components/Popup-profile";
import { IoIosCall, IoMdMail } from "react-icons/io";
import { useCallback } from 'react';


export default function DetailsPage() {
    // const searchParams = useSearchParams();
    const [nameQuery, setNameQuery] = useState('');
    const [pathQuery, setPathQuery] = useState('');
    const [results, setResults] = useState<Person[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);


    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);


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
            fetchProfiles();
        }, 500),
        [nameQuery, pathQuery]
    );


    
    // useEffect(() => {
    //     const searchQuery = searchParams.get('search');
    //     if (searchQuery) {
            
    //         const parts = searchQuery.split(' ');
    //         if (parts.length > 1) {
    //             setNameQuery(parts[0]);
    //             setPathQuery(parts.slice(1).join(' '));
    //         } else {
    //             setNameQuery(searchQuery);
    //         }
    //     }
    // }, [searchParams]);


    useEffect(() => {
        if (nameQuery !== '' || pathQuery !== '') {
            debouncedSearch();
        }
    }, [nameQuery, pathQuery, debouncedSearch]);

    useEffect(() => {
        fetchProfiles();
    }, [currentPage, pageSize]);


    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            // let url = `http://localhost:8000/admin/get-profiles/?page=${currentPage}&size=${pageSize}`;
            let url = `https://api.familytreee.zerosoft.in/admin/get-profiles/?page=${currentPage}&size=${pageSize}`;
            // let url = `${process.env.NEXT_PUBLIC_API_URL}/admin/get-profiles/?page=${currentPage}&size=${pageSize}`;

            
            if (nameQuery || pathQuery) {
                
                if (nameQuery && pathQuery) {
                    url += `&search=${encodeURIComponent(`${nameQuery} ${pathQuery}`)}`;
                } else {
                   
                    const searchTerm = nameQuery || pathQuery;
                    url += `&search=${encodeURIComponent(searchTerm)}`;
                }
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
                setResults(data.profiles.map((profile: any) => ({
                    id: profile.id,
                    name: profile.full_name,
                    phone: profile.phone || "N/A",
                    email: profile.email,
                    avatar: profile.profile_picture || Avator,
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
                    mykad_number:profile.mykad_number
                })));
                
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
        fetchProfiles();
    };
    
    useEffect(() => {
        fetchProfiles();
    }, [nameQuery, pathQuery, currentPage]);
    
    const handleReset = () => {
        setNameQuery('');
        setPathQuery('');
        setCurrentPage(1);
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
                    className={`px-3 py-1 mx-1  cursor-pointer rounded ${currentPage === i ? 'bg-green-700 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
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
                className={`px-3 py-1 mx-1 cursor-pointer  rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-gray-300 hover:bg-gray-400'}`}
            >
                &raquo;
            </button>
        );

        return pages;
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
                            placeholder="Last Name/Email/ID"
                            className="w-full md:w-1/3 border-1 border-gray-500 rounded-xl h-12 p-2"
                            value={pathQuery}
                            onChange={(e) => setPathQuery(e.target.value)}
                        />
                        <button
                            onClick={handleSearch}
                            className="px-8 py-3 bg-green-700 cursor-pointer text-white rounded-4xl hover:bg-green-800"
                        >
                            Search
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-8 py-3 bg-gray-400 cursor-pointer text-white rounded-4xl hover:bg-gray-500"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            <div className="pb-16 px-4 container mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Search Results</h2>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                            {results.length > 0 ? (
                                results.map((person) => (
                                    <div
                                        key={person.id}
                                        className="border border-gray-400 rounded-lg p-8 flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 shadow-lg"
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
                                            className="bg-yellow-300 text-black px-6 py-4 cursor-pointer rounded-full text-sm font-medium hover:bg-yellow-400 w-full md:w-auto"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-8">
                                    <p className="text-gray-500">No results found. Please try a different search term.</p>
                                </div>
                            )}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center  mt-8">
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