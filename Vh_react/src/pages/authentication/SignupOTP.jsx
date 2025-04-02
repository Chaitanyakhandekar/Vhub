import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Volunteer");
    const [college, setCollege] = useState("");
    const [faculty, setFaculty] = useState("");
    const [year, setYear] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const navigate = useNavigate();

    function handleSignupChange(e) {
        const { name, value } = e.target;
        switch (name) {
            case "name": setName(value); break;
            case "email": setEmail(value); break;
            case "phone": setPhone(value); break;
            case "password": setPassword(value); break;
            case "college": setCollege(value); break;
            case "faculty": setFaculty(value); break;
            case "year": setYear(value); break;
            case "role": setRole(value); break;
            default: break;
        }
    }

    async function sendOtp() {
        try {
            console.log(email)
            setLoading(true)
            const response = await axios.post("http://127.0.0.1:8000/api/auth/send-signup-otp/", {
                email: email.trim()  // ✅ Ensure email is sent correctly
            }, {
                headers: { "Content-Type": "application/json" }
            });
    
            console.log("✅ OTP Sent:", response.data);
            alert("OTP sent successfully!");
            setLoading(false)
        } catch (error) {
            console.error("❌ OTP Error:", error.response?.data || error.message);
            alert(error.response?.data?.error || "Failed to send OTP.");
        }
    }

    async function verifyOtp() {
        if (!otp) {
            setErrorMessage("Please enter the OTP.");
            return;
        }
        setErrorMessage("");
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/auth/verify-signup-otp/", {
                email,
                otp,
                name,
                phone,
                password,
                role,
                college_name: college || "",
                faculty: faculty || "",
                year_of_study: year || null,
            });

            if (response.status === 201) {
                alert("Signup successful! Redirecting to login...");
                setIsOtpVerified(true);
                navigate("/login");
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.error || "OTP verification failed.");
        }
    }

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-[#1a202c]">
            <h1 className="text-4xl font-bold text-white mb-5">Create Account</h1>
            <div className="w-[35%] flex flex-col items-center text-white bg-[#2d3748] p-6 rounded-lg shadow-md">
                
                <input type="text" name="name" placeholder="Full Name" value={name}
                    className="w-full h-12 px-3 rounded-md bg-gray-700 text-lg focus:outline-none"
                    onChange={handleSignupChange} required />

                <input type="email" name="email" placeholder="Email" value={email}
                    autoComplete="email"
                    className="w-full h-12 px-3 rounded-md bg-gray-700 text-lg focus:outline-none mt-3"
                    onChange={handleSignupChange} required />

                {!isOtpSent ? (
                    <button className="bg-[#3182ce] font-bold text-lg px-5 py-2 rounded-md mt-4 w-full"
                        onClick={sendOtp}
                        disabled={loading}>{loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                ) : !isOtpVerified ? (
                    <>
                        <input type="text" name="otp" placeholder="Enter OTP" value={otp}
                            className="w-full h-12 px-3 rounded-md bg-gray-700 text-lg focus:outline-none mt-3"
                            onChange={(e) => setOtp(e.target.value)} required />
                        <button className="bg-[#22c55e] font-bold text-lg px-5 py-2 rounded-md mt-4 w-full"
                            onClick={verifyOtp}>Verify OTP</button>
                    </>
                ) : (
                    <>
                        <input type="text" name="phone" placeholder="Phone Number" value={phone}
                            className="w-full h-12 px-3 rounded-md bg-gray-700 text-lg focus:outline-none mt-3"
                            onChange={handleSignupChange} required />

                        <input type="password" name="password" placeholder="Password" value={password}
                            autoComplete="new-password"
                            className="w-full h-12 px-3 rounded-md bg-gray-700 text-lg focus:outline-none mt-3"
                            onChange={handleSignupChange} required />

                        <select name="role" value={role} onChange={handleSignupChange}
                            className="w-full h-12 px-3 rounded-md bg-gray-700 text-lg focus:outline-none mt-3">
                            <option value="Volunteer">Volunteer</option>
                            <option value="Event Organizer">Event Organizer</option>
                            <option value="Admin">Admin</option>
                            <option value="Coordinator">Coordinator</option>
                            <option value="Super Volunteer">Super Volunteer</option>
                        </select>

                        <input type="text" name="college" placeholder="College Name (Optional)" value={college}
                            className="w-full h-12 px-3 rounded-md bg-gray-700 text-lg focus:outline-none mt-3"
                            onChange={handleSignupChange} />

                        <input type="text" name="faculty" placeholder="Faculty (Optional)" value={faculty}
                            className="w-full h-12 px-3 rounded-md bg-gray-700 text-lg focus:outline-none mt-3"
                            onChange={handleSignupChange} />

                        <select name="year" value={year} onChange={handleSignupChange}
                            className="w-full h-12 px-3 rounded-md bg-gray-700 text-lg focus:outline-none mt-3">
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>

                        {errorMessage && <p className="text-red-500 text-center py-2">{errorMessage}</p>}

                        <button className="bg-[#22c55e] font-bold text-lg px-5 py-2 rounded-md mt-4 w-full"
                            disabled={loading}
                            onClick={verifyOtp}>
                            {loading ? "Creating Account..." : "Signup"}
                        </button>
                    </>
                )}

                <div className="mt-4">
                    <span className="text-white">Already have an account? </span>
                    <a href="/login" className="text-[#60a5fa]">Login</a>
                </div>
            </div>
        </div>
    );
}

export default Signup;
