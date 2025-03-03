import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

function Signup() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    function handleName(e) {
        setName(e.target.value);
    }

    function handlePhone(e) {
        setPhone(e.target.value);
    }

    function handleEmail(e) {
        setEmail(e.target.value);
    }

    function handlePassword(e) {
        let pass = e.target.value;
        setPassword(pass);
        
        if (pass.length < 8) {
            setPasswordError("Password must be at least 8 characters long");
        } else {
            setPasswordError(null);
        }
    }

    function handleConfirmPassword(e) {
        let confirmPass = e.target.value;
        setConfirmPassword(confirmPass);

        if (confirmPass !== password) {
            setConfirmPasswordError("Passwords do not match");
        } else {
            setConfirmPasswordError(null);
        }
    }

    return (
        <div className="w-full min-h-screen flex flex-col justify-center gap-6 items-center bg-[#1a202c] p-4">
            <h1 className="text-5xl font-bold text-white">Sign Up</h1>
            <div className="w-full max-w-md flex flex-col items-center justify-around text-white space-y-6 bg-[#2d3748] p-6 rounded-lg shadow-lg">
                <input type="text" placeholder="Name" value={name} 
                    className="w-full px-4 py-3 rounded-md bg-[#1a202c] text-xl focus:outline-none" 
                    onChange={handleName} />
                <input type="text" placeholder="Phone" value={phone} 
                    className="w-full px-4 py-3 rounded-md bg-[#1a202c] text-xl focus:outline-none" 
                    onChange={handlePhone} />
                <input type="email" placeholder="Email" value={email} 
                    className="w-full px-4 py-3 rounded-md bg-[#1a202c] text-xl focus:outline-none" 
                    onChange={handleEmail} />
                <input type="password" placeholder="Password" value={password} 
                    className="w-full px-4 py-3 rounded-md bg-[#1a202c] text-xl focus:outline-none" 
                    onChange={handlePassword} />
                {passwordError && <p className="text-red-500 text-center text-sm">{passwordError}</p>}
                <input type="password" placeholder="Confirm Password" value={confirmPassword} 
                    className="w-full px-4 py-3 rounded-md bg-[#1a202c] text-xl focus:outline-none" 
                    onChange={handleConfirmPassword} />
                {confirmPasswordError && <p className="text-red-500 text-center text-sm">{confirmPasswordError}</p>}
                <button className="bg-[#22c55e] font-bold text-xl px-4 py-3 rounded-md w-full hover:bg-[#1f9d4d] transition-all"
                    disabled={passwordError || confirmPasswordError}>Sign Up</button>
                <div className="w-full flex flex-col space-y-3">
                    <button className="flex items-center justify-center gap-3 bg-white text-black font-bold text-xl px-4 py-3 rounded-md w-full shadow-md hover:bg-gray-100 transition-all">
                        <FcGoogle size={24} /> Continue with Google
                    </button>
                    <button className="flex items-center justify-center gap-3 bg-gray-800 text-white font-bold text-xl px-4 py-3 rounded-md w-full shadow-md hover:bg-gray-700 transition-all">
                        <FaGithub size={24} /> Continue with GitHub
                    </button>
                </div>
                <div className="text-center"> 
                    <span className="text-white">Already have an account? </span>
                    <a href="/login" className="text-[#60a5fa] hover:underline">Login</a>
                </div>
            </div>
        </div>
    );
}

export default Signup;
