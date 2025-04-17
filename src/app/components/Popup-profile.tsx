// import { useState, useEffect, useCallback } from 'react';
// import Image from 'next/image';
// import { IoCloseSharp } from "react-icons/io5";
// import { Person } from "@/app/components/Utils/interface";
// import { motion } from "framer-motion";
// import Shield from "@/assets/images/shield.jpg";
// import defaultAvatar from "@/assets/images/user.png";
// import axios from 'axios';
// import { BASE_URL } from "@/app/components/Utils/apis"

// interface PopupProfileProps {
//   isOpen: boolean;
//   onClose: () => void;
//   person: Person | null;
//   currentUser?: { id: string; role: string; username: string };
// }

// const PopupProfile: React.FC<PopupProfileProps> = ({ 
//   isOpen, 
//   onClose, 
//   person, 
//   currentUser 
// }) => {
//   const [activeTab, setActiveTab] = useState('Tab 01');
//   const [requestLoading, setRequestLoading] = useState(false);
//   const [requestedTabs, setRequestedTabs] = useState<{ [key: string]: boolean }>({});
//   const [accessStatus, setAccessStatus] = useState<{ tab: string, status: string }[]>([]);
//   const [lastFetchTime, setLastFetchTime] = useState(0);

//   const [tab2Access, setTab2Access] = useState(false);
//   const [tab3Access, setTab3Access] = useState(false);
  
//   const [user, setUser ] = useState({
//     role: "user",
//     id: "",
//     username: ""
//   });
  
//   useEffect(() => {
//     const storedUser = localStorage.getItem("userId") || "";
//     const storedUsername = localStorage.getItem("username") || "";
  
//     setUser(prev => ({
//       ...prev,
//       id: storedUser,
//       username: storedUsername
//     }));
//   }, []);
  
  
  

//   const tabMapping: { [key: string]: string } = {
//     'Tab 01': 'Basic Info',
//     'Tab 02': 'Personal Info',
//     'Tab 03': 'Additional Info'
//   };

// // MEMOIZE THE FUNCTION so React doesn't re-create it every render
// const fetchAccessStatus = useCallback(async () => {
//   if (isOpen && person && user?.id) {
//     try {
//       const res = await axios.get(
//         `${BASE_URL}/user/access-status/?userId=${user.id}&targetUserId=${person?.id}`
//       );

//       const personalInfoAccess = res?.data?.access?.find(
//         (item: { tab: string }) => item.tab === "personal"
//       );
      
//       const additionalInfoAccess = res?.data?.access?.find(
//         (item: { tab: string }) => item.tab === "additional"
//       );

//       setTab2Access(personalInfoAccess?.status === "Approved");
//       setTab3Access(additionalInfoAccess?.status === "Approved");
//       setAccessStatus(res.data.access);
//       setLastFetchTime(Date.now());
//     } catch (err) {
//       console.error("Access check failed", err);
//     }
//   }
// }, [isOpen, person, user?.id]);

// // FIRST EFFECT: fetch data when conditions match
// useEffect(() => {
//   fetchAccessStatus();
// }, [fetchAccessStatus]);

// // SECOND EFFECT: runs when popup opens (set state + fetch access)
// useEffect(() => {
//   if (isOpen && person) {
//     console.log("Popup opened with person:", person);
//     setRequestedTabs({});
//     fetchAccessStatus();
//   }
// }, [isOpen, person, fetchAccessStatus]);


// const handleRequestAccess = async (tabName: string) => {
//   try {
//     setRequestLoading(true);

//     const userId = user.id;
//     const username = user.username;
//     const targetUserId = person?.id;

//     if (!userId || !username || !targetUserId) {
//       console.error("Missing user info:", { userId, username, targetUserId });
//       // alert("Missing user info. Please try logging in again.");
//       return;
//     }

//     const response = await fetch(`${BASE_URL}/request-access/`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         requestedTab: tabMapping[tabName],
//         userId,
//         username,
//         targetUserId,
//       }),
//     });

//     const result = await response.json();

//     if (response.ok) {
//       setRequestedTabs(prev => ({ ...prev, [tabName]: true }));
//       // alert("Request sent successfully!");
//       await fetchAccessStatus();
//     } else {
//       console.error("Failed to send request:", result);
//       // alert("Failed to send request: " + (result.error || "Unknown error"));
//     }
//   } catch (error) {
//     console.error("Error sending request:", error);
//     // alert("Error sending request: " + (error as Error).message);
//   } finally {
//     setRequestLoading(false);
//   }
// };

