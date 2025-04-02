// import React, { useState } from "react";
// import { v4 as uuidv4 } from "uuid"; 
// import axios from "axios";
// import './create.css';
// import volunteers from "../../functions/volunteers";



// function CreateVolunteer() {
//     const [name, setName] = useState("");
//     const [phone, setPhone] = useState("");
//     const [address, setAddress] = useState("");
//     const [email, setEmail] = useState("");
//     const [status, setStatus] = useState(false);
//     const [skill, setSkill] = useState("");
//     const [availability, setAvailability] = useState(false);
//     const [message, setMessage] = useState("");
//     const [age, setAge] = useState(""); // ✅ Add Age state
//     const [gender,setGender]= useState("");
//     const [imageUrl, setImageUrl] = useState("");



//     function handleSubmit(){
//         setMessage("");
//         let data = {
//             V_ID:uuidv4(),
//             V_Name: name,
//             V_Email:email,
//             V_Phone_No: phone,
//             V_Address: address,
//             V_Status: Boolean(status),
//             V_Skills: skill,
//             V_Availability: Boolean(availability),
//             V_Gender:gender,
//             V_Age: age, 
//             V_Image_Urls: imageUrl || "", 
//         };
        
    
//         console.log("Sending Data:", data); // ✅ Debugging Step
    
        
//         axios.post("http://127.0.0.1:8000/api/volunteers/", data, {         //!  Create Volunteer Function
//             headers: { "Content-Type": "application/json" }  
//         })
//         .then(response => console.log("Added to Database Successfully"),alert("Added to Database Successfully"),setName(""),setEmail(""),setPhone(""),setAddress(""),setStatus(""),setSkill(""),setAvailability(""),setGender(""),setAge(""),setMessage(""),setImageUrl(""))
//         .catch(error => {
//             console.error("Error:", error.response?.data || error.message);
//             console.log("Error adding volunteer: " + (error.response?.data || error.message));
//         });
//     }   
    

//     return (
//         <div className="flex flex-col  items-center    w-full h-[90%] relative 	bg-gray-900">
//             <h1 className="text-center text-5xl font-bold my-10 text-white  ">Create Volunteer</h1>

//             <div className="flex flex-col justify-around items-center h-[60%] w-[30vw] mx-auto gap-3 ">
//                 <input type="text"  placeholder="Name" onChange={(e) => setName(e.target.value)} />
//                 <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
//                 <input type="text" placeholder="Phone Number" onChange={(e) => setPhone(e.target.value)} />
//                 <input type="text" placeholder="Address" onChange={(e) => setAddress(e.target.value)} />
//                 <input type="text" placeholder="Gender" onChange={(e) => setGender(e.target.value)} />
//                 <div className="flex gap-4 items-center">
//                 <label className="text-xl font-bold text-white">Status</label>
//                 <select
//                 className="bg-gray-400 p-3 rounded-md   " 
//                 onChange={(e) => setStatus(e.target.value === "true")}>
//                     <option value="false">Inactive</option>
//                     <option value="true">Active</option>
//                 </select>
//                 </div>
//                 <input type="text" placeholder="Skills" onChange={(e) => setSkill(e.target.value)} />
//                 <input type="number" placeholder="Age" onChange={(e) => setAge(e.target.value)} />
//                 <div className="flex gap-4 items-center">
//                 <label className="text-xl font-bold text-white">Availability</label>
//                 <select 
//                 className="bg-gray-400 p-3 rounded-md " 
//                 onChange={(e) => setAvailability(e.target.value === "true")}>
//                     <option value="false">Unavailable</option>
//                     <option value="true">Available</option>
//                 </select>
//                 </div>

//                 <button className=" px-[150px] py-5 rounded-xl text-white font-bold text-xl"
//                     onClick={handleSubmit}
//                     disabled={!name || !phone || !address || !email || !status || !skill  || !age || !gender}
//                     >Submit</button>
//             </div>

            
//         </div>
//     );
// }

// export default CreateVolunteer;


import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import "./create.css";

const API_BASE_URL = "http://127.0.0.1:8000/api";

function CreateVolunteer() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(false);
    const [skill, setSkill] = useState("");
    const [availability, setAvailability] = useState(false);
    const [message, setMessage] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    function handleSubmit() {
        setMessage("");
        let data = {
            V_ID: uuidv4(),
            V_Name: name,
            V_Email: email,
            V_Phone_No: phone,
            V_Address: address,
            V_Status: Boolean(status),
            V_Skills: [skill],
            V_Availability: Boolean(availability),
            V_Gender: gender,
            V_Age: age,
            V_Image_Urls: imageUrl || "",
        };

        axios.post(`${API_BASE_URL}/volunteers/create/`, data, {
            headers: { "Content-Type": "application/json" },
        })
            .then(response => {
                alert("Volunteer Added Successfully");
                setName("");
                setEmail("");
                setPhone("");
                setAddress("");
                setStatus(false);
                setSkill("");
                setAvailability(false);
                setGender("");
                setAge("");
                setMessage("");
                setImageUrl("");
            })
            .catch(error => {
                console.error("Error:", error.response?.data || error.message);
                alert("Error adding volunteer: " + (error.response?.data || error.message));
            });
    }

    return (
        <div className="flex flex-col items-center w-full h-[90%] relative bg-gray-900">
            <h1 className="text-center text-5xl font-bold my-10 text-white">Create Volunteer</h1>
            <div className="flex flex-col justify-around items-center h-[60%] w-[30vw] mx-auto gap-3">
                <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <input type="text" placeholder="Phone Number" onChange={(e) => setPhone(e.target.value)} />
                <input type="text" placeholder="Address" onChange={(e) => setAddress(e.target.value)} />
                <input type="text" placeholder="Gender" onChange={(e) => setGender(e.target.value)} />
                <input type="text" placeholder="Skills" onChange={(e) => setSkill(e.target.value)} />
                <input type="number" placeholder="Age" onChange={(e) => setAge(e.target.value)} />
                <div className="flex gap-4 items-center">
                    <label className="text-xl font-bold text-white">Status</label>
                    <select className="bg-gray-400 p-3 rounded-md" onChange={(e) => setStatus(e.target.value === "true")}>
                        <option value="false">Inactive</option>
                        <option value="true">Active</option>
                    </select>
                </div>
                <div className="flex gap-4 items-center">
                    <label className="text-xl font-bold text-white">Availability</label>
                    <select className="bg-gray-400 p-3 rounded-md" onChange={(e) => setAvailability(e.target.value === "true")}>
                        <option value="false">Unavailable</option>
                        <option value="true">Available</option>
                    </select>
                </div>
                <button className="px-[150px] py-5 rounded-xl text-white font-bold text-xl" onClick={handleSubmit} disabled={!name || !phone || !address || !email || !status || !skill || !age || !gender}>Submit</button>
            </div>
        </div>
    );
}

export default CreateVolunteer;