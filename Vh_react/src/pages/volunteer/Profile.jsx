import React, { useEffect, useState } from "react";
import { FaEnvelope, FaPhone, FaUniversity, FaUserGraduate, FaBriefcase, FaEdit } from "react-icons/fa";
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

    useEffect(() => {
        console.log("🔍 Debugging Profile:");
        console.log("Loading:", loading);
        console.log("User Data:", user);
    }, [loading, user]);

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
        setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value});
    };
    const handleChange1 = (e) => {
        setUpdatedUser({ ...updatedUser, college_name:e.target.value});
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
        <div className="flex justify-center items-center h-full w-full  bg-gradient-to-br from-[#1c202c] to-[#283046] p-6">
            <div className="bg-[#2a2d3e] text-white p-6 rounded-lg shadow-lg   w-full max-w-lg border border-gray-700 relative">
                <div className="text-center ">
                    <label htmlFor="profileImageUpload" className="cursor-pointer">
                        <img 
                            src={imagePreview || "/default-avatar.png"} 
                            alt="Profile"
                            className="w-32 h-32 rounded-full mx-auto border border-gray-500"
                        />
                    </label>
                    {editMode && (
                        <input type="file" id="profileImageUpload" accept="image/*" onChange={handleImageChange} className="hidden" />
                    )}
                    <h2 className="text-3xl font-bold text-green-400">{updatedUser.name}</h2>
                    <p className="text-gray-400 text-sm">{updatedUser.role}</p>
                </div>
                <div className="mt-6 space-y-4">
                    <div className="flex items-center space-x-3 text-gray-300">
                        <FaEnvelope className="text-yellow-400" />
                        {editMode ? (
                            <input type="email" placeholder="Email" name="email" value={updatedUser.email} onChange={handleChange} className="bg-gray-700 text-white px-3 py-1 rounded-md w-full" />
                        ) : (
                            <p>Email: {updatedUser.email}</p>
                        )}
                    </div>
                    <div className="flex items-center space-x-3 text-gray-300">
                        <FaPhone className="text-blue-400" />
                        {editMode ? (
                            <input type="text" placeholder="Phone" name="phone" value={updatedUser.phone} onChange={handleChange} className="bg-gray-700 text-white px-3 py-1 rounded-md w-full" />
                        ) : (
                            <p>Phone: {updatedUser.phone || "Not Provided"}</p>
                        )}
                    </div>

                    <div className="flex items-center space-x-3 text-gray-300">
                        <FaUniversity className="text-green-400" />
                        {editMode ? (
                            <input type="text" placeholder="College" name="faculty" value={updatedUser.college_name} onChange={handleChange1} className="bg-gray-700 text-white px-3 py-1 rounded-md w-full" />
                        ) : (
                            <p>College: {updatedUser.college_name}</p>
                        )}
                        
                    </div>
                    <div className="flex items-center space-x-3 text-gray-300">
                        <FaBriefcase className="text-purple-400" />
                        {editMode ? (
                            <input type="text" placeholder="Faculty" name="faculty" value={updatedUser.faculty} onChange={handleChange} className="bg-gray-700 text-white px-3 py-1 rounded-md w-full" />
                        ) : (
                            <p>Faculty: {updatedUser.faculty}</p>
                        )}
                    </div>
                    <div className="flex items-center space-x-3 text-gray-300">
                        <FaUserGraduate className="text-orange-400" />
                        {editMode ? (
                            <input type="number" placeholder="Year of Study" name="year_of_study" value={updatedUser.year_of_study} onChange={handleChange} className="bg-gray-700 text-white px-3 py-1 rounded-md w-full" />
                        ) : (
                            <p>Current Year: {yearOfStudyText(updatedUser.year_of_study)}</p>
                        )}
                    </div>
                </div>
                <button onClick={toggleEdit} className="mt-6 w-full bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center space-x-2">
                    <span>{editMode ? "Cancel" : "Edit Profile"}</span>
                </button>
                {editMode && (
                    <button onClick={saveProfile} className="mt-4 w-full bg-green-500 hover:bg-green-700 text-white py-2 rounded-lg transition-all">
                        Save Changes
                    </button>
                )}
            </div>
        </div>
    );
}

export default Profile;