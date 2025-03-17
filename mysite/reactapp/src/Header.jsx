
import React, {useRef, useEffect, useState} from "react";
import IconBootstrap from "./IconBootstrap.jsx";
import {motion, AnimatePresence} from "motion/react"
import { MotionButton } from "./Button.jsx";

const Header = ({refs}) => {

    const [showMiniMenu,setShowMiniMenu] = useState(false);
    const headerRef = useRef(null);

    
    function scrollToRef(refChoice){
        console.log("trying to scroll",refChoice.current)
        refChoice.current.scrollIntoView({block:"start",behavior:"smooth"})
    }

    const MenuOptions = () => {
        const classNames = "flex gap-1 items-center h-8 justify-center transition-all hover:text-xl hover:bg-primaryLightTransparent p-1 px-2 rounded-md";

        return <>
            <button className={classNames} onClick={()=>scrollToRef(refs.projects)}><IconBootstrap icon="terminal"/>Projects</button>
            <button className={classNames} onClick={()=>scrollToRef(refs.resume)}><IconBootstrap icon="file-earmark-text"/>Resume</button>
            <a className={classNames} href="mailto:javieroblesamar@gmail.com"><IconBootstrap icon="person-vcard"/>Contact me</a>
        </>
    }

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

    return <header ref={headerRef} className="flex flex-col">
        <div className="flex p-4 h-24 justify-between z-[2] items-center shadow-md bg-primaryTransparent backdrop-blur-sm">
            <button className="text-2xl text-secondary transition-all duration-300 font-manrope cursor-pointer  font-semibold rounded-md p-2 hover:text-4xl hover:font-normal hover:bg-secondaryTransparent" onClick={()=>scrollToRef(refs.about)}>Javier Robles Samar</button>
            <MotionButton
                animate={{rotate:showMiniMenu?180:0}} 
                transition={{visualDuration:.5}} 
                className="h-7 w-7 md:hidden"
                onClick={()=>setShowMiniMenu(oldValue=>!oldValue)}>
                    <IconBootstrap icon="chevron-compact-down"/>
            </MotionButton>
            <div id="menu" className="hidden md:flex items-center gap-x-3">
                <MenuOptions/>
            </div>
        </div>
        <AnimatePresence>
            {showMiniMenu && 
            <motion.div 
                exit={{translateY:"-100%",opacity:0}}
                initial={{translateY:"-100%",opacity:0}}
                animate={{translateY:"0%",opacity:1}}
                transition={{type:"tween"}}
                className="z-[1] md:hidden backdrop-blur-sm bg-primaryTransparent flex flex-col items-stretch text-center divide-y-2 divide-slate-950">
                    <MenuOptions/>
            </motion.div>}
        </AnimatePresence>
    </header>
}

export default Header;