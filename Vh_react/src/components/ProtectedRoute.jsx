import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem("accessToken");
    const userRole = localStorage.getItem("userRole") || "Volunteer"; // Default to Volunteer

    // Redirect to login if no token is found
    if (!token) {
        console.log("🔴 No token found! Redirecting to login...");
        return <Navigate to="/login" replace />;
    }

    // Redirect if user's role is not allowed
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        console.log(`🔴 Role '${userRole}' not allowed! Redirecting to /unauthorized`);
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
