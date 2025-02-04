import React, { useState } from 'react'
import FileOptions from "./FileOptions"

function Inputs({ socket, code, options, setoptions }) {
    const [message, setmessage] = useState("")

    const sendchat = (e) => {
        e.preventDefault();
        if (socket && message.trim()) {
            const messageData = { roomId: code, message };
            socket.emit("message", messageData);
            setmessage("");
        } else console.log("Socket is not connected or message is empty.");
    };

    return (
        <>
            <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[33%] max-w-[40%] flex justify-center">
                <div className="flex justify-center items-center gap-4 w-full">
                    <form onSubmit={sendchat} className="flex w-full gap-4 justify-start items-center">
                        <input
                            type="text"
                            className="rounded-lg w-full sm:w-[400px] md:w-[500px] lg:w-[500px] h-[50px] sm:h-[55px] md:h-[60px] p-2 text-lg outline-none border-none overflow-hidden bg-blue-900 resize-none whitespace-normal"
                            value={message}
                            onChange={(e) => setmessage(e.target.value)}
                            placeholder="Type a message..."
                        />
                        <button
                            type="submit"
                            className="p-3 rounded-full bg-blue-900 transition-all active:shadow-inner active:shadow-white active:scale-110"
                            onClick={sendchat}
                        >
                            <i className="fa fa-paper-plane fa-2x text-[#03032fee]" aria-hidden="true"></i>
                        </button>
                        <button
                            className="p-3 rounded-full bg-blue-900 transition-all active:shadow-inner active:shadow-white active:scale-110"
                            onClick={(e) => {
                                e.preventDefault();
                                setoptions(prev => !prev)
                            }}
                        >
                            <i className="fa fa-paperclip fa-2x text-[#03032fee]" aria-hidden="true"></i>
                        </button>
                    </form>
                    <FileOptions options={options} socket={socket} code={code} />
                </div>
            </div>
        </>
    )
}

export default Inputs
