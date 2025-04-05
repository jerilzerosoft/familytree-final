import { useState, useEffect } from 'react';
import Image from 'next/image';
import { IoCloseSharp } from "react-icons/io5";
import { ProfileModalProps } from "@/app/components/Utils/interface";
import { motion } from "framer-motion";
import Shield from "@/assets/images/shield.jpg";



const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, person }) => {
  const [activeTab, setActiveTab] = useState('Tab 01');
  const [firstName, setFirstName] = useState('Ahmad bin');
  const [lastName, setLastName] = useState('Abdullah');
  const [email, setEmail] = useState('ahmad@example.com');
  const [country, setCountry] = useState('United States');
  const user = { role: "guest" };
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (person) {
      const nameParts = person.name.split(' ');
      setFirstName(nameParts.slice(0, 2).join(' '));
      setLastName(nameParts.slice(2).join(' ').replace(/[()]/g, ''));
      setEmail(person.email);
    }
  }, [person]);

  if (!isOpen) return null;

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
            <h2 className="text-xl font-semibold text-gray-800">{person?.name || 'Ahmad bin Abdullah'}</h2>
            <p className="text-gray-500 text-sm">{person?.email || 'ahmad@example.com'}</p>
          </div>
        </div>

        <div className="flex border-b-4 border-green-800 mb-6">
          <button
            onClick={() => setActiveTab('Tab 01')}
            className={`py-3 px-4 rounded-t-xl mr-2 border border-green-800 ${activeTab === 'Tab 01'
              ? 'bg-green-800 text-white'
              : 'text-gray-700 hover:bg-gray-100'}`}
          >
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab('Tab 02')}
            className={`py-3 px-4 mr-2 border border-green-800 rounded-t-xl ${activeTab === 'Tab 02'
              ? 'bg-green-800 text-white'
              : 'text-gray-700 hover:bg-gray-100'}`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab('Tab 03')}
            className={`py-3 px-4 border border-green-800 rounded-t-xl ${activeTab === 'Tab 03'
              ? 'bg-green-800 text-white'
              : 'text-gray-700 hover:bg-gray-100'}`}
          >
            Additional Info
          </button>
        </div>

        <div className=" space-y-6 min-h-[200px]">
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
                  className="w-full p-3 border  border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Last Name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 ">
                <input
                  type="text"
                  // value={Phonenumber}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Phone Number"
                />
                <input
                  type="text"
                  // value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-3 border  border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Telephone Number"
                />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border  border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Email"
              />

            </>
          )}
          {activeTab === "Tab 02" && (
            <>
              {!isAdmin ? (
                <div className="flex flex-col items-center justify-center p-6 border border-blue-300 bg-red-50 rounded-lg">
                  <p className="text-center text-lg font-semibold text-blue-600">
                    Please contact admin to view this information.
                  </p>
                  <   Image src={Shield} alt="Contact Admin" className="w-40 h-40 mb-4" />
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">Contact Admin</button>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
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
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Pin Code"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Father's Name"
                    />
                    <input
                      type="text"
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Mother's Name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Date of Birth"
                    />
                    <input
                      type="text"
                      onChange={(e) => setLastName(e.target.value)}
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
              {!isAdmin ? (
                <div className="flex flex-col items-center justify-center p-6 border border-blue-300 bg-red-50 rounded-lg">
                  <p className="text-center text-lg font-semibold text-blue-600">
                    Please contact admin to view this information.
                  </p>
                  <   Image src={Shield} alt="Contact Admin" className="w-40 h-40 mb-4" />
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">Contact Admin</button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Nation"
                    />
                    <input
                      type="text"
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Career"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Employment"
                    />
                    <input
                      type="text"
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Work Address"
                    />
                  </div>
                  <input
                    type="text"
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Don't know"
                  />
                  <div className="flex items-center border border-gray-400 rounded-lg p-3 bg-gray-50">
                    <input className="mr-2" type="checkbox" />
                    <input
                      type="text"
                      onChange={(e) => setCountry(e.target.value)}
                      className="flex-grow outline-none bg-transparent"
                      placeholder="The above information is correct"
                    />
                  </div>
                </>
              )}
            </>
          )}

        </div>

        <div className="flex justify-end p-4 space-x-4  bg-gray-50">
          <button
            onClick={onClose}
            className="py-2 px-6 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          {/* <button 
            className="py-2 px-6 bg-yellow-400 rounded-full text-black font-medium hover:bg-yellow-500 transition"
          >
            Save Changes
          </button> */}
        </div>
      </motion.div>
    </div>
  );
}

export default ProfileModal;
