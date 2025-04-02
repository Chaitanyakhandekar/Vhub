import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

function AdminCreateEvent() {
    const navigate = useNavigate();
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
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setErrorMessage("❌ Please upload a valid image file.");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setErrorMessage("❌ Image size should be less than 5MB.");
                return;
            }

            setEventData({ ...eventData, E_Photo: file });

            // Preview image
            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const currentDate = new Date().toISOString().split("T")[0];
        const errors = [];

        if (!eventData.E_Name.trim()) errors.push("Event name is required.");
        if (!eventData.E_Description.trim()) errors.push("Description is required.");
        if (!eventData.E_Location.trim()) errors.push("Location is required.");
        if (!eventData.E_Photo) errors.push("Event photo is required.");
        if (eventData.E_Required_Volunteers <= 0) errors.push("Volunteers must be a positive number.");
        if (!eventData.E_Start_Date) errors.push("Start date is required.");
        if (!eventData.E_End_Date) errors.push("End date is required.");
        if (eventData.E_Start_Date < currentDate) errors.push("Start date cannot be in the past.");
        if (eventData.E_Start_Date && eventData.E_End_Date && eventData.E_End_Date < eventData.E_Start_Date) {
            errors.push("End date cannot be before start date.");
        }
        if (eventData.E_Start_Date === eventData.E_End_Date &&
            eventData.E_Start_Time &&
            eventData.E_End_Time &&
            eventData.E_End_Time <= eventData.E_Start_Time) {
            errors.push("End time must be after start time for same-day events.");
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setErrorMessage(validationErrors.join(". ") + ".");
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        Object.keys(eventData).forEach((key) => {
            if (eventData[key] !== null) {
                if(key==='E_Start_Time' || key==='E_End_Time'){
                   formData.append(key,eventData[key]+':00')
                   console.log(eventData[key]+':00') 
                }else{
                    formData.append(key, eventData[key]);
                }
            }
        });

        console.log("FormData Contents:");
        for (let pair of formData.entries()) {
            console.log(pair[0] + ": " + pair[1]);
        }
        
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.post(
                "http://127.0.0.1:8000/api/events/create/",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log(response)

            if (response.status === 201) {
                navigate("/admin/events");
            }
        } catch (error) {
            console.error("Error creating event:", error);
            setErrorMessage("❌ Error creating event. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            <Sidebar />
            <div className="flex-1 p-6 h-[100vh] overflow-auto">
                <h1 className="text-4xl font-bold text-center mb-6">Create New Event</h1>
                <form 
                    onSubmit={handleSubmit} 
                    className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg mx-auto"
                >
                    {/* Input Fields */}
                    {[
                        { label: "Event Name", name: "E_Name", type: "text" },
                        { label: "Description", name: "E_Description", type: "textarea" },
                        { label: "Location", name: "E_Location", type: "text" },
                        { label: "Start Date", name: "E_Start_Date", type: "date" },
                        { label: "Start Time", name: "E_Start_Time", type: "time" },
                        { label: "End Date", name: "E_End_Date", type: "date" },
                        { label: "End Time", name: "E_End_Time", type: "time" },
                        { label: "Required Volunteers", name: "E_Required_Volunteers", type: "number" },
                    ].map((field, index) => (
                        <div key={index} className="mb-4">
                            <label className="block mb-2">{field.label}:</label>
                            {field.type === "textarea" ? (
                                <textarea
                                    name={field.name}
                                    value={eventData[field.name]}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-green-500"
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={eventData[field.name]}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-green-500"
                                />
                            )}
                        </div>
                    ))}

                    {/* File Upload */}
                    <div className="mb-4">
                        <label className="block mb-2">Event Photo:</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            required 
                            className="w-full p-2 rounded-lg bg-gray-700 focus:ring-2 focus:ring-green-500" 
                        />
                    </div>

                    {/* Image Preview */}
                    {previewImage && (
                        <div className="mb-4 p-2 border border-gray-500 rounded-lg">
                            <img src={previewImage} alt="Preview" className="max-w-full h-auto max-h-40 rounded-lg" />
                        </div>
                    )}

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-900 rounded text-red-300 text-center">
                            {errorMessage}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full p-3 rounded-lg font-bold transition duration-300 ${
                            isSubmitting 
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-green-500 hover:bg-green-700"
                        }`}
                    >
                        {isSubmitting ? "Creating..." : "Create Event"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminCreateEvent;