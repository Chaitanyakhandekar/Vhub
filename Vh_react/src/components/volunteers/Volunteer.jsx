// import React from "react";
// import volunteers from "../../functions/volunteers";

// function Volunteer({id,name,status,gender,age,phone,flag,setFlag}){

//     function deleteVolunteer1(){
//         console.log("Deleting",id);
//         volunteers.deleteVolunteer(phone)
//             .then(response=>setFlag(!flag))
//             .catch();
//     }
//     return(
//         <tr key={id} className="text-white bg-gray-700 items-center border border-b-gray-800">
//     <td className="p-3">{name}</td>
//     <td className="p-3">{phone}</td>
//     <td className="p-3">{gender}</td>
//     <td className="p-3">{age}</td>
//     <td className="p-3">{status ? "Active" : "Inactive"}</td>
//     <td><button className="bg-red-600 px-3 py-1 rounded-md" onClick={deleteVolunteer1}>Delete</button></td>
// </tr>

//     )
// }

// export default Volunteer;


import React from "react";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

function Volunteer({ id, name, status, gender, age, phone, flag, setFlag }) {
    function deleteVolunteer() {
        axios.delete(`${API_BASE_URL}/volunteers/delete/${id}/`)
            .then(() => setFlag(!flag))
            .catch(() => alert("Error deleting volunteer!"));
    }

    return (
        <tr key={id} className="text-white bg-gray-700 items-center border border-b-gray-800">
            <td className="p-3">{name}</td>
            <td className="p-3">{phone}</td>
            <td className="p-3">{gender}</td>
            <td className="p-3">{age}</td>
            <td className="p-3">{status ? "Active" : "Inactive"}</td>
            <td>
                <button className="bg-red-600 px-3 py-1 rounded-md" onClick={deleteVolunteer}>
                    Delete
                </button>
            </td>
        </tr>
    );
}

export default Volunteer;
