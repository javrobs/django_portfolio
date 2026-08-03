import React,{useState,useContext} from "react"
import { userContext } from "../App.jsx";
import { AnimatePresence, motion } from "motion/react";

const HoverInput = ({label,className,classNameLabel,value,onInput,onFocus,onBlur,stayActive,name,textAid,...props}) => {
    const [isFocused,setFocused] = useState(false);

    const inputOnFocus = (e) => {
        setFocused(true);
        if(onFocus){
            onFocus(e);
        }
    }
    
    const inputOnBlur = (e) => {
        setFocused(false);
        if(onBlur){
            onBlur(e);
        }
    }


    return <div className={`relative ${classNameLabel}`}>
        <AnimatePresence>
            {Boolean(textAid) && isFocused && <motion.div className="text-sm italic absolute top-0 bg-sky-900 -translate-y-full p-1 px-2 rounded-t-md text-slate-200 shadow-md" animate={{height:"auto"}} exit={{height:0}} initial={{height:0}}>{textAid}</motion.div>}
        </AnimatePresence>
        <motion.label className={`relative overflow-hidden flex flex-col justify-end h-14 ${isFocused?"border-sky-800 border-2":""} shadow-sm ${(Boolean(textAid) && isFocused)?"rounded-b-md":"rounded-md"} bg-white`}>
            <input onFocus={inputOnFocus} name={name} onBlur={inputOnBlur} className={`p-1 h-8 w-full !bg-transparent px-2 outline-none ${className||""} ${value||isFocused||stayActive?"":"text-white"}`} value={value} onInput={onInput} {...props} />
            <span className={`absolute transition-all -translate-y-1/2 ${value||isFocused||stayActive?"text-sm top-3 left-2":"top-1/2 left-2"}`}>{label}</span>
        </motion.label>
    </div>
}
export default HoverInput
