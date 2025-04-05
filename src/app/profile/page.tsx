// pages/profile.js
"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { UserData } from "@/app/components/Utils/interface";


export default function ProfilePage() {

    const [userData, setUserData] = useState({
        personalInfo: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            telephoneNumber: '',
            email: '',
            avatar: '/assets/images/456322.webp',
        },
        addressInfo: {
            address: '',
            country: 'USA',
            pinCode: '',
            fathersName: '',
            mothersName: '',
            dateOfBirth: '',
            birthPlace: '',
        },
        professionalInfo: {
            nation: '',
            career: '',
            employment: '',
            workAddress: '',
            additionalInfo: '',
        },
        agreeToTerms: false
    });




    const handleChange = (
        section: keyof UserData,
        field: string,
        value: string | boolean
    ) => {
        setUserData((prevData) => ({
            ...prevData,
            [section]: {
                ...(typeof prevData[section] === 'object' && prevData[section] !== null ? prevData[section] : {}),
                [field]: value,
            },
        }));
    };


    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setUserData((prevData: UserData) => ({
            ...prevData,
            agreeToTerms: e.target.checked
        }));
    };


    useEffect(() => {

        const loadUserData = async () => {
            try {

                setTimeout(() => {
                    const sampleData = {
                        personalInfo: {
                            firstName: 'Ahmad',
                            lastName: 'bin Abdullah',
                            phoneNumber: '+1234567890',
                            telephoneNumber: '+0987654321',
                            email: 'ahmad@example.com',
                            avatar: '/assets/images/456322.webp',
                        },
                        addressInfo: {
                            address: '123 Main Street',
                            country: 'USA',
                            pinCode: '12345',
                            fathersName: 'Abdullah',
                            mothersName: 'Fatima',
                            dateOfBirth: '1990-01-01',
                            birthPlace: 'Riyadh',
                        },
                        professionalInfo: {
                            nation: 'Saudi Arabia',
                            career: 'Software Engineer',
                            employment: 'Tech Company Inc.',
                            workAddress: '456 Tech Boulevard',
                            additionalInfo: '',
                        },
                        agreeToTerms: false
                    };

                    setUserData(sampleData);
                }, 300);
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        };

        loadUserData();
    }, []);


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        console.log('Saving user data:', userData);

        alert('Profile updated successfully!');
    };

    return (
        <div className="bg-gray-100">
            <div className="text-white text-center inner-banner">
                <Header />
                <div className="flex justify-center items-center">
                    <h1 className="text-2xl md:text-5xl font-bold shadow-md">Profile</h1>
                </div>
            </div>

            <div className="container mx-auto mt-12  overflow-hidden">

                <div className=" p-6">
                    <div className="flex items-center">
                        <div className="relative w-24 h-24 mr-6">
                            <Image
                                src={userData.personalInfo.avatar}
                                alt="Profile"
                                layout="fill"
                                className="rounded-full border-4 border-white shadow-lg object-cover"
                                priority
                            />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-black">
                                {userData.personalInfo.firstName || 'New'} {userData.personalInfo.lastName || 'User'}
                            </h1>
                            <p className="text-black/80">
                                {userData.personalInfo.email || 'No email provided'}
                            </p>
                            <p className="text-black/60 text-sm mt-1">
                                {userData.professionalInfo.career || 'Career'} at {userData.professionalInfo.employment || 'Company'}
                            </p>
                        </div>
                    </div>
                </div>


                <form onSubmit={handleSubmit} className="p-6">



                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    value={userData.personalInfo.firstName}
                                    onChange={(e) => handleChange('personalInfo', 'firstName', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg  focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    value={userData.personalInfo.lastName}
                                    onChange={(e) => handleChange('personalInfo', 'lastName', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    value={userData.personalInfo.phoneNumber}
                                    onChange={(e) => handleChange('personalInfo', 'phoneNumber', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telephone Number</label>
                                <input
                                    type="text"
                                    value={userData.personalInfo.telephoneNumber}
                                    onChange={(e) => handleChange('personalInfo', 'telephoneNumber', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={userData.personalInfo.email}
                                    onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>
                    </div>


                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Address Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input
                                    type="text"
                                    value={userData.addressInfo.address}
                                    onChange={(e) => handleChange('addressInfo', 'address', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                <div className="flex items-center border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
                                    <span className="mr-2">🇺🇸</span>
                                    <input
                                        type="text"
                                        value={userData.addressInfo.country}
                                        onChange={(e) => handleChange('addressInfo', 'country', e.target.value)}
                                        className="flex-grow outline-none bg-transparent"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                                <input
                                    type="text"
                                    value={userData.addressInfo.pinCode}
                                    onChange={(e) => handleChange('addressInfo', 'pinCode', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Father Name</label>
                                <input
                                    type="text"
                                    value={userData.addressInfo.fathersName}
                                    onChange={(e) => handleChange('addressInfo', 'fathersName', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mother Name</label>
                                <input
                                    type="text"
                                    value={userData.addressInfo.mothersName}
                                    onChange={(e) => handleChange('addressInfo', 'mothersName', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                <input
                                    type="date"
                                    value={userData.addressInfo.dateOfBirth}
                                    onChange={(e) => handleChange('addressInfo', 'dateOfBirth', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Birth Place</label>
                                <input
                                    type="text"
                                    value={userData.addressInfo.birthPlace}
                                    onChange={(e) => handleChange('addressInfo', 'birthPlace', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>
                    </div>

                   
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Professional Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nation</label>
                                <input
                                    type="text"
                                    value={userData.professionalInfo.nation}
                                    onChange={(e) => handleChange('professionalInfo', 'nation', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Career</label>
                                <input
                                    type="text"
                                    value={userData.professionalInfo.career}
                                    onChange={(e) => handleChange('professionalInfo', 'career', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employment</label>
                                <input
                                    type="text"
                                    value={userData.professionalInfo.employment}
                                    onChange={(e) => handleChange('professionalInfo', 'employment', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Work Address</label>
                                <input
                                    type="text"
                                    value={userData.professionalInfo.workAddress}
                                    onChange={(e) => handleChange('professionalInfo', 'workAddress', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                                <input
                                    type="text"
                                    value={userData.professionalInfo.additionalInfo}
                                    onChange={(e) => handleChange('professionalInfo', 'additionalInfo', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Agreement Checkbox */}
                    <div className="mb-8">
                        <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
                            <input
                                type="checkbox"
                                checked={userData.agreeToTerms}
                                onChange={handleCheckboxChange}
                                className="h-5 w-5 text-green-500 rounded focus:ring-green-500 mr-2"
                            />
                            <label className="text-gray-700">
                                The above information is correct
                            </label>
                        </div>
                    </div>

                
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-yellow-300 text-black font-medium rounded-xl shadow-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300"
                        >
                            Save Profile
                        </button>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    );
}