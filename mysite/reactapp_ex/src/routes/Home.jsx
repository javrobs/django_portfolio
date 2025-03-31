import React, {useContext} from "react";
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

    </BubbleDiv>
    </MainContainer>
}

export default Home;