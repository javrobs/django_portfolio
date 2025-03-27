import React, {useContext,useState,useEffect} from "react"
import {Link,useNavigate} from "react-router"
import BubbleDiv from "../components/BubbleDiv.jsx";
import MainContainer from "../components/MainContainer.jsx";
import HoverInput from "../components/HoverInput.jsx";
import Button from "../components/Button.jsx";
import { userContext } from "../App.jsx"
import { postFetcher } from "../utils/fetcher.js";

export default function Login(){
    const {refreshFunction,setError} = useContext(userContext);
    const [redirect,setRedirect] = useState(false);
    const [formState,setFormState] = useState({});
    const nav = useNavigate();

    if (redirect) {
        nav('/exercisapp/');
    } 

    function handleChange(e){
        setError({});
        const {name,value} = e.target;
        setFormState(oldState=>({...oldState,[name]:value}))
    }
    
    async function handleSubmit(e){
        e.preventDefault();
        const data = await postFetcher("/exercisapp/api/login/login_user/",formState);
        if(data.success){
            refreshFunction().then(()=>setRedirect(true));
        } else{
            setError({tag:data.tag||false,message:data.message||"Error desconocido"})
        }  
    }

    return <MainContainer size="mini">
        <BubbleDiv>
            <form autoComplete="on" className="flex self-center w-72 flex-col gap-3 bubble-div justify-center text-center" onSubmit={handleSubmit}>
                <HoverInput onInput={handleChange} value={formState.username||""} label="Username" type="text" id='username' name="username" autoComplete="username" required/>
                <HoverInput onInput={handleChange} value={formState.password||""} label="Password" id='password' minLength={8} name="password" type="password" autoComplete="current-password" required/>
                <Button type="google" icon="login" inverted={true}>Login</Button>
                <Link className="self-center px-2 rounded-md transition-all underline text-green-600 hover:text-lime-300 hover:bg-lime-300 hover:bg-opacity-15" to='/exercisapp/signup'>I don't have a user yet</Link>
            </form>
        </BubbleDiv>
    </MainContainer>
}