//   const hasRequestedAccess = (tabName: string) => {
//     return requestedTabs[tabName] || (Array.isArray(accessStatus) && accessStatus.some(item => 
//       item.tab === tabMapping[tabName] && item.status === 'pending'
//     ));
//   };
  
  

//   const renderRestrictedContent = (tabName: string) => (
//     <div className="flex flex-col items-center justify-center p-6 border border-blue-300 rounded-lg">
//       <p className="text-center text-lg font-semibold text-blue-600">
//         Please contact admin to view this information.
//       </p>
//       <Image src={Shield} alt="Contact Admin" className="w-40 h-40 mb-4" />
//       {hasRequestedAccess(tabName) ? (
//         <p className="text-green-600 font-medium">Request sent! Admin will review shortly.</p>
//       ) : (
//         <button 
//           className={`bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 ${
//             requestLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
//           }`}
//           onClick={() => handleRequestAccess(tabName)}
//           disabled={requestLoading}
//         >
//           {requestLoading ? 'Sending...' : 'Contact Admin'}
//         </button>
//       )}
//     </div>
//   );

//   if (!isOpen || !person) return null;

//   const nameParts = person.name?.split(' ') || ['', ''];
//   const firstName = nameParts.slice(0, Math.ceil(nameParts.length / 2)).join(' ');
//   const lastName = nameParts.slice(Math.ceil(nameParts.length / 2)).join(' ');
  
//   return (
//     <div className="fixed inset-0 bg-[rgba(10,7,7,0.6)] flex items-center justify-center p-6 z-50">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.9 }}
//         className="bg-white rounded-2xl shadow-lg w-full max-w-lg relative overflow-hidden p-6"
//       >
//         <button
//           onClick={onClose}
//           className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition"
//         >
//           <IoCloseSharp className="h-6 w-6" />
//         </button>

//         <div className="flex items-center p-4 mb-4">
//           <div className="w-16 h-16 mr-4 relative">
//             <Image
//               src={person.avatar || defaultAvatar}
//               alt="Profile"
//               width={64}
//               height={64}
//               className="rounded-full object-cover shadow-md"
//             />
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold text-gray-800">{person.name}</h2>
//             <p className="text-gray-500 text-sm">{person.email}</p>
//           </div>
//         </div>

//         <div className="flex border-b-4 border-green-800 mb-6 overflow-x-auto">
//           <button
//             onClick={() => setActiveTab('Tab 01')}
//             className={`py-3 px-4 cursor-pointer rounded-t-xl mr-2 border border-green-800 ${
//               activeTab === 'Tab 01' ? 'bg-green-800 text-white' : 'text-gray-700 hover:bg-gray-100'
//             }`}
//           >
//             Basic Info
//           </button>
//           <button
//             onClick={() => setActiveTab('Tab 02')}
//             className={`py-3 cursor-pointer px-4 mr-2 border border-green-800 rounded-t-xl ${
//               activeTab === 'Tab 02' ? 'bg-green-800 text-white' : 'text-gray-700 hover:bg-gray-100'
//             }`}
//           >
//             Personal Info
//           </button>
//           <button
//             onClick={() => setActiveTab('Tab 03')}
//             className={`py-3 cursor-pointer px-4 border border-green-800 rounded-t-xl ${
//               activeTab === 'Tab 03' ? 'bg-green-800 text-white' : 'text-gray-700 hover:bg-gray-100'
//             }`}
//           >
//             Additional Info
//           </button>
//         </div>

