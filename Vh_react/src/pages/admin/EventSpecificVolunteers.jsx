import React, { useEffect, useState } from "react";
import { FaUserShield, FaPlusCircle, FaSearch,FaBullhorn  } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import AddTaskModal from "./AddTaskModal"; // ✅ Import the modal
import { useNavigate } from "react-router-dom";
import ViewTasks from "./ViewTasks";
import AssignRole from "./AssignRole";

function EventSpecificVolunteers() {
    const [volunteers, setVolunteers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [backupVolunteers, setBackupVolunteers] = useState([]);
    const { eventId, updateEventId } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [backupTasks, setBackupTasks] = useState([]);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false); // ✅ Controls modal visibility
    const [viewTasksBtn, setViewTasksBtn] = useState(false);
    const[selectedRole,setSelectedRole]=useState('volunteer')
    const [announcement, setAnnouncement] = useState("");
    

    useEffect(() => {
        let storedEventId = localStorage.getItem("eventId");
        if (!eventId && storedEventId) {
            updateEventId(storedEventId);
        }
    }, [eventId, updateEventId]);

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.get("http://127.0.0.1:8000/api/registrations/", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // ✅ Filter volunteers by eventId
                const filteredVolunteers = response.data.filter((registration) => (
                    registration.event.E_ID === eventId
                ));

                setVolunteers(filteredVolunteers);
                setBackupVolunteers(filteredVolunteers);
            } catch (error) {
                console.error("❌ Error fetching volunteers:", error);
            }
        };
        
        if (eventId) {
            fetchVolunteers();
        }
    }, [eventId]);

    useEffect(() => {
        if (!viewTasksBtn) {
            if (searchQuery.length === 0) {
                setVolunteers(backupVolunteers);
            } else {
                const searchedVolunteers = backupVolunteers.filter((registration) =>
                    registration.volunteer.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setVolunteers(searchedVolunteers);
            }
        }
        else if (viewTasksBtn) {
            if (searchQuery.length === 0) {
                setVolunteers(backupVolunteers);
            } else {
                const searchedVolunteers = backupVolunteers.filter((registration) =>
                    registration.volunteer.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setVolunteers(searchedVolunteers);
            }
        }
    }, [searchQuery, backupVolunteers,backupTasks]);



    function handleAssignRole(id) {
        console.log("Assigning role to volunteer with ID:", id);
    }


    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(`http://127.0.0.1:8000/api/events/${eventId}/tasks/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data);
            setBackupTasks(response.data);
            console.log(tasks)
        } catch (error) {
            console.error("❌ Error fetching tasks:", error);
        }
    };


    const sendAnnouncement = async () => {
        if (!announcement.trim()) {
            alert("⚠️ Please enter an announcement message.");
            return;
        }

        if (!eventId) {
            alert("⚠️ Invalid event ID. Please refresh the page.");
            return;
        }

        try {
            const token = localStorage.getItem("accessToken");
            await axios.post(
                `http://127.0.0.1:8000/api/events/${eventId}/announcement/`,
                { message: announcement },
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`, 
                        "Content-Type": "application/json" 
                    } 
                }
            );
            alert("✅ Announcement sent successfully!");
            setAnnouncement("");
        } catch (error) {
            console.error("❌ Error sending announcement:", error);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#1a202c] text-white">
            {/* ✅ Sidebar Navigation */}
            <Sidebar />



            {/* ✅ Main Content */}
            <div className="flex-1 p-6">
            <div className="bg-[#2d3748] p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-2xl font-bold mb-4">Send Announcement</h2>
                    <textarea
                        className="w-full p-3 bg-gray-800 rounded-lg text-white focus:outline-none"
                        rows="3"
                        placeholder="Type your announcement here..."
                        value={announcement}
                        onChange={(e) => setAnnouncement(e.target.value)}
                    />
                    <button
                        onClick={sendAnnouncement}
                        className="flex items-center bg-yellow-500 hover:bg-yellow-700 p-3 rounded-lg text-lg font-bold mt-3"
                    >
                        <FaBullhorn className="mr-3" /> Send Announcement
                    </button>
                </div>
                <h1 className="text-4xl font-bold mb-6">Event Details</h1>

                {/* ✅ Search & Task Buttons */}
                <div className="flex items-center justify-between h-[10%] p-3 rounded-lg w-full mb-6">
                    {/* 🔍 Search Bar */}
                    <div className="flex items-center bg-gray-800 p-3 h-full rounded-lg w-[40%]">
                        <FaSearch className="text-gray-300 mr-2" />
                        <input 
                            type="text" 
                            placeholder={viewTasksBtn?"Search tasks...":"Search volunteers..."} 
                            className="bg-transparent focus:outline-none text-white w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* 🛠 Task Buttons */}
                    <div className="flex space-x-4 h-full w-[50%]">
                        {/* ✅ Open Modal Instead of Navigating */}
                        <button 
                            onClick={() => setIsTaskModalOpen(true)} 
                            className="flex items-center bg-green-500 hover:bg-green-700 p-3 px-5 rounded-lg text-lg font-bold transition duration-300 h-full w-[40%]"
                        >
                            <FaPlusCircle className="mr-3" /> Add Task
                        </button>

                        {/* 🔵 View Tasks Button (Still Navigates) */}
                        <button 
                            onClick={()=>setViewTasksBtn(!viewTasksBtn)} 
                            className="flex items-center bg-blue-500 hover:bg-blue-700 p-3 px-5 rounded-lg text-lg font-bold transition duration-300 w-[40%] h-full"
                        >
                            {viewTasksBtn ? "View Volunteers":"View Tasks"}
                        </button>
                    </div>
                </div>

                {/* ✅ Volunteers Table */}
                {!viewTasksBtn &&
                <div className="bg-[#2d3748] p-6 rounded-lg shadow-md">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-600">
                            <th className="p-2">Name</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Phone</th>
                            <th className="p-2">Role</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(volunteers) && volunteers.length > 0 ? (
                            volunteers.map((registration) => (
                                <tr key={registration.R_ID} className="border-b border-gray-700">
                                    <td className="p-2">{registration.volunteer.name}</td>
                                    <td className="p-2">{registration.volunteer.email}</td>
                                    <td className="p-2">{registration.volunteer.phone || "N/A"}</td>
                                    <td className="p-2">{registration.volunteer.role}</td>
                                    <td className="p-2">
                                        <AssignRole userId={registration.volunteer.id} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-4 text-center">No volunteers available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                    </div>}
                
                {
                    viewTasksBtn &&
                    
                    <ViewTasks tasks1={tasks} searchQuery={searchQuery} />
                    
                }

                {/* ✅ Add Task Modal */}
                <AddTaskModal 
                isOpen={isTaskModalOpen} 
                onClose={() => setIsTaskModalOpen(false)}
                fetchTasks={fetchTasks}  // ✅ Ensure fetchTasks is passed correctly
            />

            </div>
        </div>
    );
}

export default EventSpecificVolunteers;