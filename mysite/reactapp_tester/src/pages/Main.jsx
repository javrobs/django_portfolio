import React, { useState , useContext, useEffect} from "react";
import BubbleDiv from "../components/BubbleDiv.jsx";
import Button from "../components/Button.jsx";
import Icon from "../components/Icon.jsx";
import QRScanner from "../components/QRScanner.jsx";
import Select from "./Select.jsx";
import Modal from "../components/Modal.jsx";
import { appContext } from "../App.jsx";
import { Link } from "react-router";

export default function Main() {
    const [workOrders, setWorkOrders] = useState([]);
    const {user} = useContext(appContext);
    const [openScanner, setOpenScanner] = useState(false);
    const [scanAction, setScanAction] = useState(null);

    const BUTTONS = {
        "createPO": {icon: "add", color: "amber", onClick: ()=>{setScanAction("createPO")}, text: "Nueva PO"},
        "enter": {icon: "login", color: "amber", onClick: ()=>{setScanAction("enter")}, text: "Entrada"},
        "exit": {icon: "cycle", color: "red", onClick: ()=>{setScanAction("exit")}, text: "En proceso"},
        "enterFinished": {icon: "assignment_turned_in", color: "green", onClick: ()=>{setScanAction("enterFinished")}, text: "Entrar WO"},
        "finish": {icon: "assignment_turned_in", color: "green", onClick: ()=>{setScanAction("finish")}, text: "Terminar"},
        "delivery": {icon: "delivery_truck_speed", color: "red", to: "/tester/createDelivery", text: "Delivery"},
        "scan": {icon: "qr_code", color: "blue", onClick: ()=>{setScanAction("scan")}, text: "Ver QR"}
    }

    const updateWorkOrders = async () => {
        try {
            const response = await fetch(`/tester/api/work_orders/${user.role}`);
            if (response.ok) {
                const {work_orders} = await response.json();
                console.log(work_orders);
                setWorkOrders(work_orders);
            } else {
                throw new Error("Error fetching work orders");
            }
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        if(scanAction == null && user.role != null) updateWorkOrders();
    }, [user.role, scanAction]);


    const roleSettings = {
        1: {title: "Almacén", 
            bg: "bg-blue-900", 
            divider: "divide-blue-700", 
            border: "border-blue-700",
            buttons: ["createPO","enterFinished","delivery"],
        }, 
        3: {title: "Línea 15", 
            bg: "bg-rose-900", 
            divider: "divide-rose-700", 
            border: "border-rose-700",
            buttons: ["enter","exit","finish"],
        },
    }

    const headers = [{label:"ID"}, {label:"Fecha"},{label:"PO"}, {label:"Part #"},{label:"Qty(Bin)"}, {label:"Siguiente"}];

    return (user.role == null) ? <Select/> : <section className="flex flex-col relative bg-slate-100 !h-screen !min-h-screen overflow-y-auto">
            <p className={`text-lg font-bold px-2 flex justify-center text-white ${roleSettings[user.role].bg} ${roleSettings[user.role].border} border-b-2`} >{roleSettings[user.role].title}</p>
            <div className='flex flex-col justify-start relative z-0 grow'>
                <div className={`grid grid-cols-6 top-0 sticky ${roleSettings[user.role].bg} ${roleSettings[user.role].divider} divide-x-2`}>
                    {headers.map((each) => <div key={each.label} className={`font-bold ${roleSettings[user.role].bg} text-white px-2 ${each.cols}`}>{each.label}</div>)}
                </div>
                {workOrders.map((order) => <div className="grid grid-cols-6" key={order.id}>
                    <Cell>{order.id}</Cell>
                    <Cell>{order.date}</Cell>
                    <Cell>{order.orderNumber}</Cell>
                    <Cell>{order.partNumber}</Cell>
                    <Cell>{order.quantity}</Cell>
                    <Cell>{order.next }</Cell>
                </div>)}
            </div>
            <div className={`flex gap-2 justify-end items-stretch p-4 fixed bottom-0 w-full z-10 bg-white border-t ${roleSettings[user.role].border} shadow-lg`}>
                {roleSettings[user.role].buttons.map(each => {
                    const {icon, color, onClick, to, text} = BUTTONS[each];
                    return Boolean(to)?<Link key={text} to={to} className="flex items-stretch">
                        <Button icon={icon} color={color}>
                            <span className="hidden sm:block">{text}</span>
                        </Button> 
                    </Link> : <Button key={text} icon={icon}  color={color} onClick={onClick}>
                            <span className="hidden sm:block">{text}</span>
                        </Button> 
                })}
            </div>
            <Modal action={scanAction} onClose={()=>setScanAction(null)}/>
    </section>
}

const Cell = ({children, span}) => {
    return <div className={`p-1 flex items-center`}>{children}</div>
}