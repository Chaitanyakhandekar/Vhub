import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaClipboardList, FaSignOutAlt, FaUsers, FaUser, FaCalendarCheck, FaHome, FaTasks } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Profile from "../pages/volunteer/Profile"; // Profile Page Component
import VolunteerDashboard from "../pages/volunteer/AllEvents"; // Events Page Component
//import TasksPage from "../pages/TasksPage"; // Tasks Page Component
//import CommunityPage from "../pages/CommunityPage"; // Community Page Component

function SidebarLayout() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState("events"); // ✅ Track active section

    // Define available sections
    const sections = {
        events: <VolunteerDashboard />,
        profile: <Profile />,
        // tasks: <TasksPage />,
        //community: <CommunityPage />
    };

    return (
        <div className="flex min-h-screen bg-[#1a202c] text-white">
            {/* ✅ Sidebar - Consistent Across All Pages */}
            <aside className="w-72 bg-[#2d3748] min-h-screen p-6 flex flex-col justify-between shadow-lg">
                <div>
                    <h2 className="text-2xl font-bold mb-6">Volunteer Dashboard</h2>
                    <nav>
                        <ul className="space-y-4">
                            <li className={`p-3 rounded-md cursor-pointer ${activeTab === "events" ? "bg-blue-500" : "hover:bg-gray-700"}`} 
                                onClick={() => setActiveTab("events")}>
                                <FaCalendarCheck /> <span className="ml-2">My Events</span>
                            </li>
                            {/* <li className={`p-3 rounded-md cursor-pointer ${activeTab === "tasks" ? "bg-blue-500" : "hover:bg-gray-700"}`} 
                                onClick={() => setActiveTab("tasks")}>
                                <FaTasks /> <span className="ml-2">Tasks</span>
                            </li> */}
                            {/* <li className={`p-3 rounded-md cursor-pointer ${activeTab === "community" ? "bg-blue-500" : "hover:bg-gray-700"}`} 
                                onClick={() => setActiveTab("community")}>
                                <FaUsers /> <span className="ml-2">Community</span>
                            </li> */}
                            <li className={`p-3 rounded-md cursor-pointer ${activeTab === "profile" ? "bg-blue-500" : "hover:bg-gray-700"}`} 
                                onClick={() => setActiveTab("profile")}>
                                <FaUser /> <span className="ml-2">My Profile</span>
                            </li>
                            <li>
                                <Link to="/" className="flex items-center p-3 rounded-md hover:bg-gray-700">
                                    <FaHome /> <span className="ml-2">Home</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <button onClick={logout} className="flex items-center p-3 bg-red-500 hover:bg-red-700 rounded-md">
                    <FaSignOutAlt /> <span className="ml-2">Logout</span>
                </button>
            </aside>

            {/* ✅ Dynamic Content (Changes Based on Active Section) */}
            <main className="flex-1 p-8">
                {sections[activeTab]}
            </main>
        </div>
    );
}

export default SidebarLayout;
