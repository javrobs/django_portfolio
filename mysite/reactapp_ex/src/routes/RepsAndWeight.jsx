import React, {useState, useContext,useEffect} from "react";
import { useLoaderData, useParams, Link, useNavigate } from "react-router";
import MainContainer from "../components/MainContainer.jsx";
import BubbleDiv from "../components/BubbleDiv.jsx";
import HoverInput from "../components/HoverInput.jsx";
import { userContext } from "../App.jsx";
import Button from "../components/Button.jsx";
import Icon from "../components/Icon.jsx";
import { motion } from "motion/react";
import H1Title from "../components/H1Title.jsx";
import { postFetcher } from "../utils/fetcher.js";
import ListOfCols from "../components/ListOfCols.jsx";

const RepsAndWeight = () => {
    const {orderID} = useParams();
    const load = useLoaderData();
    const [formState,setFormState] = useState(load);
    const {setError} = useContext(userContext);
    const nav = useNavigate();

    useEffect(()=>{
        if(JSON.stringify(load)!=JSON.stringify(formState)){
            setFormState(load)
        }},
    [load])

    function goToNext() {
        nav(`/exercisapp/today/${load.next[0]}`);
    }

    const difficultyRef = [
        ["Too easy","hover:text-cyan-400","text-cyan-500"],
        ["Easy","hover:text-emerald-400","text-emerald-500"],
        ["Normal","hover:text-lime-400","text-lime-500"],
        ["Hard","hover:text-amber-400","text-amber-500"],
        ["Too hard","hover:text-red-400","text-red-500"]
    ]
    

    async function editWeight(set,e){
        setFormState(oldState=>{
            const matchIndex = oldState.currentState[set]||{};
            return {...oldState,currentState:{...oldState.currentState,[set]:{...matchIndex,"weight":Number(e.target.value)}}}
        });
    }

    function handleCheck({target}){
        updateState("",{[target.name]:target.value});
    }
    
    function setWeight(set,e){
        updateState(set,{weight:e.target.value})
    }

    function setDifficulty(set,value){
        updateState(set,{difficulty:value});
    }

    function markAsWarmup(set){
        updateState(set,{warmup:true});
    }

    function setReps(set,value){
        updateState(set,{reps:value});
    }

    async function updateState(set,passBody){
        const {success,...freshState} = await postFetcher(
            `/exercisapp/api/set_rep_weight/${orderID}/`,
            {
                set:set,
                session:formState.session,
                id:formState.id,
                exercise_id:formState.exercise_id,
                ...passBody
            });
        if(success){
            setFormState(freshState);
        } else{
            setError({tag:freshState.tag||false,message:freshState.message||"Unknown error, didn't save"})
        }  
    }

    const sets = Array(load.sets + Object.values(formState.currentState).filter(each=>each.warmup).length).fill("1").map((each,i)=>{
        const matchSet = formState.currentState[i+1] || {};
        console.log(matchSet)
        return <div className={`shadow-md from-zinc-800 to-zinc-900 bg-gradient-to-br overflow-hidden rounded-md p-1`} key={i}>
            <div className="flex gap-2 pb-2 px-3">
                <div className="flex">
                <HoverInput
                    className={"!w-28"}
                    label="Weight"
                    name={`weight-${i+1}`}
                    type="number"
                    value={matchSet.weight||""}
                    onBlur={(e)=>setWeight(i+1,e)}
                    onInput={(e)=>editWeight(i+1,e)}
                />
                </div>
                <motion.button 
                    animate={{boxShadow:matchSet.warmup?"0 0 0 100dvw #43140AAA":"0 0 0 0dvw #431407AA"}}
                    transition={{duration:.6,type:"linear"}}
                    className={`mt-3 hover:bg-orange-950 ${matchSet.warmup?"bg-orange-950 text-orange-500":""} transition-all hover:text-orange-400 rounded-full w-8 h-8 flex items-center justify-center`} 
                    onClick={()=>markAsWarmup(i+1)}
                >
                    <Icon icon="local_fire_department"/>
                </motion.button>
                {!matchSet.warmup&&<div className="items-center flex mt-3 ms-auto">
                    {difficultyRef[matchSet.difficulty-1] && <span className={`me-2 mb-1 text-xs italic ${difficultyRef[matchSet.difficulty-1][2]}`}>{difficultyRef[matchSet.difficulty-1][0]}</span>}
                    {difficultyRef.map((each,j)=>{
                        return <button key={each[0]} className={`${matchSet.difficulty>j?difficultyRef[matchSet.difficulty-1][2]:"text-zinc-400"} ${each[1]} transition-all ${j==0?"rounded-s-full":""}  ${j==4?"rounded-e-full":""}`} onClick={()=>setDifficulty(i+1,j+1)}>
                            <Icon icon="fitness_center"/>
                        </button>
                    })}
                </div>}
            </div>
            <div className="flex">
                {Array(load.rep_range[1]-load.rep_range[0]+5).fill("0").map((_,k)=>{
                    const value=k+load.rep_range[0]-2
                    const hoverBG = value>load.rep_range[1]?
                        "bg-cyan-500":
                        (value<load.rep_range[0]?
                            "bg-red-500":
                            (value==load.rep_range[1]?
                                "bg-lime-500":
                                "bg-amber-500"));
                    return <button 
                        key={k} 
                        className={`grow ${hoverBG} ${value==matchSet.reps?"bg-opacity-80":"bg-opacity-15"} transition-all hover:bg-opacity-100 p-1 ${k==0?"rounded-s-full":""} ${value==load.rep_range[1]?"border-2 border-lime-500":""}  ${k==load.rep_range[1]-load.rep_range[0]+4?"rounded-e-full":""}`}
                        onClick={()=>setReps(i+1,value)}>
                            {value}
                    </button>
                })}
            </div>
            {matchSet.warmup&&<p className="text-xs italic">Warmup sets don't count towards the required sets</p>}
        </div>
    })

    return <MainContainer size="md">
        <BubbleDiv className="!gap-3">
            <div className="flex flex-wrap justify-between items-center gap-2">
                <H1Title className="!text-start">{load.name}</H1Title>
                <div className="flex items-center gap-2">
                <fieldset className="flex flex-col gap-1 bg-zinc-900 rounded-lg px-2">
                    <label className="flex gap-1"><input type="radio" className="accent-lime-400" name="units" value="lbs" onChange={handleCheck} checked={!formState.uses_kilos}/>Pounds</label>
                    <label className="flex gap-1"><input type="radio" className="accent-lime-400" name="units" value="kgs" onChange={handleCheck}  checked={formState.uses_kilos}/>Kilos</label>
                </fieldset>
                <fieldset className="flex flex-col gap-1 bg-zinc-900 rounded-lg px-2">
                    <label className="flex gap-1"><input type="radio" className="accent-lime-400" name="side" value="whole" onChange={handleCheck}  checked={!formState.per_side}/>Whole</label>
                    <label className="flex gap-1"><input type="radio" className="accent-lime-400" name="side" value="perside" onChange={handleCheck}  checked={formState.per_side}/>Per side</label>
                </fieldset>
                </div>
            </div>
            {load.uses_bar&&<p className="italic text-xs">The weight of the bar (20kg) is already accounted for.</p>}
            <ListOfCols>
            {sets}
            </ListOfCols>
            {load.next[0]?
                <Button onClick={goToNext}>Next!</Button>:
                <div>This is the end of your workout!</div>
            }
        </BubbleDiv>
    </MainContainer>
}

export default RepsAndWeight;