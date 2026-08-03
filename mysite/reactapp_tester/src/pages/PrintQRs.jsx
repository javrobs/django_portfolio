import React, { useState } from "react";
import QRCodeImage from "../components/QRCodeImage.jsx";

const PrintQRs = () => {
    const PRINT_COUNT = 20;
     
    const invoiceData = [
        {id:1,text:"INV", color:"#082280"},
        {id:2,text:"QLT", color:"#297B33"},
        {id:3,text:"L15", color:"#7D1705"},
    ].reduce((acc,cur)=>{
        for (let i = 0; i < PRINT_COUNT; i++) {
            const url = `https://javrobs.pythonanywhere.com/tester/QR/${cur.id}/${i+1}/`;
            const digits = String(i+1).padStart(2, '0');
            acc.push({url:url,name:`${cur.text}-${digits}`, color:cur.color});
        }
        return acc;
    }, []);

    return <div className="grid grid-cols-2 showPrint">
        {invoiceData.map(each=>(<div key={each.name} style={{color: each.color}} className="p-2 items-center text-slate-300  border border-gray-300 font-extrabold text-xl flex flex-col justify-center">
            <QRCodeImage url={each.url} color={each.color}/>
            {each.name}
        </div>))}
    </div>
}

export default PrintQRs;