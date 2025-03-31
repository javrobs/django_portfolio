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
    const {success,currentState,workout_session_info:workoutSessionInfo,...load} = useLoaderData();
    const [formState,setFormState] = useState({currentState:{},workoutSessionInfo:{}});
    const {setError} = useContext(userContext);
    const nav = useNavigate();


    console.log(load,formState)

    useEffect(()=>{
        console.log("load id changed")
        setFormState({currentState,workoutSessionInfo})
    },[load.exercise_id]);

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

    function increase(set){
        updateState(set,{operation:"increase"});
    }
    function decrease(set){
        updateState(set,{operation:"decrease"});
    }
    function clone(set){
        updateState(set,{operation:"clone"});
    }
    function copyLast(set){
        updateState(set,{operation:"copyLast"});
    }

    function editStep(e){
        setFormState(oldState=>({...oldState,workoutSessionInfo:{...oldState.workoutSessionInfo,step:e.target.value}}));
    }

    function handleCheck({target}){
        updateState("",{operation:target.name,value:target.value});
    }
    
    function setWeight(set,e){
        updateState(set,{operation:"weight",value:e.target.value})
    }

    function setDifficulty(set,value){
        updateState(set,{operation:"difficulty",value});
    }

    function markAsWarmup(set){
        updateState(set,{operation:"warmup"});
    }

    function setReps(set,value){
        updateState(set,{operation:"reps",value});
    }

    async function endWorkout(e){
        const {success,...freshState} = await postFetcher(
            `/exercisapp/api/end_session/`,
            {});
        console.log("updated",success)
        if(success){
            nav("/exercisapp/");
        } else{
            setError({tag:freshState.tag||false,message:freshState.message||"Unknown error, didn't save"})
        }
    }


    async function updateState(set,passBody){
        const {success,...freshState} = await postFetcher(
            `/exercisapp/api/set_rep_weight/${orderID}/`,
            {
                set:set,
                session:load.session,
                id:formState.workoutSessionInfo?.id,
                exercise_id:load.exercise_id,
                ...passBody
            });
        console.log("updated",success)
        if(success){
            console.log(freshState)
            setFormState(freshState);
        } else{
            setError({tag:freshState.tag||false,message:freshState.message||"Unknown error, didn't save"})
        }  
    }

    const sets = Array(load.sets + Object.values(formState.currentState).filter(each=>each.warmup).length).fill("1").map((each,i)=>{
        const matchSet = formState.currentState[i+1] || {};
        const lastSet = load.lastState[i+1] || {};
        console.log(lastSet);
        return <div className={`shadow-md from-zinc-800 to-zinc-900 bg-gradient-to-br flex-col flex gap-2 overflow-hidden rounded-md p-2`} key={i}>
            <div className="flex items-center gap-2">
                <motion.button 
                    animate={{boxShadow:matchSet.warmup?"0 0 0 100dvw #43140AAA":"0 0 0 0dvw #431407AA"}}
                    transition={{duration:.6,type:"linear"}}
                    className={` hover:bg-orange-950 ${matchSet.warmup?"bg-orange-950 text-orange-500":""} transition-all hover:text-orange-400 rounded-full w-6 h-6 flex items-center justify-center`} 
                    onClick={()=>markAsWarmup(i+1)}
                >
                    <Icon icon="local_fire_department"/>
                </motion.button>
                {lastSet?.weight&&
                <button onClick={()=>copyLast(i+1)} className="bg-zinc-950 h-6 text-nowrap transition-colors hover:bg-lime-700 px-2 gap-1 flex items-center rounded-full text-sm">
                    Last: {lastSet.warmup&&<Icon className={"text-sm"} icon="local_fire_department"/>} {lastSet.weight}{load.last_workout_session_info?.uses_kilos?"kg":"lb"} x {lastSet.reps}
                    <Icon className="!text-sm" icon="replay"/>
                </button>}   
                {!matchSet.warmup&&<div className="ms-auto items-center justify-end flex flex-wrap">
                    {difficultyRef[matchSet.difficulty-1] && <span className={`me-2 mb-1 text-xs italic ${difficultyRef[matchSet.difficulty-1][2]}`}>{difficultyRef[matchSet.difficulty-1][0]}</span>}
                    <div className="flex items-center">
                        {difficultyRef.map((each,j)=>{
                        return <button key={each[0]} className={`${matchSet.difficulty>j?difficultyRef[matchSet.difficulty-1][2]:"text-zinc-400"} flex w-6 h-6  items-center ${each[1]} transition-all ${j==0?"rounded-s-full":""}  ${j==4?"rounded-e-full":""}`} onClick={()=>setDifficulty(i+1,j+1)}>
                            <Icon icon="fitness_center"/>
                        </button>
                    })}
                    </div>
                </div>}
            </div>
            <div className="flex relative">
                <HoverInput
                    className={`!px-2`}
                    classNameLabel="grow"
                    label="Weight"
                    name={`weight-${i+1}`}
                    type="number"
                    value={matchSet.weight||""}
                    stayActive={true}
                    onBlur={(e)=>setWeight(i+1,e)}
                    onInput={(e)=>editWeight(i+1,e)}
                />
                <div className="absolute right-0 mt-3 flex">
                    {i>0&&Boolean(formState.currentState[i]?.weight)&&
                    <button 
                        className={`hover:bg-sky-600 rounded-full transition-all hover:text-sky-200 w-8 h-8 flex items-center justify-center`} 
                        onClick={()=>clone(i+1)}
                    ><Icon icon="place_item"/>
                    </button>}
                    {Boolean(matchSet.weight)&&<><button 
                        className={`hover:bg-lime-600  transition-all hover:text-lime-200 rounded-full w-8 h-8 flex items-center justify-center`} 
                        onClick={()=>increase(i+1)}
                    ><Icon icon="arrow_warm_up"/>
                    </button>
                    <button 
                        className={`hover:bg-orange-600  transition-all hover:text-orange-200 rounded-full w-8 h-8 flex items-center justify-center`} 
                        onClick={()=>decrease(i+1)}
                    ><Icon icon="arrow_cool_down"/>
                    </button></>}
                
                </div>
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
                        className={`grow ${hoverBG} ${value==matchSet.reps?"bg-opacity-80":"bg-opacity-15"} transition-all hover:bg-opacity-100 ${""} p-1 ${k==0?"rounded-s-full":""} ${k==load.rep_range[1]-load.rep_range[0]+4?"rounded-e-full":""}`}
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
                <div className="flex items-stretch gap-2">
                    <fieldset className="px-2 w-24 bg-zinc-900 rounded-lg flex flex-col">
                        <HoverInput 
                            label="Step"
                            onInput={editStep} 
                            onBlur={handleCheck}
                            name="step"
                            type="number"
                            min={0}
                            value={formState.workoutSessionInfo?.step||load.last_workout_session_info?.step||""}
                            stayActive={true}
                        />
                        {/* 
                        className={"!rounded-e-none !px-2"}
                        classNameLabel="grow"
                        */}
                    </fieldset>
                    <fieldset className="flex flex-col gap-1 bg-zinc-900 rounded-lg px-2 w-24">
                        <label className="flex gap-1"><input type="radio" className="accent-lime-400" name="units" value="lbs" onChange={handleCheck} checked={formState.workoutSessionInfo?.uses_kilos===false||load.last_workout_session_info?.uses_kilos==false}/>Pounds</label>
                        <label className="flex gap-1"><input type="radio" className="accent-lime-400" name="units" value="kgs" onChange={handleCheck}  checked={formState.workoutSessionInfo?.uses_kilos===true||load.last_workout_session_info?.uses_kilos==true}/>Kilos</label>
                    </fieldset>
                    <fieldset className="flex flex-col gap-1 bg-zinc-900 rounded-lg px-2 w-24">
                        <label className="flex gap-1"><input type="radio" className="accent-lime-400" name="side" value="whole" onChange={handleCheck}  checked={formState.workoutSessionInfo?.per_side===false||load.last_workout_session_info?.per_side==false}/>Whole</label>
                        <label className="flex gap-1"><input type="radio" className="accent-lime-400" name="side" value="perside" onChange={handleCheck}  checked={formState.workoutSessionInfo?.per_side===true||load.last_workout_session_info?.per_side==true}/>Per side</label>
                    </fieldset>
                </div>
            </div>
            {load.uses_bar&&<p className="italic text-xs">The weight of the bar (20kg) is already accounted for.</p>}
            <ListOfCols>
            {sets}
            </ListOfCols>
            {load.next?
                <Link className="w-full flex flex-col" to={`/exercisapp/today/${load.next}`}><Button>Next!</Button></Link>:
                <Button onClick={endWorkout}>Finish workout!</Button>
            }
        </BubbleDiv>
    </MainContainer>
}

export default RepsAndWeight;