import React from "react";

function Event({ id, name, description, startDate, endDate, location }) {
    let today = new Date();
    today.setHours(0, 0, 0, 0);  // ✅ Set today's date to midnight

    let eventEndDate = endDate ? new Date(endDate) : null;
    if (eventEndDate) eventEndDate.setHours(0, 0, 0, 0); // ✅ Normalize endDate time

    return (
        <tr key={id} className="text-white bg-gray-700 items-center border border-b-gray-800" onClick={()=>console.log(id)}>
            <td className="p-3">{name}</td>
            <td className="p-3 ">{description}</td>
            <td className="p-3">{location}</td>
            <td className="p-3">{new Date(startDate).toLocaleDateString()}</td>
            <td className="p-3">{new Date(endDate).toLocaleDateString()}</td>
            <td className="p-3">
                {eventEndDate && eventEndDate < today ? "Completed" : "Ongoing"}
            </td>
            <td><button className="bg-red-600 px-3 py-1 rounded-md">Delete</button></td>
        </tr>
    );
}

export default Event;
