import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const QRCanvas = ({url, size=200, color}) => {
  const [content, setContent] = useState("");
    
  useEffect(() => {
    QRCode.toString(url, {type: "svg",margin:2, color: {dark: color, light: '#fff'}}).then(setContent).catch(console.error);
    console.log(color)
  },[url]);

    return <div style={{width: size+"px", height: size+"px"}} dangerouslySetInnerHTML={{ __html: content }}></div>
      
  }

export default QRCanvas;