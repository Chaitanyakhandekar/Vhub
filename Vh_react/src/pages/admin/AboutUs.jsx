import React from "react";
import { FaUsers, FaUniversity, FaCode, FaGithub, FaLinkedin } from "react-icons/fa";

import teamLogo from "../../assets/Vcoders_logo.png";
import Sidebar from "./Sidebar";
import { TypeAnimation } from "react-type-animation";

const teamMembers = [
    {
        name: "Chaitanya",
        role: "Frontend & UI/UX Designer",
        expertise: [
            "React.js & Tailwind CSS",
            "Responsive & Mobile-First Web Design",
            "Figma/Adobe XD for Prototyping",
            "State Management (Redux/Zustand)"
        ],
        linkedin: "https://www.linkedin.com/in/chaitanya13114/",
        github: "https://github.com/chaitanyaKhandekar"
    },
    {
        name: "Manish",
        role: "Backend & Security Expert",
        expertise: [
            "Django (Python) for Backend Development",
            "Database Management (PostgreSQL/MySQL)",
            "Cybersecurity & Ethical Hacking (OWASP Top 10)",
            "API Development & Authentication (JWT, OAuth)"
        ],
        linkedin: "https://www.linkedin.com/in/manishdhaygude/",
        github: "https://github.com/manish01-hash/"
    },
    {
        name: "Uday",
        role: "Database & DevOps Engineer",
        expertise: [
            "Database Design & Optimization",
            "DevOps & CI/CD (Docker, Kubernetes)",
            "Cloud Deployment (AWS, Azure, Firebase)",
            "Backup & Disaster Recovery Strategies"
        ],
        linkedin: "https://www.linkedin.com/in/uday-suryavanshi-7971a8286/",
        github: "https://github.com/uday9067"
    },
    {
        name: "Atish",
        role: "API Integration Specialist",
        expertise: [
            "RESTful & GraphQL API Development",
            "Third-Party API Integrations",
            "Backend-Frontend API Communication",
            "API Security & Optimization"
        ],
        linkedin: "https://www.linkedin.com/in/atish-thorat-784232347/",
        github: "https://github.com/atisht080604"
    }
];

const AboutUs = () => {
    return (
        <div className="flex bg-[#1a202c] text-white w-full min-h-screen">
            <Sidebar />
            <div className="flex-1 p-8 flex flex-col items-center relative min-h-screen">
                <div className="text-center flex flex-col items-center">
                    <img loading="lazy" src={teamLogo} alt="Logo" className="w-40 mb-6 rounded-lg shadow-xl invert" />
                    <TypeAnimation
                        sequence={[
                            "Building innovative projects...",
                            1500,
                            "Solving real-world problems...",
                            1500,
                            "Participating in hackathons...",
                            1500
                        ]}
                        wrapper="p"
                        speed={75}
                        repeat={Infinity}
                        className="text-4xl mt-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
                    />
                </div>

                {/* Ensure Dynamic Height Adjustment */}
                <div className="mt-8 bg-[#2d3748] p-6 rounded-lg shadow-lg w-full">
                    <h2 className="text-2xl font-bold text-yellow-400 flex items-center">
                        <FaUniversity className="mr-3" /> Vidya Prathisthan's Arts Commerce Science College, Baramati
                    </h2>
                </div>

                <div className="mt-6 bg-[#2d3748] p-6 rounded-lg shadow-lg w-full flex-grow">
                    <h2 className="text-2xl font-bold text-blue-400 flex items-center">
                        <FaUsers className="mr-3" /> Meet Our Team
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="bg-[#1e293b] p-4 rounded-lg shadow-lg hover:scale-105 transition-transform">
                                <h3 className="text-xl font-bold text-green-300">{member.name}</h3>
                                <p className="text-gray-400">{member.role}</p>
                                <ul className="text-sm text-gray-300 mt-2 list-disc list-inside">
                                    {member.expertise.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                                <div className="flex gap-4 mt-3">
                                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-2xl hover:text-blue-400">
                                        <FaLinkedin />
                                    </a>
                                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 text-2xl hover:text-gray-300">
                                        <FaGithub />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 bg-[#2d3748] p-6 rounded-lg shadow-lg w-full">
                    <h2 className="text-2xl font-bold text-purple-400 flex items-center">
                        <FaCode className="mr-3" /> Featured Projects
                    </h2>
                    <ul className="list-disc list-inside text-lg text-gray-300 mt-3">
                        <li className="text-green-400 font-bold">QuickMentor</li>
                        <li className="text-blue-400 font-bold">VHub</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;