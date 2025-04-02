import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

function AdminEditEvent() {
    const { eventId } = useParams();
    const [eventData, setEventData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchEventDetails();
    }, []);

    const fetchEventDetails = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(`http://127.0.0.1:8000/api/events/${eventId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            const event = response.data;
    
            // ✅ Convert date format (Extract YYYY-MM-DD)
            event.E_Start_Date = event.E_Start_Date.split("T")[0];
            event.E_End_Date = event.E_End_Date.split("T")[0];
    
            setEventData(event);
        } catch (error) {
            setErrorMessage("❌ Error fetching event details.");
        }
    };
    

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setEventData({ ...eventData, E_Photo: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
    
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setErrorMessage("❌ Unauthorized! No token found.");
            return;
        }
    
        const formData = new FormData();
    
        // ✅ Append only fields that have values
        Object.keys(eventData).forEach((key) => {
            let value = eventData[key];
    
            // ✅ Filter out empty UUIDs (fix for E_Coordinators & E_Super_Volunteers)
            if (["E_Coordinators", "E_Super_Volunteers"].includes(key) && Array.isArray(value)) {
                value = value.filter((id) => id !== "" && id !== null);
            }
    
            if (value) {
                if (key === "E_Photo" && value instanceof File) {
                    formData.append("E_Photo", value); // ✅ Correct way to send a file
                } else if (Array.isArray(value)) {
                    value.forEach((item) => formData.append(`${key}[]`, item)); // ✅ Send arrays properly
                } else {
                    formData.append(key, value);
                }
            }
        });
    
        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/events/${eventId}/update/`,  // ✅ Correct API URL
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
            setErrorMessage(`❌ Failed to update event: ${error.response?.data?.E_Photo || "Unknown error"}`);
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
                    <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 mb-4 bg-gray-700 rounded" />

                    <label className="block mb-2">Required Volunteers:</label>
                    <input type="number" name="E_Required_Volunteers" value={eventData.E_Required_Volunteers} onChange={handleChange} required className="w-full p-2 mb-4 bg-gray-700 rounded" />

                    <label className="block mb-2">Start Date:</label>
                    <input type="date" name="E_Start_Date" value={eventData.E_Start_Date} onChange={handleChange} required className="w-full p-2 mb-4 bg-gray-700 rounded" />

                    <label className="block mb-2">End Date:</label>
                    <input type="date" name="E_End_Date" value={eventData.E_End_Date} onChange={handleChange} required className="w-full p-2 mb-4 bg-gray-700 rounded" />

                    <label className="block mb-2">Status:</label>
                    <select name="E_Status" value={eventData.E_Status} onChange={handleChange} className="w-full p-2 mb-4 bg-gray-700 rounded">
                        <option value="Upcoming">Upcoming</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                    </select>

                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                    <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-700 p-3 rounded-lg font-bold">Update Event</button>
                </form>
            </div>
        </div>
    );
}

export default AdminEditEvent;