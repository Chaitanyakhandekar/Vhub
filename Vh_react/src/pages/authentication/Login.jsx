import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Volunteer");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    const isMounted = useRef(false);

    async function handleLogin(e) {
        e.preventDefault();
        if (!email || !password) {
            setErrorMessage("All fields are required.");
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
                email,
                password,
            }, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.status === 200) {
                const backendRole = response.data.role;

                if (role !== backendRole) {
                    Swal.fire({
                        icon: "error",
                        title: "Role Mismatch",
                        text: `Your actual role is '${backendRole}', but you selected '${role}'.`,
                    });
                    setLoading(false);
                    return;
                }

                localStorage.setItem("accessToken", response.data.access);
                localStorage.setItem("refreshToken", response.data.refresh);
                localStorage.setItem("userRole", backendRole);

                const redirectPath = role === "Admin" ? "/admin-dashboard" : "/home";

                Swal.fire({
                    icon: "success",
                    title: "Login Successful!",
                    text: "Redirecting to your dashboard...",
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    navigate(redirectPath, { replace: true });
                });
            } else {
                setErrorMessage("Invalid credentials! Please try again.");
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.error || "Invalid credentials! Please try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (isMounted.current) return;

        const userRole = localStorage.getItem("userRole");
        if (userRole && window.location.pathname === "/") {
            navigate("/home", { replace: true });
        }
        isMounted.current = true;
    }, [navigate]);

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-[#1a202c]">
            <h1 className="text-6xl font-extrabold text-white mb-6 animate-pulse">Login</h1>
            <div className="w-[30%] flex flex-col items-center justify-around text-white bg-[#2d3748] p-8 rounded-2xl shadow-2xl border border-gray-600">
                <form className="w-full flex flex-col" onSubmit={handleLogin}>
                    <label htmlFor="email" className="text-lg mb-1">Email:</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email"
                        placeholder="Enter your email" 
                        value={email}
                        className="w-full h-12 px-4 rounded-md bg-gray-800 text-lg focus:outline-none border border-gray-600"
                        onChange={(e) => setEmail(e.target.value.trim())} 
                        required 
                    />

                    <label htmlFor="password" className="text-lg mt-3 mb-1">Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password"
                        placeholder="Enter your password" 
                        value={password}
                        className="w-full h-12 px-4 rounded-md bg-gray-800 text-lg focus:outline-none border border-gray-600"
                        onChange={(e) => setPassword(e.target.value.trim())} 
                        required 
                    />

                    <label htmlFor="role" className="text-lg mt-3 mb-1">Select Role:</label>
                    <select 
                        id="role" 
                        name="role"
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full h-12 px-4 rounded-md bg-gray-800 text-lg focus:outline-none border border-gray-600"
                        required
                    >
                        <option value="Volunteer">Volunteer</option>
                        <option value="Event Organizer">Event Organizer</option>
                        <option value="Admin">Admin</option>
                        <option value="Coordinator">Coordinator</option>
                        <option value="Super Volunteer">Super Volunteer</option>
                    </select>

                    {errorMessage && <p className="text-red-400 text-center py-2">{errorMessage}</p>}

                    <button 
                        type="submit"
                        className="bg-[#22c55e] font-bold text-lg px-6 py-2 rounded-md mt-4 w-full hover:bg-green-600 transition-all duration-300"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="mt-4">
                    <span className="text-white">Don't have an account? </span>
                    <a href="/signup" className="text-[#60a5fa] font-semibold hover:underline">Create account</a>
                </div>
            </div>
        </div>
    );
}

export default Login;
