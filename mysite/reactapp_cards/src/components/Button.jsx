import React from "react";
import { motion } from "motion/react";

const Button = ({className,icon,children,inverted,type,justButton,...props}) => {
    return <button {...props} type={justButton?"button":"submit"} className={`bg-indigo-800 p-1 rounded-md text-white gap-1 shadow-md duration-100 hover:duration-300 disabled:opacity-40 hover:enabled:bg-cyan-600 hover:enabled:ring-8 ring-cyan-600 ring-opacity-35 flex ${inverted?"flex-row-reverse":"flex-row"} items-center justify-center ${className}`} >
        {type=="google"?
        <><span className={`material-symbols-outlined`}>{icon}</span> {children}</>:
        <><i className={`bi bi-${icon}`}/>{children}</>
        } 
    </button>
}


export const MotionButton = motion.create(Button);

export default Button;