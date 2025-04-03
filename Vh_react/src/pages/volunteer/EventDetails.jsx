import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTasks, FaQrcode, FaCertificate, FaSpinner, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

function EventDetails() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState({
        event: true,
        qr: false,
        certificate: false,
        tasks: false,
        gallery: false
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [qrVisible, setQrVisible] = useState(false);
    const [certificateData, setCertificateData] = useState({
        available: false,
        url: "",
        exists: false,
        canGenerate: false,
        message: ""
    });
    const [tasks, setTasks] = useState([]);
    const [tasksVisible, setTasksVisible] = useState(false);
    const [galleryVisible, setGalleryVisible] = useState(false);
    const [eventPhotos, setEventPhotos] = useState([]);
    const [badges, setBadges] = useState([]);

    const getAuthToken = () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            toast.error("Please login to access this feature");
            throw new Error("No authentication token found");
        }
        return token;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchEventDetails();
                await checkCertificateStatus();
                await fetchBadges();
                await fetchEventGallery();
            } catch (error) {
                console.error("Initialization error:", error);
            }
        };
        fetchData();
    }, [eventId]);

    const fetchEventDetails = async () => {
        try {
            setLoading(prev => ({ ...prev, event: true }));
            const token = getAuthToken();
            const response = await axios.get(
                `http://localhost:8000/api/events/${eventId}/`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000
                }
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

    const fetchBadges = async () => {
        try {
            const token = getAuthToken();
            const response = await axios.get(
                `http://localhost:8000/api/events/${eventId}/badges/`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000
                }
            );
            setBadges(response.data.badges || []);
        } catch (error) {
            console.error("Error fetching badges:", error);
        }
    };

    const fetchEventGallery = async () => {
        try {
            setLoading(prev => ({ ...prev, gallery: true }));
            const token = getAuthToken();
            const response = await axios.get(
                `http://localhost:8000/api/events/${eventId}/gallery/`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000
                }
            );
            setEventPhotos(response.data.photos || []);
        } catch (error) {
            console.error("Error fetching gallery:", error);
        } finally {
            setLoading(prev => ({ ...prev, gallery: false }));
        }
    };

    const generateQrCode = async () => {
        try {
            setLoading(prev => ({ ...prev, qr: true }));
            const token = getAuthToken();
            const response = await axios.get(
                `http://localhost:8000/api/events/${eventId}/generate-qr/`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000
                }
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

    const checkCertificateStatus = async () => {
        try {
            setLoading(prev => ({ ...prev, certificate: true }));
            const token = getAuthToken();
            const response = await axios.get(
                `http://localhost:8000/api/events/${eventId}/check-certificate/`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000
                }
            );
    
            console.log("Certificate status response:", response.data); // Debug log
    
            if (response.data.certificate_url) {
                setCertificateData({
                    available: true,
                    url: response.data.certificate_url,
                    exists: true,
                    canGenerate: false,
                    message: "Certificate available"
                });
            } else if (response.data.can_generate) {
                setCertificateData({
                    available: false,
                    url: "",
                    exists: false,
                    canGenerate: true,
                    message: response.data.message || "You can generate a certificate"
                });
            } else {
                setCertificateData({
                    available: false,
                    url: "",
                    exists: false,
                    canGenerate: false,
                    message: response.data.error || "Certificate not available"
                });
            }
        } catch (error) {
            console.error("Error checking certificate:", error);
            // ... rest of your error handling ...
        } finally {
            setLoading(prev => ({ ...prev, certificate: false }));
        }
    };

    const generateCertificate = async () => {
        try {
            setLoading(prev => ({ ...prev, certificate: true }));
            const token = getAuthToken();
            const response = await axios.post(
                `http://localhost:8000/api/events/${eventId}/generate-certificate/`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000
                }
            );

            if (response.data.certificate_url) {
                setCertificateData({
                    available: true,
                    url: response.data.certificate_url,
                    exists: true,
                    canGenerate: false,
                    message: "Certificate generated successfully"
                });
                toast.success("Certificate generated successfully");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message ||
                "Failed to generate certificate";
            toast.error(errorMsg);
        } finally {
            setLoading(prev => ({ ...prev, certificate: false }));
        }
    };

    const downloadCertificate = async () => {
        try {
            setLoading(prev => ({ ...prev, certificate: true }));
            const token = getAuthToken();
            
            // First get the download URL
            const response = await axios.get(
                `http://localhost:8000/api/events/${eventId}/download-certificate/`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000
                }
            );
    
            if (response.data.certificate_url) {
                // Create a temporary anchor tag to trigger download
                const link = document.createElement('a');
                link.href = response.data.certificate_url;
                link.target = '_blank';
                link.download = `certificate_${event?.E_Name || 'event'}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                toast.success("Certificate download started");
            } else {
                toast.error("Certificate URL not found");
            }
        } catch (error) {
            console.error("Download failed:", error);
            toast.error(error.response?.data?.error || "Failed to download certificate");
        } finally {
            setLoading(prev => ({ ...prev, certificate: false }));
        }
    };
    const fetchTasks = async () => {
        try {
            setLoading(prev => ({ ...prev, tasks: true }));
            const token = getAuthToken();
            const response = await axios.get(
                `http://localhost:8000/api/events/${eventId}/tasks/`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000
                }
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

    const hasEventEnded = () => {
        if (!event?.E_End_Date) return false;
        
        try {
            const endDate = new Date(event.E_End_Date);
            
            if (event.E_End_Time) {
                const [hours, minutes] = event.E_End_Time.split(':');
                endDate.setHours(parseInt(hours, 10));
                endDate.setMinutes(parseInt(minutes, 10));
            } else {
                endDate.setHours(23, 59, 59);
            }
            
            return endDate <= new Date();
        } catch (e) {
            console.error("Date comparison error:", e);
            return false;
        }
    };

    const formatEventDateTime = (dateStr, timeStr) => {
        if (!dateStr) return "N/A";
        
        try {
            const date = new Date(dateStr);
            
            if (timeStr) {
                const [hours, minutes] = timeStr.split(':');
                date.setHours(parseInt(hours, 10));
                date.setMinutes(parseInt(minutes, 10));
            }
            
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (e) {
            console.error("Date formatting error:", e);
            return "Invalid Date";
        }
    };

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

    const BadgesSection = () => (
        <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-3">Your Achievements</h3>
            <div className="flex flex-wrap gap-3">
                {badges.length > 0 ? (
                    badges.map((badge, index) => (
                        <div key={index} className="relative group">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${badge.earned ? 'bg-yellow-500' : 'bg-gray-700'}`}>
                                {badge.earned ? (
                                    <img src={badge.icon} alt={badge.name} className="w-10 h-10" />
                                ) : (
                                    <div className="text-gray-400 text-2xl">?</div>
                                )}
                            </div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {badge.name}
                                {badge.earned && (
                                    <div className="text-xs text-gray-300">Earned on {new Date(badge.earnedDate).toLocaleDateString()}</div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">No badges available for this event</p>
                )}
            </div>
        </div>
    );

    const GalleryModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <div className="p-4 flex justify-between items-center border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Event Gallery</h2>
                    <button
                        onClick={() => setGalleryVisible(false)}
                        className="text-gray-400 hover:text-white text-2xl"
                    >
                        &times;
                    </button>
                </div>
                
                <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[70vh]">
                    {eventPhotos.length > 0 ? (
                        eventPhotos.map((photo, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={photo.url}
                                    alt={`Event photo ${index + 1}`}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-8 text-gray-400">
                            No photos available yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="fixed top-4 left-4 z-50 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"
            >
                <FaArrowLeft /> Back
            </button>
    
            <div className="container mx-auto pt-16 px-4">
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
                                        <p className="text-white">{formatEventDateTime(event?.E_Start_Date, event?.E_Start_Time)}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400">End Date</h3>
                                        <p className="text-white">{formatEventDateTime(event?.E_End_Date, event?.E_End_Time)}</p>
                                    </div>
                                </div>

                                <BadgesSection />
                            </div>

                            {/* Event Image */}
                            {event?.E_Photo && (
                                <div className="w-full md:w-64 flex-shrink-0">
                                    <img 
                                        src={event.E_Photo} 
                                        alt="Event" 
                                        className="rounded-lg w-full h-48 object-cover shadow-md cursor-pointer hover:brightness-110 transition-all"
                                        onClick={() => setGalleryVisible(true)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-gray-700 p-4 md:p-6 flex flex-wrap gap-4 justify-center">
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

                        {hasEventEnded() && (
    certificateData.exists ? (
        <button
            onClick={downloadCertificate}
            disabled={loading.certificate}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
            {loading.certificate ? (
                <FaSpinner className="animate-spin" />
            ) : (
                <FaCertificate />
            )}
            Download Certificate
        </button>
    ) : certificateData.canGenerate ? (
        <button
            onClick={generateCertificate}
            disabled={loading.certificate}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
            {loading.certificate ? (
                <FaSpinner className="animate-spin" />
            ) : (
                <FaCertificate />
            )}
            Generate Certificate
        </button>
    ) : (
        <button
            disabled
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg cursor-not-allowed"
        >
            <FaCertificate />
            {certificateData.message || "Certificate not available"}
        </button>
    )
)}
                        {event?.E_Photo && (
                            <button
                                onClick={() => setGalleryVisible(true)}
                                disabled={loading.gallery}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {loading.gallery ? (
                                    <FaSpinner className="animate-spin" />
                                ) : (
                                    "View Gallery"
                                )}
                            </button>
                        )}
                    </div>
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
                                                {task.status}
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

            {galleryVisible && <GalleryModal />}
        </div>
    );
}

export default EventDetails;