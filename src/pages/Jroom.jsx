import React,{useState, useEffect} from 'react'
import {useNavigate} from "react-router-dom"

function Jroom() {
    
    const [code, setcode] = useState(undefined);
    const [valid, setvalid] = useState(false);
    const navigate = useNavigate();
    const handleclick = async ()=>{    
        try {
            const response =  await fetch("http://192.168.42.164:5000/join", { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({code: code }) ,
            })
            if(response.ok){
                localStorage.setItem("code",JSON.stringify(code));
                setvalid(false);
                navigate("/Croom");
            }
            else{
                setvalid(true);
            }    
        } catch (error) {
            console.log(error)
            setvalid(true);
        }

    }
    useEffect(() => {
        if(valid){
            setvalid(false);
        }
    }, [valid])
    
    const handleChange = (e)=>{
        setcode(e.target.value);
    }
    
    return (
        <div className = "flex flex-col justify-center gap-28 items-center"> 
            <h1 className = "text-red-500 font-bold text-5xl"> Enter the room code </h1>
            <input type="number" placeholder = "e.g.14321" value = {code} name="code" id="code" onChange = {handleChange}  className = "w-40 h-14 outline-none placeholder:text-center placeholder:text-3xl rounded text-5xl p-3" onInput={(e) => e.target.value = e.target.value.slice(0, 5)}/>
            {valid && <p className = "font-extrabold text-red-600 ">Room code is not valid</p>}
            <button className = " w-[60px] h-[60px] bg-white rounded-full transition-all hover:shadow-lg hover:shadow-green-400 hover:scale-110 " onClick = {handleclick} ><i className="fa fa-arrow-right" aria-hidden="true"></i>
            </button>
        </div>
    )
}

export default Jroom;
