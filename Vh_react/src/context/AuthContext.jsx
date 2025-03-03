import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem("user")) || null;
    });

    const navigate = useNavigate();

    // ✅ Login Function
    const login = async (username, password) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/token/", { 
                username, 
                password 
            });

            const { access, refresh } = response.data;

            // ✅ Fetch user details after login
            const userResponse = await axios.get("http://127.0.0.1:8000/api/user/", {
                headers: { Authorization: `Bearer ${access}` }
            });

            setUser(userResponse.data);
            localStorage.setItem("user", JSON.stringify(userResponse.data));
            localStorage.setItem("token", access);
            localStorage.setItem("refresh", refresh);

            navigate("/dashboard");
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            throw error;
        }
    };

    // ✅ Register Function
    const register = async (userData) => {
        try {
            await axios.post("http://127.0.0.1:8000/api/register/", userData);
            alert("Registration successful! Please log in.");
            navigate("/login");
        } catch (error) {
            console.error("Registration failed:", error.response?.data || error.message);
            throw error;
        }
    };

    // ✅ Logout Function
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
