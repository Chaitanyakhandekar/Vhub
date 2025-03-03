import React, { useContext } from "react";
import { FaClipboardList, FaEnvelope, FaHome, FaInfoCircle, FaSignInAlt, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Home() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();


    if (!user) {
        return <div className="flex h-screen items-center justify-center text-white text-xl">
            Loading user info...
        </div>;
    }
    return (
        <div className="w-full min-h-screen flex bg-[#1a202c] text-white">
            {/* Sidebar */}
            <div className="w-1/4 min-h-screen bg-[#2d3748] flex flex-col justify-between p-6 shadow-lg">
                <div className="flex items-center space-x-3 text-2xl font-bold">
                    <FaHome size={24} />
                    <span>Home</span>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[100%] text-center">
                <h1 className="text-2xl font-bold mb-4">Hello, <span className="text-green-400">{user.username}!</span> <br /><span className="">Welcome To Vhub Community</span></h1>
                {/* <p className="text-gray-300">Email: {user.email}</p>
                <p className="text-gray-300 mb-4">Role: {user.role}</p> */}
            
            </div>


                <h1 className="text-3xl font-bold text-center mt-20">Volunteer Management System</h1>
                <button className="bg-[#22c55e] text-white font-bold text-xl px-6 py-3 rounded-md w-full hover:bg-[#1f9d4d] transition-all">
                    Apply Now
                </button>
            </div>

            {/* Main Content */}
            <div className="w-3/4 flex flex-col">
                {/* Navbar */}
                <nav className="w-full bg-[#1a202c] p-4 flex justify-between items-center shadow-md px-10">
                    <div className="text-xl font-bold">VMS</div>
                    <div className="flex space-x-6">
                        <span className="text-lg flex items-center space-x-2 hover:text-[#60a5fa] transition-all cursor-pointer">
                            <FaInfoCircle /> <span>About Us</span>
                        </span>
                        <span className="text-lg flex items-center space-x-2 hover:text-[#60a5fa] transition-all cursor-pointer">
                            <FaEnvelope /> <span>Contact</span>
                        </span>
                        <span className="text-lg flex items-center space-x-2 bg-[#22c55e] px-4 py-2 rounded-md hover:bg-[#1f9d4d] transition-all cursor-pointer  bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-300">
                            <FaSignInAlt /> <span onClick={()=>navigate('/login')}>Logout</span>
                        </span>
                    </div>
                </nav>
                
                {/* Middle Bar */}
                <div className="w-full bg-[#2d3748] p-6 flex justify-around items-center shadow-md ">
                    <div className="flex items-center space-x-3">
                        <FaClipboardList size={30} />
                        <span className="text-lg font-semibold">Manage Volunteers</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <FaUsers size={30} />
                        <span className="text-lg font-semibold">Community Engagement</span>
                    </div>
                </div>

                {/* Content Section with Image and Features */}
                <div className="flex-grow flex flex-col items-center justify-center p-6">
                    <img src="https://img.freepik.com/free-vector/people-volunteering-donating-money_53876-66112.jpg?semt=ais_hybrid" alt="Volunteering" className="max-w-full h-auto rounded-lg shadow-lg mb-6" />
                    <div className="text-center max-w-2xl">
                        <h2 className="text-4xl font-bold">Join Our Volunteer Community</h2>
                        <p className="text-lg mt-4">Be part of something meaningful. Register, manage events, and contribute to a better world!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
