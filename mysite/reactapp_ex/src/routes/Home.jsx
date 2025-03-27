import React, {useContext} from "react";
import { Link } from "react-router";
import { useLoaderData } from "react-router";
import { userContext } from "../App.jsx";
import BubbleDiv from "../components/BubbleDiv.jsx";
import MainContainer from "../components/MainContainer.jsx";
import LinkInText from "../components/LinkInText.jsx";
import ListOfCols from "../components/ListOfCols.jsx";

const Home =() => {
    const {exercises,name} = useLoaderData();
    const {logged_in} = useContext(userContext);

    const exerciseList = (exercises||[]).map(each=>{
        return <Link to={`/exercisapp/today/${each.order}`} key={each.id}>
            <div className={`bg-gradient-to-br group flex gap-1 items-center justify-between ${each.completed==each.sets?"from-green-800 to-lime-600":"from-zinc-800 to-zinc-900"} p-2 rounded-md shadow-md`}>
                <span className="group-hover:underline group-hover:text-lime-500">{each.name}</span>
                <span>{each.completed}/{each.sets}</span>
            </div> 
        </Link>
    });

    return <MainContainer size="md">
    <BubbleDiv title={logged_in?name||"You don't have a workout yet!":"Greater tracking, greaterest biceps!"}>
        {logged_in?
        <>
            {exerciseList.length>0?
            <><ListOfCols title="List of exercises">{exerciseList}</ListOfCols>
            <span className="text-xs">Today's session will be marked as finished 6 hours after your last recorded rep.</span>
            </>:
            <div className="text-md">Go to <LinkInText>workouts</LinkInText> to fix that!</div>}
        </>:
        <>
            <p className="text-xl">Do you forget which rep you're on? Are you stuck doing the exact same weight, same reps, every day? Do you pick up some weights and put them back down, repeatedly for hours, with the hopes of being hot, strong or even healthy!?</p>
            <div className="p-3 flex-col flex gap-4">
                <p>This is a tracking app that helps with your workouts by logging weight, reps, and sets. You can see your progress over time and keep a history of your training. <LinkInText to="/exercisapp/login/">Log in here to start!</LinkInText></p>
                <p>If I shared this page with you, let me know what you think of it, or if there are some functions, such as a decent name, that you would like to see. I'm trying to optimize it to work with small screens and few clicks, so you can focus on your workout and not on logging.</p> 
                <p>Enjoy your workout!</p>
            </div>
        </>}
    </BubbleDiv>
    </MainContainer>
}

export default Home;