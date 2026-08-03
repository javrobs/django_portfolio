import React, { useState, useRef, useEffect, useContext} from "react"
import lowerCaseNoAccent from "../utils/lowerCaseNoAccent.js"
import { AnimatePresence, motion } from "motion/react";


/**
 * 
 * @param {{id: number, text: string}[]} optionList - Array of objects with id and text properties [{id:1,text:"Option 1"},{id:2,text:"Option 2"}]
 * @param {String} label - Label for the select input
 * @param {String} className - Class name for the select container 
 * @param {String} idName - ID for the select input
 * @param {String} labelClassname - Class name for the label
 * @param {Number} value - Current value of the select
 * @param {Function} changeState - Function to update the state
 * @param {Boolean} takeInput - Whether the select should take input
 * @param {Boolean} readOnly - Whether the select should be read-only
 */
const Select = ({label,className,idName,optionList=[{id:0,text:"La lista está vacía"}],labelClassname="",value=0,changeState=()=>{alert("Element is not plugged to state")},takeInput=true,readOnly=false}) => {
    const [searchValue,setSearchValue] = useState(optionList.find(({id})=>id==value)?.text||"");
    const [showList,setShowList] = useState(false);
    const inputRef = useRef(null);
    const divRef = useRef(null);
    const contextualMenuRef = useRef(null);
    const [maxHeight,setMaxHeight] = useState("auto");

    function updateMaxHeight(){
        const {bottom:bottomMain} = document.getElementsByTagName("main")[0].getBoundingClientRect();
        const {bottom:divRefBottom} = divRef.current?.getBoundingClientRect()||{bottom:0};
        if(divRefBottom < bottomMain) {
            setMaxHeight(`${bottomMain - divRefBottom - 10}px`);
        }

    }

    useEffect(()=>{
        window.addEventListener("resize",updateMaxHeight);
        document.getElementById("root").addEventListener("scroll",updateMaxHeight);
        return ()=>{window.removeEventListener("resize",updateMaxHeight);}
    },[]);


    const listOfMatches = optionList
        .filter(({text})=>takeInput?lowerCaseNoAccent(text).includes(lowerCaseNoAccent(searchValue)):true)
        .map(({id,text})=>(
        <button 
            type="button" 
            onClick={()=>selectOption(id)} 
            className="px-3 w-full py-1 text-start bg-white hover:bg-slate-200" 
            key={id}
        >
            {text}
        </button>));

    function manageInput(e){
        if(takeInput) setSearchValue(e.target.value);
    }

    function checkEnter(e){
        if(e.key=="Enter"){
            e.preventDefault();
            const {id} = optionList.find(({text})=>lowerCaseNoAccent(text).includes(lowerCaseNoAccent(searchValue)))
            selectOption(id)
        }
    }

    function selectOption(id){
        setSearchValue(optionList.find(each=>each.id==id)?.text);
        changeState(id);
        setShowList(false);
        inputRef.current.blur();
    }

    useEffect(()=>{
        const matchWithValue = optionList.find(({text}) => {
            return lowerCaseNoAccent(text) == lowerCaseNoAccent(searchValue)
        });
        inputRef.current.setCustomValidity(matchWithValue && matchWithValue.id == value?"":"Elige un elemento de la lista")
    },[searchValue])

    useEffect(()=>{
        if(!value){
            setSearchValue("");
        }
    },[value])

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

    return <div className={`flex flex-col ${className}`} ref={divRef} >
        <label  className={` ${labelClassname} relative overflow-hidden flex flex-col justify-end h-14 ${showList?"border-sky-800 border-2 rounded-t-md":"rounded-md"} shadow-sm bg-white `}>
            <input ref={inputRef} 
                className={`p-1 h-8 w-full !bg-transparent px-2 outline-none`}
                type="text" 
                onChange={takeInput ? manageInput:()=>{}} 
                onFocus={()=>{updateMaxHeight();setShowList(true)}}
                onKeyDown={checkEnter}
                id={idName} 
                name={idName}
                value={searchValue}
                readOnly={readOnly}
                inputMode={takeInput?"text":"none"}
                required
                autoComplete="off"
            />
            <span className={`absolute transition-all -translate-y-1/2 ${searchValue||showList?"text-sm top-3 left-2":"top-1/2 left-2"}`}>{label}</span>
        </label>
        <div className="relative">
            <AnimatePresence>
                {showList && !readOnly &&
                <motion.div ref={contextualMenuRef} animate={{opacity:[0,1]}} exit={{opacity:[1,0]}} style={{maxHeight}} className="z-20 border-sky-800  border-2 border-t-0 shadow-md rounded-b-xl overflow-auto no-scrollbar-x absolute w-full divide-y-[1px] divide-sky-800">
                    {listOfMatches}
                </motion.div>}
            </AnimatePresence>
        </div>
    </div>
}


export default Select;