
import React from "react";
import Button from "../components/Button.jsx";
import BubbleDiv from "../components/BubbleDiv.jsx";
import H1big from "../components/H1big.jsx";
import { useContext } from "react";
import { appContext } from "../App.jsx";

export default function Select({setRolePage}) {
    const {setUser} = useContext(appContext);


    function handleRoleSelection(role) {
        localStorage.setItem("role", role);
        setUser(prev => ({...prev, role: role}));
    };

    return  <BubbleDiv>
        <H1big className="text-center">Prueba de concepto</H1big>
        <p> Seleccione una opción para utilizar el sistema con el siguiente rol: </p>
        <Button icon="warehouse" color="blue" onClick={()=>handleRoleSelection(1)}>Almacén</Button>
        <Button icon="factory" color='red' onClick={()=>handleRoleSelection(3)}>Linea 15</Button>
    </BubbleDiv>}