import React, { useEffect, useState } from "react";
import {
    FaEnvelope, FaPhone, FaUniversity, FaUserGraduate,
    FaBriefcase, FaEdit, FaDownload, FaCertificate,
    FaCalendarAlt, FaTrophy, FaCrown, FaMedal
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

function Profile() {
    const { user, loading, fetchProfile } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        college_name: user?.college_name || "",
        faculty: user?.faculty || "",
        year_of_study: user?.year_of_study || "",
        role: user?.role || "",
        profile_image: user?.profile_image || ""
    });
    const [imagePreview, setImagePreview] = useState(user?.profile_image || "");
    const [volunteerStats, setVolunteerStats] = useState({
        eventsAttended: 15,
        certificatesEarned: 8,
        leaderboardRank: "Top 10%"
    });
    const [certificates, setCertificates] = useState([]);
    useEffect(() => {
        console.log("🔍 Debugging Profile:");
        console.log("Loading:", loading);
        console.log("User Data:", user);
    }, [loading, user]);
    const toggleEditMode = () => {
        if (editMode) {
            // Here you would typically save the changes to your backend
            console.log("Saving changes:", updatedUser);
        }
        setEditMode(!editMode);
    };

    // Handle input changes
    const handleChange2 = (e) => {
        const { name, value } = e.target;
        setUpdatedUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        setUpdatedUser({
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            college_name: user?.college_name || "",
            faculty: user?.faculty || "",
            year_of_study: user?.year_of_study || "",
            role: user?.role || "",
            profile_image: user?.profile_image || ""
        });
        setImagePreview(user?.profile_image || "");
    }, [user]);
    useEffect(() => {
        if (user) {
            const fetchCertificates = async () => {
                try {
                    const token = localStorage.getItem("accessToken");
                    const response = await axios.get(
                        `http://127.0.0.1:8000/api/users/${user.id}/certificates/`,
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );
                    setCertificates(response.data);
                } catch (error) {
                    console.error("Error fetching certificates:", error);
                }
            };
            fetchCertificates();
        }
    }, [user]);

    const yearOfStudyText = (year) => {
        const yearMapping = {
            1: "First Year",
            2: "Second Year",
            3: "Third Year",
            4: "Fourth Year"
        };
        return yearMapping[year] || "Unknown Year";
    };

    const saveProfile = async () => {
        const token = localStorage.getItem("accessToken");
        const formData = new FormData();
        for (const key in updatedUser) {
            if (updatedUser[key] && key !== "profile_image") {
                formData.append(key, updatedUser[key]);
            }
        }

        if (updatedUser.profile_image && updatedUser.profile_image instanceof File) {
            formData.append("profile_image", updatedUser.profile_image);
        }

        try {
            const response = await axios.patch(
                `http://127.0.0.1:8000/api/users/${user.id}/update/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("✅ Profile updated successfully!", response.data);
            setUpdatedUser(response.data.user);
            setImagePreview(response.data.user.profile_image);
            setEditMode(false);
        } catch (error) {
            console.error("❌ Error updating profile:", error.response ? error.response.data : error);
        }
    };

    const handleChange = (e) => {
        setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
    };
    const handleChange1 = (e) => {
        setUpdatedUser({ ...updatedUser, college_name: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUpdatedUser({ ...updatedUser, profile_image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const toggleEdit = () => setEditMode(!editMode);

    if (loading) return <p className="text-center text-white">⏳ Loading profile...</p>;

    if (!user) {
        console.error("🚨 Unauthorized: User data is null. Check API or token.");
        return <p className="text-center text-red-500">❌ Unauthorized. Please log in.</p>;
    }

    return (
        <div className="h-[94vh] w-full bg-gradient-to-br from-[#1c202c] to-[#283046]  overflow-auto">
            {/* Main Profile Header */}
            <div className="max-w-6xl mx-auto ">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Column - Profile Info */}
                    <div className="bg-[#2a2d3e] p-8 rounded-lg border border-gray-700 flex-1 flex flex-col">
                        {/* Profile Header */}
                        <div className="text-center mb-8">
                            <label htmlFor="profileImageUpload" className="cursor-pointer group">
                                <div className="relative">
                                    <img
                                        src={imagePreview || "/default-avatar.png"}
                                        alt="Profile"
                                        className="w-40 h-40 rounded-full mx-auto border-2 border-green-400 object-cover"
                                    />
                                    {editMode && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white text-sm">Change Photo</span>
                                        </div>
                                    )}
                                </div>
                                <input type="file" id="profileImageUpload" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>

                            <h1 className="text-3xl font-bold text-green-400 mt-4">{updatedUser.name}</h1>
                            <div className="inline-flex items-center bg-gray-800 px-3 py-1 rounded-full mt-2">
                                <span className="text-gray-300 text-sm">{updatedUser.role}</span>
                                {volunteerStats.leaderboardRank && (
                                    <span className="ml-2 flex items-center text-yellow-400 text-xs">
                                        <FaCrown className="mr-1" /> {volunteerStats.leaderboardRank}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Personal Information Fields */}
                        <div className="space-y-6 flex-1">
                            {/* Email Field */}
                            <div className="bg-[#1e2130] p-4 rounded-lg border border-gray-700 hover:border-green-400 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-800 p-3 rounded-full">
                                        <FaEnvelope className="text-yellow-400 text-lg" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-400 text-xs mb-1">Email</p>
                                        {editMode ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={updatedUser.email}
                                                onChange={handleChange}
                                                className="bg-gray-700 text-white w-full px-3 py-1 rounded-md"
                                            />
                                        ) : (
                                            <p className="text-white">{updatedUser.email}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Phone Field */}
                            <div className="bg-[#1e2130] p-4 rounded-lg border border-gray-700 hover:border-blue-400 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-800 p-3 rounded-full">
                                        <FaPhone className="text-blue-400 text-lg" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-400 text-xs mb-1">Phone</p>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                name="phone"
                                                value={updatedUser.phone}
                                                onChange={handleChange}
                                                className="bg-gray-700 text-white w-full px-3 py-1 rounded-md"
                                                placeholder="Add phone number"
                                            />
                                        ) : (
                                            <p className="text-white">{updatedUser.phone || "Not provided"}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* College Field */}
                            <div className="bg-[#1e2130] p-4 rounded-lg border border-gray-700 hover:border-green-400 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-800 p-3 rounded-full">
                                        <FaUniversity className="text-green-400 text-lg" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-400 text-xs mb-1">College</p>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                name="college_name"
                                                value={updatedUser.college_name}
                                                onChange={handleChange}
                                                className="bg-gray-700 text-white w-full px-3 py-1 rounded-md"
                                            />
                                        ) : (
                                            <p className="text-white">{updatedUser.college_name}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Faculty Field */}
                            <div className="bg-[#1e2130] p-4 rounded-lg border border-gray-700 hover:border-purple-400 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-800 p-3 rounded-full">
                                        <FaBriefcase className="text-purple-400 text-lg" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-400 text-xs mb-1">Faculty</p>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                name="faculty"
                                                value={updatedUser.faculty}
                                                onChange={handleChange}
                                                className="bg-gray-700 text-white w-full px-3 py-1 rounded-md"
                                            />
                                        ) : (
                                            <p className="text-white">{updatedUser.faculty}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Year of Study Field */}
                            <div className="bg-[#1e2130] p-4 rounded-lg border border-gray-700 hover:border-orange-400 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-800 p-3 rounded-full">
                                        <FaUserGraduate className="text-orange-400 text-lg" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-400 text-xs mb-1">Year of Study</p>
                                        {editMode ? (
                                            <input
                                                type="number"
                                                name="year_of_study"
                                                value={updatedUser.year_of_study}
                                                onChange={handleChange}
                                                className="bg-gray-700 text-white w-full px-3 py-1 rounded-md"
                                            />
                                        ) : (
                                            <p className="text-white">{yearOfStudyText(updatedUser.year_of_study)}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Edit Button at Bottom Center */}
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={toggleEditMode}
                                className={`px-6 py-2 rounded-full font-medium transition-colors ${editMode
                                        ? "bg-green-600 hover:bg-green-700 text-white"
                                        : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                                    }`}
                            >
                                {editMode ? "Save Changes" : "Edit Profile"}
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Stats & Certificates */}
                    <div className="bg-[#2a2d3e] p-8 rounded-lg border border-gray-700 flex-1">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <StatCard
                                icon={<FaCalendarAlt className="text-blue-400 text-2xl" />}
                                value={volunteerStats.eventsAttended}
                                label="Events Attended"
                            />
                            <StatCard
                                icon={<FaCertificate className="text-purple-400 text-2xl" />}
                                value={volunteerStats.certificatesEarned}
                                label="Certificates"
                            />
                        </div>

                        {/* Certificates Section */}
                        <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
                            <FaMedal /> My Certificates
                        </h2>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {certificates.length > 0 ? (
                                certificates.map((cert) => (
                                    <div key={cert.id} className="bg-[#1e2130] p-4 rounded-lg border border-gray-700 hover:border-green-400 transition-all">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-green-400">{cert.event_name}</h3>
                                                <p className="text-gray-400 text-sm">
                                                    Issued: {new Date(cert.issued_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => window.open(cert.download_url, '_blank')}
                                                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    <FaDownload size={12} /> Download
                                                </button>
                                            </div>
                                        </div>
                                        {cert.badge && (
                                            <div className="mt-2 flex items-center gap-1 text-xs text-yellow-400">
                                                <FaMedal /> {cert.badge}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-lg">
                                    <FaCertificate className="mx-auto text-4xl text-gray-600 mb-2" />
                                    <p className="text-gray-400">No certificates earned yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Edit Buttons */}
                
            </div>
        </div>
    );
}

// Reusable components
const ProfileField = ({ icon, label, value, editMode, name, onChange }) => (
    <div className="flex items-center gap-4">
        <span className="text-xl">{icon}</span>
        {editMode ? (
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                className="bg-gray-700 text-white px-3 py-2 rounded-md flex-1"
                placeholder={label}
            />
        ) : (
            <div className="flex-1">
                <p className="text-gray-400 text-sm">{label}</p>
                <p className="text-white">{value || "Not provided"}</p>
            </div>
        )}
    </div>
);

const StatCard = ({ icon, value, label }) => (
    <div className="bg-[#1e2130] p-4 rounded-lg border border-gray-700 hover:border-green-400 transition-all">
        <div className="flex items-center gap-3">
            {icon}
            <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-gray-400 text-sm">{label}</p>
            </div>
        </div>
    </div>
);

export default Profile;