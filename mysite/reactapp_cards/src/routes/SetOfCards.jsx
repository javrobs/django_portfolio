import React, { useContext, useState, useRef, useEffect } from "react";
import MainContainer from "../components/MainContainer.jsx";
import BubbleDiv from "../components/BubbleDiv.jsx";
import { useLoaderData, Link, useLocation } from "react-router";
import { userContext } from "../App.jsx";
import Button from "../components/Button.jsx";
import ModalConfirm from "../components/ModalConfirm.jsx";
import H1Title from "../components/H1Title.jsx";
import { motion } from "motion/react";
import HoverInput from "../components/HoverInput.jsx";

const SetOfCards = () => {
    const {cards:initialCards,title} = useLoaderData();
    const [cards,setCards] = useState(initialCards);
    const [activeCard,setActiveCard] = useState("");
    const {postFetcher} = useContext(userContext);
    const [editUserNotes,setEditUserNotes] = useState({});
    const editNoteInputRef = useRef(null);
    const loc = useLocation();

    useEffect(()=>{setCards(initialCards);setActiveCard("")},[loc.pathname]);

    useEffect(()=>{
        if(editUserNotes.id && editNoteInputRef.current){
            editNoteInputRef.current.focus();
        }
    },[editUserNotes.id])

    console.log(editUserNotes);
    
    function studyCard(e,id){
        console.log(e.target);
        setActiveCard(pastValue=>{
            if(id==pastValue){
                return pastValue;
            } else {
                increaseStudy(id);
                return id;
            }
        })
    } 

    async function increaseStudy(id){
        const {success,card} = await postFetcher(`/cards/api/study_word/`,{id});
        if(success){
            setCards(oldValues=>oldValues.map(each=>each.id==card.id?card:each));
        }
    }

    async function saveEditNotes(e){
        e.preventDefault();
        const {success,card} = await postFetcher(`/cards/api/save_user_notes/`,editUserNotes);
        if(success){
            setEditUserNotes({});
            setCards(oldValues=>oldValues.map(each=>each.id==card.id?card:each));
        }
    }

    function checkEnter(e){
        if(e.key=="Enter"){
            saveEditNotes(e);
        }
    }

    const cardArray = cards.map(each=>{
        return <Card 
            key={each.id} 
            data={each} 
            active={each.id==activeCard} 
            setCards={setCards}
            editNotes={()=>{setEditUserNotes({id:each.id,value:each.user_notes,title:each.word})}} 
            onClick={(e)=>studyCard(e,each.id)}/>
    })

    return <MainContainer size={"lg"}>
        <BubbleDiv title={title}>
            <div className="grid grid-flow-dense gap-2" style={{gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))"}}>
                {cardArray}
            </div>
        </BubbleDiv>
        <ModalConfirm show={editUserNotes.id} clickOutside={()=>setEditUserNotes({})}>
            <form className="flex flex-col gap-2" onSubmit={saveEditNotes}>
                <H1Title>{editUserNotes.title}</H1Title>
                <textarea ref={editNoteInputRef} onKeyDown={checkEnter} required className="shadow-inner outline-none" rows="5" cols="30" value={editUserNotes.value||""} onInput={(e)=>{setEditUserNotes(oldValue=>({...oldValue,value:e.target.value}))}}/>
                <Button icon="save">Save</Button>
            </form>
        </ModalConfirm>
    </MainContainer>
}

const Card = ({onClick,active,data,editNotes,className,styleContainer,setCards,...props}) => {
    const [editRelated,setEditRelated] = useState(false);
    const [value,setValue] = useState(data.relatedWords.map(each=>each.word).join(", "));
    const inputRef = useRef(null);
    const {postFetcher} = useContext(userContext);

    useEffect(()=>{
        if(editRelated){
            inputRef.current.focus()
        }
    },
    [editRelated])

    async function sendRelated(){
        const {success,newRelatedWords,card} = await postFetcher(`/cards/api/send_related_words/`,{id:data.id,relatedWords:value});
        if(success){
            setCards(oldValues=>oldValues.map(each=>each.id==card.id?card:each));
            setValue(newRelatedWords.map(each=>each.word).join(", "));
            setEditRelated(false);
        }
    }

    function checkKey({key}){
        if(key=="Enter"){
            sendRelated();
        }
    }
    
    return <div style={{perspective:"2000px",...styleContainer}}>
        <motion.div 
        animate={active?{zIndex:[0,1,1,0],rotateY:[0,90,270,360]}:{zIndex:[0,1,1,0],rotateY:[360,270,90,0]}} 
        transition={{times:[0,0.5,0.5,1],duration:.6}} 
        className={`flex relative flex-col rounded-lg overflow-hidden shadow-md aspect-[3/4] ${className||""}`}
        onClick={onClick}>
            <motion.div 
            animate={{zIndex:active?1:2}} 
            transition={{delay:0.3}} 
            className={`bg-gradient-to-br p-1 h-full w-full flex flex-col absolute items-center text-white justify-center text-2xl grow   ${data.studied?"from-indigo-950 to-rose-800":"from-amber-600 to-rose-800"}`}>
                {data.word}
                <p>({data.type})</p>
                Studied: {data.studied}
            </motion.div>
            <motion.div 
            animate={{zIndex:active?2:1}} 
            transition={{delay:0.3}} 
            className="bg-stone-200 gap-1 grow p-2 h-full w-full flex flex-col absolute">
                <p className="text-center font-semibold text-lg">{data.word}<br/>({data.type})</p>
                <div className="overflow-y-auto grow shadow-inner bg-white italic p-2" style={{scrollbarWidth:"none"}}>
                    {data.user_notes&&<div className="text-indigo-700 font-semibold">{data.user_notes}</div>}
                    {data.text}
                    <Button icon="edit" type="google" onClick={editNotes}></Button>
                </div>
                {editRelated?
                    <HoverInput autoComplete="off" onKeyDown={checkKey} onBlur={sendRelated} ref={inputRef} value={value||""} onInput={(e)=>setValue(e.target.value)} name="related-words" label="Related words"/>:
                    <div className="flex justify-between h-6 shrink-0 overflow-hidden">
                        <div className="grow overflow-x-auto text-nowrap flex items-center gap-1"  style={{scrollbarWidth:"none"}}>
                            {data.relatedWords.map(each=>{
                                return each.id?
                                    <Link key={each.word} className="bg-white rounded-full px-1 shadow-md underline text-indigo-900 text-sm" to={`/cards/tag/${each.tag__id}`}>{each.word}</Link>:
                                    <div key={each.word} className="bg-white rounded-full px-1 shadow-md text-sm">{each.word}</div>
                            })}
                        </div>
                        <Button className={"ms-auto !h-6"} icon="linked_services" type="google" onClick={()=>setEditRelated(true)}></Button>
                    </div>
                }
            </motion.div>
        </motion.div>
    </div>
}

export default SetOfCards;
