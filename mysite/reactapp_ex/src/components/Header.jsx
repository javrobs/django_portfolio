
import React, {useRef, useEffect, useState, useContext} from "react";
import IconBootstrap from "./IconBootstrap.jsx";
import {motion, AnimatePresence} from "motion/react"
import { MotionButton } from "./Button.jsx";
import { Link, useNavigate } from "react-router";
import Icon from "./Icon.jsx"
import { userContext } from "../App.jsx";
import { postFetcher } from "../utils/fetcher.js";

const Header = () => {

    const [showMiniMenu,setShowMiniMenu] = useState(false);
    const headerRef = useRef(null);
    const {logged_in,setError,refreshFunction} = useContext(userContext);
    const nav = useNavigate();

    async function logoutUser() {
        const data = await postFetcher("/exercisapp/api/login/logout_user/")
        if(data.success){
            refreshFunction().then(()=>nav('/exercisapp/'))
        } else {
            setError(data);
        }
    }  


    const MenuOptions = [
    ].concat(logged_in?[
        {url:"/exercisapp/workouts", text:"Workouts"},
    ]:[]).map(each=>{
        return <Link 
            key={each.url}
            to={each.url}
            className="flex gap-1 items-center h-8 justify-center transition-all hover:text-xl hover:bg-secondaryTransparent hover:text-secondary p-1 px-2 rounded-md">
                {each.text}
        </Link>
    })

    MenuOptions.push(
        logged_in?
        <button 
            onClick={logoutUser}
            key="logout"
            className="flex gap-1 items-center h-8 justify-center transition-all hover:text-xl hover:bg-secondaryTransparent hover:text-secondary p-1 px-2 rounded-md">
                Log out
        </button>:
        <Link 
            key="login"
            to="/exercisapp/login"
            className="flex gap-1 items-center h-8 justify-center transition-all hover:text-xl hover:bg-secondaryTransparent hover:text-secondary p-1 px-2 rounded-md">
                Log in
        </Link>
    )

    useEffect(()=>{
        function checkClick(e){
            if(!headerRef.current.contains(e.target)){
                setShowMiniMenu(false);
                document.removeEventListener("click",checkClick);
            }
        }

        if(showMiniMenu){
            document.addEventListener("click",checkClick);
        }
        return ()=> document.removeEventListener("click",checkClick);
    },[showMiniMenu])

    return <header ref={headerRef} className="flex flex-col divide-y-4 divide-secondaryTransparent">
        <div className="flex p-4 h-24 justify-between z-[2] items-center shadow-md bg-primaryTransparent  backdrop-contrast-200">
            <Link to="/exercisapp">
                <motion.button 
                    whileHover={{scale:1.4}} 
                    style={{transformOrigin:"left"}} 
                    transition={{type:"tween"}} 
                    className="text-2xl text-secondary flex items-center transition-all duration-300 font-manrope cursor-pointer font-semibold rounded-md p-2 hover:font-normal hover:bg-secondaryTransparent">
                        <span className="max-sm:hidden font-racing">UnnamedApp</span><Icon icon="fitness_center"/>
                </motion.button>
            </Link>
            <MotionButton
                animate={{rotate:showMiniMenu?180:0}} 
                transition={{visualDuration:.5}} 
                className="h-7 w-7 md:hidden"
                icon="chevron-compact-down"
                onClick={()=>setShowMiniMenu(oldValue=>!oldValue)}
            />
            <div id="menu" className="hidden md:flex items-center gap-x-3">
                {MenuOptions}
            </div>
        </div>
        <AnimatePresence>
            {showMiniMenu && 
            <motion.div 
                exit={{translateY:"-100%",opacity:0}}
                initial={{translateY:"-100%",opacity:0}}
                animate={{translateY:"0%",opacity:1}}
                transition={{type:"tween"}}
                className="z-[1] md:hidden backdrop-contrast-200 bg-primaryTransparent flex flex-col items-stretch text-center divide-y-2 divide-secondaryTransparent">
                    {MenuOptions}
            </motion.div>}
        </AnimatePresence>
    </header>
}

export default Header;