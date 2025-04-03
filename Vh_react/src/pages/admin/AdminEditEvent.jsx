import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

function AdminEditEvent() {
    const { eventId } = useParams();
    const [eventData, setEventData] = useState({
        E_Name: "",
        E_Description: "",
        E_Start_Date: "",
        E_Start_Time: "",
        E_End_Date: "",
        E_End_Time: "",
        E_Location: "",
        E_Photo: null,
        E_Required_Volunteers: 10,
        E_Status: "Upcoming",
        existingImageUrl: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchEventDetails();
    }, [eventId]);

    const fetchEventDetails = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(`http://127.0.0.1:8000/api/events/${eventId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            const event = response.data;
            
            // Format dates and times
            const startDate = new Date(event.E_Start_Date);
            const endDate = new Date(event.E_End_Date);
            
            setEventData({
                ...event,
                E_Start_Date: startDate.toISOString().split('T')[0],
                E_Start_Time: event.E_Start_Time || "08:00",
                E_End_Date: endDate.toISOString().split('T')[0],
                E_End_Time: event.E_End_Time || "17:00",
                existingImageUrl: event.E_Photo // Store existing image URL
            });
        } catch (error) {
            setErrorMessage("❌ Error fetching event details.");
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setEventData({ 
                ...eventData, 
                E_Photo: e.target.files[0],
                existingImageUrl: "" // Clear existing image if new one is uploaded
            });
        }
    };

    const getEventStatus = (startDate, startTime, endDate, endTime) => {
        const now = new Date(); // Current date & time
        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);
    
        if (now < start) return "Upcoming";  // Event has not started yet
        if (now >= start && now <= end) return "Ongoing";  // Event is happening now
        return "Completed";  // Event has ended
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
    
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setErrorMessage("❌ Unauthorized! No token found.");
            return;
        }
    
        // ✅ Compute `E_Status` before sending
        const eventStatus = getEventStatus(
            eventData.E_Start_Date, 
            eventData.E_Start_Time, 
            eventData.E_End_Date, 
            eventData.E_End_Time
        );
    
        const formData = new FormData();
    
        // Append all simple fields
        const simpleFields = [
            "E_Name", "E_Description", "E_Location",
            "E_Start_Date", "E_Start_Time",
            "E_End_Date", "E_End_Time",
            "E_Required_Volunteers"
        ];
    
        simpleFields.forEach(field => {
            if (eventData[field] !== null && eventData[field] !== undefined) {
                formData.append(field, eventData[field]);
            }
        });
    
        formData.append("E_Status", eventStatus);  // ✅ Add computed status
    
        // Handle image upload (only if new image was selected)
        if (eventData.E_Photo instanceof File) {
            formData.append("E_Photo", eventData.E_Photo);
        }
    
        // Handle coordinators and super volunteers
        if (eventData.E_Coordinators && eventData.E_Coordinators.length > 0) {
            eventData.E_Coordinators.forEach(coordinator => {
                formData.append("E_Coordinators", coordinator);
            });
        }
    
        if (eventData.E_Super_Volunteers && eventData.E_Super_Volunteers.length > 0) {
            eventData.E_Super_Volunteers.forEach(volunteer => {
                formData.append("E_Super_Volunteers", volunteer);
            });
        }
    
        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/events/${eventId}/update/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
    
            console.log("✅ Event Updated:", response.data);
            navigate("/admin/events");
        } catch (error) {
            console.error("❌ Error updating event:", error.response?.data || error);
            setErrorMessage(
                `❌ Failed to update event: ${error.response?.data?.message || "Unknown error"}`
            );
        }
    };
    
    
    if (!eventData) return <p className="text-white text-center">Loading event details...</p>;

    return (
        <div className="flex min-h-screen bg-[#1a202c] text-white">
            <Sidebar />
            <div className="flex-1 p-6">
                <h1 className="text-4xl font-bold mb-6">Edit Event</h1>
                <form onSubmit={handleSubmit} className="bg-[#2d3748] p-6 rounded-lg shadow-md max-w-lg mx-auto">
                    <label className="block mb-2">Event Name:</label>
                    <input type="text" name="E_Name" value={eventData.E_Name} onChange={handleChange} required className="w-full p-2 mb-4 bg-gray-700 rounded" />

                    <label className="block mb-2">Description:</label>
                    <textarea name="E_Description" value={eventData.E_Description} onChange={handleChange} required className="w-full p-2 mb-4 bg-gray-700 rounded"></textarea>

                    <label className="block mb-2">Event Photo:</label>
                    {eventData.existingImageUrl && (
                        <div className="mb-2">
                            <p className="text-sm text-gray-400">Current Image:</p>
                            <img 
                                src={eventData.existingImageUrl} 
                                alt="Current Event" 
                                className="h-32 object-contain mb-2"
                            />
                        </div>
                    )}
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="w-full p-2 mb-4 bg-gray-700 rounded" 
                    />
                    <p className="text-sm text-gray-400 mb-4">Leave blank to keep current image</p>

                    <label className="block mb-2">Required Volunteers:</label>
                    <input type="number" name="E_Required_Volunteers" value={eventData.E_Required_Volunteers} onChange={handleChange} required className="w-full p-2 mb-4 bg-gray-700 rounded" />

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block mb-2">Start Date:</label>
                            <input type="date" name="E_Start_Date" value={eventData.E_Start_Date} onChange={handleChange} required className="w-full p-2 bg-gray-700 rounded" />
                        </div>
                        <div>
                            <label className="block mb-2">Start Time:</label>
                            <input type="time" name="E_Start_Time" value={eventData.E_Start_Time} onChange={handleChange} required className="w-full p-2 bg-gray-700 rounded" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block mb-2">End Date:</label>
                            <input type="date" name="E_End_Date" value={eventData.E_End_Date} onChange={handleChange} required className="w-full p-2 bg-gray-700 rounded" />
                        </div>
                        <div>
                            <label className="block mb-2">End Time:</label>
                            <input type="time" name="E_End_Time" value={eventData.E_End_Time} onChange={handleChange} required className="w-full p-2 bg-gray-700 rounded" />
                        </div>
                    </div>

                    <label className="block mb-2">Location:</label>
                    <input type="text" name="E_Location" value={eventData.E_Location} onChange={handleChange} required className="w-full p-2 mb-4 bg-gray-700 rounded" />

                    <label className="block mb-2">Status:</label>
                    <select name="E_Status" value={eventData.E_Status} onChange={handleChange} className="w-full p-2 mb-4 bg-gray-700 rounded">
                        <option value="Upcoming">Upcoming</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                    </select>

                    {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

                    <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-700 p-3 rounded-lg font-bold">Update Event</button>
                </form>
            </div>
        </div>
    );
}

export default AdminEditEvent;