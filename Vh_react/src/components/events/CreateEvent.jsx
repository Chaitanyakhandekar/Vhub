import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid"; 
import axios from "axios";




function CreateEvent() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [location, setLocation] = useState("");
    const [message, setMessage] = useState("");
    // const [time,setTime] = useState("");
    // const [requiredVolunteers, setRequiredVolunteers] = useState("");
    // const [imageUrl, setImageUrl] = useState("");

    function clearAll(){
        setName("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        setLocation("");
    }

    function handleSubmit(){
        setMessage("");
        let formattedStartDate = startDate ? `${startDate}T00:00:00Z` : null;
        let formattedEndDate = endDate ? `${endDate}T00:00:00Z` : null;
    
        let data = {
            E_ID: uuidv4(),
            E_Name: name,
            E_Description: description,
            E_Start_Date: formattedStartDate,
            E_End_Date: formattedEndDate,
            E_Location: location,
            // T_ID: ,
            E_Volunteers: [],  // ✅ Empty list instead of null
            E_Tasks: [],
            E_Image_Urls: []
        };
        
        
    
        console.log("Sending Data:", data); // ✅ Debugging Step
    
        
        axios.post("http://127.0.0.1:8000/api/event/", data)            
        .then(response => {
            console.log("Added to Database Successfully");
            alert("Added to Database Successfully");
            clearAll();

        })
        .catch(error => {
            console.error("Error:", error.response?.data || error.message);
            alert("Error adding event: " + (error.response?.data || error.message));
        });
    
    }   
    

    return (
        <div className="flex flex-col  items-center  justify-center w-full h-[90%] relative 	bg-gray-900">
            <h1 className="text-center text-5xl font-bold my-10 text-white  ">Create Event</h1>

            <div className="flex flex-col justify-around items-center h-[60%] w-[30vw] mx-auto gap-3 ">
                <div className="flex items-center">
                    <input type="text" className="text-xl font-bold" value={name} placeholder="Name" onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="flex items-center">
                    <input type="text" className="text-xl font-bold" value={description} placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div className="flex items-center">
                    <input type="date" className="text-xl font-bold" value={startDate} placeholder="Start Date" onChange={(e) => setStartDate(e.target.value)} />
                </div>
                {/* <div className="flex items-center">
                    <input type="time" className="text-xl font-bold" value={time}  onChange={(e) => setTime(e.target.value)} />
                </div> */}

                <div className="flex items-center">
                    <input type="date" className="text-xl font-bold" value={endDate} placeholder="End Date" onChange={(e) => setEndDate(e.target.value)} />
                </div>

                <div className="flex items-center">
                  
                    <input type="text" className="text-xl font-bold" value={location} placeholder="Location" onChange={(e) => setLocation(e.target.value)} />
                </div>


                <button className="w-[40%] h-[12%] text-white font-bold text-xl rounded-md"
                onClick={handleSubmit}>Add Event</button>

            </div>

            
        </div>
    );
}

export default CreateEvent;