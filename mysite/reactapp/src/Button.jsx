import React from "react";
import { motion } from "motion/react";

const Button = ({children,className,...props}) => {
    return <button {...props} className={`bg-primaryLight p-2 rounded-md text-primary shadow-md duration-100 hover:duration-300 hover:bg-secondary hover:ring-8 ring-secondaryTransparent flex items-center justify-center ${className}`} >
        {children}
    </button>
}


export const MotionButton = motion.create(Button);

export default Button;