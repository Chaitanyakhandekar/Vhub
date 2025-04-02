

import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [eventId, setEventId] = useState(localStorage.getItem("eventId") || null);
    const navigate = useNavigate();

// ✅ Fetch User Profile (Added New Code)
const fetchProfile = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        console.error("🚨 No token found! User not authenticated.");
        setUser(null);
        setLoading(false);
        return;
    }

    try {
        const res = await axios.get("http://127.0.0.1:8000/api/users/profile/", { // ✅ Using your existing URL
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        console.log("✅ Profile fetched successfully:", res.data);
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data)); // ✅ Store updated user
    } catch (error) {
        console.error("❌ Profile API Error:", error.response?.data || error);
        logout(); // ✅ Logout if token is invalid
    }
    setLoading(false);
};

// ✅ Load user from localStorage on app start & fetch profile
useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (accessToken && storedUser) {
        setUser(JSON.parse(storedUser));
    }

    fetchProfile(); // ✅ Fetch user profile when app starts
}, []);


    // ✅ Keep eventId updated when localStorage changes (No changes)
    useEffect(() => {
        const handleStorageChange = () => {
            setEventId(localStorage.getItem("eventId"));
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // ✅ Function to set Event ID (No changes)
    const updateEventId = (id) => {
        setEventId(id);
        localStorage.setItem("eventId", id);
    };
    useEffect(() => {
        if (user) {
            console.log("🔍 Debug: Logged-in user →", user);
            if (user.role === "Admin") {
                console.log("✅ Redirecting Admin to Dashboard");
                navigate("/admin-dashboard");
            }
        }
    }, [user]);
    
    // ✅ Login function (No changes, just added `fetchProfile()`)
    const login = async (email, password) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", { email, password }, {
                headers: { "Content-Type": "application/json" }
            });
    
            const userData = response.data.user;
            localStorage.setItem("accessToken", response.data.access);
            localStorage.setItem("refreshToken", response.data.refresh);
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("userRole", userData.role);  // ✅ Ensure role is stored
    
            setUser(userData);
            await fetchProfile(); // ✅ Fetch updated profile
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.error || "Login failed!" };
        }
    };
    

    // ✅ Logout function (No changes)
    const logout = () => {
        console.log("🔴 Logging out...");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("eventId");
        setUser(null);
        setEventId(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, eventId, updateEventId }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);
