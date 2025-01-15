import React, { useState } from "react";
import Image from "next/image";
import { FaUsers,FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

const Sidebar2: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeButton, setActiveButton] = useState("participantes");

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleButtonClick = (button: string) => {
    setActiveButton(button);
  };

  return (
    <div className="relative">
      {/* Botón para abrir/cerrar la barra lateral */}
      <button
        className="absolute top-4 left-4 z-50 md:hidden text-blue-900"
        onClick={toggleSidebar}
      >
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
            <Image
              src="/logocongreso.svg" // Cambia esta ruta por la ruta de tu logo
              alt="Logo"
              width={195} // Tamaño del logo (en píxeles)
              height={68}
              className="mb-2"
            />
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-4 px-6 flex-grow">
          <button
            className={`flex items-center gap-4 py-2 px-4 rounded-md ${
              activeButton === "participantes"
                ? "text-white bg-blue-900"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => handleButtonClick("participantes")}
          >
            <FaUsers />
            <span>Participantes</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-6">
          <button className="flex items-center gap-4 py-2 px-4 rounded-md text-gray-600 hover:bg-gray-100">
            <FaSignOutAlt />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Fondo oscuro cuando la barra lateral está abierta */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Sidebar2;
