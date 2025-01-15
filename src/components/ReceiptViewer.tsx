import React, { useState } from "react";
import Image from "next/image";

const ReciboViewer = ({ recibo }: { recibo: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Recibo</label>
      <div
        className="bg-orange-500 h-64 w-64 mt-2 relative cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <Image
          src={recibo || "/imagen.svg"}
          alt="UserRecibo"
          layout="fill"
          objectFit="cover"
        />
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
          onClick={handleCloseModal}
        >
          <div
            className="relative bg-white rounded-lg overflow-hidden shadow-lg max-w-4xl w-full p-4"
            onClick={(e) => e.stopPropagation()} // Evita cerrar el modal al hacer clic dentro
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10 cursor-pointer" 
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <div className="relative w-full h-[80vh]">
              <Image
                src={recibo || "/imagen.svg"}
                alt="UserRecibo Enlarged"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReciboViewer;
