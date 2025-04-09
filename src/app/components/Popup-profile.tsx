import { useState, useEffect } from 'react';
import Image from 'next/image';
import { IoCloseSharp } from "react-icons/io5";
import { ProfileModalProps } from "@/app/components/Utils/interface";
import { motion } from "framer-motion";
import Shield from "@/assets/images/shield.jpg";
import axios from 'axios';

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, person }) => {
  const [activeTab, setActiveTab] = useState('Tab 01');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [telNumber, setTelNumber] = useState('');
  const [country, setCountry] = useState('United States');
  const [approvedTabs, setApprovedTabs] = useState<string[]>([]);
  const [requestingTab, setRequestingTab] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Get authentication token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  };

  // Configure axios with authentication
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Get user details
  const user = {
    id: typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : '',
    email: typeof window !== 'undefined' ? localStorage.getItem('userEmail') || '' : '',
    username: person?.name || '',
    role: typeof window !== 'undefined' ? localStorage.getItem('userRole') || 'guest' : 'guest'
  };

  const isAdmin = user.role === "admin";

  const fetchApprovedTabs = async () => {
    try {
      if (!getAuthToken()) {
        setAuthError("No authentication token found. Please log in again.");
        return;
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/login/api/request-access-status/`);
      setApprovedTabs(response.data.approved_tabs || []);
      setAuthError(null);
    } catch (error: any) {
      console.error("Error fetching approved tabs:", error);
      if (error.response?.status === 401) {
        setAuthError("Authentication failed. Please log in again.");
      }
    }
  };

  const handleAccessRequest = async (tab: string) => {
    setRequestingTab(tab);
  
    const username = localStorage.getItem("username");
  
    if (!username) {
      setAuthError("No username found. Please log in again.");
      setRequestingTab(null);
      return;
    }
  
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/login/api/request-access/`, {
        username,
        tab,
      });
  
      alert("Request sent to admin successfully.");
      setAuthError(null);
    } catch (error: any) {
      console.error("Failed to send request:", error);
      if (error.response?.status === 401) {
        setAuthError("Authentication failed. Please log in again.");
      } else {
        alert("Failed to send request. Please try again.");
      }
    } finally {
      setRequestingTab(null);
    }
  };
  
  
  
  

  useEffect(() => {
    if (isOpen && user.id) {
      fetchApprovedTabs();
    }
  }, [isOpen, user.id]);

  useEffect(() => {
    if (person) {
      const nameParts = person.name ? person.name.split(' ') : ['', ''];
      setFirstName(nameParts.length > 0 ? nameParts[0] : '');
      setLastName(nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');
      setEmail(person.email || user.email || '');
    }
  }, [person, user.email]);

  if (!isOpen) return null;

  const isTabApproved = (tab: string) => 
    tab === 'Tab 01' || isAdmin || approvedTabs.includes(tab);

  const tabMapping = {
    'Tab 01': 'Basic Info',
    'Tab 02': 'Personal Info',
    'Tab 03': 'Additional Info'
  };

  // Show authentication error if present
  if (authError) {
    return (
      <div className="fixed inset-0 bg-[rgba(10,7,7,0.6)] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 text-center"
        >
          <div className="text-red-600 text-xl mb-4">Authentication Error</div>
          <p className="mb-6">{authError}</p>
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[rgba(10,7,7,0.6)] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-lg w-full max-w-lg relative overflow-hidden p-6"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition"
        >
          <IoCloseSharp className="h-6 w-6" />
        </button>

        <div className="flex items-center p-4 mb-4">
          <div className="w-16 h-16 mr-4">
            <Image
              src={person?.avatar || "/avatars/default.jpg"}
              alt="Profile"
              width={64}
              height={64}
              className="rounded-full object-cover shadow-md"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{person?.name || user.username}</h2>
            <p className="text-gray-500 text-sm">{person?.email || user.email}</p>
          </div>
        </div>

        <div className="flex border-b-4 border-green-800 mb-6">
          {Object.entries(tabMapping).map(([tabKey, tabName]) => (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`py-3 px-4 rounded-t-xl mr-2 border border-green-800 ${
                activeTab === tabKey
                ? 'bg-green-800 text-white'
                : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tabName}
            </button>
          ))}
        </div>

        <div className="space-y-6 min-h-[200px]">
          {activeTab === "Tab 01" && (
            <>
              <div className="grid grid-cols-2 gap-4 ">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="First Name"
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Last Name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 ">
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Phone Number"
                />
                <input
                  type="text"
                  value={telNumber}
                  onChange={(e) => setTelNumber(e.target.value)}
                  className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Telephone Number"
                />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Email"
              />
            </>
          )}

          {activeTab === "Tab 02" && (
            <>
              {!isTabApproved("Tab 02") ? (
                <div className="flex flex-col items-center justify-center p-6 border border-blue-300 bg-red-50 rounded-lg">
                  <p className="text-center text-lg font-semibold text-blue-600">
                    Please request access to view this information.
                  </p>
                  <Image src={Shield} alt="Request Access" className="w-40 h-40 mb-4" />
                  <button 
                    onClick={() => handleAccessRequest("Tab 02")}
                    disabled={requestingTab === "Tab 02"}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 disabled:bg-gray-400"
                  >
                    {requestingTab === "Tab 02" ? "Sending Request..." : "Request Access"}
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Address"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center border border-gray-400 rounded-lg p-3 bg-gray-50">
                      <span className="mr-2">🇺🇸</span>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="flex-grow outline-none bg-transparent"
                        placeholder="Country"
                      />
                    </div>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Pin Code"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Father's Name"
                    />
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Mother's Name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Date of Birth"
                    />
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Birth Place"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === "Tab 03" && (
            <>
              {!isTabApproved("Tab 03") ? (
                <div className="flex flex-col items-center justify-center p-6 border border-blue-300 bg-red-50 rounded-lg">
                  <p className="text-center text-lg font-semibold text-blue-600">
                    Please request access to view this information.
                  </p>
                  <Image src={Shield} alt="Request Access" className="w-40 h-40 mb-4" />
                  <button 
                    onClick={() => handleAccessRequest("Tab 03")}
                    disabled={requestingTab === "Tab 03"}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 disabled:bg-gray-400"
                  >
                    {requestingTab === "Tab 03" ? "Sending Request..." : "Request Access"}
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Nation"
                    />
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Career"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Employment"
                    />
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Work Address"
                    />
                  </div>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Additional Info"
                  />
                  <div className="flex items-center border border-gray-400 rounded-lg p-3 bg-gray-50">
                    <input className="mr-2" type="checkbox" />
                    <span className="flex-grow">The above information is correct</span>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end p-4 space-x-4 bg-gray-50">
          <button
            onClick={onClose}
            className="py-2 px-6 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button 
            className="py-2 px-6 bg-yellow-400 rounded-full text-black font-medium hover:bg-yellow-500 transition"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ProfileModal;