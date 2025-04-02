import React, { useEffect, useState } from "react";
import { FaSearch, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Task from "./Task";

function ViewTasks({tasks1,searchQuery}) {
    const { eventId } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [backupTasks, setBackupTasks] = useState([]);
    const[status,setStatus] = useState("")
    // const [searchQuery, setSearchQuery] = useState("");
    const [filterPriority, setFilterPriority] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const navigate = useNavigate();

    

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.get(`http://127.0.0.1:8000/api/events/${eventId}/tasks/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTasks(response.data);
                setBackupTasks(response.data);
                console.log("Tasks = = = ",tasks)
            } catch (error) {
                console.error("❌ Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, [eventId, tasks1]);
    
    useEffect(() => { 
        setTasks(backupTasks)
        
        let searchedTasks = tasks.filter((task) => (
            searchQuery.trim().toLowerCase() === task.title.trim().toLowerCase()
        ))

        setTasks(searchedTasks)
        
    },[searchQuery])

    useEffect(() => {
        let filteredTasks = backupTasks;
        
        if (filterPriority !== "all") {
            filteredTasks = filteredTasks.filter(task => task.priority === filterPriority);
        }
        if (filterStatus !== "all") {
            filteredTasks = filteredTasks.filter(task => task.status === filterStatus);
        }
        if (searchQuery.length > 0) {
            filteredTasks = filteredTasks.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        setTasks(filteredTasks);
    }, [searchQuery, filterPriority, filterStatus]);



    

    return (
        <>
            

                <div className="bg-[#2d3748] p-6 rounded-lg shadow-md">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-600">
                                <th className="p-2">Title</th>
                                <th className="p-2">Description</th>
                                <th className="p-2">Priority</th>
                                <th className="p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(tasks) && tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <Task id={task.T_ID} title={task.title} description={task.description} priority={task.priority} status1={task.status}/>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-4 text-center">No tasks available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </>
        
    );
}

export default ViewTasks;
