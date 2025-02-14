import React from 'react'

function Message({ item, index, name }) {
    return (
        <>
            {item.name == name ?
                (<div className={`message flex ${item.name === name ? 'justify-end' : 'justify-start'} clear-both p-3 gap-2`} key={index}>
                    <div className={`inline-block bg-[#449ef8] text-red-50 max-w-[60%] h-fit overflow-y-auto p-3 rounded-2xl text-left ${item.name === name ? 'text-right' : 'text-left'}`} style={{ wordBreak: 'break-word' }} >
                        {item.message}
                    </div>
                    <i className="fa fa-user-circle text-xl" style={{ color: item.color }} aria-hidden="true"></i>
                </div>)
                :

                (<div className={`message flex ${item.name === name ? 'justify-end' : 'justify-start'} clear-both p-3 gap-2`} key={index}>
                    <i className="fa fa-user-circle text-xl" style={{ color: item.color }} aria-hidden="true"></i>
                    <div className={`inline-block bg-[#449ef8] text-red-50 max-w-[60%] h-fit overflow-y-auto p-3 rounded-2xl text-left ${item.name === name ? 'text-right' : 'text-left'}`} style={{ wordBreak: 'break-word' }} >
                        {item.message}
                    </div>
                </div>)}
        </>
    )
}

export default Message
