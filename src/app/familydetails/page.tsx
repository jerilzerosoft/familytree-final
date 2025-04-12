"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { UserData } from "@/app/components/Utils/interface";
import { BASE_URL } from "@/app/components/Utils/apis";
// Import default avatar
import DefaultAvatar from "@/assets/images/user.png";

export default function ProfilePage() {
    const [userData, setUserData] = useState({
        personalInfo: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            telephoneNumber: '',
            email: '',
            avatar: '',
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
        }
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null); // Store the selected file for later upload
    const fileInputRef = useRef(null);

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

    
    const uploadProfileImage = async (file) => {
        try {
            setIsUploading(true);
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');
            
            if (!token || !userId) {
                throw new Error('Authentication credentials not found');
            }
            
            // Create form data
            const formData = new FormData();
            formData.append('profile_picture', file);
            
            // Upload image
            const response = await fetch(`${BASE_URL}/admin/upload-profile-picture/${userId}/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });
            
            if (!response.ok) {
                throw new Error('Failed to upload profile picture');
            }
            
            const data = await response.json();
            
            // Update user data with the new image path from server
            handleChange('personalInfo', 'avatar', `${BASE_URL}${data.profile_picture}`);
            
            return data.profile_picture;
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            alert('Failed to upload profile picture: ' + error.message);
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    // Handle profile picture selection - now only shows preview without uploading
    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Store file for later upload
            setSelectedFile(file);
            
            // Show preview immediately
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Function to trigger file input click
    const triggerFileInput = () => {
        fileInputRef.current.click();
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
                
                const response = await fetch(`${BASE_URL}/admin/get-profile/${userId}/`, {
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

                
                let avatarUrl = profile.profile_picture || '';
                if (avatarUrl && !avatarUrl.startsWith('http') && !avatarUrl.startsWith('data:')) {
                    avatarUrl = `${BASE_URL}${avatarUrl}`;
                }
                
                
                if (!avatarUrl || avatarUrl.trim() === '') {
                    avatarUrl = '';
                }

                setUserData({
                    personalInfo: {
                        firstName,
                        lastName,
                        phoneNumber: profile.phone || '',
                        telephoneNumber: profile.phone || '', 
                        email: profile.email || '',
                        avatar: avatarUrl,
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
                    }
                });
                
               
                if (avatarUrl) {
                    setImagePreview(avatarUrl);
                }
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
            const userId = localStorage.getItem('userId');
    
            if (!token || !userId) {
                throw new Error('Missing authentication or user ID');
            }
            
            // First upload image if a new one was selected
            let profilePicture = userData.personalInfo.avatar;
            if (selectedFile) {
                const uploadedImagePath = await uploadProfileImage(selectedFile);
                if (uploadedImagePath) {
                    profilePicture = `${BASE_URL}${uploadedImagePath}`;
                }
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
                profile_picture: profilePicture
            };
    
            const response = await fetch(`${BASE_URL}/admin/profiles/update/${userId}/`, {
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
            // Reset the selected file since it's been uploaded
            setSelectedFile(null);
            setIsEditMode(false); // Exit edit mode after successful save
        } catch (error: any) {
            console.error('Error updating profile:', error);
            alert(`Failed to update profile: ${error.message}`);
        }
    };
    
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        // Redirect to login page
        window.location.href = '/login';
    };

    // Toggle edit mode and reset image preview if canceling
    const toggleEditMode = () => {
        if (isEditMode) {
            // If canceling edit mode, reset any unsaved changes including image preview
            setImagePreview(userData.personalInfo.avatar || null);
            setSelectedFile(null);
        }
        setIsEditMode(!isEditMode);
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

    // Determine the image source to use
    const displayImageSrc = imagePreview || userData.personalInfo.avatar || DefaultAvatar.src;

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
                            <div 
                                className="relative w-24 h-24 mr-6 cursor-pointer group"
                                onClick={isEditMode ? triggerFileInput : null}
                            >
                                {isEditMode && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-sm font-medium">Change Photo</span>
                                    </div>
                                )}
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                                    </div>
                                )}
                                <Image
                                    src={displayImageSrc}
                                    alt="Profile"
                                    width={96}
                                    height={96}
                                    className="rounded-full border-4 border-white shadow-lg object-cover w-24 h-24"
                                    priority
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = DefaultAvatar.src;
                                    }}
                                />
                                {isEditMode && (
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleProfilePictureChange}
                                    />
                                )}
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
                        <div className="flex gap-3">
                            <button 
                                onClick={toggleEditMode}
                                className={`px-4 py-2 ${isEditMode ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg transition duration-300`}
                            >
                                {isEditMode ? 'Cancel Edit' : 'Edit Profile'}
                            </button>
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
                                    className={`w-full p-3 border border-gray-300 rounded-lg ${isEditMode ? 'focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'bg-gray-100'}`}
                                    readOnly={!isEditMode}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    value={userData.personalInfo.lastName}
                                    onChange={(e) => handleChange('personalInfo', 'lastName', e.target.value)}
                                    className={`w-full p-3 border border-gray-300 rounded-lg ${isEditMode ? 'focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'bg-gray-100'}`}
                                    readOnly={!isEditMode}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    value={userData.personalInfo.phoneNumber}
                                    onChange={(e) => handleChange('personalInfo', 'phoneNumber', e.target.value)}
                                    className={`w-full p-3 border border-gray-300 rounded-lg ${isEditMode ? 'focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'bg-gray-100'}`}
                                    readOnly={!isEditMode}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">MyKad Number</label>
                                <input
                                    type="text"
                                    value={userData.personalInfo.mykadNumber}
                                    onChange={(e) => handleChange('personalInfo', 'mykadNumber', e.target.value)}
                                    className={`w-full p-3 border border-gray-300 rounded-lg ${isEditMode ? 'focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'bg-gray-100'}`}
                                    readOnly={!isEditMode}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={userData.personalInfo.email}
                                    onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
                                    className={`w-full p-3 border border-gray-300 rounded-lg ${isEditMode ? 'focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'bg-gray-100'}`}
                                    readOnly={!isEditMode}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Race</label>
                                <input
                                    type="text"
                                    value={userData.personalInfo.race}
                                    onChange={(e) => handleChange('personalInfo', 'race', e.target.value)}
                                    className={`w-full p-3 border border-gray-300 rounded-lg ${isEditMode ? 'focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'bg-gray-100'}`}
                                    readOnly={!isEditMode}
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
                                    className={`w-full p-3 border border-gray-300 rounded-lg ${isEditMode ? 'focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'bg-gray-100'}`}
                                    readOnly={!isEditMode}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                <div className={`flex items-center border border-gray-300 rounded-lg p-3 ${isEditMode ? 'focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500' : 'bg-gray-100'}`}>
                                    <span className="mr-2">🇲🇾</span>
                                    <input
                                        type="text"
                                        value={userData.addressInfo.country}
                                        onChange={(e) => handleChange('addressInfo', 'country', e.target.value)}
                                        className="flex-grow outline-none bg-transparent"
                                        readOnly={!isEditMode}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                                <input
                                    type="text"
                                    value={userData.addressInfo.pinCode}
                                    onChange={(e) => handleChange('addressInfo', 'pinCode', e.target.value)}
                                    className={`w-full p-3 border border-gray-300 rounded-lg ${isEditMode ? 'focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'bg-gray-100'}`}
                                    readOnly={!isEditMode}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                                <input
                                    type="text"
                                    value={userData.addressInfo.fathersName}
                                    onChange={(e) => handleChange('addressInfo', 'fathersName', e.target.value)}
                                    className={`w-full p-3 border border-gray-300 rounded-lg ${isEditMode ? 'focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'bg-gray-100'}`}
                                    readOnly={!isEditMode}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                                <input
                                    type="text"
                                    value={userData.addressInfo.mothersName}
                                    onChange={(e) => handleChange('addressInfo', 'mothersName', e.target.value)}
                                    className={`w-full p-3 border border-gray-300 rounded-lg ${isEditMode ? 'focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'bg-gray-100'}`}
                                    readOnly={!isEditMode}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                <input
                                    type="date"
                                    value={userData.addressInfo.dateOfBirth}
                                    onChange={(e) => handleChange('addressInfo', 'dateOfBirth', e.target.value)}
                                    className={`w-full p-3 border border-gray-300 rounded-lg ${isEditMode ? 'focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'bg-gray-100'}`}
                                    readOnly={!isEditMode}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Birth Place</label>
                                <input
                                    type="text"
                                    value={userData.addressInfo.birthPlace}
                                    onChange={(e) => handleChange('addressInfo', 'birthPlace', e.target.value)}
                                    className={`w-full p-3 border border-gray-300 rounded-lg ${isEditMode ? 'focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'bg-gray-100'}`}
                                    readOnly={!isEditMode}
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
                                    className={`w-full p-3 border border-gray-300 rounded-lg ${isEditMode ? 'focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'bg-gray-100'}`}
                                    readOnly={!isEditMode}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                                <input
                                    type="text"
                                    value={userData.professionalInfo.career}
                                    onChange={(e) => handleChange('professionalInfo', 'career', e.target.value)}
                                    className={`w-full p-3 border border-gray-300 rounded-lg ${isEditMode ? 'focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'bg-gray-100'}`}
                                    readOnly={!isEditMode}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employment</label>
                                <input
                                    type="text"
                                    value={userData.professionalInfo.employment}
                                    onChange={(e) => handleChange('professionalInfo', 'employment', e.target.value)}
                                    className={`w-full p-3 border border-gray-300 rounded-lg ${isEditMode ? 'focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'bg-gray-100'}`}
                                    readOnly={!isEditMode}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Work Address</label>
                                <input
                                    type="text"
                                    value={userData.professionalInfo.workAddress}
                                    onChange={(e) => handleChange('professionalInfo', 'workAddress', e.target.value)}
                                    className={`w-full p-3 border border-gray-300 rounded-lg ${isEditMode ? 'focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'bg-gray-100'}`}
                                    readOnly={!isEditMode}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                                <input
                                    type="text"
                                    value={userData.professionalInfo.additionalInfo}
                                    onChange={(e) => handleChange('professionalInfo', 'additionalInfo', e.target.value)}
                                    className={`w-full p-3 border border-gray-300 rounded-lg ${isEditMode ? 'focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'bg-gray-100'}`}
                                    readOnly={!isEditMode}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={!isEditMode}
                            className={`px-6 py-3 font-medium rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ${
                                isEditMode 
                                ? 'bg-yellow-300 text-black hover:bg-yellow-400' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
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