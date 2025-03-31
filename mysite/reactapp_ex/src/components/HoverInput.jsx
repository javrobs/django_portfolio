import React,{useState,useContext} from "react"
import { userContext } from "../App.jsx";
import { motion } from "motion/react";

const HoverInput = ({label,className,classNameLabel,value,onInput,stayActive,name,...props}) => {
    const [isFocused,setFocused] = useState(false);
    const {error} = useContext(userContext);


    return <motion.label animate={{x:error?.tag==name?[0,2,-2,0]:0}} transition={{duration:.3}} className={`relative mt-3 ${classNameLabel}`}>
            <input onFocus={()=>setFocused(true)} name={name} onBlur={()=>setFocused(false)} className={`p-1 h-8 text-white focus:outline-secondary rounded-full w-full shadow-sm px-3 ${error?.tag==name?"bg-rose-800":"bg-zinc-950"}  ${className||""} ${value||isFocused||stayActive?"text-white":"text-black"}`} value={value} onInput={onInput} {...props} />
            <span className={`absolute text-white transition-all ${error?.tag==name?"bg-rose-800":"bg-zinc-950"} ${value||isFocused||stayActive?" rounded-md px-2 text-sm -top-3 left-4":"left-3 top-[5px]"}`}>{error?.tag==name?error.message:label}</span>
        </motion.label>
}
export default HoverInput
