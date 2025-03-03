import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
    const [userData, setUserData] = useState({ username: "", email: "", password: "", role: "volunteer" });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(userData);
            navigate("/login");
        } catch (error) {
            alert("Registration failed. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input className="p-2 rounded bg-gray-700 focus:outline-none" name="username" placeholder="Username" onChange={handleChange} required />
                    <input className="p-2 rounded bg-gray-700 focus:outline-none" name="email" type="email" placeholder="Email" onChange={handleChange} required />
                    <input className="p-2 rounded bg-gray-700 focus:outline-none" name="password" type="password" placeholder="Password" onChange={handleChange} required />
                    <select className="p-2 rounded bg-gray-700 focus:outline-none" name="role" onChange={handleChange}>
                        <option value="volunteer">Volunteer</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button className="p-2 rounded bg-green-500 hover:bg-green-600 text-white font-semibold" type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;