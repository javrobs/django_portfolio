import React, { useContext, useState } from "react";
import MainContainer from "../components/MainContainer.jsx";
import BubbleDiv from "../components/BubbleDiv.jsx";
import HoverInput from "../components/HoverInput.jsx";
import { getFetcher, postFetcher } from "../utils/fetcher.js";
import Button from "../components/Button.jsx";
import { useLoaderData, Link } from "react-router";
import { userContext } from "../App.jsx";

const Friends = () => {
    const {friendRequests, currentFriends} = useLoaderData();
    const [myFriends,setMyFriends] = useState(currentFriends||[])
    const [requests,setRequests] = useState(friendRequests||[])
    const [friendSearch,setFriendSearch] = useState("");
    const [friendResult,setFriendResult] = useState("");
    const {setError} = useContext(userContext);

    async function handleSubmit(e){
        e.preventDefault();
        const data = await postFetcher("/exercisapp/api/login/request_friendship/",{username:friendSearch})
        if(data.success){
            setFriendResult(data.showMessage);
        } else {
            setFriendResult(false);
            setError({message:data.message||"",tag:data.tag||""})
        }
    }

    function handleChange(e){
        setFriendSearch(e.target.value);
    }

    async function respondFriend(friendship,accept){
        const data = await postFetcher("/exercisapp/api/login/respond_friendship/",{friendship,accept})
        if(data.success){
            const {friendRequests, currentFriends} = await getFetcher("/exercisapp/api/load/friends/");
            setMyFriends(currentFriends);
            setRequests(friendRequests);
        }
    }

    return <MainContainer size="md">
        <BubbleDiv title="Friends">
            {(myFriends||[]).length>0&&
                <>
                    <p>Wow, you managed to make friends in this little app with so few users? You can go see your friends workouts and see what they are up to if you want to copy them...</p>
                    <div className="flex flex-wrap gap-1">
                        {(myFriends||[]).map(each=>{
                            return <div key={each.id_friend} className="bg-zinc-900 p-3 rounded-md shadow-md">
                                {each.name}<br/>
                                ({each.username})
                                <br/>
                                <div className="flex gap-2 p-2 justify-center">
                                    <Link to={`/exercisapp/profile/${each.id_friend}/`}><Button icon="person" type="google"/></Link>
                                </div>
                            </div>
                        })}
                    </div>
                </>
            }
            <p>Working out is better with friends because of peer pressure! Add some people you know by inputting their username below:</p>
            <form className="flex gap-1" onSubmit={handleSubmit} autoComplete="off">
                <HoverInput classNameLabel={"grow"} value={friendSearch||""} onInput={handleChange} name="friendSearch" label="Your friend's username" required/>
                <Button className="mt-3 !py-1" icon="search" type="google">Search</Button>
            </form>
            {Boolean(friendResult)&&<div className="from-lime-800 p-3 rounded-md shadow-md bg-gradient-to-br to-lime-600">{friendResult}</div>}
        </BubbleDiv>
        {(requests||[]).length>0&&
        <BubbleDiv title="Friend requests">
            <p>Aren't you popular! These people want to be your friends. Friends can share workouts and maybe see each other's progress? I don't know, I haven't decided yet!</p>
            <div className="flex flex-wrap gap-1">
                {(requests||[]).map(each=>{
                    return <div key={each.id} className="bg-zinc-900 p-3 rounded-md shadow-md">
                        {each.name}<br/>
                        ({each.username})
                        <br/>
                        <div className="flex gap-2 p-2 justify-center">
                            <Button onClick={()=>respondFriend(each.id,true)} icon="check_circle" type="google"/>
                            <Button onClick={()=>respondFriend(each.id,false)} icon="cancel" type="google"/>
                        </div>
                    </div>
                })}
            </div>
        </BubbleDiv>}
    </MainContainer>
}


export default Friends;