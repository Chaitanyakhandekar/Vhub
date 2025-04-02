import React, { useEffect, useState } from "react";
import { FaUserShield, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

function AdminVolunteers() {
    const [volunteers, setVolunteers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [backupVolunteers, setBackupVolunteers] = useState([]);

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.get("http://127.0.0.1:8000/api/volunteers/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setVolunteers(response.data);
                setBackupVolunteers(response.data);
            } catch (error) {
                console.error("❌ Error fetching volunteers:", error);
            }
        };
        fetchVolunteers();
    }, []);

    useEffect(() => {
        if (searchQuery.length === 0) {
            setVolunteers(backupVolunteers);
        } else {
            const searchedVolunteers = backupVolunteers.filter((volunteer) =>
                volunteer.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setVolunteers(searchedVolunteers);
        }
    }, [searchQuery]);

    return (
        <div className="flex min-h-screen bg-[#1a202c] text-white">
            {/* ✅ Sidebar Navigation */}
            <Sidebar />

            {/* ✅ Main Content */}
            <div className="flex-1 p-6">
                <h1 className="text-4xl font-bold mb-6 text-center text-blue-400">
                    Manage Volunteers
                </h1>

                {/* ✅ Search Bar */}
                <div className="flex justify-center mb-6">
                    <div className="flex items-center bg-gray-800 p-3 rounded-lg w-[50%] shadow-md">
                        <FaSearch className="text-gray-300 mr-2" />
                        <input
                            type="text"
                            placeholder="Search volunteers..."
                            className="bg-transparent focus:outline-none text-white w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* ✅ Volunteers Table */}
                <div className="bg-[#2d3748] p-6 rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900 text-gray-300">
                                <th className="p-4 border-b border-gray-600 text-center">Name</th>
                                <th className="p-4 border-b border-gray-600 text-center">Email</th>
                                <th className="p-4 border-b border-gray-600 text-center">Phone</th>
                                <th className="p-4 border-b border-gray-600 text-center">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(volunteers) && volunteers.length > 0 ? (
                                volunteers.map((volunteer, index) => (
                                    <tr
                                        key={volunteer.id}
                                        className={`border-b border-gray-700 text-center hover:bg-gray-700 transition ${
                                            index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
                                        }`}
                                    >
                                        <td className="p-4">{volunteer.name}</td>
                                        <td className="p-4">{volunteer.email}</td>
                                        <td className="p-4">{volunteer.phone || "N/A"}</td>
                                        <td className="p-4 text-blue-300 font-semibold">{volunteer.role}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-6 text-center text-gray-400">
                                        No volunteers available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminVolunteers;
