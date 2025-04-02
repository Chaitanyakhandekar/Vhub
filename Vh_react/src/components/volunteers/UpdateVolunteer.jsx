// import React, { useState } from "react";
// import volunteers from "../../functions/volunteers";
// import axios from "axios";

// function UpdateVolunteer() {
//     const [phoneNo, setPhoneNo] = useState("");
//     const [message, setMessage] = useState("");
//     const [found, setFound] = useState(false);

//     const [name, setName] = useState("");
//     const [phone, setPhone] = useState("");
//     const [address, setAddress] = useState("");
//     const [email, setEmail] = useState("");
//     const [status, setStatus] = useState(false);
//     const [skill, setSkill] = useState("");
//     const [availability, setAvailability] = useState(false);
//     const [age, setAge] = useState(100);
//     const [gender, setGender] = useState("");
//     const [imageUrl, setImageUrl] = useState("");

//     function handleSubmit() {
//         setMessage("");

//         axios.get(`http://127.0.0.1:8000/api/volunteers/get/by-phone/${phoneNo}/`)
//             .then((response) => response?setFound(true):setFound(false),setMessage("Volunteer not found!..."))  // ✅ Fix: Ensures `setFound(true)` executes after success
//             .catch(() => {
//                 setMessage("Volunteer Not Found!");
//                 setFound(false);
//             });
//     }

//     function handleUpdate() {
//         setMessage("");

//         let data = {
//             V_Name: name,
//             V_Email: email,
//             V_Phone_No: phone,
            
//             V_Address: address,
//             V_Status: Boolean(status),
//             V_Skills: skill,
//             V_Availability: Boolean(availability),
//             V_Gender: gender,
//             V_Age: age,
//             V_Image_Urls: imageUrl || "",
//         };

//         volunteers.updateVolunteer(phoneNo, {data})
//             .then(() => {
//                 setMessage("Updated Successfully");
//                 setFound(true);
//             })
//             .catch(() => {
//                 setMessage("Error while Updating Volunteer!...");
//                 setFound(false);
//             });
//     }

//     return (
//         <div className="h-[70%] relative  flex flex-col  items-center bg-gray-900">

//             {!found && 
//             <>
//             <h1 className="text-center text-5xl font-bold mt-10 text-white">Update Volunteer</h1>
//                 <div className="flex flex-col items-center justify-around h-[100%]  w-[30vw] ">
//                     <div className="flex flex-col items-center">
//                         <label htmlFor="" className="text-2xl py-10 text-white">
//                             Enter the phone number to Update Volunteer
//                         </label>
//                         <input 
//                             type="text" 
//                             className="text-xl font-bold" 
//                             placeholder="Phone Number" 
//                             value={phoneNo}
//                             onChange={(e) => setPhoneNo(e.target.value)} 
//                         />
//                     </div>
//                     <button 
//                         className="bg-orange-400 mt-3 text-white py-5 px-10 text-2xl font-bold rounded-xl"
//                         onClick={handleSubmit}
//                     >
//                         Done
//                     </button>

//                     <p className=" text-white text-xl font-bold text-red-700">{message && message}</p>
                    
//                 </div>
//                 </>
//             }

//             {found && (
//                 <div className="flex flex-col items-center w-full h-[90%] relative bg-gray-900">
//                     <h1 className="text-center text-5xl font-bold my-10 text-white">Update Volunteer</h1>

//                     <div className="flex flex-col justify-around items-center h-[60%] w-[30vw] mx-auto gap-3">
//                         <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
//                         <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
//                         <input type="text" placeholder="Phone Number" onChange={(e) => setPhone(e.target.value)} />
//                         <input type="text" placeholder="Address" onChange={(e) => setAddress(e.target.value)} />
//                         <input type="text" placeholder="Gender" onChange={(e) => setGender(e.target.value)} />
                        
//                         <div className="flex gap-4 items-center">
//                             <label className="text-xl font-bold text-white">Status</label>
//                             <select className="bg-gray-400 p-3 rounded-md" onChange={(e) => setStatus(e.target.value === "true")}>
//                                 <option value="false">Inactive</option>
//                                 <option value="true">Active</option>
//                             </select>
//                         </div>

