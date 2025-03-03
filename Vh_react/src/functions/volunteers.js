import axios from "axios";

export class Volunteers {
    
    constructor(){
        
    }

    async createVolunteer(data){
        await axios.post("http://127.0.0.1:8000/api/volunteers/", data, {
            headers: { "Content-Type": "application/json" }  // ✅ Ensure JSON format
        })
        .then(response => console.log("Added to Database Successfully"))
        .catch(error => {
            console.error("Error:", error.response?.data || error.message);
            console.log("Error adding volunteer: " + (error.response?.data || error.message));
        });
    }

    async deleteVolunteer(phoneNo){
        await axios.delete(`http://127.0.0.1:8000/api/volunteers/delete/by-phone/${phoneNo}/`)
        .then(response => console.log("Deleted Successfully"))
        .catch(error => console.log("Volunteer Not Found!..."));
    }

    async viewAllVolunteers(){
        await axios.get("http://127.0.0.1:8000/api/volunteers/")
        .then(response => response.data)
        .catch(error => console.log("Error fetching volunteers!..."));
    }

    async viewVolunteer(phoneNo){
        await axios.get(`http://127.0.0.1:8000/api/volunteers/get/by-phone/8767011304/`)
        .then(response => response.data)
        .catch(error => console.log("Volunteer Not Found!..."));
    }

    async updateVolunteer(phoneNo, data) {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/volunteers/update/${phoneNo}/`, data, {
                headers: { "Content-Type": "application/json" }
            });
            console.log("Updated Successfully:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error updating volunteer:", error.response?.data || error.message);
            throw error;
        }
    }
    
    
    
}

let volunteers = new Volunteers();
export default volunteers;