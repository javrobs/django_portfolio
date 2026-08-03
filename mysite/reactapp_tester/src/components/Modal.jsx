import React from "react";
import IconButton from "./IconButton.jsx";
import CreatePO from "./modalPages/CreatePO.jsx";
import Enter from "./modalPages/Enter.jsx";
import ExitWO from "./modalPages/ExitWO.jsx";
import Finish from "./modalPages/Finish.jsx";

export default function Modal({children, action, onClose, color}) {
    if(!action) return null;


    const TitleBlock = () => {
        const actions = {
            "createPO": {bg:"bg-amber-600", title:"Crear PO"},
            "enter": {bg:"bg-amber-600", title:"Entrada"},
            "enterFinished": {bg:"bg-green-600", title:"Entrada"},
            "exit": {bg:"bg-rose-700", title:"En proceso"},
            "finish": {bg:"bg-green-600", title:"Terminar producto"},
            "delivery": {bg:"bg-green-600", title:"Delivery"},
            "scan": {bg:"bg-sky-700", title:"Ver QR"}
        }
        return <><div className={`flex justify-between items-center p-2 ${actions[action].bg} rounded-t-md text-white`}>
            <h2 className="text-lg font-bold">{actions[action].title}</h2>
            <IconButton onClick={onClose} icon="close"/>
        </div></>
    };

    const ContentBlock = () => {
        switch(action){
            case "createPO":
                return <CreatePO onClose={onClose} role={1}/>
            case "enter":
                return <Enter onClose={onClose} role={3}/>
            case "enterFinished":
                return <Enter onClose={onClose} role={2}/>
            case "exit":
                return <ExitWO onClose={onClose} role={3}/>
            case "finish":
                return <Finish onClose={onClose} role={3}/>
        }
    }


    return <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        
        <div className="bg-slate-100 flex flex-col max-w-screen-sm relative rounded-md shadow-lg">
            <TitleBlock/>
            <div className='p-2'>
                <ContentBlock/>
            </div>
        </div>
    </div>
}