//                         <input type="text" placeholder="Skills" onChange={(e) => setSkill(e.target.value)} />
//                         <input type="number" placeholder="Age" onChange={(e) => setAge(parseInt(e.target.value) || 0)} />
                        
//                         <div className="flex gap-4 items-center">
//                             <label className="text-xl font-bold text-white">Availability</label>
//                             <select className="bg-gray-400 p-3 rounded-md" onChange={(e) => setAvailability(e.target.value === "true")}>
//                                 <option value="false">Unavailable</option>
//                                 <option value="true">Available</option>
//                             </select>
//                         </div>

//                         <button className="px-[150px] py-5 rounded-xl text-white font-bold text-xl bg-orange-400"
//                             onClick={handleUpdate}>
//                             Update
//                         </button>
//                     </div>

//                     {message && <p className="text-center text-xl mt-4 absolute bottom-12 text-xl font-bold text-white">{message}</p>}
//                 </div>
//             )}
//         </div>
//     );
// }

// export default UpdateVolunteer;



import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

function UpdateVolunteer() {
    const [phoneNo, setPhoneNo] = useState("");
    const [message, setMessage] = useState("");
    const [found, setFound] = useState(false);
    const [volunteerData, setVolunteerData] = useState({
        V_Name: "",
        V_Email: "",
        V_Phone_No: "",
        V_Address: "",
        V_Status: false,
        V_Skills: "",
        V_Availability: false,
        V_Age: "",
        V_Gender: "",
        V_Image_Urls: ""
    });

    function handleSearch() {
        setMessage("");
        axios.get(`${API_BASE_URL}/volunteers/get/${phoneNo}/`)
            .then(response => {
                setVolunteerData(response.data);
                setFound(true);
            })
            .catch(() => {
                setMessage("Volunteer Not Found!");
                setFound(false);
            });
    }

    function handleUpdate() {
        setMessage("");
        axios.put(`${API_BASE_URL}/volunteers/update/${phoneNo}/`, volunteerData)
            .then(() => {
                setMessage("Volunteer Updated Successfully");
            })
            .catch(() => {
                setMessage("Error while Updating Volunteer!");
            });
    }

    return (
        <div className="h-[70%] relative flex flex-col items-center bg-gray-900">
            {!found && (
                <>
                    <h1 className="text-center text-5xl font-bold mt-10 text-white">Update Volunteer</h1>
                    <div className="flex flex-col items-center justify-around h-[100%] w-[30vw]">
                        <label className="text-2xl py-10 text-white">
                            Enter phone number to find volunteer
                        </label>
                        <input 
                            type="text" 
                            className="text-xl font-bold" 
                            placeholder="Phone Number" 
                            value={phoneNo}
                            onChange={(e) => setPhoneNo(e.target.value)}
                        />
                        <button className="bg-orange-400 mt-3 text-white py-5 px-10 text-2xl font-bold rounded-xl" onClick={handleSearch}>
                            Search
                        </button>
                        <p className="text-white text-xl font-bold text-red-700">{message}</p>
                    </div>
                </>
            )}

            {found && (
                <div className="flex flex-col items-center w-full h-[90%] relative bg-gray-900">
                    <h1 className="text-center text-5xl font-bold my-10 text-white">Update Volunteer</h1>
                    <div className="flex flex-col justify-around items-center h-[60%] w-[30vw] mx-auto gap-3">
                        {Object.keys(volunteerData).map((key) => (
                            <input 
                                key={key} 
                                type="text" 
                                placeholder={key.replace("V_", "")} 
                                value={volunteerData[key]}
                                onChange={(e) => setVolunteerData({ ...volunteerData, [key]: e.target.value })}
                            />
                        ))}
                        <button className="px-[150px] py-5 rounded-xl text-white font-bold text-xl bg-orange-400" onClick={handleUpdate}>
                            Update
                        </button>
                    </div>
                    <p className="text-center text-xl mt-4 absolute bottom-12 text-xl font-bold text-white">{message}</p>
                </div>
            )}
        </div>
    );
}

export default UpdateVolunteer;
