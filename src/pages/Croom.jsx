import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Sidebar from "../components/Sidebar";
import Inputs from "../components/Inputs";
import Chatbox from "../components/Chatbox";
import getMimeType from "../utils/getMineType";

function Croom() {
    const [code, setcode] = useState(localStorage.getItem("code") ? JSON.parse(localStorage.getItem("code")) : null);
    const [socket, setSocket] = useState(null);
    const [chat, setchat] = useState([]);
    const [name, setname] = useState("");
    const [users, setusers] = useState([]);
    const [options, setoptions] = useState(false);
    const [left, setLeft] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const nameRef = useRef(name);

    const joinRoom = (roomId) => { socket && socket.emit('joinRoom', roomId) };

    useEffect(() => {
        if (localStorage.getItem("code")) return
        else {
            try {
                fetch("https://server-pqo0.onrender.com/create", { method: "GET" })
                    .then(res => res.json())
                    .then(data => {
                        localStorage.setItem("code", JSON.stringify(data));
                        setcode(data);
                    })
            } catch (error) {
                console.log(error);
            }
        }
    }, []);

    useEffect(() => {
        const newSocket = io("https://server-pqo0.onrender.com");
        setSocket(newSocket);
        newSocket.on("connect", () => { });
        newSocket.on("message", (data) => setchat((prevChat) => [data, ...prevChat]));
        newSocket.on("update-users", ({ newusers, leftname }) => {
            setusers(newusers);
            setLeft(leftname);
        });
        newSocket.on('fileBroadcast', (data) => {
            const { fileName, fileBuffer, name } = data;
            const blob = new Blob([fileBuffer], { type: getMimeType(fileName) });
            const downloadUrl = URL.createObjectURL(blob);
            setchat((prevChat) => [{ fileName, downloadUrl, name }, ...prevChat]);
        });

        return () => {
            const currentName = nameRef.current;
            const currentcode = localStorage.removeItem("code");
            console.log(`code = ${currentcode} , name = ${currentName}`);
            if (currentcode && currentName) {
                
                newSocket.emit("user-left", { code: currentcode, name: currentName });
                localStorage.removeItem("code");
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
        setShowMessage(true);
        const timeout = setTimeout(() =>setShowMessage(false), 4000); 
    
        return () => clearTimeout(timeout);
      }, [left]);

    return (
        <div className="flex justify-start w-full " onClick={() => options ? setoptions(false) : ""}>
            <Sidebar
                code={code}
                users={users}
            />
            <div className="w-[85%] h-screen max-h-[90%] flex flex-col justify-around items-center">
                <Chatbox
                    name={name}
                    chat={chat}
                />
               {<div className = {`${(showMessage && left)?"block":"hidden" } fixed top-[50%] left-[50%] `} ><h1 className="text-red-500">{left} left the chat room</h1></div>} 
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
