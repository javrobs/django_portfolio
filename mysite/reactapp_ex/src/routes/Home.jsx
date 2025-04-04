import React, {useContext, useState} from "react";
import { Link } from "react-router";
import { useLoaderData } from "react-router";
import { userContext } from "../App.jsx";
import BubbleDiv from "../components/BubbleDiv.jsx";
import MainContainer from "../components/MainContainer.jsx";
import LinkInText from "../components/LinkInText.jsx";
import ListOfCols from "../components/ListOfCols.jsx";
import Button from "../components/Button.jsx";
import { motion } from "motion/react";
import { postFetcher } from "../utils/fetcher.js";

const Home =() => {
    const {logged_in} = useContext(userContext);
    return logged_in?<UserHome/>:<GuestHome/>
}

const UserHome = () => {
    const load = useLoaderData();
    const [homeState,setHomeState] = useState(load||{})
    const {setError} = useContext(userContext)

    const exerciseList = (homeState.exercises||[]).map(each=>{
        return <Link className={`cursor-default`} to={Boolean(homeState.session)&&`/exercisapp/today/${each.order}/`} key={each.id}>
            <motion.div animate={{opacity:Boolean(homeState.session)?1:.4}} className={`bg-gradient-to-br group flex gap-1 items-center justify-between ${each.completed==each.sets?"from-green-800 to-lime-600":"from-zinc-800 to-zinc-900"} p-2 rounded-md shadow-md`}>
                <span className={Boolean(homeState.session)?"group-hover:underline group-hover:text-lime-500":""}>{each.name}</span>
                <span>{each.completed}/{each.sets}</span>
            </motion.div> 
        </Link>
    });

    async function startSession(){
        const {success,...data} = await postFetcher("/exercisapp/api/create_session/");
        if(success){
            setHomeState(data);
        } else {
            setError({tag:data.tag||"",message:data.message||"Unknown error."})
        }
    }

    return <MainContainer size="md">
        {exerciseList.length>0?
        <BubbleDiv title={homeState.name}>
            <ListOfCols>{exerciseList}</ListOfCols>
            {homeState.session?
            <span className="text-xs">Today's session will be marked as finished 6 hours after your last recorded rep.</span>:
            <Button icon='start' type="google" inverted={true} onClick={startSession}>Start workout</Button>}
        </BubbleDiv>:
        <BubbleDiv title="You don't have a workout yet!">
            <div className="text-md">Go to <LinkInText to='/exercisapp/workouts/'>workouts</LinkInText> to fix that!</div>
        </BubbleDiv>}
    </MainContainer>
}

const GuestHome = () => <MainContainer size="md">
    <BubbleDiv title="Good tracking, goodest biceps!">
        <p className="text-xl">Did you forget which rep you're on? Are you stuck doing the exact same weight, same reps, every day? Do you love picking up some weights and putting them back down, repeatedly for hours, with the hopes of being hot, strong or even healthy?!</p>
        <div className="p-3 flex-col flex gap-4">
            <p>This is a tracking app that helps with your workouts by logging weight, reps, and sets. You can see your progress over time and keep a history of your training. <LinkInText to="/exercisapp/login/">Log in here to start!</LinkInText></p>
            <p>If I shared this page with you, let me know what you think of it, or if there are some functions, such as a decent name, that you would like to see. I'm trying to optimize it to work with small screens and few clicks, so you can focus on your workout and not on logging.</p> 
            <p>Enjoy your workout!</p>
        </div>
    </BubbleDiv>
</MainContainer>

export default Home;