import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { isValidPhoneNumber } from "libphonenumber-js"; // Library for phone number validation
import countries from "./countries.json"; // Import the updated countries.json file

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [countryCode, setCountryCode] = useState("+91"); // Default to India
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("Volunteer");
    const [gender, setGender] = useState(""); // Gender state
    const [college, setCollege] = useState("");
    const [faculty, setFaculty] = useState("");
    const [year, setYear] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to check if user is logged in
    const navigate = useNavigate();

    // Check if the user is already logged in
    useEffect(() => {
        const token = localStorage.getItem("token"); // Check for a token in local storage
        if (token) {
            setIsLoggedIn(true); // Set isLoggedIn to true if token exists
        }
    }, []);

    // Validate email
    function validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    // Validate password
    function validatePassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    // Validate phone number (accepts both with and without country code)
    function validatePhone(phone, countryCode) {
        // Remove any leading '+' from the phone number
        const cleanedPhone = phone.replace(/^\+/, "");
        // Remove any leading '+' from the country code
        const cleanedCountryCode = countryCode.replace(/^\+/, "");

        // Check if the phone number starts with the country code
        if (cleanedPhone.startsWith(cleanedCountryCode)) {
            // If it starts with the country code, validate the full number
            return isValidPhoneNumber(`+${cleanedPhone}`, countryCode);
        } else {
            // If it doesn't start with the country code, prepend the country code and validate
            return isValidPhoneNumber(`+${cleanedCountryCode}${cleanedPhone}`, countryCode);
        }
    }

    // Handle input changes
    function handleSignupChange(e) {
        const { name, value } = e.target;

        switch (name) {
            case "name":
                setName(value);
                break;
            case "email":
                setEmail(value);
                setEmailError(validateEmail(value) ? "" : "Invalid email format");
                break;
            case "phone":
                setPhone(value);
                setPhoneError(validatePhone(value, countryCode) ? "" : "Invalid phone number");
                break;
            case "countryCode":
                setCountryCode(value);
                setPhoneError(validatePhone(phone, value) ? "" : "Invalid phone number");
                break;
            case "password":
                setPassword(value);
                setPasswordError(validatePassword(value)
                    ? ""
                    : "Password must have 8+ characters, 1 uppercase, 1 lowercase, 1 number & 1 special character."
                );
                setConfirmPasswordError(confirmPassword && value !== confirmPassword ? "Passwords do not match" : "");
                break;
            case "confirmPassword":
                setConfirmPassword(value);
                setConfirmPasswordError(value !== password ? "Passwords do not match" : "");
                break;
            case "gender":
                setGender(value);
                break;
            case "college":
                setCollege(value);
                break;
            case "faculty":
                setFaculty(value);
                break;
            case "year":
                setYear(value);
                break;
            case "role":
                setRole(value);
                break;
            default:
                break;
        }
    }

    // Handle signup
    async function handleSignup() {
        if (!name || !email || !phone || !password || !confirmPassword || !gender || !role) {
            setErrorMessage("All fields are required.");
            return;
        }
        if (!validateEmail(email)) {
            setErrorMessage("Invalid email format.");
            return;
        }
        if (!validatePhone(phone, countryCode)) {
            setErrorMessage("Invalid phone number.");
            return;
        }
        if (!validatePassword(password)) {
            setErrorMessage("Password must have at least 1 uppercase, 1 lowercase, 1 number, 1 special character, and be at least 8 characters long.");
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            // Format the phone number correctly before sending it to the backend
            const formattedPhone = phone.startsWith("+") ? phone : `${countryCode}${phone}`;

            await axios.post("http://127.0.0.1:8000/api/auth/signup/", {
                name,
                email,
                phone: formattedPhone, // Use the formatted phone number
                password,
                role,
                gender,
                college_name: college || "",
                faculty: faculty || "",
                year_of_study: year || null,
            }, {
                headers: { "Content-Type": "application/json" }
            });

            Swal.fire({
                icon: "success",
                title: "Signup Successful!",
                text: "Redirecting to login...",
                showConfirmButton: false,
                timer: 2000
            });

            setTimeout(() => navigate("/login"), 2000);

        } catch (error) {
            console.log("❌ Signup Error:", error.response?.data);

            if (error.response?.data?.email) {
                setErrorMessage("❌ Email is already registered! Try a different one.");
            } else {
                setErrorMessage(error.response?.data?.error || "Signup failed! Try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-[#1a202c]">
            <h1 className="text-4xl font-bold text-white mb-8">Create Account</h1>
            <div className="w-[35%] flex flex-col items-center text-white bg-[#2d3748] p-8 rounded-lg shadow-md space-y-6">

                {/* If user is already logged in, show a message and redirect option */}
                {isLoggedIn ? (
                    <div className="text-center">
                        <p className="text-lg mb-4">You are already logged in.</p>
                        <button
                            className="bg-[#22c55e] font-bold text-lg px-5 py-2 rounded-md hover:bg-[#1ea94d] transition-colors"
                            onClick={() => navigate("/dashboard")} // Redirect to dashboard or any other page
                        >
                            Go to Dashboard
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Personal Information */}
                        <div className="w-full space-y-4">
                            <input type="text" name="name" placeholder="Full Name" value={name}
                                className="w-full h-12 px-4 rounded-md bg-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                                onChange={handleSignupChange} />

                            <input type="email" name="email" placeholder="Email" value={email}
                                className="w-full h-12 px-4 rounded-md bg-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                                onChange={handleSignupChange} />
                            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}

                            <div className="flex gap-2">
                                <select name="countryCode" value={countryCode} onChange={handleSignupChange}
                                    className="w-1/4 h-12 px-4 rounded-md bg-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e]">
                                    {countries.map((country) => (
                                        <option key={country.code} value={country.dial_code}>
                                            {country.name} ({country.dial_code})
                                        </option>
                                    ))}
                                </select>
                                <input type="text" name="phone" placeholder="Phone Number" value={phone}
                                    className="w-3/4 h-12 px-4 rounded-md bg-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                                    onChange={handleSignupChange} />
                            </div>
                            {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}

                            <input type="password" name="password" placeholder="Password" value={password}
                                className="w-full h-12 px-4 rounded-md bg-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                                onChange={handleSignupChange} />
                            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}

                            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={confirmPassword}
                                className="w-full h-12 px-4 rounded-md bg-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                                onChange={handleSignupChange} />
                            {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}

                            {/* Gender Selection */}
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setGender("Male")}
                                    className={`flex-1 h-12 px-4 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e] ${gender === "Male" ? "bg-[#22c55e]" : "bg-gray-700"
                                        }`}
                                >
                                    Male
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setGender("Female")}
                                    className={`flex-1 h-12 px-4 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e] ${gender === "Female" ? "bg-[#22c55e]" : "bg-gray-700"
                                        }`}
                                >
                                    Female
                                </button>
                            </div>
                        </div>

                        {/* College Information */}
                        <div className="w-full space-y-4">
                            <input type="text" name="college" placeholder="College Name (Optional)" value={college}
                                className="w-full h-12 px-4 rounded-md bg-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                                onChange={handleSignupChange} />

                            <input type="text" name="faculty" placeholder="Faculty (Optional)" value={faculty}
                                className="w-full h-12 px-4 rounded-md bg-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                                onChange={handleSignupChange} />

                            <input type="text" name="year" placeholder="Year of Study (Optional)" value={year}
                                className="w-full h-12 px-4 rounded-md bg-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                                onChange={handleSignupChange} />
                        </div>

                        {/* Role Selection */}
                        <select name="role" value={role} onChange={handleSignupChange}
                            className="w-full h-12 px-4 rounded-md bg-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e]">
                            <option value="Volunteer">Volunteer</option>
                            <option value="Event Organizer">Event Organizer</option>
                            <option value="Admin">Admin</option>
                        </select>

                        {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}

                        <button className="bg-[#22c55e] font-bold text-lg px-5 py-2 rounded-md w-full hover:bg-[#1ea94d] transition-colors"
                            disabled={loading}
                            onClick={handleSignup}>
                            {loading ? "Creating Account..." : "Signup"}
                        </button>

                        {/* Link to login page for users who already have an account */}
                        <p className="text-center">
                            Already have an account?{" "}
                            <span
                                className="text-[#3b82f6] cursor-pointer hover:underline" // Changed color to blue
                                onClick={() => navigate("/login")}
                            >
                                Login here
                            </span>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default Signup;