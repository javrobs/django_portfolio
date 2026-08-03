import React, {useState,useEffect} from "react";
import QRScanner from "../../components/QRScanner.jsx";
import Button from "../../components/Button.jsx";
import ScanInModal from "./ScanInModal.jsx";
import CSRFTOKEN from "../../utils/csrftoken.js";

export default function Enter({onClose, role}) {
    const [formState, setFormState] = useState({});
    const [sending, setSending] = useState(false);
    const [stage, setStage] = useState(0);
    const [qrInfo, setQrInfo] = useState({});

    console.log(qrInfo,qrInfo.work_order);

    const sendForm = async () => {
        setSending(true);
        try {
            const response = await fetch("/tester/api/enter_station/" +role + "/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": CSRFTOKEN
                },
                body: JSON.stringify({...qrInfo})
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

    switch(stage){
        case 0:
            return <ScanInModal setStage={setStage} qrInfo={qrInfo} setQrInfo={setQrInfo} role={role} action={"enterStation"} reason="ingresar material a la estación" />
        case 1:
            return <div className="flex flex-col gap-2">
                <p>Verifica que la información sea correcta antes de guardar</p>
                <div className="flex flex-col gap-1">
                    <p><span className="font-bold">Cliente:</span> {qrInfo.work_order.client}</p>
                    <p><span className="font-bold">Part Number:</span> {qrInfo.work_order.partNumber}</p>
                    <p><span className="font-bold">Órden de compra:</span> {qrInfo.work_order.orderNumber}</p>
                    <p><span className="font-bold">Cantidad(Bins):</span> {qrInfo.work_order.quantity}</p>
                    <p><span className="font-bold">QR:</span> {qrInfo.qr_name}</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <Button icon="report" color="red">Incidente</Button>
                    <Button icon="arrow_back" color="gray" onClick={()=>setStage(current=>current-1)}>Regresar</Button>
                    <Button icon="send" reverse={true} sending={sending} onClick={sendForm} color="green">Sí, guardar</Button>
                </div>
            </div>
    }
}