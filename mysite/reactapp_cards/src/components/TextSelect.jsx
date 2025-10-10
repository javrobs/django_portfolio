import React, { useState, useRef, useEffect, useContext} from "react"
import { userContext } from "../App.jsx";
import lowerCaseNoAccent from "../utils/lowerCaseNoAccent.js"
import { motion } from "motion/react";

const TextSelect = ({label,className,idName,optionList,value,changeState,inFlex}) => {
    const [searchValue,setSearchValue] = useState(optionList.find(({id})=>id==value)?.text||"");
    const [showList,setShowList] = useState(false);
    const [isFocused,setFocused] = useState(false);
    const {error} = useContext(userContext);
    const inputRef = useRef(null);
    const divRef = useRef(null);

    const listOfMatches = optionList
        .filter(({text})=>lowerCaseNoAccent(text).includes(lowerCaseNoAccent(searchValue)))
        .map(({id,text})=>(
        <button 
            type="button" 
            onClick={()=>selectOption(id)} 
            className="px-3 w-full py-1 text-start bg-zinc-800 hover:bg-lime-600" 
            key={id}
        >
            {text}
        </button>));

    function manageInput(e){
        setSearchValue(e.target.value);
    }

    function checkEnter(e){
        if(e.key=="Enter"){
            e.preventDefault();
            const {id} = optionList.find(({text})=>lowerCaseNoAccent(text).includes(lowerCaseNoAccent(searchValue)))
            selectOption(id)
        }
    }

    function selectOption(id){
        setSearchValue("");
        changeState(id);
        setShowList(false);
        inputRef.current.blur();
    }


    useEffect(()=>{
        if(showList){
            function listenForClickOut(e){
                if(divRef.current !== e.target && !divRef.current.contains(e.target)){
                    setShowList(false);
                    inputRef.current.blur();
                    window.removeEventListener("click", listenForClickOut)
                } 
            }
            window.addEventListener("click", listenForClickOut)
            return () => {window.removeEventListener("click", listenForClickOut)}
        }
    },[showList])

    return <div className={`flex flex-col  ${className}`} ref={divRef} >
        <motion.label animate={{x:error?.tag==idName?[0,2,-2,0]:0}} transition={{duration:.3}} className={`relative mt-3 `}>
            <input ref={inputRef} 
                className={`p-1 h-8 text-white shadow-sm px-3 focus:outline-secondary rounded-full w-full ${showList?"!rounded-b-none !rounded-t-xl":""}  ${searchValue||isFocused?"text-white":"text-black"} ${error?.tag==idName?"bg-rose-800":"bg-zinc-950"} `}
                type="text" 
                onChange={manageInput} 
                onFocus={()=>{setShowList(true);setFocused(true)}}
                onKeyDown={checkEnter}
                onBlur={()=>setFocused(false)}
                id={idName} 
                name={idName}
                value={searchValue}
            />
            <span className={`absolute text-white transition-all ${error?.tag==idName?"bg-rose-800":"bg-zinc-950"} ${searchValue||isFocused?" rounded-md px-2 text-sm -top-3 left-4":"left-3 top-[5px]"}`}>{error?.tag==idName?error.message:label}</span>
        </motion.label>
        <div className="relative">
            {showList && 
            <div className="z-10 max-h-[30dvh] border-lime-600  border-2 border-t-0 shadow-md rounded-b-xl overflow-auto no-scrollbar-x absolute w-full divide-y-[1px] bg- divide-lime-600">
                {listOfMatches}
            </div>}
        </div>
    </div>
}


export default TextSelect;