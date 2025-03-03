import React,{useEffect,useState} from "react";
import axios from "axios";
import Event from "./Event";
import './event.css'


function ViewEvents() {


const [events, setEvents] = useState([]);
const [message,setMessage] = useState("")

useEffect(()=>{
    axios.get("http://127.0.0.1:8000/api/event/all/")
    .then(response => setEvents(response.data))
    .catch(error => setMessage("Error fetching events!..."));
},[])


    return (
        <div className=" h-[100%] w-full  relative flex flex-col items-center bg-gray-900 gap-3">
            <h1 className="text-center text-5xl font-bold mt-10 text-white mb-10">
                View All events
            </h1>

            
            <div className=" w-[70%] h-[78%] overflow-auto position-relative  ">

                {
                    !events && <p>Currently There is No events...</p>
                }

                {
                    events &&
                    <table className="w-full border-collapse border-2 border-gray-600 text-center">
                        <thead className="position-sticky top-0">
                            <tr className="text-white bg-gray-800">
                                <th className="p-2">Event Name</th>
                                <th className="p-2">Description</th>
                                <th>Location</th>
                                <th className="p-2">Start Date</th>
                                <th className="p-2">End Date</th>
                                <th className="p-2">Status</th>
                                <th>Delete</th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                events.map((event)=>(
                                    
                                        <Event id={event.E_ID} name={event.E_Name} description ={event.E_Description} startDate ={event.E_Start_Date} endDate={event.E_End_Date} location={event.E_Location}/>
                            
                                ))
                            }
                        </tbody>
                    </table>
                }

                

            </div>
            
        </div>
    );
}

export default ViewEvents;