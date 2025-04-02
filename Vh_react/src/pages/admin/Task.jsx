import React,{useState,useEffect} from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

function Task({id,title,description,priority}){
    const [taskStatus,setTaskStatus] = useState("Not Started")

    useEffect(()=>{
        try {
            async function fetchEvents(){
                let token = localStorage.getItem("accessToken");
              const response = await axios.get(
                `http://127.0.0.1:8000/api/tasks/${id}/`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );
            //   setTaskStatus(response.data.status)
            console.log("status a = ",response.data.status)
            setTaskStatus(response.data.status)
        }
        fetchEvents()
        }
        catch(error){

        }
    },[])

   async function handleTaskStatus(id,e){
        let newStatus = taskStatus==='Completed'?"Not Started":"Completed"
        setTaskStatus(newStatus)

        try {
            let token = localStorage.getItem("accessToken");
            await axios.patch(
                `http://127.0.0.1:8000/api/tasks/${id}/update-status/`,
                { status: newStatus },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );
              console.log("DONE",id)

              token = localStorage.getItem("accessToken");
              const response = await axios.get(
                `http://127.0.0.1:8000/api/tasks/${id}/`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );
              console.log("Task = ",response.data)

            // setTasks(response.data);
            // setBackupTasks(response.data);
            // console.log("Tasks = = = ",tasks)
        } catch (error) {
            console.error("❌ Error fetching tasks:", error);
        }
    }
    return(
        <tr key={id} className="border-b border-gray-700">
                <td className="p-2">{title}</td>
                <td className="p-2">{description}</td>
                <td className="p-2">{priority}</td>
                <td className='px-5'><input type="checkbox"  checked={taskStatus==="Completed"} onChange={()=>handleTaskStatus(id)}/></td>
        </tr>
    )
}

export default Task;