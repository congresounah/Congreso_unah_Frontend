import React from 'react';
import { useState, useEffect } from 'react';

const CheckComponent = () => {
  const [conferences, setConferences] = useState<{ id_conferencia: number; nombre: string }[]>([]);
  const [selectedConference, setSelectedConference] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showBackButton, setShowBackButton] = useState(false);

  useEffect(() => {
    const fetchConferences = async () => {
      const today = new Date().toISOString().split('T')[0];
      const requestData = { fecha: today };


      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conferencias/fecha`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        const data = await response.json();
        setConferences(data.conferencias || []);
      } catch (error) {
        console.error('Error fetching conferences:', error);
      }
    };

    fetchConferences();
  }, []);

  const handleConferenceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedConference(Number(event.target.value));
  };

  const handleButtonClick = async (type: 'entrada' | 'salida') => {
    if (!selectedConference) {
      setModalMessage('Por favor selecciona una conferencia antes de continuar.');
      setIsModalOpen(true);
      setShowBackButton(false);
      return;
    }
  
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const currentTime = currentDate.toTimeString().split(' ')[0];
    const timestamp = `${formattedDate} ${currentTime}`;
  
    const url = window.location.href; // Obtiene la URL completa
    const idUsuario = url.split('/').pop(); // Extrae el último segmento de la URL

    const requestData = {
      idUsuario,
      idConferencia: selectedConference.toString(),
      ...(type === 'entrada' ? { horaEntrada: timestamp } : { horaSalida: timestamp }),
    };
  
    try {
      const url =
        type === 'entrada'
          ? `https://congreso-unah-backend.vercel.app/usuario/asistencia/hora/entrada`
          : `https://congreso-unah-backend.vercel.app/usuario/asistencia/hora/salida`;
  
      const method = type === 'entrada' ? 'POST' : 'PUT';
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      const data = await response.json();
  
      const errorMessages: Record<
        'entrada' | 'salida',
        Record<2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, string>
      > = {
        entrada: {
          2: 'Error: La conferencia no existente.',
          3: 'Error: La conferencia ya finalizó.',
          4: 'Error: inesperado.',
          5: 'Error: Usuario no existente.',
          6: 'Error: Usuario no inscrito en la conferencia.',
          7: 'Aún no es tiempo de marcar asistencia, solo 1 hora antes del comienzo',
          8: 'Error: El tiempo para entrar a la conferencia finalizó',
          9: 'Error: Usuario ya entró a la conferencia',
        },
        salida: {
          2: 'Error: La conferencia no existe.',
          3: 'Error: Usuario no existente o no validado.',
          4: 'Error: Usuario no inscrito en la conferencia.',
          5: 'Error: El usuario no ha registrado una hora de entrada a esta conferencia.',
          6: 'Advertencia: Menos de 20 minutos de estadía en la conferencia, no se valida la asistencia.',
          7: 'Error: Tiempo de marcar asistencia finalizado, hasta 1 hora después de finalizar',
          8: 'Error: La conferencia no ha iniciado, no puedes marcar hora de salida',
          9: 'Error: inesperado.',
        },
      };
  
      if (data.result?.codigo === 1) {
        setModalMessage(data.result.mensaje);
        setShowBackButton(true);
      } else {
        const errorMessage =
          errorMessages[type]?.[data.result?.codigo as 2 | 3 | 4 | 5 | 6] ||
          'Error inesperado. Intenta nuevamente.';
        setModalMessage(errorMessage);
        setShowBackButton(false);
      }
    } catch (error) {
      console.error(`Error registrando hora ${type}:`, error);
      setModalMessage('Error de conexión con el servidor.');
      setShowBackButton(false);
    }
  
    setIsModalOpen(true);
  };
  

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const navigateToMainPage = () => {
    window.location.href = `https://congresoinnovacionunah2025.com/colaborador/escaner`;
  };

  return (
    <div className="flex flex-col items-center space-y-4 bg-gray-900 text-white p-6 rounded-md w-full max-w-md mx-auto sm:p-8">
      {/* Dropdown menu */}
      <div className="w-full">
        <label htmlFor="conference" className="block text-sm font-medium text-white mb-2">
          Conferencias
        </label>
        <select
          id="conference"
          value={selectedConference || ''}
          onChange={handleConferenceChange}
          className="w-full bg-white text-black px-4 py-2 rounded-md"
        >
          <option value="" disabled>
            Selecciona una conferencia
          </option>
          {conferences.map((conference) => (
            <option key={conference.id_conferencia} value={conference.id_conferencia}>
              {conference.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <button
        onClick={() => handleButtonClick('entrada')}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
      >
        Hora Entrada
      </button>
      <button
        onClick={() => handleButtonClick('salida')}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
      >
        Hora Salida
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white text-black p-6 rounded-md text-center w-full max-w-sm">
            <p className="mb-4">{modalMessage}</p>
            <button
              onClick={closeModal}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md mt-4"
            >
              Cerrar
            </button>
            {showBackButton && (
              <button
                onClick={navigateToMainPage}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md mt-4"
              >
                Volver a la página principal
              </button>
            )}
          </div>
        </div>
      )}
      <div>
      <button
                onClick={navigateToMainPage}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md mt-4"
              >
                Volver a la página principal
              </button>
      </div>
    </div>
    
  );
};

export default CheckComponent;
