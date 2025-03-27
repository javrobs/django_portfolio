import React, { useContext, useEffect } from "react"
import { Outlet, useLocation } from "react-router";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { userContext } from "../App.jsx";
import {AnimatePresence, motion} from "motion/react"
import Button from "./Button.jsx";

const Layout =() => {
    const location = useLocation();
    const {setError,error} = useContext(userContext);
    
    useEffect(()=>{
        setError({});
        console.log("effecting!")},[location]);

    return <div className="flex flex-col min-h-dvh overflow-y-hidden">
    <Header/>
    <div className="grow flex flex-col">
        <Outlet/>
        
        <Footer/>
    </div>
    <AnimatePresence>
        {error.tag=="" && Boolean(error.message) &&
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute flex sm:max-w-full max-w-screen-sm gap-1 items-center top-24 self-center bg-rose-800 bg-opacity-90 backdrop-blur-sm p-3 rounded-md shadow-md">
                <div>{error.message}</div><Button icon="close" type="google" onClick={()=>setError({})}/>
            </motion.div>
        }
    </AnimatePresence>
    </div>
}

export default Layout;