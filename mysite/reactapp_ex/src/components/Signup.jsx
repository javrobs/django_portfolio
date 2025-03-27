import React from "react";
import { useNavigate } from "react-router";
import MainContainer from "../components/MainContainer.jsx";
import BubbleDiv from "../components/BubbleDiv.jsx";
import HoverInput from "../components/HoverInput.jsx";
import Button from "../components/Button.jsx";
import Form from "../components/Form.jsx";

const CrearCuenta = () => {
    const nav = useNavigate();

    const onSuccess = () => {
        nav("/ingresar");
    }

    return <MainContainer size="sm">
        <BubbleDiv title="Crear cuenta" centerTitle={true}>
            <Form action="/api/login/signup/" onSuccess={onSuccess} className="grid self-center max-sm:grid-cols-1 grid-cols-2 w-full gap-2 flex-col bubble-div justify-center">
                <div className="self-start col-span-full">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rerum nobis incidunt unde excepturi quo a! </div>
                <HoverInput className="col-span-full" label='Correo electrónico' type="email" id="username" name="username" required/>
                <HoverInput label='Nombre' id="first_name" name="first_name" required/>
                <HoverInput label='Apellido' id="last_name" name="last_name" required/>
                <div className="self-start col-span-full">La contraseña debe tener entre 8 y 20 caracteres.</div>
                <HoverInput label='Contraseña' type="password" id="password" name="password" required/>
                <HoverInput label='Repite la contraseña' type="password" id="password2" name="password2" required/>
                <Button className="col-span-full">Enviar</Button>
            </Form>
        </BubbleDiv>
    </MainContainer>
}


export default CrearCuenta;