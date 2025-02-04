import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"

function Sidebar({ code, users }) {
    const [side, setside] = useState(true);
    const hamburger = (e) => setside(prev => !prev);
    const navigate = useNavigate();

    const handleUnload = async () => {
        await fetch("https://server-pqo0.onrender.com/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ code: code }),
        }).then(() => localStorage.removeItem("code"));

        navigate("/home");
    };

    return (
        <>
            {side && (<nav className="bg-slate-400 h-full flex flex-col items-center justify-center max-h-[90%]" >

                <div className="bg-[#122255] w-full flex items-center justify-around gap-12 ">
                    <button className="transition-all active:scale-110" onClick={hamburger}><i className="fa fa-mobile fa-2x text-white" aria-hidden="true"></i></button>
                    <h1 className="font-bold text-white orb ">{Number(code)}</h1>
                </div>

                <ul className=" bg-[#0f1a3b] h-full flex flex-col items-center justify-center w-full">
                    {users.length != 1 ?
                        users.map((item, index) => (
                            <li key={index} className="border-t p-4 cursor-pointer w-full" style={{ color: item.color }} >{item.name}</li>
                        )) : <li className="text-red-600 border-t p-4 ">No users are there</li>
                    }
                </ul>
                <div className="fixed top-0 right-1 ">
                    <button className="w-28 h-20 transition-all bottom-0 pl-3 text-red-700 active:scale-125 z-30" onClick={handleUnload} ><i className="fa fa-sign-out fa-2x" aria-hidden="true"></i></button>
                </div>
            </nav>)}
            {!side && (
                <nav className=" bg-slate-400 h-full flex flex-col items-center justify-center max-h-[90%]">
                    <div className=" bg-[#122255] w-full flex items-center justify-around gap-12 ">
                        <button className="transition-all active:scale-110" onClick={hamburger}><i class="fa fa-users fa-2x text-white" aria-hidden="true"></i></button>
                        <h1 className="font-bold text-white ">{Number(code)}</h1>
                    </div>
                    <div className="fixed top-0 right-1 ">
                        <button className="w-28 h-20 transition-all bottom-0 pl-3 text-red-700 active:scale-125 z-30" onClick={handleUnload} ><i className="fa fa-sign-out fa-2x" aria-hidden="true"></i></button>
                    </div>
                </nav>
            )}
        </>
    )
}

export default Sidebar