//         <div className="space-y-6 min-h-[200px]">
//           <div className="min-h-[200px]">
//             {activeTab === "Tab 01" && (
//               <>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="flex flex-col">
//                     <label htmlFor="firstName" className="text-sm text-gray-600 mb-1">First Name</label>
//                     <input
//                       id="firstName"
//                       type="text"
//                       value={firstName}
//                       readOnly
//                       className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
//                       placeholder="First Name"
//                     />
//                   </div>
//                   <div className="flex flex-col">
//                     <label htmlFor="lastName" className="text-sm text-gray-600 mb-1">Last Name</label>
//                     <input
//                       id="lastName"
//                       type="text"
//                       value={lastName}
//                       readOnly
//                       className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
//                       placeholder="Last Name"
//                     />
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="flex flex-col">
//                     <label htmlFor="phone" className="text-sm text-gray-600 mb-1">Phone Number</label>
//                     <input
//                       id="phone"
//                       type="text"
//                       value={person.phone || ''}
//                       readOnly
//                       className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
//                       placeholder="Phone Number"
//                     />
//                   </div>
//                   <div className="flex flex-col">
//                     <label htmlFor="telephone" className="text-sm text-gray-600 mb-1">Telephone</label>
//                     <input
//                       id="telephone"
//                       type="text"
//                       value={person.telephone || ''}
//                       readOnly
//                       className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
//                       placeholder="Telephone Number"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex flex-col">
//                   <label htmlFor="email" className="text-sm text-gray-600 mb-1">Email</label>
//                   <input
//                     id="email"
//                     type="email"
//                     value={person.email || ''}
//                     readOnly
//                     className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
//                     placeholder="Email"
//                   />
//                 </div>
//                 {person.nationality && (
//                   <div className="flex flex-col">
//                     <label htmlFor="nationality" className="text-sm text-gray-600 mb-1">Nationality</label>
//                     <input
//                       id="nationality"
//                       type="text"
//                       value={person.nationality || ''}
//                       readOnly
//                       className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
//                       placeholder="Nationality"
//                     />
//                   </div>
//                 )}
//                 {person.race && (
//                   <div className="flex flex-col">
//                     <label htmlFor="race" className="text-sm text-gray-600 mb-1">Race</label>
//                     <input
//                       id="race"
//                       type="text"
//                       value={person.race || ''}
//                       readOnly
//                       className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
//                       placeholder="Race"
//                     />
//                   </div>
//                 )}
//               </>
//             )}
            
//             {activeTab === "Tab 02" && (
//               <>
//                 {!tab2Access ? (
//                   renderRestrictedContent('Tab 02')
//                 ) : (
//                   <>
//                     <div className="flex flex-col">
//                       <label htmlFor="address" className="text-sm text-gray-600 mb-1">Address</label>
//                       <input
//                         id="address"
//                         type="text"
//                         value={person.address || ''}
//                         readOnly
//                         className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
//                         placeholder="Address"
//                       />
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="flex flex-col">
//                         <label htmlFor="country" className="text-sm text-gray-600 mb-1">Country</label>
//                         <div className="flex items-center border border-gray-400 rounded-lg p-3 bg-gray-50">
//                           <span className="mr-2">🏠</span>
//                           <input
//                             id="country"
//                             type="text"
//                             value={person.country || ''}
//                             readOnly
//                             className="flex-grow outline-none bg-transparent"
//                             placeholder="Country"
//                           />
//                         </div>
//                       </div>
//                       <div className="flex flex-col">
//                         <label htmlFor="pinCode" className="text-sm text-gray-600 mb-1">Pin Code</label>
//                         <input
//                           id="pinCode"
//                           type="text"
//                           value={person.pin_code || ''}
//                           readOnly
//                           className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
//                           placeholder="Pin Code"
//                         />
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="flex flex-col">
//                         <label htmlFor="fathersName" className="text-sm text-gray-600 mb-1">Father's Name</label>
//                         <input
//                           id="fathersName"
//                           type="text"
//                           value={person.fathers_name || ''}
//                           readOnly
//                           className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
//                           placeholder="Father's Name"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <label htmlFor="mothersName" className="text-sm text-gray-600 mb-1">Mother's Name</label>
//                         <input
//                           id="mothersName"
//                           type="text"
//                           value={person.mothers_name || ''}
//                           readOnly
//                           className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
//                           placeholder="Mother's Name"
//                         />
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="flex flex-col">
//                         <label htmlFor="dob" className="text-sm text-gray-600 mb-1">Date of Birth</label>
//                         <input
//                           id="dob"
//                           type="text"
//                           value={person.date_of_birth || ''}
//                           readOnly
//                           className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
//                           placeholder="Date of Birth"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <label htmlFor="birthPlace" className="text-sm text-gray-600 mb-1">Birth Place</label>
//                         <input
//                           id="birthPlace"
//                           type="text"
//                           value={person.place_of_birth || ''}
//                           readOnly
//                           className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
//                           placeholder="Birth Place"
//                         />
//                       </div>
//                     </div>
//                     {person.mykad_number && (
//                       <div className="flex flex-col">
//                         <label htmlFor="mykadNumber" className="text-sm text-gray-600 mb-1">MyKad Number</label>
//                         <input
//                           id="mykadNumber"
//                           type="text"
//                           value={person.mykad_number || ''}
//                           readOnly
//                           className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
//                           placeholder="MyKad Number"
//                         />
//                       </div>
//                     )}
//                   </>
//                 )}
//               </>
//             )}

