'use client';

import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useRouter } from 'next/navigation';
import { checkIfAuthenticated } from '../actions/auth';
import { toast } from 'sonner';
import Loading from '../components/Loading';

export default function Scan() {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkIfAuthenticated(localStorage.getItem('token') || '').then((check) => {
      if (check) {
        setLoading(false);
      } else {
        router.push('/login');
        toast.error('Please login to continue');
      }
    });
  }, []);

  const startScanning = async () => {
    const qrCodeRegionId = 'qr-scanner';

    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(qrCodeRegionId);
    }

    try {
      await scannerRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          stopScanning();
          router.push(`/get-details?pass_id=${encodeURIComponent(decodedText)}`);
        },
        (errorMessage) => {
          console.warn('QR scan error:', errorMessage);
        }
      );
      setIsScanning(true);
    } catch (err) {
      console.error('Failed to start scanning', err);
    }
  };

  const stopScanning = () => {
    scannerRef.current
      ?.stop()
      .then(() => {
        scannerRef.current?.clear();
        setIsScanning(false);
      })
      .catch((err) => console.error('Failed to stop scanning', err));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-3 text-[#f9dd9c]">Pass Scanner</h1>

      <div
        id="qr-scanner"
        className={`w-full max-w-sm rounded-lg overflow-hidden ${
          isScanning ? 'border border-[#f9dd9c] p-2 bg-white/5 backdrop-blur-sm' : ''
        }`}
      ></div>

      {!isScanning ? (
        <button
          onClick={startScanning}
          className="mt-6 px-6 py-3 bg-[#f9dd9c] text-black font-semibold rounded-md hover:bg-[#ffeaa6] transition"
        >
          📷 Start Scanning
        </button>
      ) : (
        <button
          onClick={stopScanning}
          className="mt-6 px-6 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
        >
          ✋ Stop Scanning
        </button>
      )}
    </div>
  );
}
