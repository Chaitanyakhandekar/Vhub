import React, { useState } from "react";
import axios from "axios";

const AssignRole = ({ userId, eventId, currentRole, onRoleUpdate }) => {
    const [role, setRole] = useState(currentRole);
    const [loading, setLoading] = useState(false);

    const handleRoleChange = async (newRole) => {
        if (!newRole || newRole === role) return; // ✅ Prevent duplicate requests

        try {
            setLoading(true);
            const token = localStorage.getItem("accessToken");

            const apiUrl = `http://127.0.0.1:8000/api/events/${eventId}/update-role/`; // ✅ Corrected endpoint

            const response = await axios.patch(
                apiUrl,
                { user_id: userId, role: newRole }, // ✅ Ensure correct payload
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                setRole(newRole); // ✅ Update role instantly in UI
                onRoleUpdate(userId, newRole); // ✅ Notify parent component to update UI
            }
        } catch (error) {
            console.error("❌ Error updating role:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };


return (
    <select
        value={role}
        onChange={(e) => handleRoleChange(e.target.value)}
        className="bg-gray-700 p-2 rounded text-white"
        disabled={loading}
    >
        <option value="Volunteer">Volunteer</option>
        <option value="Coordinator">Coordinator</option>
        <option value="Super Volunteer">Super Volunteer</option>
    </select>
);
};

export default AssignRole;
