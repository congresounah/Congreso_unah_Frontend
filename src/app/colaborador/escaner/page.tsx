'use client';
import React from 'react';
import QrScanner from './components/QrScanner';
import Header from '../components/header';

const ScanPage: React.FC = () => {
  const handleScanSuccess = (decodedText: string) => {
    // Verificar si el texto decodificado es una URL válida
    try {
      const url = new URL(decodedText);
      window.location.href = url.href; // Redirige a la URL
    } catch (error) {
      console.error("El texto escaneado no es una URL válida:", decodedText, error);
      alert(`Texto detectado no válido: ${decodedText}`);
    }
  };
  

  const handleScanError = (errorMessage: string) => {
    console.warn(`QR Scan Error: ${errorMessage}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fff] text-white">
      {/* Header siempre en la parte superior */}
      <Header />

      {/* Contenido principal */}
      <main className="flex flex-col items-center justify-center flex-grow px-4">
        {/* Escáner QR */}
        <div className="">
          <QrScanner onScanSuccess={handleScanSuccess} onScanError={handleScanError} />
        </div>
      </main>
    </div>
  );
};

export default ScanPage;