import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import MainContainer from "../components/MainContainer.jsx";
import BubbleDiv from "../components/BubbleDiv.jsx";
import HoverInput from "../components/HoverInput.jsx";
import Button from "../components/Button.jsx";
import { userContext } from "../App.jsx";
import { postFetcher } from "../utils/fetcher.js";

const CrearCuenta = () => {
    const [formState,setFormState] = useState({});
    const {setError} = useContext(userContext);
    const nav = useNavigate();

    function handleChange(e){
        setError({});
        const {name,value} = e.target;
        setFormState(oldState=>({...oldState,[name]:value}))
    }
    
    async function handleSubmit(e){
        e.preventDefault();
        const data = await postFetcher("/exercisapp/api/login/signup_user/",formState);
        if(data.success){
            nav("/exercisapp/login");
        } else{
            setError({tag:data.tag||false,message:data.message||"Error desconocido"})
        }  
    }

    return <MainContainer size="sm">
        <BubbleDiv centerTitle={true}>
            <form className="grid self-center max-sm:grid-cols-1 grid-cols-2 w-full gap-2 flex-col bubble-div justify-center" onSubmit={handleSubmit}>
                <div className="self-start col-span-full">Sign up to access workouts and keep your progress in one place.</div>
                <HoverInput onInput={handleChange} value={formState.username||""} classNameLabel="col-span-full" label='Username' type="text" id="username" name="username" required/>
                <HoverInput onInput={handleChange} value={formState.first_name||""} label='Name' id="first_name" name="first_name" required/>
                <HoverInput onInput={handleChange} value={formState.last_name||""} label='Last name' id="last_name" name="last_name" required/>
                <div className="self-start col-span-full">The password must be 8 to 20 characters long. Don't lose it, we can never ever recover it (not really, but it's annoying).</div>
                <HoverInput onInput={handleChange} value={formState.password||""} label='Password' type="password" id="password" name="password" required/>
                <HoverInput onInput={handleChange} value={formState.password2||""} label='Repeat password' type="password" id="password2" name="password2" required/>
                <Button className="col-span-full" icon="login" inverted={true} type={"google"}>Sign up</Button>
            </form>
        </BubbleDiv>
    </MainContainer>
}


export default CrearCuenta;