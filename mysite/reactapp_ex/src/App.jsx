import React, {createContext, useState, useEffect} from "react"
import Layout from "./components/Layout.jsx"
import Home from "./routes/Home.jsx"
import Signup from "./routes/Signup.jsx"
import ErrorPage from "./routes/ErrorRoute.jsx"
import Login from "./routes/Login.jsx"
import Workouts from "./routes/Workouts.jsx"
import RepsAndWeight from "./routes/RepsAndWeight.jsx"
import { RouterProvider, createBrowserRouter } from "react-router"
import { getFetcher } from "./utils/fetcher.js"
import CreateWorkout from "./routes/CreateWorkout.jsx"

export const userContext = createContext();

export default function App() {
    const [init,setInit] = useState(false);
    const [user,setUser] = useState({});
    const [error,setError] = useState({});


    useEffect(()=>{getUserInfo()},[])

    async function getUserInfo(){
        const data = await getFetcher("/exercisapp/api/login/load_user/");
        setUser(data);
        setInit(true);
        console.log(data)
    }


    const router = createBrowserRouter([
        {
            path:"/exercisapp",
            element: <Layout/>,
            children:[
                {path:"/exercisapp",element: <Home/>,loader:()=>getFetcher("/exercisapp/api/load/home/")},
                {path:"/exercisapp/signup",element: <Signup/>},
                {path:"/exercisapp/login",element: <Login/>},
                {path:"/exercisapp/workouts",element: <Workouts/>,loader:()=>getFetcher("/exercisapp/api/load/workouts/")},
                {path:"/exercisapp/create-workout",element: <CreateWorkout/>,loader:()=>getFetcher("/exercisapp/api/load/create_workout/")},
                {path:"/exercisapp/edit-workout/:workoutID",element: <CreateWorkout/>,loader:({params})=>getFetcher("/exercisapp/api/load/create_workout/"+params.workoutID+"/")},
                {path:"/exercisapp/today/:orderID",element: <RepsAndWeight/>,loader:({params})=>getFetcher(`/exercisapp/api/load/today/${params.orderID}`)},
            ],
            errorElement: <ErrorPage/>
        }
    ])

    return init?<userContext.Provider value={{...user,refreshFunction:getUserInfo,error:error,setError:setError}}>
        <RouterProvider router={router}/>
    </userContext.Provider>:<div>Loading...</div> 
}
