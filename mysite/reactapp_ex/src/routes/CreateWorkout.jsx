import React,{ useState ,useContext} from "react";
import { useNavigate } from "react-router";
import MainContainer from "../components/MainContainer.jsx";
import BubbleDiv from "../components/BubbleDiv.jsx";
import Button from "../components/Button.jsx";
import {useLoaderData, useParams } from "react-router";
import HoverInput from "../components/HoverInput.jsx";
import TextSelect from "../components/TextSelect.jsx";
import { userContext } from "../App.jsx";
import { postFetcher } from "../utils/fetcher.js";
import ListOfTags from "../components/listOfTags.jsx";
import ListOfCols from "../components/ListOfCols.jsx";

const CreateWorkout = ()=>{
    const params = useParams();
    const load = useLoaderData();
    const [formState,setFormState] = useState(load.current_state||{});
    const nav = useNavigate();
    const {setError} = useContext(userContext);

    console.log(params,load,formState);

    const exercises = (formState.exercises||[]).map((each,iter)=>{
        const findExercise = load.exercises.find(({id})=>id==each.id)
        return <div key={each.id} className="flex gap-2 bg-gradient-to-br p-2 justify-between items-end rounded-md to-zinc-900 from-zinc-800">
            
            <div className="flex flex-col gap-1">
                {findExercise.name}
                <ListOfTags tags={findExercise.muscles}/>
            </div>
            <div className="flex flex-wrap gap-1 justify-end">
                <div className="flex gap-1 mt-3">
                    <Button justButton={true} icon="arrow_upward" type="google" disabled={iter==0} className="h-7 w-7 flex items-center self-center" onClick={()=>moveUp(each.id)}/>
                    <Button justButton={true} icon="arrow_downward" type="google" disabled={iter+1==formState.exercises.length} className="h-7 w-7 flex items-center self-center" onClick={()=>moveDown(each.id)}/>
                    <Button justButton={true} icon="delete" type="google" className="h-7 w-7 flex items-center self-center" onClick={()=>deleteWorkout(each.id)}/>
                </div>
                <HoverInput
                    label="Sets"
                    value={each.sets}
                    name={`sets-${each.id}`}
                    onInput={editQty}
                    required
                    type="number"
                    step={1}
                    max={10}
                    min={1}
                    classNameLabel={"w-24"}
                />
            </div>
            
        </div>
    })

    function moveUp(id){
        setFormState(oldValue=>{
            const findEx = oldValue.exercises.findIndex(each=>each.id==id);
            const [extract] = oldValue.exercises.splice(findEx,1);
            oldValue.exercises.splice(findEx-1,0,extract)
            console.log("extract",extract,oldValue)
            return {...oldValue}
        })
    }

    function moveDown(id){
        setFormState(oldValue=>{
            const findEx = oldValue.exercises.findIndex(each=>each.id==id);
            const [extract] = oldValue.exercises.splice(findEx,1);
            oldValue.exercises.splice(findEx+1,0,extract)
            console.log("extract",extract,oldValue)
            return {...oldValue}
        })
    }

    function deleteWorkout(id){
        setFormState(oldValue=>({...oldValue,exercises:oldValue.exercises.filter(each=>each.id!=id)}))
    }

    function editQty(e){
        const {name,value} = e.target;
        const id = Number(name.split('-')[1]);
        setFormState(oldValue=>({...oldValue,exercises:oldValue.exercises.map(each=>each.id==id?{id:id,sets:value}:each)}))
    }
    
    function handleChange(e){
        setError({});
        const {name,value} = e.target;
        setFormState(oldState=>({...oldState,[name]:value}))
    }

    function handleSelection(i){
        console.log(i,load.exercises.find(({id})=>id==i));
        setFormState(oldState=>({...oldState,exercises:[...(oldState.exercises||[]),{id:i,sets:""}]}))
    }

    async function handleSubmit(e){
        e.preventDefault();
        const data = await postFetcher(`/exercisapp/api/create_workout/${params.workoutID?params.workoutID+"/":""}`,formState);
        if(data.success){
            console.log("saved changes",data);
            nav(`/exercisapp/workouts/`)
        } else{
            setError({tag:data.tag||false,message:data.message||"Unknown error, didn't save"})
        }  
    }

    return <MainContainer size="md">
        <BubbleDiv title={load?.current_state?.name?`Edit: ${load.current_state.name}`:"Create workout"}>
            <form className="flex flex-col gap-2" autoComplete="off" onSubmit={handleSubmit}>
                
                <HoverInput label="Name" name="name" value={formState.name||""} onInput={handleChange} required/>
                <TextSelect 
                    idName = "add_exercise"
                    label = "Search exercise"
                    optionList={load.exercises.filter(({id})=>!(formState.exercises||[]).map(each=>each.id).includes(id)).map(each=>({id:each.id,text:`${each.name} - ${each.muscles.join(", ")}`}))}
                changeState={handleSelection}/>
                {Boolean(exercises.length>0)&&<>
                <ListOfCols title="List of exercises">
                    {exercises}
                </ListOfCols>
                </>
                }
                <div className="flex flex-wrap gap-3 mt-3">
                    <Button className={"grow"} icon="save">Save changes</Button>
                </div>
            </form>
        </BubbleDiv>
    </MainContainer>
}

export default CreateWorkout;