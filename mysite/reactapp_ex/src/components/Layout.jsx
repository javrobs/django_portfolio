import React, { useContext, useEffect, useRef } from "react"
import { Outlet} from "react-router";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { userContext } from "../App.jsx";
import {AnimatePresence, motion} from "motion/react"
import Button from "./Button.jsx";

const Layout =() => {
    const {setError,error} = useContext(userContext);
    const errorRef = useRef(null);
    
    useEffect(()=>{
        function closeIfClickout(e){
            if(!errorRef.current || (errorRef.current !== e.target && !errorRef.current.contains(e.target))){
                setError({});
                window.removeEventListener("click", closeIfClickout);
            }
        };
        if(error.message){
            window.addEventListener("click",closeIfClickout);
        }
        return ()=>{window.removeEventListener("click",closeIfClickout)}
    },[error.message]);

    return <div className="flex flex-col min-h-dvh overflow-y-hidden">
    <Header/>
    <div className="grow flex flex-col">
        <Outlet/>
        
        <Footer/>
    </div>
    <AnimatePresence>
        {error.tag=="" && Boolean(error.message) &&
            <motion.div ref={errorRef} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute flex sm:max-w-full max-w-screen-sm gap-1 items-center top-24 self-center bg-rose-800 bg-opacity-90 backdrop-blur-sm p-3 rounded-md shadow-md">
                <div>{error.message}</div><Button icon="close" type="google" onClick={()=>setError({})}/>
            </motion.div>
        }
    </AnimatePresence>
    </div>
}

export default Layout;