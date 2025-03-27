import React, {useState} from "react";
import {useRouteError} from "react-router";
import Icon from "../components/Icon.jsx";
import Button from "../components/Button.jsx";
import MainContainer from "../components/MainContainer.jsx";
import BubbleDiv from "../components/BubbleDiv.jsx";

const ErrorComponent = () => {
    const [showError,setShowError] = useState(false);
    const error = useRouteError();

    function goBack(){
        history.back();
    }

    function toggleShowError(){
        setShowError(value=>!value);
    }

    return <>
        <MainContainer size="sm">
            <BubbleDiv maxititle="Algo salió mal?">
            <p>Hubo un error pero nadie sabe <span onClick={toggleShowError} className="hover:text-blue-500 cursor-pointer">cual</span> es.</p>
            <Button onClick={goBack}>Regresar<Icon icon='undo'/></Button>
            </BubbleDiv>
            
        </MainContainer>
    </>
}

export default ErrorComponent;