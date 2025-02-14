import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Sidebar from "../components/Sidebar";
import Inputs from "../components/Inputs";
import Chatbox from "../components/Chatbox";
import getMimeType from "../utils/getMineType";
import '../styles/Room.css';

function Croom() {
    const [code, setCode] = useState(localStorage.getItem("code") ? JSON.parse(localStorage.getItem("code")) : null);
    const [socket, setSocket] = useState(null);
    const [chat, setChat] = useState([]);
    const [name, setName] = useState("");
    const [users, setUsers] = useState([]);
    const [options, setoptions] = useState(false);
    const [left, setLeft] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const nameRef = useRef(name);

    const joinRoom = (roomId) => {
        if (socket) {
            socket.emit('joinRoom', roomId);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("code")) return;

        try {
            fetch("https://server-pqo0.onrender.com/create", { method: "GET" })
                .then(res => res.json())
                .then(data => {
                    localStorage.setItem("code", JSON.stringify(data));
                    setCode(data);
                })
                .catch(error => console.error("Error fetching room code:", error));
        } catch (error) {
            console.error("Error:", error);
        }
    }, []);

    useEffect(() => {
        const newSocket = io("https://server-pqo0.onrender.com");
        setSocket(newSocket);

        newSocket.on("connect", () => console.log("Connected to socket"));

        newSocket.on("message", (data) => setChat((prevChat) => [data, ...prevChat]));

        newSocket.on("update-users", ({ newusers, leftname }) => {
            setUsers(newusers);
            setLeft(leftname);
        });

        newSocket.on('fileBroadcast', (data) => {
            const { fileName, fileBuffer, name } = data;
            const blob = new Blob([fileBuffer], { type: getMimeType(fileName) });
            const downloadUrl = URL.createObjectURL(blob);
            setChat((prevChat) => [{ fileName, downloadUrl, name }, ...prevChat]);
        });

        return () => {
            const currentName = nameRef.current;
            if (code && currentName) {
                newSocket.emit("user-left", { code, name: currentName });
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
                setName(data.name);
                nameRef.current = data.name;
            });

            socket.on("roomusers", (data) => setUsers(data));
        }
    }, [code, socket]);

    useEffect(() => {
        setShowMessage(true);
        const timeout = setTimeout(() => setShowMessage(false), 4000);

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
