import React, { useState } from "react";
import { useLoaderData, Link } from "react-router";
import BubbleDiv from "../components/BubbleDiv.jsx";
import MainContainer from "../components/MainContainer.jsx";
import HoverInput from "../components/HoverInput.jsx";

const Home =() => {
    const [amountOfCards,setAmountOfCards] = useState("5");
    const {tags} = useLoaderData();

    const categories = (tags||[]).map(each=>{

        return <Link to={`/cards/tag/${each.id}`} key={each.id} className={`h-20 relative hover:scale-105 transition-all overflow-hidden shadow-md border-[1px] border-stone-400 duration-300 justify-center text-center flex flex-col items-center p-2 bg-stone-100 rounded-xl`}>
            <div className="absolute left-0 z-0 h-full bg-blue-200" style={{width:`${Math.round(each.studied_words/each.word_amount*100)}%`}}>
            </div>
            <div className="z-[1]">
            {each.name}
            <p>{each.studied_words}/{each.word_amount}</p>
            </div>
        </Link>
    })

    const games = ([{id:`match/${amountOfCards}`,name:"Match"},{id:`new/${amountOfCards}`,name:"Study new"},{id:`known/${amountOfCards}`,name:"Study known"},{id:`annotate/${amountOfCards}`,name:"Annotate"},{id:"create_new/",name:"Create new"}]).map(each=>{

        return <Link to={`/cards/${each.id}`} key={each.id} className="h-20 hover:scale-105 transition-all duration-300 justify-center text-center flex items-center p-2 shadow-md bg-stone-100 border-[1px] border-stone-400 rounded-xl">
            {each.name}
            
        </Link>
    })

    const totalwords = tags.reduce((agg,each)=>[agg[0]+each.studied_words,agg[1]+each.word_amount],[0,0])

    return <MainContainer size="xl">
        <BubbleDiv title={"Study categories"+` (${tags.length})`}>
            <div className="bg-stone-100 outline-1 outline-stone-400 overflow-hidden rounded-sm h-8 flex">
                <div style={{width:`${Math.round(totalwords[0]/totalwords[1]*100)}%`}} className="bg-indigo-400 overflow-x-hidden flex items-center justify-end px-1">{totalwords.join("/")}</div>
            </div>
            <div className="grid gap-2" style={{gridTemplateColumns:"repeat(auto-fit, minmax(230px, 1fr))"}}>
                {categories}
            </div>
        </BubbleDiv>
        <BubbleDiv title={"Games"}>
            <HoverInput label="Amount" value={amountOfCards||""} type="number" onInput={(e)=>{setAmountOfCards(e.target.value)}} name="amount-of-cards"/>
            <div className="grid gap-2" style={{gridTemplateColumns:"repeat(auto-fit, minmax(230px, 1fr))"}}>
                {games}
            </div>
        </BubbleDiv>
    </MainContainer>
}

export default Home;