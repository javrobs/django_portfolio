
import React from "react";
import { motion } from "motion/react"
import { Link } from "react-router";

const Header = () => {

    return <header className="flex p-4 h-24 justify-between z-[2] items-center shadow-md bg-gradient-to-tr from-indigo-950 to-indigo-900">
        <Link to="/cards">
            <motion.button 
                whileHover={{scale:1.4}} 
                style={{transformOrigin:"left"}} 
                transition={{type:"tween"}} 
                className="text-2xl text-indigo-300 hover:text-indigo-500 flex items-center transition-all duration-300 cursor-pointer font-semibold rounded-md p-2 hover:font-normal hover:bg-secondaryTransparent">
                    <div className="text-start" style={{lineHeight:"1.2rem"}}>Cards</div>
            </motion.button>
        </Link>
    </header>
}

export default Header;