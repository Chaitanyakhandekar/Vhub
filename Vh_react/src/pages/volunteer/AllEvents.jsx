import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import EventPost from "./EventPost"; // Event Card Component
import { FaSearch, FaFilter } from "react-icons/fa";
import './volunteer.css'

function AllEvents() {
    const { user, logout } = useAuth();
    const [events, setEvents] = useState([]);
    const [backupEvents, setBackupEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [allEvents, setAllEvents] = useState([]); // Store all events
    const [noEventsMessage, setNoEventsMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");
    const [newRegistration, setNewRegistration] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        console.log("🟡 Current Filter Value = ", filter);

        const filtered = allEvents.filter((event) => filter === "All" || event.E_Status === filter);
        setEvents(filtered);

        console.log("✅ Events Fetched", events);
    }, [filter, allEvents]); // Depend on allEvents to avoid data loss

    async function fetchEvents() {
        try {
            console.log("🟡 Fetching events...");
            const response = await axios.get("http://127.0.0.1:8000/api/events/", {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });

            if (response.data.length === 0) {
                console.log("🔴 No events available");
                setNoEventsMessage("No upcoming volunteer events. Stay tuned for new opportunities!");
            } else {
                console.log("✅ Events Fetched:", response.data);
                setEvents(response.data); // Initialize displayed events
                setAllEvents(response.data); // Store all events
                setBackupEvents(response.data);
                setNoEventsMessage("");
            }
        } catch (error) {
            console.error("❌ Error fetching events:", error.response?.status, error.response?.data);
            setNoEventsMessage("No events are available at the moment.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEvents();
        setNewRegistration(false);
    }, [newRegistration]);

    useEffect(() => {
        setAllEvents(backupEvents);
        console.log("Events = ", allEvents);
        console.log("Searched Item = ", searchTerm);

        let searchedEvents = allEvents.filter((event) =>
            event.E_Name.trim().toLowerCase().includes(searchTerm.trim().toLowerCase())
        );

        setEvents(searchedEvents);
    }, [searchTerm, setSearchTerm]);

    return (
        <div className=" h-[90vh] w-full  p-6 bg-[#1a202c]  overflow-auto ">
            {/* 🎯 Navigation Bar */}
            <nav className="bg-blur-400 bg-[#1A202C]  h-[8%] pb-5 w-[90%]   rounded-lg shadow-md fixed z-10   top-[2%] flex items-center justify-around mb-6">
                {/* 🔍 Search Bar */}
                <div className="flex items-center bg-[#1a202c] h-full border-2  border-gray-400  px-4 py-2 rounded-lg w-[40%]">
                    <FaSearch className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="bg-transparent text-white w-full focus:outline-none"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* 🎯 Filter Dropdown */}
                <div className="flex items-center bg-[#1a202c] px-4 py-2 rounded-lg border-2 border-gray-400">
                    <FaFilter className="text-gray-400 mr-2" />
                    <select
                        className="bg-transparent text-white focus:outline-none "
                        onChange={(e) => setFilter(e.target.value)}
                    >
                       <option className="bg-[#1A202C]" value="All">All My Events</option>
                        <option className="bg-[#1A202C]" value="Upcoming">Upcoming</option>
                        <option className="bg-[#1A202C]" value="Ongoing">Ongoing</option>
                        <option className="bg-[#1A202C]" value="Completed">Completed</option>
                    </select>
                </div>
            </nav>

            {/* 🎯 Loading State */}
            {loading ? (
                <div className="flex justify-center items-center h-[70vh]">
                    <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    <p className="ml-4 text-gray-300">Loading events...</p>
                </div>
            ) : (
                <>
                    {/* 🎯 Error Message */}
                    {errorMessage && (
                        <div className="text-center mt-10 text-red-500">
                            <p className="text-xl">{errorMessage}</p>
                        </div>
                    )}

                    {/* 🎯 No Events Message */}
                    {noEventsMessage && (
                        <div className="text-center mt-10 text-gray-400">
                            <p className="text-xl">{noEventsMessage}</p>
                        </div>
                    )}

                    {/* 🎯 Events Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <div
                                key={event.E_ID}
                                className="bg-[#2a3b4f] bg-gray-700 border-2 border-gray-600 rounded-lg shadow-lg p-5 transition-transform transform hover:scale-105 mt-3"
                            >
                                <EventPost
                                    newRegistration={newRegistration}
                                    setNewRegistration={setNewRegistration}
                                    ename={event.E_Name}
                                    event={event}
                                    description={event.E_Description}
                                    requiredVolunteers={event.E_Required_Volunteers}
                                    totVolunteers={event.E_Volunteers?.length || 0}
                                    fetchEvents={fetchEvents}
                                    user={user} // Pass the user object to EventPost
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default AllEvents;