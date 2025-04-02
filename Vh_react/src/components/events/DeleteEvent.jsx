// import React, { useState } from "react";
// import axios from "axios";

// function DeleteEvent() {
//     const [eid, setEid] = useState("");
//     const [message, setMessage] = useState("");

//     function handleSubmit() {
//         setMessage("");

//         console.log("Sending Event ID:", eid); // ✅ Debugging Step

//         axios.delete(`http://127.0.0.1:8000/api/event/delete/by-id/${eid}/`)
//             .then(response => setMessage("Event Deleted Successfully"))
//             .catch(error => setMessage("Event Not Found!"));
//     }

//     return (
//         <div className="h-[60%] relative flex flex-col items-center bg-gray-900">
//             <h1 className="text-center text-5xl font-bold mt-10 text-white">Delete Event</h1>

//             <div className="flex flex-col items-center h-full w-[30vw] mx-auto my-[100px]">
//                 <div className="flex flex-col items-center">
//                     <label htmlFor="eventId" className="text-2xl py-10 text-white">
//                         Enter the Event ID to delete the event
//                     </label>
//                     <input
//                         type="text"
//                         id="eventId"
//                         className="text-xl font-bold px-2 py-2 rounded-lg"
//                         placeholder="Event ID"
//                         onChange={(e) => setEid(e.target.value)}
//                         value={eid}
//                     />
//                 </div>

//                 <button
//                     className="bg-red-400 mt-10 text-white py-5 px-10 text-2xl font-bold rounded-xl"
//                     onClick={handleSubmit}
//                 >
//                     Delete
//                 </button>
//             </div>

//             {message && <p className="text-center text-xl mt-4 absolute bottom-5 font-bold text-red-800">{message}</p>}
//         </div>
//     );
// }

// export default DeleteEvent;


import React, { useState } from "react";
import axios from "axios";

function DeleteEvent() {
    const [eid, setEid] = useState("");
    const [message, setMessage] = useState("");

    function handleSubmit() {
        setMessage("");
        axios.delete(`http://127.0.0.1:8000/api/events/delete/${eid}/`)
            .then(response => setMessage("Event Deleted Successfully"))
            .catch(error => setMessage("Event Not Found!"));
    }

    return (
        <div className="h-[60%] relative flex flex-col items-center bg-gray-900">
            <h1 className="text-center text-5xl font-bold mt-10 text-white">Delete Event</h1>
            <div className="flex flex-col items-center h-full w-[30vw] mx-auto my-[100px]">
                <label htmlFor="eventId" className="text-2xl py-10 text-white">
                    Enter the Event ID to delete the event
                </label>
                <input
                    type="text"
                    id="eventId"
                    className="text-xl font-bold px-2 py-2 rounded-lg"
                    placeholder="Event ID"
                    onChange={(e) => setEid(e.target.value)}
                    value={eid}
                />
                <button
                    className="bg-red-400 mt-10 text-white py-5 px-10 text-2xl font-bold rounded-xl"
                    onClick={handleSubmit}
                >
                    Delete
                </button>
            </div>
            {message && <p className="text-center text-xl mt-4 absolute bottom-5 font-bold text-red-800">{message}</p>}
        </div>
    );
}

export default DeleteEvent;
