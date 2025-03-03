import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);

    if (!user) {
        return <div className="flex h-screen items-center justify-center text-white text-xl">
            Loading user info...
        </div>;
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center">
                <h1 className="text-2xl font-bold mb-4">Welcome, {user.username}!</h1>
                <p className="text-gray-300">Email: {user.email}</p>
                <p className="text-gray-300 mb-4">Role: {user.role}</p>
                <button 
                    onClick={logout} 
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-300"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
