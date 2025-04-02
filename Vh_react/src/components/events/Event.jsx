// import React from "react";

// function Event({ id, name, description, startDate, endDate, location }) {
//     let today = new Date();
//     today.setHours(0, 0, 0, 0);  // ✅ Set today's date to midnight

//     let eventEndDate = endDate ? new Date(endDate) : null;
//     if (eventEndDate) eventEndDate.setHours(0, 0, 0, 0); // ✅ Normalize endDate time

//     return (
//         <tr key={id} className="text-white bg-gray-700 items-center border border-b-gray-800" onClick={()=>console.log(id)}>
//             <td className="p-3">{name}</td>
//             <td className="p-3 ">{description}</td>
//             <td className="p-3">{location}</td>
//             <td className="p-3">{new Date(startDate).toLocaleDateString()}</td>
//             <td className="p-3">{new Date(endDate).toLocaleDateString()}</td>
//             <td className="p-3">
//                 {eventEndDate && eventEndDate < today ? "Completed" : "Ongoing"}
//             </td>
//             <td><button className="bg-red-600 px-3 py-1 rounded-md">Delete</button></td>
//         </tr>
//     );
// }

// export default Event;



import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

function Event({ id, name, description, startDate, endDate, location, refreshEvents }) {
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let eventEndDate = endDate ? new Date(endDate) : null;
    if (eventEndDate) eventEndDate.setHours(0, 0, 0, 0);

    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await axios.delete(`${API_BASE_URL}/events/delete/${id}/`);
            alert("Event deleted successfully!");
            refreshEvents();
        } catch (error) {
            alert("Error deleting event: " + (error.response?.data || error.message));
        }
        setLoading(false);
    };

    return (
        <tr key={id} className="text-white bg-gray-700 items-center border border-b-gray-800">
            <td className="p-3">{name}</td>
            <td className="p-3 ">{description}</td>
            <td className="p-3">{location}</td>
            <td className="p-3">{new Date(startDate).toLocaleDateString()}</td>
            <td className="p-3">{new Date(endDate).toLocaleDateString()}</td>
            <td className="p-3">
                {eventEndDate && eventEndDate < today ? "Completed" : "Ongoing"}
            </td>
            <td>
                <button
                    className="bg-red-600 px-3 py-1 rounded-md"
                    onClick={handleDelete}
                    disabled={loading}
                >
                    {loading ? "Deleting..." : "Delete"}
                </button>
            </td>
        </tr>
    );
}

export default Event;
