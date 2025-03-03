import React from "react";
import {useState,useEffect} from "react";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    function handleEmail(e){
        setEmail(e.target.value);
    }
    function handlePassword(e){
        let pass = e.target.value
        setPassword(e.target.value);
        
        if(pass.length < 8){
            setPasswordError("Password must be at least 8 characters long");
        }
        if(pass.length >= 8){
            setPasswordError(null);
        }
        
    }



    return <div className="w-full h-[100vh]  border-red-400 flex flex-col justify-center gap-5 items-center bg-[#1a202c]">
        <h1 className="text-5xl font-bold text-white">Login</h1>
        <div className=" h-[50%] w-[30%] flex flex-col items-center justify-around text-white">
            <div className="w-full h-[15%]">
                <input type="email" placeholder="Email" value={email} className="w-full h-full px-3 rounded-md bg-[#2d3748] text-xl"
                onChange={handleEmail}/>
            </div>
            <div className="w-full h-[15%]">
                <input type="password" placeholder="Password" value={password} onChange={handlePassword} className="w-full h-full px-3 rounded-md bg-[#2d3748] text-xl"/>
                {passwordError && <p className="text-red-500 text-center py-2">{passwordError}</p>}
            </div>            
            <button className="bg-[#22c55e] font-bold text-xl px-3 py-1 rounded-md h-[15%] w-[40%]"
            disabled={passwordError}>Login</button>

            <div className=""> 
                <span className="text-white">Don't have an account? </span>
                <a href="/register" className="text-[#60a5fa]">create account</a>
            </div>
        </div>
    </div>;
}

export default Login;