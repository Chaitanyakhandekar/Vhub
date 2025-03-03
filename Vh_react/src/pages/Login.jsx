import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate("/Home");
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            alert("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <form 
                onSubmit={handleLogin} 
                className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 text-center"
            >
                <h2 className="text-white text-2xl mb-6">Login</h2>
                <input 
                    type="text" 
                    placeholder="Username" 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                    className="w-full p-3 mb-4 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="w-full p-3 mb-6 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button 
                    type="submit" 
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;