import React, {useState,useEffect} from "react";
import Button from "../../components/Button.jsx";
import Input from "../../components/Input.jsx";
import Select from "../../components/Select.jsx";
import CSRFTOKEN from "../../utils/csrftoken.js";
import ScanInModal from "./ScanInModal.jsx";
import Icon from "../../components/Icon.jsx";

export default function ExitWO({onClose, role}) {
    const [formState, setFormState] = useState({});
    const [sending, setSending] = useState(false);
    const [stage, setStage] = useState(0);
    const [qrInfoIn, setQrInfoIn] = useState({});
    const [qrInfoOut, setQrInfoOut] = useState({});

    const verifyFields = (e) => {
        e.preventDefault();
        setStage(currentStage => currentStage + 1);
    }

    const handleInput = (event) => {
        const { name, value } = event.target;
        setFormState({...formState, [name]: value});
    }

    const sendForm = async () => {
        setSending(true);
        try {
            const response = await fetch("/tester/api/exit_wo/" + role + "/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": CSRFTOKEN
                },
                body: JSON.stringify({...formState, in:qrInfoIn, out:qrInfoOut})
            });
            const data = await response.json();
            if (response.ok) {
                console.log("Form submitted successfully:", data);
                // Handle successful submission
                onClose(); // Close the modal after successful submission
            } else {
                throw new Error(data.error || "Error submitting form");
            }
        } catch (error) {
            alert(error);
        } finally {
            setSending(false);
        }
    };

    console.log("Form state:", formState); // Log the current form state
    console.log("Scanned data:", qrInfoIn); // Log the scanned data
    console.log("Scanned data (out):", qrInfoOut); // Log the scanned data (out)

    switch(stage){
        case 0:
            return <ScanInModal setStage={setStage} qrInfo={qrInfoIn} setQrInfo={setQrInfoIn} role={role} action="exitWOIn" reason="marcar material como procesado" />
        case 1:
            return <form onSubmit={verifyFields} className="flex flex-col gap-2">
                <p>Ingresa la información del material que se procesó</p>
                <p><span className="font-bold">Cliente:</span> {qrInfoIn.work_order.client}</p>
                <p><span className="font-bold">Part Number:</span> {qrInfoIn.work_order.partNumber}</p>
                <p><span className="font-bold">Órden de compra:</span> {qrInfoIn.work_order.orderNumber}</p>
                <div className="grid grid-cols-2 gap-2">
                    <Input label="Bins" name="bins" type="number" min="0" value={formState.bins||""} onInput={handleInput} required/>
                    <Input label="Cantidad" name="quantity" type="number" min="0" value={formState.quantity||""} onInput={handleInput} required/>
                </div>
                <Button icon="arrow_forward" reverse={true} color="green">Siguiente</Button>
            </form>
        case 2:
            return <ScanInModal setStage={setStage} qrInfo={qrInfoOut} setQrInfo={setQrInfoOut} role={role} action="exitWOOut" reason="ligarlo al material" />
        case 3:
            return <div className="flex flex-col gap-2">
                <p>Revisa que la información sea correcta antes de guardar</p>
                <div className="flex flex-col gap-1">
                    <p><span className="font-bold">Cliente:</span> {qrInfoIn.work_order.client}</p>
                    <p><span className="font-bold">Part Number:</span> {qrInfoIn.work_order.partNumber}</p>
                    <p><span className="font-bold">Órden de compra:</span> {qrInfoIn.work_order.orderNumber}</p>
                    <p><span className="font-bold">Cantidad trabajada(Bins):</span> {formState.quantity}({formState.bins})</p>
                    <p className="flex items-center gap-1"><span className="font-bold">QRs:</span> {qrInfoIn.qr_name} <Icon icon="arrow_forward"/> {qrInfoOut.qr_name}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <Button icon="arrow_back" color="gray" onClick={()=>setStage(0)}>Regresar</Button>
                    <Button icon="send" reverse={true} sending={sending} onClick={sendForm} color="green">Guardar</Button>
                </div>
            </div>
    }
}