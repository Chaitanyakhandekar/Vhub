import React, { useEffect, useState } from "react";
import { FaPlusCircle, FaEdit, FaTrash, FaEye, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

function AdminEvents() {
    const [events, setEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [backupEvents, setBackupEvents] = useState([]);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const { updateEventId } = useAuth();

    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                console.error("❌ No access token found! User might not be logged in.");
                return;
            }

            const response = await axios.get("http://127.0.0.1:8000/api/events/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (Array.isArray(response.data)) {
                setEvents(response.data);
                setAllEvents(response.data);
                setBackupEvents(response.data);
            } else {
                console.warn("⚠ API returned unexpected data:", response.data);
                setEvents([]);
            }
        } catch (error) {
            console.error("❌ Error fetching events:", error);
            setEvents([]);
        }
    };

    function searchEvents(e) {
        const search = e.target.value;
        setSearchQuery(search);
        setAllEvents(backupEvents);
        const searchedEvents = allEvents.filter((event) => {
            return event.E_Name.toLowerCase().includes(search.trim().toLowerCase());
        });

        setEvents(searchedEvents);
        setAllEvents(backupEvents);
    }

    useEffect(() => {
        console.log("🟡 Filter Status:", filterStatus);
        setAllEvents(backupEvents);
        let filteredEvents = allEvents.filter((event) => filterStatus === 'all' || event.E_Status === filterStatus);
        setEvents(filteredEvents);
        setAllEvents(backupEvents);
    }, [filterStatus]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const formatDate = (dateString) => {
        const options = { day: "numeric", month: "long", year: "numeric" };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    function handleDelete(id) {
        const token = localStorage.getItem("accessToken");

        let msg = confirm("Are you sure you want to delete this event?");
        if (msg) {
            axios.delete(`http://127.0.0.1:8000/api/events/${id}/delete/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => {
                    alert("✅ Event Deleted Successfully");
                    fetchEvents();
                })
                .catch(error => alert("❌ Event Not Found!"));
        }
    }

    return (
        <div className="flex min-h-screen bg-[#1a202c] text-white">
            {/* ✅ Sidebar Navigation */}
            <Sidebar />

            {/* ✅ Main Content */}
            <div className="flex-1 p-6">
                <h1 className="text-4xl font-extrabold mb-6 text-center tracking-wide text-gray-200">
                    Manage Events
                </h1>

                {/* ✅ Create Event Button & Search Bar */}
                <div className="flex flex-wrap items-center justify-between mb-6">
                    <button
                        onClick={() => navigate("/admin/events/create")}
                        className="flex items-center bg-green-500 hover:bg-green-700 p-4 rounded-lg text-lg font-bold transition transform hover:scale-105 shadow-md"
                    >
                        <FaPlusCircle className="mr-3 text-xl" /> Create Event
                    </button>

                    {/* ✅ Search Bar */}
                    <div className="flex items-center bg-gray-700 p-3 rounded-lg w-[40%] shadow-md transition focus-within:ring-2 focus-within:ring-green-400">
                        <FaSearch className="text-gray-300 mr-2" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="bg-transparent focus:outline-none text-white w-full"
                            value={searchQuery}
                            onChange={(e) => searchEvents(e)}
                        />
                    </div>

                    {/* ✅ Filter Dropdown */}
                    <div className="relative w-[20%] mr-[8%]">
                        <select
                            className="bg-gray-700 p-3 w-full rounded-lg text-white focus:outline-none shadow-md transition focus:ring-2 focus:ring-blue-400"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="Upcoming">Upcoming</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>

                {/* ✅ Events Table */}
                <div className="bg-[#2d3748] bg-opacity-90 backdrop-blur-md p-6 rounded-xl shadow-lg">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-600 text-lg text-gray-300">
                                <th className="p-3">Event Name</th>
                                <th className="p-3">Location</th>
                                <th className="p-3">Details</th>
                                <th className="p-3">Start Date</th>
                                <th className="p-3">End Date</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(events) && events.length > 0 ? (
                                events.map((event) => (
                                    <tr key={event.E_ID} className="border-b border-gray-700 text-gray-200 hover:bg-gray-700 transition">
                                        <td className="p-3">{event.E_Name}</td>
                                        <td className="p-3">{event.E_Location}</td>
                                        <td className="p-3">
                                            <button
                                                onClick={() => (updateEventId(event.E_ID), navigate("/admin/event-specific-volunteers"))}
                                                className="w-full py-2 bg-blue-500 rounded-md hover:bg-blue-800 transition"
                                            >
                                                View
                                            </button>
                                        </td>
                                        <td className="p-3">{formatDate(event.E_Start_Date)}</td>
                                        <td className="p-3">{formatDate(event.E_End_Date)}</td>
                                        <td className="p-3">{event.E_Status}</td>
                                        <td className="p-3 flex space-x-3">
                                            <button title="View" onClick={() => navigate(`/events/${event.E_ID}`)} className="text-blue-400 hover:text-blue-600">
                                                <FaEye />
                                            </button>
                                            <button title="Edit" onClick={() => navigate(`/admin/events/edit/${event.E_ID}`)} className="text-yellow-400 hover:text-yellow-600">
                                                <FaEdit />
                                            </button>
                                            <button title="Delete" className="text-red-400 hover:text-red-600" onClick={() => handleDelete(event.E_ID)}>
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-4 text-center text-gray-400">No events available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminEvents;
