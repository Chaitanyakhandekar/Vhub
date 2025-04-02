import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function EventPost({ event, ename, description, requiredVolunteers, totVolunteers, fetchEvents, newRegistration, setNewRegistration }) {
    const navigate = useNavigate();
    const [isJoined, setIsJoined] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false); // Track if the user is already registered

    useEffect(() => {
        // Check if the current user is already registered for the event
        const token = localStorage.getItem("accessToken");
        if (token) {
            const userRegistered = event.E_Volunteers?.some((volunteer) => volunteer.id === JSON.parse(atob(token.split(".")[1])).user_id);
            setIsRegistered(userRegistered);
        }
    }, [event.E_Volunteers]);

    const handleJoin = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            Swal.fire({
                title: "⚠️ Not Logged In",
                text: "You must be logged in to register for an event!",
                icon: "warning",
                confirmButtonText: "OK",
            });
            return;
        }

        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/events/${event.E_ID}/register/`,
                {},
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );

            if (response.status === 201) {
                Swal.fire({
                    title: "🎉 Success!",
                    text: "You have successfully registered for the event.",
                    icon: "success",
                    timer: 3000,
                    timerProgressBar: true,
                    confirmButtonText: "OK",
                });
                setNewRegistration(true);
                setIsRegistered(true); // Update registration status
                navigate(`/home/`);
            }
        } catch (error) {
            console.error("❌ Error registering for event:", error.response?.data || error.message);
            Swal.fire({
                title: "⚠️ Registration Error",
                text: error.response?.data?.error || "Failed to register!",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const handleLeave = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.post(
                `http://127.0.0.1:8000/api/events/${event.E_ID}/leave/`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsRegistered(false); // Update registration status
            fetchEvents && fetchEvents();
        } catch (error) {
            console.error("❌ Error leaving event:", error.response?.data || error.message);
            Swal.fire({
                title: "⚠️ Leave Event Error",
                text: error.response?.data?.error || "Failed to leave the event!",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <div className="bg-[#1E293B] bg-opacity-90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-600 transition-transform hover:scale-[1.02] hover:border-blue-400 duration-300">
            {/* Event Image */}
            <div className="relative">
                <img
                    src={event.E_Photo ? `http://127.0.0.1:8000${event.E_Photo}` : "https://via.placeholder.com/400x200"}
                    alt={event.E_Name}
                    className="w-full h-52 object-cover rounded-xl shadow-md border border-gray-700 transition-all duration-300 hover:brightness-110"
                />
                <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-lg shadow-md">
                    {totVolunteers}/{requiredVolunteers} Volunteers
                </span>
            </div>

            {/* Event Info */}
            <div className="mt-4 text-center">
                <h2 className="text-2xl font-bold text-green-400">{ename}</h2>
                <p className="text-gray-300 mt-2">{description.substring(0, 100)}...</p>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-col gap-3">
                {isRegistered ? (
                    <button
                        onClick={handleLeave}
                        className="w-full bg-red-500 hover:bg-red-700 text-white px-5 py-2 rounded-xl transition-all shadow-md transform hover:scale-105"
                    >
                        Leave Event
                    </button>
                ) : (
                    <button
                        onClick={handleJoin}
                        disabled={event.E_Status !== "Upcoming" || totVolunteers === requiredVolunteers}
                        className={`w-full ${
                            event.E_Status === "Upcoming" && totVolunteers < requiredVolunteers
                                ? "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
                                : "bg-gray-500 cursor-not-allowed"
                        } text-white px-5 py-2 rounded-xl transition-all shadow-md transform hover:scale-105`}
                    >
                        {event.E_Status === "Upcoming" && totVolunteers < requiredVolunteers
                            ? "Join Event"
                            : event.E_Status === "Ongoing"
                            ? "Ongoing"
                            : event.E_Status === "Completed"
                            ? "Event Completed"
                            : "Event Full"}
                    </button>
                )}
                <Link
                    to={`/events/${event.E_ID}`}
                    className="block text-center bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-5 py-2 rounded-xl font-semibold transition-all shadow-md transform hover:scale-105"
                >
                    View Event
                </Link>
            </div>
        </div>
    );
}

export default EventPost;