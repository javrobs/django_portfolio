import React, {useState} from "react";
import {useRouteError} from "react-router";
import Icon from "../components/Icon.jsx";
import Button from "../components/Button.jsx";
import MainContainer from "../components/MainContainer.jsx";
import BubbleDiv from "../components/BubbleDiv.jsx";

const ErrorComponent = () => {
    const error = useRouteError();

    function goBack(){
        history.back();
    }

    console.log(error)

    return <>
        <MainContainer size="sm">
            <BubbleDiv title="Something went wrong :(">
            <p>Not entirely sure what happened, but it's fine. Please go back</p>
            <Button onClick={goBack}>Return<Icon icon='undo'/></Button>
            </BubbleDiv>
        </MainContainer>
    </>
}

export default ErrorComponent;