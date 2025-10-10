import React, { useEffect, useState } from "react";
import MainContainer from "../components/MainContainer.jsx";
import BubbleDiv from "../components/BubbleDiv.jsx";
import { Link, replace, useLoaderData, useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";
import Button from "../components/Button.jsx";

const MatchGame = () => {
    const {cards} = useLoaderData();
    const [row,setRow] = useState([]);
    const [selectedId,setSelectedId] = useState(["",""]);
    const [errorChoice,setErrorChoice] = useState(["",""]);
    const loc = useLocation();
    const nav = useNavigate();

    useEffect(initialize,[])

    function initialize(){
        const row = cards.map(({id,word,type})=>[{id,word,type}]);
        const cardBack = cards.map(({id,relatedWords,user_notes})=>({id,relatedWords,user_notes}));
        for(let i = 0;i<row.length;i++){
            const randIndex = Math.floor(Math.random() * (cardBack.length))
            row[i].push(cardBack.splice(randIndex,1)[0]);
        }
        setRow(row);
    }

    function refresh(){
        nav(0,{replace:true})
    }
    
    function selectFront(id){
        if (selectedId[1]&&selectedId[1]!=id){
            setErrorChoice([id,selectedId[1]])
            setSelectedId(["",""])
        } else if(selectedId[1]==id){
            setSelectedId(["",""]);
            setRow(oldValue=>{
                const matchValue = oldValue.find(each=>each[0].id==id)
                return oldValue.filter(each=>each[0].id!=id).map(each=>each[1].id==id?[each[0],matchValue[1]]:each);
            })
        } else {
            setSelectedId([id,""])
            setErrorChoice(["",""])
        }
    }
    
    function selectBack(id){
        if (selectedId[0]&&selectedId[0]!=id){
            setErrorChoice([selectedId[0],id])
            setSelectedId(["",""])
        } else if(selectedId[0]==id){
            setSelectedId(["",""]);
            setRow(oldValue=>{
                const matchValue = oldValue.find(each=>each[1].id==id)
                return oldValue.filter(each=>each[1].id!=id).map(each=>each[0].id==id?[matchValue[0],each[1]]:each);
            })
        } else {
            setSelectedId(["",id])
            setErrorChoice(["",""])
        }
    }

    const gridArray = row.map(([front,back])=>{
        return  <div className="grid grid-cols-2 gap-2" key={front.id}>
                <motion.button 
                    animate={errorChoice[0]==front.id?
                        {rotate:[0,1,-1,1,0],backgroundColor:["#E7E5E4","#FB7185","#FB7185","#FB7185","#E7E5E4"]}:
                        (selectedId[0]==front.id?
                            {rotate:[-1,1,-1],transition:{repeat:Infinity,duration:.5}}:
                            {rotate:0,backgroundColor:"#E7E5E4"}
                        )
                    } 
                    initial={{rotate:0,backgroundColor:"#E7E5E4"}} 
                    onClick={()=>selectFront(front.id)}
                    className="shadow-md origin-center rounded-md flex justify-center items-center flex-col p-2"
                >
                    <p className="text-center">{front.word}</p>
                    <p className="text-center">({front.type})</p>
                </motion.button>
                <motion.button 
                    animate={errorChoice[1]==back.id?
                        {rotate:[0,1,-1,1,0],backgroundColor:["#E7E5E4","#FB7185","#FB7185","#FB7185","#E7E5E4"]}:
                        (selectedId[1]==back.id?
                            {rotate:[-1,1,-1],transition:{repeat:Infinity,duration:.5}}:
                            {rotate:0,backgroundColor:"#E7E5E4"}
                        )} 
                    initial={{rotate:0,backgroundColor:"#E7E5E4"}}
                    onClick={()=>selectBack(back.id)} className="bg-stone-200 shadow-md rounded-md flex justify-center items-center flex-col p-2"
                >
                    {back.user_notes&&<p className="text-center">{back.user_notes}</p>}
                    {back.relatedWords.length>0&&<p className="text-center">{back.relatedWords.map(each=>each.word).join(", ")}</p>}
                </motion.button>
        </div>
    })

    return <MainContainer size={"md"}>
        <BubbleDiv title="Match game">
                
                {gridArray}
            {row.length==0 && <Button icon="undo" type="google" onClick={refresh}>Again</Button> }
            
        </BubbleDiv>
    </MainContainer>
}

export default MatchGame;