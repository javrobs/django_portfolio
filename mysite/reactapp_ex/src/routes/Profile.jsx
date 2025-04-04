import React, {useContext, useState} from "react";
import MainContainer from "../components/MainContainer.jsx";
import BubbleDiv from "../components/BubbleDiv.jsx";
import { useLoaderData, Link } from "react-router";
import { WorkoutCard } from "./Workouts.jsx";
import ListOfCols from "../components/ListOfCols.jsx";
import Button from "../components/Button.jsx";
import { getFetcher, postFetcher } from "../utils/fetcher.js";
import ModalConfirm from "../components/ModalConfirm.jsx";
import H1Title from "../components/H1Title.jsx";
import { userContext } from "../App.jsx";

const Profile = () => {
    const {current_routine,name,finished_workouts,myself} = useLoaderData();
    const [show,setShow] = useState({})
    const {setError} = useContext(userContext);

    async function showDetails(id){
        const data = await getFetcher("/exercisapp/api/load/workout_details/"+id+"/");
        setShow({show:true,
        content:<>
            <H1Title>{data.name}</H1Title>
            {(data.exercises||[]).map(each=><div key={each}>{each}</div>)}
            <Button type="google" icon="undo" onClick={()=>{setShow({})}}/>
        </>});
    }

    async function forkWorkout(id){
        const data = await postFetcher("/exercisapp/api/copy_workout/",{id});
        if(data.success){
            setShow({show:true,
                content:<>
                    <H1Title>{data.name} copied!</H1Title>
                    <Link className="self-stretch flex flex-col" to={`/exercisapp/edit-workout/${data.new_id}/`}><Button type="google" icon="edit" onClick={()=>{setShow({})}}>Edit</Button></Link>
                    <Link className="self-stretch flex flex-col" to={`/exercisapp/workouts/`}><Button type="google" icon="fitness_center" onClick={()=>{setShow({})}}>Go to workouts</Button></Link>
                    <Button type="google" icon="undo" onClick={()=>{setShow({})}}>Return</Button>
                </>});
        } else {
            console.log(data);
            setError({message:data.message||"Unknown error"})
        }
    }

    const myWorkouts = current_routine.map(each=>{
        const buttons = <>
            <Button className={"h-7 w-7 flex text-lg items-center"} icon="description" onClick={()=>showDetails(each.id)} type="google"/>
            {!myself&&<Button className={"h-7 w-7 flex text-lg items-center"} icon="fork_right" onClick={()=>forkWorkout(each.id)} type="google"/>}
        </>
        return <WorkoutCard workout={each} buttons={buttons} key={each.id}/>
    })

    return <MainContainer size="md">
        <BubbleDiv title={name.join(" ")}>
            Finished workouts: {finished_workouts}
            <p>{myself?"My":name[0]+"'s"} Routine:</p>
            <ListOfCols>
                <div>{myself?"Your friends can see these active workouts and copy them. Sharing is caring!":`You can use the fork button to copy these workouts. I don't think ${name[0]} will mind.`}</div>
                {myWorkouts}
            </ListOfCols>
        </BubbleDiv>
        <ModalConfirm show={show.show} clickOutside={()=>{setShow({})}}>
            {show.content}
        </ModalConfirm>
    </MainContainer>
}

export default Profile;