import React, { useEffect, useState, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from "html5-qrcode";

interface QrScannerProps {
  onScanError?: (errorMessage: string) => void;
  onScanSuccess: (decodedText: string) => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ onScanError, onScanSuccess }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState<number>(0);

  const startScanner = useCallback(
    async (cameraId: string) => {
      const scanner = new Html5Qrcode("qr-reader");
      try {
        await scanner.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          } as Html5QrcodeCameraScanConfig,
          (decodedText) => {
            try {
              const url = new URL(decodedText); // Validar si es una URL
              onScanSuccess(url.href); // Ejecutar callback en caso de éxito
              window.location.href = url.href; // Redirigir al enlace
            } catch {
              console.error("Texto escaneado no es una URL válida:", decodedText);
              onScanError?.("El código QR no contiene una URL válida.");
            }
          },
          (scanError) => {
            console.warn("Error al escanear:", scanError);
            onScanError?.(scanError); // Manejar errores de escaneo
          }
        );
      } catch (error) {
        console.error("Error al iniciar el escáner:", error);
        setErrorMessage("No se pudo iniciar el escáner con la cámara seleccionada.");
      }

      return () => {
        scanner.stop().catch(console.error);
        scanner.clear();
      };
    },
    [onScanError, onScanSuccess]
  );

  const changeCamera = async () => {
    if (cameras.length > 0) {
      const nextIndex = (currentCameraIndex + 1) % cameras.length;
      setCurrentCameraIndex(nextIndex);

      const cameraId = cameras[nextIndex].deviceId;

      await startScanner(cameraId);
    }
  };

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();

        if (devices.length === 0) {
          throw new Error("No se encontraron cámaras disponibles.");
        }

        // Filtrar la cámara trasera (si está disponible)
        const rearCamera = devices.find((device) => device.label.toLowerCase().includes("back"));
        const frontCamera = devices.find((device) => device.label.toLowerCase().includes("front"));

        const selectedCamera = rearCamera || frontCamera || devices[0]; // Prioriza la cámara trasera, luego la delantera, si no se encuentra, usa la primera disponible.

        // Mapear dispositivos de tipo CameraDevice a MediaDeviceInfo
        const formattedDevices = devices.map((device) => ({
          deviceId: device.id,
          label: device.label,
          kind: "videoinput" as MediaDeviceKind, // Aseguramos que el tipo es correcto
          groupId: "", // Opcional
          toJSON: () => JSON.stringify(device), // Implementación mínima de toJSON
        }));

        setCameras(formattedDevices as MediaDeviceInfo[]);

        const initialCameraId = selectedCamera.id;
        await startScanner(initialCameraId);
      } catch (error) {
        console.error("Error al inicializar el escáner:", error);
        setErrorMessage("No se pudo acceder a la cámara. Asegúrate de otorgar permisos.");
      }
    };

    initializeScanner();
  }, [startScanner]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">
          Escanea el Código QR
        </h1>
        {errorMessage && (
          <p className="text-red-500 text-center font-medium">{errorMessage}</p>
        )}
        <div
          id="qr-reader"
          className="border-2 border-gray-600 rounded-lg w-full max-w-[90vw] h-auto aspect-square"
        ></div>
        <p className="mt-4 text-sm text-center text-gray-700">
          Asegúrate de que el código QR esté completamente dentro del recuadro.
        </p>
      </div>
      <div className="mt-[3%]">
        <button
          onClick={changeCamera}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Cambiar Cámara
        </button>
      </div>
    </div>
  );
};

export default QrScanner;