//             {activeTab === "Tab 03" && (
//               <>
//                 {!tab3Access ? (
//                   renderRestrictedContent('Tab 03')
//                 ) : (
//                   <>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="flex flex-col">
//                         <label htmlFor="nation" className="text-sm text-gray-600 mb-1">Nation</label>
//                         <input
//                           id="nation"
//                           type="text"
//                           value={person.nation || person.nationality || ''}
//                           readOnly
//                           className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
//                           placeholder="Nation"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <label htmlFor="career" className="text-sm text-gray-600 mb-1">Career/Occupation</label>
//                         <input
//                           id="career"
//                           type="text"
//                           value={person.career || person.occupation || ''}
//                           readOnly
//                           className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
//                           placeholder="Career/Occupation"
//                         />
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="flex flex-col">
//                         <label htmlFor="employment" className="text-sm text-gray-600 mb-1">Employment</label>
//                         <input
//                           id="employment"
//                           type="text"
//                           value={person.employment || ''}
//                           readOnly
//                           className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
//                           placeholder="Employment"
//                         />
//                       </div>
//                       <div className="flex flex-col">
//                         <label htmlFor="workAddress" className="text-sm text-gray-600 mb-1">Work Address</label>
//                         <input
//                           id="workAddress"
//                           type="text"
//                           value={person.work_address || ''}
//                           readOnly
//                           className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
//                           placeholder="Work Address"
//                         />
//                       </div>
//                     </div>
//                     {person.mykad_number && (
//                       <div className="flex flex-col">
//                         <label htmlFor="mykadNumber2" className="text-sm text-gray-600 mb-1">MyKad Number</label>
//                         <input
//                           id="mykadNumber2"
//                           type="text"
//                           value={person.mykad_number || ''}
//                           readOnly
//                           className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
//                           placeholder="MyKad Number"
//                         />
//                       </div>
//                     )}
//                     {person.additional_info && (
//                       <div className="flex flex-col">
//                         <label htmlFor="additionalInfo" className="text-sm text-gray-600 mb-1">Additional Information</label>
//                         <input
//                           id="additionalInfo"
//                           type="text"
//                           value={person.additional_info || ''}
//                           readOnly
//                           className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
//                           placeholder="Additional Information"
//                         />
//                       </div>
//                     )}
//                     {person.user_id && (
//                       <div className="flex flex-col">
//                         <label htmlFor="userId" className="text-sm text-gray-600 mb-1">User ID</label>
//                         <input
//                           id="userId"
//                           type="text"
//                           value={person.user_id || ''}
//                           readOnly
//                           className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
//                           placeholder="User ID"
//                         />
//                       </div>
//                     )}
//                     {person.username && (
//                       <div className="flex flex-col">
//                         <label htmlFor="username" className="text-sm text-gray-600 mb-1">Username</label>
//                         <input
//                           id="username"
//                           type="text"
//                           value={person.username || ''}
//                           readOnly
//                           className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
//                           placeholder="Username"
//                         />
//                       </div>
//                     )}
//                   </>
//                 )}
//               </>
//             )}
//           </div>
//         </div>

//         <div className="flex justify-end p-4 space-x-4 bg-gray-50 mt-6">
//           <button
//             onClick={onClose}
//             className="py-2 px-6 cursor-pointer bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 transition"
//           >
//             Close
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default PopupProfile;

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { IoCloseSharp } from "react-icons/io5";
import { Person } from "@/app/components/Utils/interface";
import { motion } from "framer-motion";
import defaultAvatar from "@/assets/images/user.png";

interface PopupProfileProps {
  isOpen: boolean;
  onClose: () => void;
  person: Person | null;
  currentUser?: { id: string; role: string; username: string };
}

