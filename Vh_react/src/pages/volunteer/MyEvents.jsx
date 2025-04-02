import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import EventPost from "./EventPost";
import { FaSearch, FaFilter, FaBell, FaCheckCircle } from "react-icons/fa";

function MyEvents() {
    const { user } = useAuth(); 
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");
    const [backupEvents, setBackupEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    
    useEffect(() => {
        fetchMyEvents();
        fetchNotifications();
    }, []);

    useEffect(() => {
        setAllEvents(backupEvents);
        const filtered = allEvents.filter(event => filter === "All" || event.E_Status === filter);
        setMyEvents(filtered);
        setAllEvents(backupEvents);
    }, [filter]); 
    
    async function fetchMyEvents() {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/my-events/", {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });
            if (response.data.length === 0) {
                setErrorMessage("You are not involved in any events yet.");
                setMyEvents([]);
            } else {
                setMyEvents(response.data);
                setBackupEvents(response.data);
                setAllEvents(response.data);
                setErrorMessage("");
            }
        } catch (error) {
            setErrorMessage("Failed to load your events.");
        } finally {
            setLoading(false);
        }
    }

    async function fetchNotifications() {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/notifications/", {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });
            setNotifications(response.data);
        } catch (error) {
            console.error("❌ Error fetching notifications:", error);
        }
    }

    async function markAllAsRead() {
        try {
            await axios.patch("http://127.0.0.1:8000/api/notifications/mark-all-read/", {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });
            setNotifications([]);
        } catch (error) {
            console.error("❌ Error marking notifications as read:", error);
        }
    }

    return (
        <div className="h-[90vh] w-full p-3 overflow-auto">
            <nav className="bg-blur-400 bg-[#1A202C]  h-[8%] pb-5 w-[90%]   rounded-lg shadow-md fixed z-10   top-[2%] flex items-center justify-around mb-6">
                <div className="flex items-center bg-[#1a202c] h-full border-2  border-gray-400  px-4 py-2 rounded-lg w-[40%]">
                    <FaSearch className="text-gray-400 mr-2" />
                    <input 
                        type="text" 
                        placeholder="Search my events..." 
                        className="bg-transparent text-white w-full focus:outline-none"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center bg-[#1a202c] px-4 py-2 rounded-lg border-2 border-gray-400">
                    <FaFilter className="text-gray-400 mr-2" />
                    <select 
                        className="bg-transparent focus:outline-none"
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option className="bg-[#1A202C]" value="All">All My Events</option>
                        <option className="bg-[#1A202C]" value="Upcoming">Upcoming</option>
                        <option className="bg-[#1A202C]" value="Ongoing">Ongoing</option>
                        <option className="bg-[#1A202C]" value="Completed">Completed</option>
                    </select>
                </div>
                <div className="relative">
                    <FaBell 
                        className="text-green-400 text-2xl cursor-pointer hover:text-yellow-400" 
                        onClick={() => setShowNotifications(!showNotifications)}
                    />
                    {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-2">{notifications.length}</span>
                    )}
                    {showNotifications && (
                        <div className="absolute z-10 top-10 right-0 bg-gray-900 p-4 rounded-lg shadow-lg w-72 text-white border border-gray-700">
                            <div className="flex justify-between items-center mb-2 border-b pb-2">
                                <h3 className="font-bold text-lg">Notifications</h3>
                                <button onClick={markAllAsRead} className="text-blue-400 text-sm hover:underline">Mark all as read</button>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((notification, index) => (
                                        <div key={index} className="flex items-center border-b border-gray-700 p-2 last:border-0 hover:bg-gray-800 rounded-md transition duration-200">
                                            <FaCheckCircle className="text-green-400 mr-3" />
                                            <p className="text-sm">{notification.message}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-center">No new notifications</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {loading ? (
                <div className="text-center mt-10">
                    <span className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></span>
                    <p className="mt-3 text-gray-300">Loading your events...</p>
                </div>
            ) : (
                <>
                    {errorMessage ? (
                        <div className="text-center mt-10 font-bold text-blue-400">
                            <p className="text-xl">{errorMessage}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            {myEvents.filter(event => filter === "All" || event.E_Status === filter).filter(event => event.E_Name.toLowerCase().includes(searchTerm.toLowerCase())).map(event => (
                                <div key={event.E_ID} className="bg-[#2a3b4f] rounded-lg shadow-lg p-5 transition-transform transform hover:scale-105">
                                    <EventPost ename={event.E_Name} event={event} description={event.E_Description} requiredVolunteers={event.E_Required_Volunteers} totVolunteers={event.E_Volunteers?.length || 0} />
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default MyEvents;