import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleEmail(e) {
        setEmail(e.target.value.trim());
    }

    function handlePassword(e) {
        let pass = e.target.value.trim();
        setPassword(pass);
        setPasswordError(pass.length < 8 ? "Password must be at least 8 characters long" : "");
    }

    async function handleLogin() {
        if (!email || !password) {
            setErrorMessage("All fields are required.");
            return;
        }

        setLoading(true);
        setErrorMessage(""); // Clear previous errors

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
                email,
                password
            }, {
                headers: { "Content-Type": "application/json" }
            });

            localStorage.setItem("accessToken", response.data.access);
            localStorage.setItem("refreshToken", response.data.refresh);
            localStorage.setItem("userRole", response.data.role); // Store role for redirection

            // Redirect based on role
            if (response.data.role === "Admin") {
                navigate("/admin-dashboard");
            } else {
                navigate("/volunteer-dashboard");
            }
        } catch (error) {
            console.log(error.response); // Debugging
            setErrorMessage(error.response?.data?.error || "Invalid credentials! Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-[#1a202c]">
            <h1 className="text-5xl font-bold text-white mb-5">Login</h1>
            <div className="w-[30%] flex flex-col items-center justify-around text-white bg-[#2d3748] p-6 rounded-lg shadow-md">
                <input type="email" placeholder="Email" value={email}
                    className="w-full h-12 px-3 rounded-md bg-gray-700 text-lg focus:outline-none"
                    onChange={handleEmail} />
                <input type="password" placeholder="Password" value={password}
                    className="w-full h-12 px-3 rounded-md bg-gray-700 text-lg focus:outline-none mt-3"
                    onChange={handlePassword} />
                {passwordError && <p className="text-red-500 text-center py-2">{passwordError}</p>}
                {errorMessage && <p className="text-red-500 text-center py-2">{errorMessage}</p>}

                <button className="bg-[#22c55e] font-bold text-lg px-5 py-2 rounded-md mt-4 w-full"
                    disabled={passwordError || loading}
                    onClick={handleLogin}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                <div className="mt-4">
                    <span className="text-white">Don't have an account? </span>
                    <a href="/signup" className="text-[#60a5fa]">Create account</a>
                </div>
            </div>
        </div>
    );
}

export default Login;