const PopupProfile: React.FC<PopupProfileProps> = ({ 
  isOpen, 
  onClose, 
  person, 
  currentUser 
}) => {
  const [activeTab, setActiveTab] = useState('Tab 01');
  const [user, setUser] = useState({
    role: "user",
    id: "",
    username: ""
  });
  
  useEffect(() => {
    const storedUser = localStorage.getItem("userId") || "";
    const storedUsername = localStorage.getItem("username") || "";
  
    setUser(prev => ({
      ...prev,
      id: storedUser,
      username: storedUsername
    }));
  }, []);

  const tabMapping: { [key: string]: string } = {
    'Tab 01': 'Basic Info',
    'Tab 02': 'Personal Info',
    'Tab 03': 'Additional Info'
  };

  if (!isOpen || !person) return null;

  const nameParts = person.name?.split(' ') || ['', ''];
  const firstName = nameParts.slice(0, Math.ceil(nameParts.length / 2)).join(' ');
  const lastName = nameParts.slice(Math.ceil(nameParts.length / 2)).join(' ');
  
  return (
    <div className="fixed inset-0 bg-[rgba(10,7,7,0.6)] flex items-center justify-center p-6 z-50">
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
          <IoCloseSharp className="h-6 w-6 cursor-pointer " />
        </button>

        <div className="flex items-center p-4 mb-4">
          <div className="w-16 h-16 mr-4 relative">
            <Image
              src={person.avatar || defaultAvatar}
              alt="Profile"
              width={64}
              height={64}
              className="rounded-full object-cover shadow-md"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{person.name}</h2>
            <p className="text-gray-500 text-sm">{person.email}</p>
          </div>
        </div>

        <div className="flex border-b-4 border-green-800 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('Tab 01')}
            className={`py-3 px-4 cursor-pointer rounded-t-xl mr-2 border border-green-800 ${
              activeTab === 'Tab 01' ? 'bg-green-800 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab('Tab 02')}
            className={`py-3 cursor-pointer px-4 mr-2 border border-green-800 rounded-t-xl ${
              activeTab === 'Tab 02' ? 'bg-green-800 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab('Tab 03')}
            className={`py-3 cursor-pointer px-4 border border-green-800 rounded-t-xl ${
              activeTab === 'Tab 03' ? 'bg-green-800 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Additional Info
          </button>
        </div>

        <div className="space-y-6 min-h-[200px]">
          <div className="min-h-[200px]">
            {activeTab === "Tab 01" && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div className="flex flex-col">
                    <label htmlFor="firstName" className="text-sm text-gray-600 mb-1">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      readOnly
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="First Name"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="lastName" className="text-sm text-gray-600 mb-1">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      readOnly
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Last Name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-2 ">
                  <div className="flex flex-col">
                    <label htmlFor="phone" className="text-sm text-gray-600 mb-1">Phone Number</label>
                    <input
                      id="phone"
                      type="text"
                      value={person.phone || ''}
                      readOnly
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Phone Number"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="telephone" className="text-sm text-gray-600 mb-1">Telephone</label>
                    <input
                      id="telephone"
                      type="text"
                      value={person.telephone || ''}
                      readOnly
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Telephone Number"
                    />
                  </div>
                </div>
                <div className="flex flex-col mb-2">
                  <label htmlFor="email" className="text-sm text-gray-600 mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={person.email || ''}
                    readOnly
                    className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Email"
                  />
                </div>
                {person.nationality && (
                  <div className="flex flex-col">
                    <label htmlFor="nationality" className="text-sm text-gray-600 mb-1">Nationality</label>
                    <input
                      id="nationality"
                      type="text"
                      value={person.nationality || ''}
                      readOnly
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Nationality"
                    />
                  </div>
                )}
                {person.race && (
                  <div className="flex flex-col">
                    <label htmlFor="race" className="text-sm text-gray-600 mb-1">Race</label>
                    <input
                      id="race"
                      type="text"
                      value={person.race || ''}
                      readOnly
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Race"
                    />
                  </div>
                )}
              </>
            )}
            
            {activeTab === "Tab 02" && (
              <>
                <div className="flex flex-col mb-2">
                  <label htmlFor="address" className="text-sm text-gray-600 mb-1">Address</label>
                  <input
                    id="address"
                    type="text"
                    value={person.address || ''}
                    readOnly
                    className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div className="flex flex-col">
                    <label htmlFor="country" className="text-sm text-gray-600 mb-1">Country</label>
                    <div className="flex items-center border border-gray-400 rounded-lg p-3 bg-gray-50">
                      <span className="mr-2">🏠</span>
                      <input
                        id="country"
                        type="text"
                        value={person.country || ''}
                        readOnly
                        className="flex-grow outline-none bg-transparent"
                        placeholder="Country"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col mb-2">
                    <label htmlFor="pinCode" className="text-sm text-gray-600 mb-1">Pin Code</label>
                    <input
                      id="pinCode"
                      type="text"
                      value={person.pin_code || ''}
                      readOnly
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Pin Code"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div className="flex flex-col">
                    <label htmlFor="fathersName" className="text-sm text-gray-600 mb-1">Father's Name</label>
                    <input
                      id="fathersName"
                      type="text"
                      value={person.fathers_name || ''}
                      readOnly
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Father's Name"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="mothersName" className="text-sm text-gray-600 mb-1">Mother's Name</label>
                    <input
                      id="mothersName"
                      type="text"
                      value={person.mothers_name || ''}
                      readOnly
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Mother's Name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div className="flex flex-col">
                    <label htmlFor="dob" className="text-sm text-gray-600 mb-1">Date of Birth</label>
                    <input
                      id="dob"
                      type="text"
                      value={person.date_of_birth || ''}
                      readOnly
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Date of Birth"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="birthPlace" className="text-sm text-gray-600 mb-1">Birth Place</label>
                    <input
                      id="birthPlace"
                      type="text"
                      value={person.place_of_birth || ''}
                      readOnly
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Birth Place"
                    />
                  </div>
                </div>
                {person.mykad_number && (
                  <div className="flex flex-col">
                    <label htmlFor="mykadNumber" className="text-sm text-gray-600 mb-1">MyKad Number</label>
                    <input
                      id="mykadNumber"
                      type="text"
                      value={person.mykad_number || ''}
                      readOnly
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="MyKad Number"
                    />
                  </div>
                )}
              </>
            )}

            {activeTab === "Tab 03" && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div className="flex flex-col">
                    <label htmlFor="nation" className="text-sm text-gray-600 mb-1">Nation</label>
                    <input
                      id="nation"
                      type="text"
                      value={person.nation || person.nationality || ''}
                      readOnly
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Nation"
                    />
                  </div>
                  <div className="flex flex-col mb-2">
                    <label htmlFor="career" className="text-sm text-gray-600 mb-1">Career/Occupation</label>
                    <input
                      id="career"
                      type="text"
                      value={person.career || person.occupation || ''}
                      readOnly
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Career/Occupation"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div className="flex flex-col">
                    <label htmlFor="employment" className="text-sm text-gray-600 mb-1">Employment</label>
                    <input
                      id="employment"
                      type="text"
                      value={person.employment || ''}
                      readOnly
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Employment"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="workAddress" className="text-sm text-gray-600 mb-1">Work Address</label>
                    <input
                      id="workAddress"
                      type="text"
                      value={person.work_address || ''}
                      readOnly
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Work Address"
                    />
                  </div>
                </div>
                {person.mykad_number && (
                  <div className="flex flex-col">
                    <label htmlFor="mykadNumber2" className="text-sm text-gray-600 mb-1">MyKad Number</label>
                    <input
                      id="mykadNumber2"
                      type="text"
                      value={person.mykad_number || ''}
                      readOnly
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="MyKad Number"
                    />
                  </div>
                )}
                {person.additional_info && (
                  <div className="flex flex-col">
                    <label htmlFor="additionalInfo" className="text-sm text-gray-600 mb-1">Additional Information</label>
                    <input
                      id="additionalInfo"
                      type="text"
                      value={person.additional_info || ''}
                      readOnly
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Additional Information"
                    />
                  </div>
                )}
                {person.user_id && (
                  <div className="flex flex-col">
                    <label htmlFor="userId" className="text-sm text-gray-600 mb-1">User ID</label>
                    <input
                      id="userId"
                      type="text"
                      value={person.user_id || ''}
                      readOnly
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="User ID"
                    />
                  </div>
                )}
                {person.username && (
                  <div className="flex flex-col">
                    <label htmlFor="username" className="text-sm text-gray-600 mb-1">Username</label>
                    <input
                      id="username"
                      type="text"
                      value={person.username || ''}
                      readOnly
                      className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Username"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end p-4 space-x-4 bg-gray-50 mt-6">
          <button
            onClick={onClose}
            className="py-2 px-6 cursor-pointer bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PopupProfile;