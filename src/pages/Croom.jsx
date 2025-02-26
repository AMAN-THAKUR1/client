import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Sidebar from "../components/Sidebar";
import Inputs from "../components/Inputs";
import Chatbox from "../components/Chatbox";
import getMimeType from "../utils/getMineType";
import {Toaster, toast} from "react-hot-toast"
function Croom() {
    const [code, setcode] = useState(localStorage.getItem("code") ? JSON.parse(localStorage.getItem("code")) : null);
    const [socket, setSocket] = useState(null);
    const [chat, setchat] = useState([]);
    const [name, setname] = useState("");
    const [users, setusers] = useState([]);
    const [options, setoptions] = useState(false);
    const [left, setLeft] = useState("");
    const nameRef = useRef(name);

    const joinRoom = (roomId) => { socket && socket.emit('joinRoom', roomId) };

    useEffect(() => {
        if (localStorage.getItem("code")) return
        else {
            try {
                fetch("http://localhost:5000/create", { method: "GET" })
                    .then(res => res.json())
                    .then(data => {
                        localStorage.setItem("code", JSON.stringify(data))
                        localStorage.setItem("code2", JSON.stringify(data))
                        setcode(data);
                    })
            } catch (error) {
                console.log(error);
            }
        }
    }, []);

    useEffect(() => {
        const newSocket = io("http://localhost:5000");
        setSocket(newSocket);
        newSocket.on("connect", () => { });

        // Handling new messages
        newSocket.on("message", (data) => setchat((prevChat) => [data, ...prevChat]));
        
        // Handling users list updates
        newSocket.on("update-users", ({ newusers, leftname }) => {
            if (Array.isArray(newusers)) {
                console.log(`Recieved: Users: ${newusers.length}, Left: ${leftname}`);
                setusers(newusers); // Overwriting users state with the new list
            } else {
                console.error("Received invalid newusers:", newusers);
            }
            setLeft(leftname);  // Setting the name of the person who left
    
        });

        // Handling file broadcast
        newSocket.on('fileBroadcast', (data) => {
            const { fileName, fileBuffer, name } = data;
            const blob = new Blob([fileBuffer], { type: getMimeType(fileName) });
            const downloadUrl = URL.createObjectURL(blob);
            setchat((prevChat) => [{ fileName, downloadUrl, name }, ...prevChat]);
        });

        // Cleanup on component unmount
        return () => {
            const currentName = nameRef.current;
            const currentCode = JSON.parse(localStorage.getItem("code2"));
            localStorage.removeItem("code2");
            console.log(`Leaving Room - Code: ${currentCode}, Name: ${currentName}`);
            if (currentCode && currentName) {
                newSocket.emit("user-left", { code: currentCode, name: currentName });
            } else {
                console.error("Code or name is not available, unable to emit user-left.");
            }
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (code && socket) joinRoom(Number(code));
        
        if (socket) {
            socket.on("assignedAttributes", (data) => {
                setname(data.name);
                nameRef.current = data.name;
            });
            socket.on("roomusers", (data) => setusers((prevUsers) => data));
        }
    }, [code, socket]);

    useEffect(() => {
       left && toast.error(`${left} left the room`)
    }, [left]);

    console.log(`left: ${left}`);

    return (
        
        <div className="flex justify-start w-full " onClick={() => options ? setoptions(false) : ""}>
            <div><Toaster /></div>
            <Sidebar
                code={code}
                users={users}
            />
            <div className="w-[85%] h-screen max-h-[90%] flex flex-col justify-around items-center">
                <Chatbox
                    name={name}
                    chat={chat}
                /> 
                <Inputs
                    socket={socket}
                    code={code}
                    options={options}
                    setoptions={setoptions}
                />
            </div>
        </div>
    );
}

export default Croom;
