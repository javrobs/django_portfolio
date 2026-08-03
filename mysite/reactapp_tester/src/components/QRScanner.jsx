import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import Button from './Button.jsx';

const QRScanner = ({ onScan, title}) => {
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');

  const startScanner = async () => {
    setError('');
    const html5QrCode = new Html5Qrcode('qr-reader');
    html5QrCodeRef.current = html5QrCode;

    try {
      await html5QrCode.start(
        { facingMode: 'environment' }, // back camera on mobile
        {
          fps: 20,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScan(decodedText);
          stopScanner(); // remove this line if you want continuous scanning
        },
        () => {
          // fires continuously while no QR is found — ignore
        }
      );
      setIsScanning(true);
    } catch (err) {
      setError('Camera access failed: ' + err.message);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (e) {
        // scanner already stopped
      }
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      stopScanner(); // cleanup camera on unmount
    };
  }, []);

  return (
    <div className='flex flex-col gap-1'>
      <div id="qr-reader" ref={scannerRef}/>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!isScanning ? (
        <Button type="button" color="blue" icon="qr_code" onClick={startScanner}>Escanear</Button>
      ) : (
        <Button type="button" color="red" icon="cancel" onClick={stopScanner}>Detener</Button>
      )}
    </div>
  );
};

export default QRScanner;