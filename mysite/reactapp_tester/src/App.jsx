import React, { useEffect, useState, createContext } from "react";
import Main from "./pages/Main.jsx";
import Icon from "./components/Icon.jsx";
import PrintQRs from "./pages/PrintQRs.jsx";
import QRView from "./pages/QRView.jsx";
import Button from "./components/Button.jsx";
import { RouterProvider, createBrowserRouter , Outlet, Navigate, Link} from "react-router"

export const appContext = createContext();

export default function App() {

    const [user, setUser] = useState({
        role:localStorage.getItem("role"),
        name: localStorage.getItem("name"), 
        lastName: localStorage.getItem("lastName")
    });

    const Layout = () => {
        if((!user.role) && window.location.pathname !== "/tester/") {
            return <Navigate to="/tester/" replace/>
        } else {
            return <main className="min-h-screen flex flex-col items-stretch"><Outlet/></main>
        }
    };

    const router = createBrowserRouter([
        {
            path:"/tester",
            element: <Layout/>,
            children:[
                {path:"/tester", element: <Main/>},
                {path:"/tester/print", element: <PrintQRs/>},
                {path:"/tester/QR/:loc/:name", element: <QRView/>},
            ],
            errorElement: <div className="flex flex-col justify-center items-center h-screen gap-4"><Icon icon="error" size="6xl" color="red"/><p className="text-2xl font-bold">Error 404</p><p>La página que estás buscando no existe.</p>
            <Link to="/tester"><Button icon="home" color="blue">Ir a la página principal</Button></Link></div>
        }
    ]);

    return <appContext.Provider value={{user, setUser}}>
    <button onClick={() => {
        localStorage.clear();
        setUser({role:null, name:null, lastName:null});
        console.log(user.role);
    }} className="bg-slate-300 z-50 hover:bg-amber-400 fixed bottom-0 left-0 transition-colors flex justify-center rounded-md shadow-md items-center gap-1 me-auto px-2"><Icon icon="change_circle"/>Cambiar rol</button>        
    <RouterProvider router={router} />
    </appContext.Provider>
}
