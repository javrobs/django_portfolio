import React, { useContext, useState } from "react";
import {Link, useLoaderData} from "react-router"
import MainContainer from "../components/MainContainer.jsx"
import BubbleDiv from "../components/BubbleDiv.jsx"
import H1Title from "../components/H1Title.jsx";
import Button from "../components/Button.jsx";
import ListOfCols from "../components/ListOfCols.jsx";
import ModalConfirm from "../components/ModalConfirm.jsx";
import {getFetcher,postFetcher} from "../utils/fetcher.js";
import ListOfTags from "../components/listOfTags.jsx";
import { userContext } from "../App.jsx";


const Workouts = () => {
    const {my_workouts} = useLoaderData();
    const [workoutState,setWorkoutState] = useState(my_workouts);
    const [show,setShow] = useState({});
    const [deleteThis,setDeleteThis] = useState({});
    const {setError} = useContext(userContext);

    const myWorkouts = workoutState.map((each,i)=>{
        const buttons = <>
            {each.active?<>
                <Button className={"h-7 w-7 flex text-lg items-center"} disabled={i==0} icon="arrow_upward" onClick={()=>modifyWorkouts(each.id,"up")} type="google"/>
                <Button className={"h-7 w-7 flex text-lg items-center"} disabled={i+1==workoutState.filter(each=>each.active).length} icon="arrow_downward" onClick={()=>modifyWorkouts(each.id,"down")} type="google"/>
            </>:<Button className={"h-7 w-7 flex text-lg items-center !text-rose-100 !bg-rose-800 hover:bg-rose-500 !ring-rose-900 !ring-opacity-35"}  icon="delete" onClick={()=>setDeleteThis({show:true,id:each.id,name:each.name})} type="google"/>}
            <Link to={"/exercisapp/edit-workout/"+each.id+"/"}>
                <Button className={"h-7 w-7 flex text-lg items-center"} icon="edit" type="google"/>
            </Link>
            <Button className={"h-7 w-7 flex text-lg items-center"} icon="description" onClick={()=>showDetails(each.id)} type="google"/>
            {each.active?
            <Button className={"h-7 w-7 flex text-lg items-center"} icon="remove" onClick={()=>modifyWorkouts(each.id,"remove")} type="google"/>:
            <Button className={"h-7 w-7 flex text-lg items-center"} icon="add" onClick={()=>modifyWorkouts(each.id,"add")} type="google"/>}
        </>
        return <WorkoutCard workout={each} buttons={buttons} key={each.id}/>
    })

    async function showDetails(id){
        const data = await getFetcher("/exercisapp/api/load/workout_details/"+id+"/");
        setShow({show:true,...data});
    }

    async function modifyWorkouts(id,instruction){
        const {success,...data} = await postFetcher(`/exercisapp/api/edit_workouts/${id}/`,{id,instruction});
        if(success){
            setWorkoutState(data.my_workouts)
        } else {
            setError({tag:data.tag||false,message:data.message||"Unknown error, didn't save"})
        }
    }

    return <MainContainer size="md">
        <BubbleDiv>
            <div className="flex gap-1 items-center justify-between">
                <H1Title>My workouts</H1Title>
                <Link to="/exercisapp/create-workout/">
                    <Button icon='add' type="google"/>
                </Link>
            </div>
            <p>These are the workouts you've made or copied, it is your right to edit them freely.</p>
            {Boolean(myWorkouts.length)?
                <ListOfCols>{myWorkouts}</ListOfCols>:
                <div className="rounded-md shadow-md bg-zinc-900 p-2">
                    You have never made a workout, it's really simple! What are you waiting for?
                </div>
            }
        </BubbleDiv>
        <ModalConfirm show={show.show} clickOutside={()=>{setShow({})}}>
            <H1Title>{show.name}</H1Title>
            {(show.exercises||[]).map(each=><div key={each}>{each}</div>)}
            <Button type="google" icon="undo" onClick={()=>{setShow({})}}/>
        </ModalConfirm>
        <ModalConfirm show={deleteThis.show} clickOutside={()=>{setDeleteThis({})}}>
            <H1Title>Do you really want to delete "{deleteThis.name}"?</H1Title>
            <p>This action <span className="font-extrabold underline text-rose-500">CANNOT</span> be undone. I'm serious!</p>
            <div className="flex gap-2 flex-wrap">
                <Button className={"grow basis-0"} type="google" icon="undo" onClick={()=>{setDeleteThis({})}}>Go back</Button>
                <Button className={"grow basis-0 !text-rose-100 !bg-rose-800 hover:bg-rose-500 !ring-rose-900 !ring-opacity-35"} type="google" icon="delete" onClick={()=>modifyWorkouts(deleteThis.id,"delete").then(()=>setDeleteThis({}))}>DELETE FOREVER!!</Button>
            </div>
        </ModalConfirm>

    </MainContainer>
}

export const WorkoutCard = ({workout,buttons}) => {
    return <div className={` ${workout.active?"":"opacity-50"} rounded-md flex justify-between gap-2 items-center shadow-md from-zinc-800 to-zinc-900 bg-gradient-to-br p-2`}>
        <div className="flex flex-col gap-1 text-wrap">
            {workout.name}
            <ListOfTags tags={workout.muscles}/> 
        </div>
        <div className="flex gap-1">
            {buttons}
        </div>
    </div>
}

export default Workouts;