import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import io from 'socket.io-client';

function Croom() {
    const [code, setcode] = useState(localStorage.getItem("code") ? JSON.parse(localStorage.getItem("code")) : null)
    const [message, setmessage] = useState("")
    const [socket, setSocket] = useState(null)
    const [chat, setchat] = useState([])
    const navigate = useNavigate();
    const [name, setname] = useState("")
    const [users, setusers] = useState([])
    const [side, setside] = useState(true)

    const hamburger = (e)=>{
        setside(prev => !prev)
    }


    const sendchat = () => {
        if (socket && message.trim()) {
            const messageData = { roomId: code, message };
            console.log("Sending message:", messageData); // Log the message data being sent
            socket.emit("message", messageData);
            setmessage("");
        } else {
            console.log("Socket is not connected or message is empty.");
        }
    };

    const joinRoom = (roomId) => {
        if (socket) {
            console.log("Joining room:", roomId);
            socket.emit('joinRoom', roomId);
        }
    }

    const handleUnload = async () => {
        await fetch("https://server-pqo0.onrender.com/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ code: code }),
        }).then(() => {
            localStorage.removeItem("code");
        })

        navigate("/home")
    };

    useEffect(() => {
        const lvalue = localStorage.getItem("code")
        if (lvalue) {
            return
        }
    
        else {
            try {
                fetch("https://server-pqo0.onrender.com/create", { method: "GET" })
                    .then(res => res.json())
                    .then(data => {

                        localStorage.setItem("code", JSON.stringify(data));
                        setcode(data);
                    })
            } catch (error) {
                console.log(error)
            }
        }
    }, []);



    useEffect(() => {

        const newSocket = io("https://server-pqo0.onrender.com");
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Connected to socket");
        });

        newSocket.on("message", (data) => {
            console.log("Attempting to receive a message.");
            console.log("Message received:", data);
            setchat((prevChat) => [...prevChat,  data ]);
            console.log(chat)
        });

        return () => newSocket.disconnect();
    }, []);


    useEffect(() => {
        if (code && socket) {
            joinRoom(Number(code))
        }
    }, [code, socket]);

    useEffect(() => {
        if (socket) {
            socket.on("assignedAttributes", (data) => {
                console.log(data);
                setname(data.name);

            })
            socket.on("roomusers", (data) => {

                setusers((prevUsers) => {

                    return data;
                });
                console.log(users);
            })
        }
    }, [socket])

    return (
        <div className = "flex justify-start w-full ">
           {side && (<nav className="bg-slate-400 h-full flex flex-col items-center justify-center max-h-[90%]" >

                    
                    <div className="bg-[#122255] w-full flex items-center justify-around gap-12 ">
                    <button className="transition-all active:scale-110" onClick = {hamburger}><i className="fa fa-mobile fa-2x text-white" aria-hidden="true"></i></button>
                    <h1 className="font-bold text-white orb ">{Number(code)}</h1>
                    </div>
                    
                
                <ul className=" bg-[#0f1a3b] h-full flex flex-col items-center justify-center w-full">
                    {users.length != 1 ?
                        users.map((item, index) => (
                            <li key={index} className="border-t p-4 cursor-pointer w-full" style={{ color: item.color }} >{item.name}</li>
                        )) : <li className="text-red-600 border-t p-4 ">No users are there</li>
                    }
                </ul>

                <div className = "fixed top-0 right-1 ">
                <button className="w-28 h-20 transition-all bottom-0 pl-3 text-red-700 active:scale-125 z-30" onClick={handleUnload} ><i className="fa fa-sign-out fa-2x" aria-hidden="true"></i></button>
                </div>
                
            </nav>)}

            {!side && (
            <nav className=" bg-slate-400 h-full flex flex-col items-center justify-center max-h-[90%]">
            <div className=" bg-[#122255] w-full flex items-center justify-around gap-12 ">
                <button className="transition-all active:scale-110" onClick = {hamburger}><i class="fa fa-users fa-2x text-white" aria-hidden="true"></i></button>
                <h1 className="font-bold text-white ">{Number(code)}</h1>
            </div>
            <div className = "fixed top-0 right-1 ">
                <button className="w-28 h-20 transition-all bottom-0 pl-3 text-red-700 active:scale-125 z-30" onClick={handleUnload} ><i className="fa fa-sign-out fa-2x" aria-hidden="true"></i></button>
                </div>
            </nav>
            ) }

            <div className = " w-[85%] h-screen max-h-[90%] flex flex-col justify-around items-center">
            <div className = "bg-[#101843] w-[60%] max-w-[60%] h-[60%] rounded-xl overflow-y-auto custom-scrollbar">
            {chat.map((item, index) => (
                     <div className={`message flex ${item.name === name ? 'justify-end' : 'justify-start'} clear-both p-3 gap-2`}key={index}>
                        <i className="fa fa-user-circle text-xl" style={{ color: item.color }}aria-hidden="true"></i>
                        <div className={`inline-block bg-[#449ef8] text-red-50 max-w-[60%] overflow-y-auto p-3 rounded-2xl text-left ${item.name === name ? 'text-right' : 'text-left'}`}style={{ wordBreak: 'break-word' }} >
                          {item.message}
                        </div>
                     </div>))}
            </div>
    

                    <div className="w-[33%] max-w-[40%] ">
                        <div className="flex justify-center items-center gap-4 ">
                            <input type="text" name="" id="" className="rounded-lg w-[480px] h-[60px] p-2 text-lg outline-none border-none overflow-hidden resize-none whitespace-normal" value={message} onChange={(e) => { setmessage(e.target.value) }} />
                            <button className=" p-3 rounded-full  bg-blue-900 transition-all active:shadow-inner active:shadow-white active:scale-110" onClick={sendchat} ><i className="fa fa-paper-plane fa-2x text-[#03032fee]" aria-hidden="true"></i></button>
                        </div>
                    </div>
            </div>
            
                
        </div>
    )
}

export default Croom
