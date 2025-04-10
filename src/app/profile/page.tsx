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
            mykadNumber: '',
            username: '',
            userRole: '',
            userId: '',
            race: '',
        },
        addressInfo: {
            address: '',
            country: 'Malaysia',
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

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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

 

    useEffect(() => {
        const loadUserData = async () => {
            setIsLoading(true);
            try {
                
                const token = localStorage.getItem('authToken');
                const userId = localStorage.getItem('userId');
                
                if (!token) {
                    throw new Error('Authentication token not found');
                }
                
                
                // const response = await fetch(`http://localhost:8000/admin/get-profile/${userId}/`, {
                    const response = await fetch(`https://api.familytreee.zerosoft.in/admin/get-profile/${userId}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch profile data');
                }
                
                const data = await response.json();
                
                
                const profile = data.profile;
                
                if (!profile) {
                    throw new Error('No profile data found');
                }
                
                
                const nameParts = (profile.full_name || '').split(' ');
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';

                setUserData({
                    personalInfo: {
                        firstName,
                        lastName,
                        phoneNumber: profile.phone || '',
                        telephoneNumber: profile.phone || '', 
                        email: profile.email || '',
                        avatar: profile.profile_picture || '/assets/images/456322.webp',
                        mykadNumber: profile.mykad_number || '',
                        username: profile.username || '',
                        userRole: profile.user_role || '',
                        userId: profile.user_id || '',
                        race: profile.race || '',
                    },
                    addressInfo: {
                        address: profile.home_address || '',
                        country: profile.nationality || 'Malaysia',
                        pinCode: profile.postcode || '',
                        fathersName: profile.fathers_name || '',
                        mothersName: profile.mothers_name || '',
                        dateOfBirth: profile.date_of_birth || '',
                        birthPlace: profile.place_of_birth || '',
                    },
                    professionalInfo: {
                        nation: profile.nationality || '',
                        career: profile.occupation || '',
                        employment: profile.occupation || '', 
                        workAddress: profile.work_address || '',
                        additionalInfo: profile.additional_info || '',
                    },
                    agreeToTerms: false
                });
            } catch (error) {
                console.error('Error loading user data:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserData();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                throw new Error('Authentication token not found');
            }
            
            
            const apiData = {
                full_name: `${userData.personalInfo.firstName} ${userData.personalInfo.lastName}`,
                email: userData.personalInfo.email,
                phone: userData.personalInfo.phoneNumber,
                home_address: userData.addressInfo.address,
                postcode: userData.addressInfo.pinCode,
                date_of_birth: userData.addressInfo.dateOfBirth,
                place_of_birth: userData.addressInfo.birthPlace,
                nationality: userData.professionalInfo.nation,
                occupation: userData.professionalInfo.career,
                work_address: userData.professionalInfo.workAddress,
                mykad_number: userData.personalInfo.mykadNumber,
                race: userData.personalInfo.race,
                fathers_name: userData.addressInfo.fathersName,
                mothers_name: userData.addressInfo.mothersName,
                additional_info: userData.professionalInfo.additionalInfo,
                profile_picture: userData.personalInfo.avatar
            };

            
            const response = await fetch(`http://localhost:8000/admin/update-profile/${userData.personalInfo.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(apiData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update profile');
            }

            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(`Failed to update profile: ${error.message}`);
        }
    };

    const handleLogout = () => {
        // Clear auth token
        localStorage.removeItem('authToken');
        // Additional cleanup if needed
        sessionStorage.clear();
        // Redirect to login page
        window.location.href = '/login';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-100">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-300 border-t-transparent"></div>
                    <p className="mt-2 text-gray-700">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-700">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-yellow-300 text-black rounded-lg hover:bg-yellow-400"
                    >
                        Try Again
                    </button>
                    <button 
                        onClick={() => window.location.href = '/login'}
                        className="mt-4 ml-2 px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100">
            <div className="text-white text-center inner-banner">
                <Header />
                <div className="flex justify-center items-center">
                    <h1 className="text-2xl md:text-5xl font-bold shadow-md">Profile</h1>
                </div>
            </div>

            <div className="container mx-auto mt-12 overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center justify-between">
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
                        <div>
                            <button 
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                            >
                                Logout
                            </button>
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
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">MyKad Number</label>
                                <input
                                    type="text"
                                    value={userData.personalInfo.mykadNumber}
                                    onChange={(e) => handleChange('personalInfo', 'mykadNumber', e.target.value)}
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Race</label>
                                <input
                                    type="text"
                                    value={userData.personalInfo.race}
                                    onChange={(e) => handleChange('personalInfo', 'race', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                                <input
                                    type="text"
                                    value={userData.personalInfo.userId}
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                                    readOnly
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
                                    <span className="mr-2">🇲🇾</span>
                                    <input
                                        type="text"
                                        value={userData.addressInfo.country}
                                        onChange={(e) => handleChange('addressInfo', 'country', e.target.value)}
                                        className="flex-grow outline-none bg-transparent"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                                <input
                                    type="text"
                                    value={userData.addressInfo.pinCode}
                                    onChange={(e) => handleChange('addressInfo', 'pinCode', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                                <input
                                    type="text"
                                    value={userData.addressInfo.fathersName}
                                    onChange={(e) => handleChange('addressInfo', 'fathersName', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                                <input
                                    type="text"
                                    value={userData.professionalInfo.nation}
                                    onChange={(e) => handleChange('professionalInfo', 'nation', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
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

                    <div className="mb-8">
                        <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
                            <input
                                type="checkbox"
                                checked={userData.agreeToTerms}
                                // onChange={handleCheckboxChange}
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
                            disabled={!userData.agreeToTerms}
                            className={`px-6 py-3 font-medium rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ${userData.agreeToTerms ? 'bg-yellow-300 text-black hover:bg-yellow-400' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
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