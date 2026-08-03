import React, {useState, useEffect} from "react";
import H1big from "../components/H1big.jsx";
import Button from "../components/Button.jsx";
import BubbleDiv from "../components/BubbleDiv.jsx";

export default function QRView() {

    const [QRData, setQRData] = useState({});

    useEffect(() => {
        fetchQRData();
    }, []);

    async function fetchQRData() {
        const pathParts = window.location.pathname.split("/");
        const loc = pathParts[3];
        const qr = pathParts[4];
        const response = await fetch(`/tester/api/QR/${loc}/${qr}`);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            setQRData(data);
        } else {
            console.error("Failed to fetch QR data");
        }
    };

    const role = localStorage.getItem("role");
    const stations = ["inventory", "line", "quality"];
    const owner = stations[QRData.station - 1] == role;

    const showEnter = (QRData.is_free && QRData.station == 1);

    console.log("owner:", owner);

    return QRData.error ? <div><p>{QRData.error}</p></div> : <BubbleDiv>
        <H1big>{QRData.qr_name}</H1big>
        <p>{QRData.is_free ? "Libre" : `Ocupado por orden ${QRData.work_order_id}`}</p>
        <div className="flex justify-center gap-2 flex-wrap">
            <Button onClick={() => {setPage(role)}} icon="undo" color="blue">Volver</Button>
            {showEnter && <Button icon="link" color="green">Ligar</Button>}
        </div>
    </BubbleDiv>
};