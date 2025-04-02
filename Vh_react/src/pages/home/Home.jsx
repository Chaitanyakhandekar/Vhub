import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBars, FaHome, FaCalendarCheck, FaClipboardList, FaUsers, FaInfoCircle, FaEnvelope, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Profile from "../volunteer/Profile";
import AllEvents from "../volunteer/AllEvents";
import MyEvents from "../volunteer/MyEvents";
import AboutUs from "../volunteer/AboutUs";
import ContactUs from "../volunteer/ContactUs";
import { useAuth } from "../../context/AuthContext";
import teamLogo from "../../assets/Vcoders_logo.png"; // ✅ Imported Team Logo
import "./home.css";

function Home() {
    const { user, logout } = useAuth();
    const username = user ? user.username : "Guest";
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activePage, setActivePage] = useState("home");
  

    return (
        <div className="w-full min-h-screen h-[100vh] flex bg-[#1a202c] text-white font-poppins">
            {/* Sidebar */}
            <div className={`min-h-screen bg-[#111827]  max-h-[100vh] flex flex-col p-4 shadow-lg transition-all ${isCollapsed ? "w-20" : "w-64"}`}>
                <button className="mb-6 p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition" onClick={() => setIsCollapsed(!isCollapsed)}>
                    <FaBars size={20} />
                </button>

                {/* Sidebar Links */}
                {[
                    { name: "home", label: "Home", icon: <FaHome size={24} /> },
                    { name: "all-events", label: "All Events", icon: <FaCalendarCheck size={24} /> },
                    { name: "my-events", label: "My Events", icon: <FaClipboardList size={24} /> },
                    // { name: "community", label: "Community", icon: <FaUsers size={24} /> },
                    { name: "about", label: "About Us", icon: <FaInfoCircle size={24} /> },
                    { name: "contact", label: "Contact", icon: <FaEnvelope size={24} /> },
                    { name: "profile", label: "My Profile", icon: <FaUser size={24} /> }
                ].map(({ name, label, icon }) => (
                    <div key={name} className={`flex items-center space-x-3 text-lg cursor-pointer p-3 rounded-md transition ${activePage === name ? "bg-green-500" : "text-gray-300 hover:bg-gray-700"}`} onClick={() => setActivePage(name)}>
                        {icon} {!isCollapsed && <span>{label}</span>}
                    </div>
                ))}

                {/* Logout Button */}
                <button onClick={() => { logout(); navigate('/login'); }} className="mt-auto flex items-center justify-center p-3 bg-red-500 hover:bg-red-700 rounded-md transition">
                    <FaSignOutAlt size={20} /> {!isCollapsed && <span className="ml-2">Logout</span>}
                </button>
            </div>

            {/* Main Content */}
            <div className="w-full flex flex-col">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5 }} 
                    className="flex-grow flex flex-col items-center justify-center p-6 text-center"
                >
                    {activePage === "home" && (
                        <div className="space-y-6">
                            {/* Team Logo (Inverted) */}
                            <motion.img 
                                src={teamLogo} 
                                alt="Team Logo" 
                                className="w-32 h-32 mx-auto filter invert shadow-lg rounded-full p-2"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.7 }}
                            />

                            <h2 className="text-4xl font-bold text-green-400">Empower Your Community</h2>
                            <p className="text-lg text-gray-300">Join hands with passionate volunteers and make a real impact.</p>
                            
                            <motion.button 
                                whileHover={{ scale: 1.1, boxShadow: "0px 0px 10px rgba(0,255,127,0.5)" }}
                                whileTap={{ scale: 0.9 }}
                                className="mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-lg font-semibold shadow-lg"
                                onClick={() => setActivePage("all-events")}
                            >
                                Explore Events
                            </motion.button>
                        </div>
                    )}
                    {activePage === "profile" && <Profile />}
                    {/* {activePage === "profile" && <Profile />} */}
                    {activePage === "all-events" && <AllEvents />}
                    {activePage === "my-events" && <MyEvents />}
                    {activePage === "community" && <h2 className="text-3xl font-bold">Community Engagement</h2>}
                    {activePage === "about" && <AboutUs />}
                    {activePage === "contact" && <ContactUs />}
                </motion.div>
            </div>
        </div>
    );
}

export default Home;
