import React, {createContext, useState, useEffect} from "react"
import Layout from "./components/Layout.jsx"
import Home from "./routes/Home.jsx"
import SetOfCards from "./routes/SetOfCards.jsx"
import ErrorPage from "./routes/ErrorRoute.jsx"
import CreateNew from "./routes/CreateNew.jsx"
import MatchGame from "./routes/MatchGame.jsx"
import { RouterProvider, createBrowserRouter } from "react-router"
// import { getFetcher, postFetcher } from "./utils/fetcher.js"
// import CreateWorkout from "./routes/CreateWorkout.jsx"
// import Friends from "./routes/Friends.jsx"
// import Profile from "./routes/Profile.jsx"

export const userContext = createContext();

export default function App() {
    const [error,setError] = useState({});



    // async function getFetcher(url){
    //     let response = {ok:false}
    //     try{
    //     const response = await fetch(url);
    //         const data = await response.json();
    //         return {"success":response.ok,...data}
    //     } catch (e){
    //         console.log(e)
    //         return {"success":response?.ok||false,message:"Connection failed"}
    //     } 
    // }
    
    
    async function postFetcher(url,body){
        const findCookie = decodeURIComponent(document.cookie.split(";").find(each=>each.includes("csrftoken"))).split("=")[1];
        try{
            const response = await fetch(url,{
                method:"POST",
                headers:{"X-CSRFToken":findCookie},
                body:JSON.stringify(body)});
            const data = await response.json();
            if(response.ok){
                return {success:true,...data}
            } else {
                setError(data)
            }
        } catch (e){
            console.log(e)
            setError({message:"Connection failed"})
        } 
    }


    async function getRouteFetcher(url){
        let response = {ok:false}
        try{
        const response = await fetch(url);
            const data = await response.json();
            return {"success":response.ok,...data}
        } catch (e){
            console.log(e)
            return {"success":response?.ok||false,message:"Connection failed"}
        } 
    }


    const router = createBrowserRouter([
        {
            path:"/cards",
            element: <Layout/>,
            children:[
                {path:"/cards",element: <Home/>,loader:()=>getRouteFetcher("/cards/api/load/home/")},
                {path:"/cards/tag/:tagID",element: <SetOfCards/>,loader:({params})=>getRouteFetcher(`/cards/api/load/tag/${params.tagID}`)},
                {path:"/cards/create_new/",element: <CreateNew/>,loader:()=>getRouteFetcher(`/cards/api/load/create_new/`)},
                {path:"/cards/annotate/:amount",element: <SetOfCards/>,loader:({params})=>getRouteFetcher(`/cards/api/load/annotate/${params.amount}`)},
                {path:"/cards/new/:amount",element: <SetOfCards/>,loader:({params})=>getRouteFetcher(`/cards/api/load/new/${params.amount}`)},
                {path:"/cards/known/:amount",element: <SetOfCards/>,loader:({params})=>getRouteFetcher(`/cards/api/load/known/${params.amount}`)},
                {path:"/cards/match/:amount",element: <MatchGame/>,loader:({params})=>getRouteFetcher(`/cards/api/load/known/${params.amount}`)},
                // {path:"/exercisapp/Tag",element: <Tag/>},
                // {path:"/exercisapp/CardStack",element: <CardStack/>},
                // {path:"/exercisapp/workouts",element: <Workouts/>,loader:()=>getFetcher("/exercisapp/api/load/workouts/")},
                // {path:"/exercisapp/create-workout",element: <CreateWorkout/>,loader:()=>getFetcher("/exercisapp/api/load/create_workout/")},
                // {path:"/exercisapp/edit-workout/:workoutID",element: <CreateWorkout/>,loader:({params})=>getFetcher("/exercisapp/api/load/create_workout/"+params.workoutID+"/")},
                // {path:"/exercisapp/today/:orderID",element: <RepsAndWeight/>,loader:({params})=>getFetcher(`/exercisapp/api/load/today/${params.orderID}/`)},
                // {path:"/exercisapp/friends",element: <Friends/>,loader:()=>getFetcher("/exercisapp/api/load/friends/")},
                // {path:"/exercisapp/profile/:profileID",element: <Profile/>,loader:({params})=>getFetcher(`/exercisapp/api/load/profile/${params.profileID}/`)},
                // {path:"/exercisapp/my-profile",element: <Profile/>,loader:()=>getFetcher("/exercisapp/api/load/my_profile/")},
            ],
            errorElement: <ErrorPage/>
        }
    ])

    return <userContext.Provider value={{error,setError, postFetcher}}>
        <RouterProvider router={router}/>
    </userContext.Provider>
}
