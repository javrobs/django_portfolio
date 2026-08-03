import React from "react";
import Icon from "./Icon.jsx"
import Spinner from "./Spinner.jsx";

const Button = ({children, icon, color, className, reverse, sending, disabled, size, ...props}) => {
    let colorClassnames ="";
    switch(color){
        case "green":
                colorClassnames = "bg-green-600 hover:bg-green-800  text-white";
            break;
        case "amber":
                colorClassnames = "bg-amber-600 hover:bg-amber-800  text-white";
            break;
        case "yellow":
                colorClassnames = "bg-yellow-500 hover:bg-yellow-800  text-white";
            break;
        case 'slate':
                colorClassnames = "bg-slate-600 hover:bg-slate-800  text-white";
            break;
        case 'red':
                colorClassnames = "bg-rose-700 hover:bg-rose-900  text-white";
            break;
        case 'blue':
                colorClassnames = "bg-sky-700 hover:bg-sky-900 text-white";
            break;
        case 'gray':
                colorClassnames = "bg-gray-600 hover:bg-gray-800 text-white";
            break;
    }
    return <button {...props} disabled={disabled||Boolean(sending)} className={` ${colorClassnames} flex ${reverse?"flex-row-reverse":"flex-row"} ${size=="sm"?"px-2 text-sm":"px-3 py-2 text-lg"} disabled:bg-slate-400 hover:disabled:bg-slate-400 gap-1 items-center justify-center rounded-lg shadow-md transition-all ${className}`}>{sending?<><Spinner/>Enviando</>:<>{icon&&<Icon icon={icon} className={size=="sm"?"!text-xl":""}/>}{children}</>}</button>
}


export default Button