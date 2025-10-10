import React, { useContext, useState } from "react";
import MainContainer from "../components/MainContainer.jsx";
import BubbleDiv from "../components/BubbleDiv.jsx";
import { useLoaderData, useNavigate } from "react-router";
import { userContext } from "../App.jsx";
import HoverInput from "../components/HoverInput.jsx";
import Button from "../components/Button.jsx";

const CreateNew = () => {
    const load = useLoaderData();
    const [formData,setFormData] = useState({});
    const {postFetcher, setError} = useContext(userContext);
    const nav = useNavigate();

    console.log(formData);

    function setTag(tag){
        setFormData(oldValue=>({...oldValue,tag}))
    }
    
    function setType(id){
        setFormData(oldValue=>{
            if ((oldValue.types||[]).includes(id)){
                return {...oldValue,types:oldValue.types.filter(each=>each!=id)}
            } else {
                return {...oldValue,types:[...(oldValue.types||[]),id]}
            }
        })
    }

    async function handleSubmit(e){
        e.preventDefault();
        if(formData?.tag!=""&&(formData.types||[]).length&&(formData.user_notes||formData.related_words)){
            const data = await postFetcher("/cards/api/create_new_card/",formData)
            if(data.success){
                nav("/cards");
            }
        } else {
            setError({"message":"You forgot something"})
        }
    }

    function handleChange(e){
        const {value,name} = e.target;
        setFormData(oldValue=>({...oldValue,[name]:value}))
    }

    return <MainContainer>
        <BubbleDiv title={"Create new card"}>
            <form className="flex flex-col gap-1" onSubmit={handleSubmit} autoComplete="off">
                <HoverInput label="Word" value={formData.word||""} onInput={handleChange} name="word" required/>
                <label>
                    Tag (select one)
                    <div className="flex flex-wrap gap-1 bg-white p-1 rounded-md shadow-md">
                        {load.tags.map(each=><button key={each.id} type="button" onClick={()=>setTag(each.id)} className={`${formData.tag==each.id?"bg-indigo-600 text-white":"bg-indigo-200"} transition-all rounded-md shadow-sm px-2`}>{each.name}</button>)}
                    </div>
                </label>
                
                <label>
                    Types
                    <div className="flex flex-wrap gap-1 bg-white p-1 rounded-md shadow-md">
                        {load.types.map(each=><button key={each.id} type="button" onClick={()=>setType(each.id)} className={`${(formData?.types||[]).includes(each.id)?"bg-indigo-600 text-white":"bg-indigo-200"} transition-all rounded-md shadow-sm px-2`}>{each.name}</button>)}
                    </div>
                </label>
                <HoverInput label="User notes" value={formData.user_notes||""} onInput={handleChange} name="user_notes"/>
                <HoverInput label="Related words (comma separated)" value={formData.related_words||""} onInput={handleChange} name="related_words"/>
                <Button icon="save" type="google">Save</Button>
            </form>
        </BubbleDiv>
    </MainContainer>
}

export default CreateNew;