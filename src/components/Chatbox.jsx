import React from 'react'
import FileMessage from "../components/FileMessage"
import Message from "../components/Message"

const Chatbox = ({ name, chat }) => (
    <div className="bg-[#101843] w-[60%] max-w-[60%] h-[60%] flex flex-col-reverse rounded-xl overflow-y-auto custom-scrollbar">
        {chat.map((item, index) => (item.hasOwnProperty("fileName") ? (<FileMessage item={item} name={name} />) : (<Message item={item} index={index} name={name} />)))}
    </div>)

export default Chatbox
