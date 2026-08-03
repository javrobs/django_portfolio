import React, {useState,useEffect} from "react";
import Button from "../../components/Button.jsx";
import Input from "../../components/Input.jsx";
import Select from "../../components/Select.jsx";
import CSRFTOKEN from "../../utils/csrftoken.js";
import ScanInModal from "./ScanInModal.jsx";

export default function CreatePO({onClose, role}) {
    const [formState, setFormState] = useState({});
    const [sending, setSending] = useState(false);
    const [init, setInit] = useState(false);
    const [clients, setClients] = useState([{id:0, text:"Cargando clientes..."}]);
    const [parts, setParts] = useState([{id:0, text:"Selecciona un cliente"}]);
    const [stage, setStage] = useState(0);
    const [qrInfo, setQrInfo] = useState({});

    useEffect(()=>{
        fetchClients();
        setInit(true);
    }, []);

    const fetchClients = async () => {
        try {
            const response = await fetch("/tester/api/clients");
            if (response.ok) {
                const {clients} = await response.json();
                setClients(clients);
            } else {
                throw new Error("Error fetching clients");
            }
        } catch (error) {
            alert(error);
        }
    };

    const fetchParts = async (clientId) => {
        console.log("Fetching parts for client ID:", clientId); // Log the client ID
        try {
            const response = await fetch(`/tester/api/parts/${clientId}`);
            if (response.ok) {
                const {parts} = await response.json();
                console.log("Fetched parts:", parts); // Log the fetched parts
                setParts(parts);
            } else {
                throw new Error("Error fetching parts");
            }
        } catch (error) {
            alert(error);
        }
    };

    const handleClient = (clientId) => {
        setFormState((currentState) => {
            const {part_number, ...rest} = currentState;
            return {...rest, client: clientId};});
        fetchParts(clientId);
        console.log("Selected client ID:", clientId); // Log the selected client ID
    }

    const verifyFields = (e) => {
        e.preventDefault();
        setStage(currentStage => currentStage + 1);
    }

    const handleInput = (event) => {
        const { name, value } = event.target;
        setFormState({...formState, [name]: value});
    }

    const handlePartNumber = (partId) => {
        setFormState({...formState, part_number: partId});
    }


    const sendForm = async () => {
        setSending(true);
        try {
            const response = await fetch("/tester/api/submit_new_po/" + role + "/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": CSRFTOKEN
                },
                body: JSON.stringify({...formState, ...qrInfo})
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
    console.log("Scanned data:", qrInfo); // Log the scanned data

    switch(stage){
        case 0:
            return <form onSubmit={verifyFields} className="flex flex-col gap-2">
                {init && <>
                <Select label="Cliente" idName="client" value={formState.client||""} optionList={clients} changeState={handleClient} required/>
                <Select label="Part Number" idName="part_number" value={formState.part_number||""} optionList={parts} changeState={handlePartNumber} required/>
                <Input label="Órden de compra" name="po" value={formState.po||""} onInput={handleInput} required/>
                <div className="grid grid-cols-2 gap-2">
                    <Input label="Bins" name="bins" type="number" min="0" value={formState.bins||""} onInput={handleInput} required/>
                    <Input label="Cantidad" name="quantity" type="number" min="0" value={formState.quantity||""} onInput={handleInput} required/>
                </div>
                <Button icon="arrow_forward" reverse={true} color="green">Siguiente</Button>
                </>}
            </form>
        case 1:
            return <ScanInModal setStage={setStage} qrInfo={qrInfo} setQrInfo={setQrInfo} role={role} action="createPO" reason="ligarlo a la PO" />
        case 2:
            return <div className="flex flex-col gap-2">
                <p>Revisa que la información sea correcta antes de guardar</p>
                <div className="flex flex-col gap-1">
                    <p><span className="font-bold">Cliente:</span> {clients.find(c=>c.id==formState.client)?.text}</p>
                    <p><span className="font-bold">Part Number:</span> {parts.find(p=>p.id==formState.part_number)?.text}</p>
                    <p><span className="font-bold">Órden de compra:</span> {formState.po}</p>
                    <p><span className="font-bold">Bins:</span> {formState.bins}</p>
                    <p><span className="font-bold">Cantidad:</span> {formState.quantity}</p>
                    <p><span className="font-bold">QR:</span> {qrInfo.qr_name}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <Button icon="arrow_back" color="gray" onClick={()=>setStage(0)}>Regresar</Button>
                    <Button icon="send" reverse={true} sending={sending} onClick={sendForm} color="green">Guardar</Button>
                </div>
            </div>
    }
}