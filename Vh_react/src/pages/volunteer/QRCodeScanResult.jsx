import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function QRCodeScanResult() {
    const location = useLocation();
    const [volunteerDetails, setVolunteerDetails] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const qrData = queryParams.get("qr_data");

        console.log("🔍 Extracted QR Data:", qrData);

        if (qrData) {
            fetchVolunteerDetails(qrData);
        } else {
            setError("Invalid QR Code.");
            setLoading(false);
        }
    }, [location.search]);

    async function fetchVolunteerDetails(qrData) {
        try {
            const response = await axios.post(
                "http://192.168.1.5:8000/api/qr/scan/",  // ✅ Updated to correct backend IP
                { qr_data: qrData },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("✅ API Response:", response.data);

            if (response.data.success) {
                setVolunteerDetails(response.data.volunteer_details);
            } else {
                setError(response.data.error || "QR Code verification failed.");
            }
        } catch (err) {
            console.error("❌ API Error:", err);
            setError(err.response?.data?.error || "Network error: Could not verify QR Code.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
            <div className="p-6 max-w-lg mx-auto bg-gray-800 shadow-lg rounded-lg border border-gray-700 text-center">
                {loading ? (
                    <h2 className="text-xl">⏳ Scanning QR Code...</h2>
                ) : error ? (
                    <h2 className="text-xl text-red-500">❌ {error}</h2>
                ) : (
                    <div>
                        <h2 className="text-xl text-green-500">✅ QR Code Verified</h2>
                        {volunteerDetails && (
                            <div className="mt-4 text-white">
                                <p><strong>Name:</strong> {volunteerDetails.name}</p>
                                <p><strong>Faculty:</strong> {volunteerDetails.faculty}</p>
                                <p><strong>College:</strong> {volunteerDetails.college}</p>
                                <p><strong>Event:</strong> {volunteerDetails.event_name}</p>
                                {volunteerDetails.profile_picture && (
                                    <img 
                                        src={volunteerDetails.profile_picture} 
                                        alt="Profile" 
                                        className="w-32 h-32 mx-auto mt-4 rounded-full border-2 border-white"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default QRCodeScanResult;
