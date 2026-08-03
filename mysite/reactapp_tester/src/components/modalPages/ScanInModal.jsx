import React, { useState } from "react";
import QRScanner from "../../components/QRScanner.jsx";
import Button from "../../components/Button.jsx";

export default function ScanInModal({setStage, qrInfo, setQrInfo, role, action, reason}) {

    async function readQR(data) {
        try {
            const [loc, name] = data.replace("https://javrobs.pythonanywhere.com/tester/QR/", "").split('/');
            const response = await fetch(`/tester/api/QR/${loc}/${name}/${role}/${action}`);
            const responseData = await response.json();
            console.log(responseData);
            setQrInfo(responseData);
        } catch (error) {
            alert(error);
        }
    }

    return <div className="flex flex-col gap-2">
        {Object.keys(qrInfo).length > 0 ? 
            (qrInfo.error)?
                <>
                    <p>{qrInfo.error}</p>
                    <Button icon="arrow_back" color="gray" onClick={()=>setQrInfo({})}>Regresar</Button>
                </> : 
                <>
                    <p className="flex justify-between gap-2"><span className="font-bold">QR:</span>
                        <span>{qrInfo.qr_name}</span>
                    </p>
                    <div className="flex gap-2 flex-col sm:flex-row flex-wrap items-end">
                        <Button icon="arrow_back" color="gray" onClick={()=>{setStage(current=>current>0?current-1:0);setQrInfo({})}}>Regresar</Button>
                        <QRScanner onScan={readQR}/>
                        <Button icon="arrow_forward" onClick={()=>setStage(current=>current+1)} reverse={true} color="green">Siguiente</Button>
                    </div>
                </>
            : <><p>Escanea el QR para {reason}:</p><QRScanner onScan={readQR}/></>}
    </div>
};