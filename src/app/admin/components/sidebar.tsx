"use client";

import { useState } from "react";
import Image from "next/image";
import { FaBars, FaTimes, FaUsers, FaLock, FaDownload, FaSignOutAlt } from "react-icons/fa";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeButton, setActiveButton] = useState("participantes");
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleButtonClick = (button: string) => {
    setActiveButton(button);
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://congreso-unah-backend.vercel.app/admin/accepted/users/license");

      if (!response.ok) throw new Error("Error al descargar");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "QR_Participantes.pdf"; // Ajusta según el formato del archivo
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Botón para abrir/cerrar la barra lateral */}
      <button className="absolute top-4 left-4 z-50 md:hidden text-blue-900" onClick={toggleSidebar}>
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Barra lateral */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white shadow-md z-40 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static w-64 transition-transform duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="p-6">
          <div className="flex flex-col items-center">
            <Image src="/logos/logocongreso.svg" alt="Logo" width={195} height={68} className="mb-2" />
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-4 px-6 flex-grow">
          <button
            className={`flex items-center gap-4 py-2 px-4 rounded-md ${
              activeButton === "participantes" ? "text-white bg-blue-900" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => handleButtonClick("participantes")}
          >
            <FaUsers />
            <span>Participantes</span>
          </button>
          <button
            className={`flex items-center gap-4 py-2 px-4 rounded-md ${
              activeButton === "conferencias" ? "text-white bg-blue-900" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => handleButtonClick("conferencias")}
          >
            <FaLock />
            <span>Conferencias</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-6">
          <button className="flex items-center gap-4 py-2 px-4 rounded-md text-gray-600 hover:bg-gray-100">
            <FaSignOutAlt />
            <span>Cerrar Sesión</span>
          </button>
          <button
            className="flex items-center gap-4 py-2 px-4  rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            onClick={handleDownload}
            disabled={loading}
          >
            {loading ? "Descargando..." : <>
              <FaDownload />
              <span>Descargar QR de los participantes Inscritos</span>
            </>}
          </button>
        </div>
      </div>

      {/* Fondo oscuro cuando la barra lateral está abierta */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={toggleSidebar}></div>}
    </div>
  );
};

export default Sidebar;
