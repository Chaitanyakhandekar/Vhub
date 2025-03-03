import React,{useEffect,useState} from "react";
import axios from "axios";
import Volunteer from "./Volunteer";
import './create.css'



function ViewAll() {


const [volunteers, setVolunteers] = useState([]);
const [message,setMessage] = useState("")
const [flag, setFlag] = useState(false);

useEffect(()=>{
    axios.get("http://127.0.0.1:8000/api/volunteers/")
    .then(response => setVolunteers(response.data))
    .catch(error => setMessage("Error fetching volunteers!..."));
},[])

useEffect(()=>{
    axios.get("http://127.0.0.1:8000/api/volunteers/")
    .then(response => setVolunteers(response.data))
    .catch(error => setMessage("Error fetching volunteers!..."));
},[flag])


    return (
        <div className=" h-[90%] w-full  relative flex flex-col items-center bg-gray-900 gap-3">
            <h1 className="text-center text-5xl font-bold mt-10 text-white mb-10">
                View All Volunteers
            </h1>

            
            <div className=" w-[70%] h-full overflow-auto">

                {
                    !volunteers && <p>Currently There is No Volunteers...</p>
                }

                {
                    volunteers &&
                    <table className="w-full border-collapse border-2 border-gray-600 text-center">
                        <thead>
                            <tr className="text-white bg-gray-800">
                                <th className="p-2">Name</th>
                                <th className="p-2">Phone No</th>
                                <th className="p-2">Gender</th>
                                <th className="p-2">Age</th>
                                <th className="p-2">Status</th>
                                <th className="p-2">Delete</th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                volunteers.map((volunteer)=>(
                                    
                                        <Volunteer id={volunteer.V_Phone_No} name={volunteer.V_Name} gender={volunteer.V_Gender} age={volunteer.V_Age} status={volunteer.V_Status} phone={volunteer.V_Phone_No} flag={flag} setFlag={setFlag}/>
                            
                                ))
                            }
                        </tbody>
                    </table>
                }

                

            </div>
            
        </div>
    );
}

export default ViewAll;