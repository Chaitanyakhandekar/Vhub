import React, { useState } from "react";
import { FaHome, FaCalendarCheck, FaTasks, FaUsers, FaBell, FaBullhorn, FaSignOutAlt, FaEnvelope ,FaInfoCircle,FaAddressCard, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";

function Sidebar() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false); // ✅ Sidebar toggle

    return (
        <div className={`min-h-screen bg-[#1a202c] h-[100vh] text-white flex flex-col justify-between p-6 shadow-lg transition-all ${isCollapsed ? "w-20" : "w-64"}`}>
            {/* ✅ Toggle Sidebar Button */}
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)} 
                className="text-white bg-gray-700 hover:bg-gray-600 p-2 rounded-md mb-4 flex items-center justify-center transition-all">
                {isCollapsed ? <FaAngleDoubleRight size={20} /> : <FaAngleDoubleLeft size={20} />}
            </button>

            {/* ✅ Sidebar Links */}
            <div className="flex flex-col space-y-6">
                <div className="flex items-center space-x-3 text-lg hover:text-green-400 cursor-pointer" onClick={() => navigate("/admin-dashboard")}> 
                    <FaHome size={24} /> {!isCollapsed && <span>Dashboard</span>}
                </div>
                <div className="flex items-center space-x-3 text-lg hover:text-blue-400 cursor-pointer" onClick={() => navigate("/admin/events")}> 
                    <FaCalendarCheck size={24} /> {!isCollapsed && <span>Events</span>}
                </div>
               
                <div className="flex items-center space-x-3 text-lg hover:text-purple-400 cursor-pointer" onClick={() => navigate("/admin/volunteers")}> 
                    <FaUsers size={24} /> {!isCollapsed && <span>Volunteers</span>}
                </div>
                <div className="flex items-center space-x-3 text-lg hover:text-orange-400 cursor-pointer" onClick={() => navigate("/admin-dashboard")}> 
                    <FaBell size={24} /> {!isCollapsed && <span>Notification</span>}
                </div>
               
                <div className="flex items-center space-x-3 text-lg hover:text-yellow-400 cursor-pointer"> 
                <NavLink to="/admin/contact-us" className="sidebar-link flex items-center">
                    <FaEnvelope className="mr-2" />{!isCollapsed && <span>Contact us</span>}
                </NavLink>
                </div>

                <div className="flex items-center space-x-3 text-lg hover:text-yellow-400 cursor-pointer"> 
                <NavLink to="/admin/about-us" className="sidebar-link flex items-center">
                    <FaInfoCircle className="mr-2" />{!isCollapsed && <span>About us</span>}
                </NavLink>
                </div>
            </div>

            {/* ✅ Logout Button */}
            <button 
                onClick={() => {
                    logout();
                    navigate("/login");
                }} 
                className="flex items-center p-3 bg-red-500 hover:bg-red-700 rounded-md mt-4"
            >
                <FaSignOutAlt className=""/> {!isCollapsed && <span>Logout</span>}
            </button>
        </div>
    );
}

export default Sidebar;
