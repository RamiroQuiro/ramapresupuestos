import React, { useState, useRef } from "react";
import { Camera, CameraOff, Loader2, CheckCircle, XCircle, User } from "lucide-react";

type Props = {
  onScan: (playerId: string) => void;
  onClose?: () => void;
};

export default function QrScanner({ onScan, onClose }: Props) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const scannerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startScan = async () => {
    setError("");
    setScanning(true);
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText: string) => {
          // Extraer ID del QR: formato "clubmanager://player/ID" o solo "ID"
          const id = decodedText.replace(/^.*\/player\//, "").trim();
          if (id) {
            scanner.stop().catch(() => {});
            setScanning(false);
            onScan(id);
          }
        },
        () => {} // ignore non-qr frames
      );
    } catch (e: any) {
      setError(e?.message || "Error al iniciar la cámara");
      setScanning(false);
    }
  };

  const stopScan = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch {}
      scannerRef.current = null;
    }
    setScanning(false);
  };

  React.useEffect(() => {
    return () => { stopScan(); };
  }, []);

  return (
    <div>
      {!scanning ? (
        <button onClick={startScan}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50/50 px-4 py-3 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-100 hover:border-blue-400">
          <Camera className="h-5 w-5" /> Escanear QR con cámara
        </button>
      ) : (
        <div className="space-y-2">
          <div ref={containerRef} id="qr-reader" className="overflow-hidden rounded-lg" style={{ maxWidth: 300, margin: "0 auto" }} />
          <button onClick={stopScan}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100">
            <CameraOff className="h-4 w-4" /> Detener cámara
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-center text-xs text-red-500">{error}</p>}
    </div>
  );
}
