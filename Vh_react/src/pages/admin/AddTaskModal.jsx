import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function AddTaskModal({ isOpen, onClose, fetchTasks }) {
    const { eventId } = useAuth();
    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        priority: "Medium"
    });

    const handleChange = (e) => {
        setTaskData({ ...taskData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("accessToken");
    
            const payload = {
                title: taskData.title,
                description: taskData.description,
                priority: taskData.priority,
                event: eventId, 
            };
    
            console.log("📩 Sending Task Data:", payload);
    
            await axios.post(`http://127.0.0.1:8000/api/events/${eventId}/tasks/create/`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTaskData({title: "",
                description: "",
                priority: "Medium"})
    
            if (typeof fetchTasks === "function") {
                console.log("🔄 Fetching updated tasks...");
                fetchTasks();  // ✅ Ensure `fetchTasks` is called
            } else {
                console.warn("⚠️ fetchTasks is not a function");
            }
    
            onClose(); // ✅ Close modal only after updating
        } catch (error) {
            console.error("❌ Error adding task:", error);
        }
    };
    
    
    
    

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-[#2d3748] text-white p-6 rounded-lg shadow-lg w-[450px] transform transition-all scale-95 hover:scale-100">
                {/* ✅ Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add New Task</h2>
                    <button onClick={onClose} className="text-red-400 hover:text-red-600 transition">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* ✅ Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 🔹 Task Title */}
                    <div>
                        <label htmlFor="title" className="block text-gray-300 font-medium mb-1">Task Title</label>
                        <input 
                            type="text" 
                            id="title" 
                            name="title" 
                            value={taskData.title} 
                            onChange={handleChange} 
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                            required 
                        />
                    </div>

                    {/* 🔹 Task Description */}
                    <div>
                        <label htmlFor="description" className="block text-gray-300 font-medium mb-1">Task Description</label>
                        <textarea 
                            id="description" 
                            name="description" 
                            value={taskData.description} 
                            onChange={handleChange} 
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                            rows="3"
                            required 
                        ></textarea>
                    </div>

                    {/* 🔹 Priority */}
                    <div>
                        <label htmlFor="priority" className="block text-gray-300 font-medium mb-1">Priority</label>
                        <select 
                            id="priority" 
                            name="priority" 
                            value={taskData.priority} 
                            onChange={handleChange} 
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    {/* ✅ Buttons */}
                    <div className="flex justify-end space-x-3 mt-4">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                        >
                            Add Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTaskModal;
