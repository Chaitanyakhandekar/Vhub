import React, { useEffect, useState } from "react";
import { FaUsers, FaCalendarCheck, FaTasks, FaPlusCircle, FaBullhorn } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

function AdminDashboard() {
    const navigate = useNavigate();
    const [totalEvents, setTotalEvents] = useState(0);
    const [pendingTasks, setPendingTasks] = useState(0);
    const [activeVolunteers, setActiveVolunteers] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const eventsResponse = await axios.get("http://127.0.0.1:8000/api/events/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTotalEvents(eventsResponse.data.length);

                const volunteersResponse = await axios.get("http://127.0.0.1:8000/api/volunteers/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setActiveVolunteers(volunteersResponse.data.length);
            } catch (error) {
                setError("❌ Error fetching dashboard data");
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex min-h-screen bg-[#1a202c] text-white">
            {/* ✅ Sidebar Navigation */}
            <Sidebar />

            {/* ✅ Main Dashboard Content */}
            <div className="flex-1 p-6">
                <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

                {error && <p className="text-red-500">{error}</p>}

                {/* ✅ Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#2d3748] p-6 rounded-lg shadow-md flex items-center">
                        <FaCalendarCheck size={30} className="text-green-400 mr-4" />
                        <div>
                            <h2 className="text-2xl font-bold">{totalEvents}</h2>
                            <p className="text-gray-300">Total Events</p>
                        </div>
                    </div>
                
                    <div className="bg-[#2d3748] p-6 rounded-lg shadow-md flex items-center">
                        <FaUsers size={30} className="text-blue-400 mr-4" />
                        <div>
                            <h2 className="text-2xl font-bold">{activeVolunteers}</h2>
                            <p className="text-gray-300">Active Volunteers</p>
                        </div>
                    </div>
                </div>

                {/* ✅ Quick Actions */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button 
                        onClick={() => navigate("/admin/events/create")} 
                        className="flex items-center bg-green-500 hover:bg-green-700 p-4 rounded-lg text-lg font-bold"
                    >
                        <FaPlusCircle className="mr-3" /> Create Event
                    </button>
                    <button 
                        onClick={() => navigate("/admin/volunteers")} 
                        className="flex items-center bg-blue-500 hover:bg-blue-700 p-4 rounded-lg text-lg font-bold"
                    >
                        <FaUsers className="mr-3" /> Manage Volunteers
                    </button>
                    <button 
                        onClick={() => navigate("/admin/events")} 
                        className="flex items-center bg-yellow-500 hover:bg-yellow-700 p-4 rounded-lg text-lg font-bold"
                    >
                        <FaBullhorn className="mr-3" /> Manage Events
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;