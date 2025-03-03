import { useEffect, useState } from 'react';
import '../App.css';
import CreateVolunteer from '../components/volunteers/CreateVolunteer';
import DeleteVolunteer from '../components/volunteers/DeleteVolunteer';
import UpdateVolunteer from '../components/volunteers/UpdateVolunteer';
import CreateEvent from '../components/events/CreateEvent';
import ViewEvents from '../components/events/ViewEvents';
import ViewAll from '../components/volunteers/ViewAll';


function AdminDashboard() {
  const [add, setAdd] = useState(true);
  const [delete1, setDelete] = useState(null);
  const [all, setAll] = useState(null);
  const [update, setUpdate] = useState(null);
  const[volunteer,setVolunteer]=useState(true);
  const[events,setEvents] = useState(false);
  
 function handleAdd(){
   setAdd(true);
   setDelete(false);
   setAll(false);
   setUpdate(false);
 }
 function handleDelete(){
   setDelete(true);
   setAdd(false);
   setAll(false);
   setUpdate(false);
 }

 function handleAll(){
  setAll(true);
  setAdd(false);
  setDelete(false);
  setUpdate(false);
}

function handleUpdate(){
  setUpdate(true);
  setAdd(false);
  setDelete(false);
  setAll(false);
}
function handleVolunteer(){
  setVolunteer(true)
  setEvents(false)
}
 
function handleEvents(){
  setEvents(true)
  setVolunteer(false)
}

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col 	bg-gray-900">
      <div className=" navbar w-full h-[20%]  flex flex-col justify-around gap-4 items-center bg-gray-700">
          <div className={`w-full h-[50%]  flex  justify-center gap-4 items-center bg-gray-700`}>
          <button className={`w-[10%] bg-green-500 h-[80%] rounded-md text-xl font-bold ${add ? "border-2 border-white" : "bg-green-500"}`}
          onClick={handleAdd}>Add</button>
          {/* <button className="w-[10%] bg-red-400 h-[80%] rounded-md text-xl font-bold"
          onClick={handleDelete}>Delete</button> */}
          
          {/* <button className="w-[10%] bg-orange-400 h-[80%] rounded-md text-xl font-bold"
          onClick={handleUpdate}>Update</button> */}
          <button className={`w-[10%] bg-blue-400 h-[80%] rounded-md text-xl font-bold ${all ? "border-2 border-white" : ""}`}
          onClick={handleAll}>View All</button>
          </div>

          {/* <div className=" w-full h-[50%] flex justify-around items-center py-4">
              <button className={`h-full w-[15%] text-black font-bold rounded-md bg-[thistle] ${volunteer ? "border-2 bg-blue-400" : ""}`} onClick={handleVolunteer}>Volunteer</button>
              <button className={`h-full w-[15%] text-white font-bold rounded-md bg-[#708090]`}>Registrations</button>
              <button className={`h-full w-[15%] text-black font-bold rounded-md bg-[mistyRose] ${events ? "border-2 bg-blue-400" : ""}`} onClick={handleEvents}>Events</button>
              <button className={`h-full w-[15%] text-white font-bold rounded-md bg-[#696969] ${add ? "border-2 border-white" : ""}`}>Tasks</button>
              <button className={`h-full w-[15%] text-BLACK font-bold rounded-md bg-[#AFEEEE] ${add ? "border-2 border-white" : ""}`}>Roles</button>
              <button className={`h-full w-[15%] text-white font-bold rounded-md bg-[lightCoral] ${add ? "border-2 border-white" : ""}`}>Skills</button>
          </div> */}

        <div className=" w-full h-[50%] flex justify-around items-center py-4">
              <button className={`h-full w-[15%] text-white font-bold rounded-md bg-[#708090] ${volunteer ? " bg-blue-400  mb-3" : ""}`} onClick={handleVolunteer}>Volunteer</button>
              <button className={`h-full w-[15%] text-white font-bold rounded-md bg-[#708090]`}>Registrations</button>
              <button className={`h-full w-[15%] text-white font-bold rounded-md bg-[#708090] ${events ? " bg-blue-400 mb-3" : ""}`} onClick={handleEvents}>Events</button>
              <button className={`h-full w-[15%] text-white font-bold rounded-md bg-[#708090] ${add ? " " : ""}`}>Tasks</button>
              <button className={`h-full w-[15%] text-white font-bold rounded-md bg-[#708090] ${add ? "" : ""}`}>Roles</button>
              <button className={`h-full w-[15%] text-white font-bold rounded-md bg-[#708090] ${add ? "" : ""}`}>Skills</button>
          </div>

      </div>
      
      <div className="h-[80%] w-full">
      {
        add && volunteer && <CreateVolunteer/>
      }
      {
        delete1 && volunteer && <DeleteVolunteer/>
      }
      {
        all && volunteer && <ViewAll/>
      }
      {
        update && volunteer && <UpdateVolunteer/>
      }

      {
        add && events && <CreateEvent/>
      }
      {
        delete1 && events && <DeleteVolunteer/>
      }
      {
        all && events && <ViewEvents/>
      }
      {
        update && events && <UpdateVolunteer/>
      }
      
      </div>
     
    </div>
  );
}

export default AdminDashboard;