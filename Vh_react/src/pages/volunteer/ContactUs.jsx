import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";


const ContactUs = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            axios.post("http://127.0.0.1:8000/contact-us/", {
                name: userName,
                email: userEmail,
                message: userMessage,
            })
            alert("Message sent successfully!");
        } catch (error) {
            alert("Failed to send message. Please try again.");
        }
    };
    

    return (
        <div className="flex min-h-screen bg-[#1a202c] text-white">
            
            <div className="flex-1 p-8 flex flex-col items-center">
                <h1 className="text-4xl font-bold text-green-400 mb-6">Contact Us</h1>

                <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
                    {/* Contact Information */}
                    <div className="bg-[#2d3748] p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-yellow-400">Get in Touch</h2>
                        <p className="text-gray-300 mt-2">Feel free to contact us for any inquiries or support.</p>
                        <div className="mt-4 space-y-3">
                            <p className="flex items-center"><FaEnvelope className="mr-3 text-blue-400" /> vcoders@vpascc.com</p>
                            <p className="flex items-center"><FaPhone className="mr-3 text-blue-400" /> +91 9876543210</p>
                            <p className="flex items-center"><FaMapMarkerAlt className="mr-3 text-blue-400" /> Vidya Pratishthan’s ACS College, Baramati</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-[#2d3748] p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-blue-400">Send a Message</h2>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                        {success && <p className="text-green-500 mt-2">{success}</p>}
                        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                            <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" />
                            <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" />
                            <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white h-24"></textarea>
                            <button type="submit" className="w-full flex items-center justify-center bg-green-500 hover:bg-green-700 p-3 rounded-lg font-bold">
                                <FaPaperPlane className="mr-2" /> Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;