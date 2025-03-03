import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/home/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
    return (
        <Router>  {/* ✅ Router should be the outermost component */}
            <AuthProvider>  
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/admindashboard" element={<AdminDashboard />} />
                    <Route path="/home" element={<Home />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
