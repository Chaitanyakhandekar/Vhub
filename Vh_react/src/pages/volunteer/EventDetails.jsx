import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaTasks, FaQrcode, FaCertificate, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

function EventDetails() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [role,setRole] = useState(localStorage.getItem("userRole")) 
    const [loading, setLoading] = useState({
        event: true,
        qr: false,
        certificate: false,
        tasks: false
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [qrVisible, setQrVisible] = useState(false);
    const [certificateAvailable, setCertificateAvailable] = useState(false);
    const [certificateUrl, setCertificateUrl] = useState("");
    const [tasks, setTasks] = useState([]);
    const [tasksVisible, setTasksVisible] = useState(false);

    useEffect(() => {
        fetchEventDetails();
        checkCertificate();
    }, [eventId]);

    const fetchEventDetails = async () => {
        try {
            setLoading(prev => ({ ...prev, event: true }));
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(
                `http://127.0.0.1:8000/api/events/${eventId}/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEvent(response.data);
        } catch (error) {
            console.error("Failed to load event details:", error);
            setErrorMessage(
                error.response?.data?.message || 
                "Failed to load event details. Please try again later."
            );
            toast.error("Failed to load event details");
        } finally {
            setLoading(prev => ({ ...prev, event: false }));
        }
    };

    const generateQrCode = async () => {
        try {
            
            setLoading(prev => ({ ...prev, qr: true }));
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(
                `http://127.0.0.1:8000/api/events/${eventId}/generate-qr/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.qr_code_url) {
                setQrCodeUrl(response.data.qr_code_url);
                setQrVisible(true);
                toast.success("QR Code generated successfully");
            }
        } catch (error) {
            console.error("Failed to generate QR Code:", error);
            toast.error(
                error.response?.data?.message || 
                "Failed to generate QR Code. Please try again."
            );
        } finally {
            setLoading(prev => ({ ...prev, qr: false }));
        }
    };

    const checkCertificate = async () => {
        try {
            setLoading(prev => ({ ...prev, certificate: true }));
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(
                `http://127.0.0.1:8000/api/events/${eventId}/check-certificate/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.certificate_url) {
                setCertificateAvailable(true);
                setCertificateUrl(response.data.certificate_url);
            }
        } catch (error) {
            if (error.response?.status === 404) {
                // Certificate not found - this is expected for some users
            } else if (error.response?.status === 403) {
                toast.warn("You are not eligible for a certificate yet");
            } else {
                console.error("Error checking certificate:", error);
            }
        } finally {
            setLoading(prev => ({ ...prev, certificate: false }));
        }
    };

    const generateCertificate = async () => {
        try {
            setLoading(prev => ({ ...prev, certificate: true }));
            const token = localStorage.getItem("accessToken");
            const response = await axios.post(
                `http://127.0.0.1:8000/api/events/${eventId}/generate-certificate/`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.certificate_url) {
                setCertificateAvailable(true);
                setCertificateUrl(response.data.certificate_url);
                toast.success("Certificate generated successfully!");
            }
        } catch (error) {
            console.error("Certificate generation failed:", error);
            toast.error(
                error.response?.data?.message || 
                "Failed to generate certificate. Please try again later."
            );
        } finally {
            setLoading(prev => ({ ...prev, certificate: false }));
        }
    };

    const downloadCertificate = () => {
        if (!certificateUrl) {
            toast.warn("Certificate not available yet");
            return;
        }
        window.open(certificateUrl, "_blank");
    };

    const fetchTasks = async () => {
        try {
            setLoading(prev => ({ ...prev, tasks: true }));
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(
                `http://127.0.0.1:8000/api/events/${eventId}/tasks/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks(response.data);
            setTasksVisible(true);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            toast.error("Failed to load tasks");
        } finally {
            setLoading(prev => ({ ...prev, tasks: false }));
        }
    };

    const hasEventEnded = event?.E_End_Date && new Date(event.E_End_Date) <= new Date();

    if (loading.event) return (
        <div className="flex justify-center items-center min-h-screen">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
    );

    if (errorMessage) return (
        <div className="text-center p-8 text-red-500">
            {errorMessage}
            <button 
                onClick={fetchEventDetails}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
                Retry
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900  flex justify-center items-center p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                {/* Event Header */}
                <div className="p-6 md:p-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">
                        {event?.E_Name}
                    </h1>
                    
                    <div className="flex flex-col md:flex-row gap-6 mt-6">
                        {/* Event Details */}
                        <div className="flex-1">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-white mb-2">Description</h2>
                                <p className="text-gray-300">{event?.E_Description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400">Status</h3>
                                    <p className="text-yellow-400 capitalize">{event?.E_Status}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400">Location</h3>
                                    <p className="text-white">{event?.E_Location}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400">Start Date</h3>
                                    <p className="text-white">{event?.E_Start_Date.split('T')[0]}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400">End Date</h3>
                                    <p className="text-white">{event?.E_End_Date.split('T')[0]}</p>
                                </div>
                            </div>
                        </div>

                        {/* Event Image */}
                        {event?.E_Photo && (
                            <div className="w-full md:w-64 flex-shrink-0">
                                <img 
                                    src={event.E_Photo} 
                                    alt="Event" 
                                    className="rounded-lg w-full h-48 object-cover shadow-md"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-gray-700 p-4 md:p-6 flex flex-wrap gap-4 justify-center">
                    {role!=="Admin" &&
                            <button
                            onClick={qrCodeUrl ? () => setQrVisible(true) : generateQrCode}
                            disabled={loading.qr}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading.qr ? (
                                <FaSpinner className="animate-spin" />
                            ) : (
                                <FaQrcode />
                            )}
                            {qrCodeUrl ? "Show QR Code" : "Generate QR Code"}
                        </button>
                    }

                    <button
                        onClick={fetchTasks}
                        disabled={loading.tasks}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading.tasks ? (
                            <FaSpinner className="animate-spin" />
                        ) : (
                            <FaTasks />
                        )}
                        View Tasks
                    </button>

                    {hasEventEnded && (
                        <button
                            onClick={certificateAvailable ? downloadCertificate : generateCertificate}
                            disabled={loading.certificate}
                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading.certificate ? (
                                <FaSpinner className="animate-spin" />
                            ) : (
                                <FaCertificate />
                            )}
                            {certificateAvailable ? "Download Certificate" : "Generate Certificate"}
                        </button>
                    )}
                </div>
            </div>

            {/* QR Code Modal */}
            {qrVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full">
                        <h2 className="text-xl font-bold text-white mb-4">Your Event QR Code</h2>
                        {qrCodeUrl ? (
                            <div className="flex flex-col items-center">
                                <img 
                                    src={qrCodeUrl} 
                                    alt="QR Code" 
                                    className="border-4 border-white p-2 rounded-lg mb-4 w-64 h-64"
                                />
                                <p className="text-gray-300 text-sm mb-4">
                                    Show this QR code at the event for check-in
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-300">No QR Code available</p>
                        )}
                        <button
                            onClick={() => setQrVisible(false)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg mt-4"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Tasks Sidebar */}
            {tasksVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-end z-50">
                    <div className="bg-gray-800 w-full max-w-xs h-full overflow-y-auto p-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Event Tasks</h3>
                            <button 
                                onClick={() => setTasksVisible(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        {tasks.length > 0 ? (
                            <ul className="space-y-2">
                                {tasks.map(task => (
                                    <li key={task.T_ID} className="bg-gray-700 p-3 rounded-lg">
                                        <h4 className="font-medium text-white">{task.title}</h4>
                                        <p className="text-sm text-gray-300 mt-1">{task.description}</p>
                                        <div className="flex justify-between items-center mt-2 text-xs">
                                            <span className={`px-2 py-1 rounded ${
                                                task.status === "Completed" ? "bg-green-600" :
                                                task.status === "In Progress" ? "bg-yellow-600" :
                                                "bg-gray-600"
                                            }`}>
                                                {task.status==="Not Started"?"Incomplete":"Completed"}
                                            </span>
                                            <span className="text-gray-400">
                                                {new Date(task.deadline).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400 text-center py-8">No tasks available</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default EventDetails;