import React,{useState,useContext} from "react"
import { userContext } from "../App.jsx";
import { motion } from "motion/react";

const HoverInput = ({label,className,classNameLabel,value,onInput,stayActive,name,...props}) => {
    const [isFocused,setFocused] = useState(false);
    const {error} = useContext(userContext);


    return <motion.label animate={{x:error?.tag==name?[0,2,-2,0]:0}} transition={{duration:.3}} className={`relative ${error?.tag==name?"bg-rose-200":"bg-stone-100"} rounded-md shadow-md flex flex-col justify-end shrink-0 h-10 ${classNameLabel}`}>
        <input onFocus={()=>setFocused(true)} name={name} onBlur={()=>setFocused(false)} className={`px-2 outline-none bg-transparent w-full ${className||""} `} value={value} onInput={onInput} {...props} />
        <span className={`absolute transition-all px-2 ${value||isFocused||stayActive?" top-0 left-0 text-xs":"left-0 top-1/2 -translate-y-1/2"}`}>{error?.tag==name?error.message:label}</span>
    </motion.label>
}
export default HoverInput
