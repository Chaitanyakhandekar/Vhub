import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EventRegistration() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
    const [loading, setLoading] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        checkRegistrationStatus();
    }, []);

    const checkRegistrationStatus = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(
                `http://127.0.0.1:8000/api/events/${eventId}/registration-status/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsRegistered(response.data.registered); // ✅ Set registered status
        } catch (error) {
            console.error("❌ Error checking registration:", error.response?.data || error.message);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.name || !formData.email || !formData.phone) {
            alert("⚠️ Please fill in all fields.");
            setLoading(false);
            return;
        }

        try {
            console.log("🟢 Registering:", formData);
            const token = localStorage.getItem("accessToken");
            const response = await axios.post(
                `http://127.0.0.1:8000/api/events/${eventId}/register/`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 201) {
                alert("✅ Successfully registered!");
                setIsRegistered(true); // ✅ Update UI immediately
                navigate(`/events/${eventId}`);
            }
        } catch (error) {
            console.error("❌ Error registering:", error.response?.data || error.message);
            if (error.response?.data?.error === "Already registered") {
                alert("⚠️ You are already registered for this event.");
                setIsRegistered(true);
            }
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="p-6 max-w-md w-full bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold text-center">Event Registration</h2>
                {isRegistered ? (
                    <p className="text-green-600 text-center mt-4">✅ You are already registered!</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <input type="text" name="name" placeholder="Full Name" className="w-full p-2 border rounded" onChange={handleChange} required />
                        <input type="email" name="email" placeholder="Email Address" className="w-full p-2 border rounded" onChange={handleChange} required />
                        <input type="tel" name="phone" placeholder="Phone Number" className="w-full p-2 border rounded" onChange={handleChange} required />
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-lg disabled:opacity-50"
                            disabled={loading || isRegistered}
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default EventRegistration;
