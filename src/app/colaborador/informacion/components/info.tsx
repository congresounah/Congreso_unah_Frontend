'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { isTokenValid } from '../[id]/actions';
import { useNavbar } from '../../../contexts/NavbarContext';

interface ConferenciasData {
  nombre_usuario: string;
  cantidad_asistidas: number;
  cantidad_total_conferencias: number;
  cantidad_minima_conferencias: number;
  cantidad_inscritas_actualmente: number;
  cantidad_faltante_a_inscribir: number;
}

interface ApiResponse {
  conferencias: ConferenciasData;
}

interface UserInfoCardProps {
  id: string | undefined; // ID del usuario pasado como prop
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ id }) => {
  const { setNavbarVisible } = useNavbar();  
  const [data, setData] = useState<ConferenciasData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenValido, setTokenValido] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return; // Si no hay ID, no hacemos el fetch.

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/conferencias/usuario/${id}/asistencias`
        );

        if (!response.ok) {
          throw new Error('Error al obtener los datos del usuario');
        }

        const result: ApiResponse = await response.json();
        setData(result.conferencias);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error desconocido');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
      const processToken = () => {
      const token = Cookies.get("authToken");
  
      if (token) {
        setTokenValido(isTokenValid(token));
      } else {
        setTokenValido(false);
      }


    };
  
    processToken();
  }, []);

  useEffect(() => {
    if(!tokenValido) {
       setNavbarVisible(false);
     } else {
        setNavbarVisible(true);
    }
  }, [tokenValido]);
  
  const renderMessage = () => {
    if (!data) return null;

    const {
      cantidad_asistidas,
      cantidad_minima_conferencias,
      cantidad_faltante_a_inscribir,
    } = data;

    if (cantidad_asistidas >= cantidad_minima_conferencias) {
      return (
        <p className="text-sm mt-4 text-center">
          🥳 <strong>¡Felicidades!</strong> Has cumplido con el requisito de asistencia mínima para obtener tu certificado. Sigue participando y enriqueciendo tu experiencia en el congreso. 🎓✨
        </p>
      );
    }

    if (cantidad_asistidas >= cantidad_minima_conferencias - 3) {
      return (
        <p className="text-sm mt-4 text-center">
          🎉 ¡Estás a un paso de alcanzar el mínimo de conferencias requeridas para obtener tu certificado! Aprovecha esta oportunidad y asiste a una más. ¡Tú puedes lograrlo! 💪
        </p>
      );
    }

    if (cantidad_faltante_a_inscribir > 0) {
      return (
        <p className="text-sm mt-4 text-center">
          📝 ¡Aún puedes inscribirte en más conferencias! Solo te faltan{" "}
          <strong>{cantidad_faltante_a_inscribir}</strong> para alcanzar el
          mínimo necesario. ¡No dejes pasar esta oportunidad y asegura tu lugar!
        </p>
      );
    }

    return (
      <p className="text-sm mt-4 text-center">
        📋 ¡Sigue avanzando en tu participación! Aún tienes oportunidades para completar las conferencias necesarias y lograr tu certificado.
      </p>
    );
  };

  const renderProgressBar = () => {
    if (!data) return null;

    const { cantidad_asistidas, cantidad_minima_conferencias } = data;
    const progress =
      (cantidad_asistidas / cantidad_minima_conferencias) * 100;

    return (
      <div className="mt-4">
        <div className="w-full bg-gray-300 rounded-full h-4">
          <div
            className="bg-indigo-600 h-4 rounded-full"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-center mt-2">
          Llevas {cantidad_asistidas} / {cantidad_minima_conferencias} conferencias para conseguir tu diploma ({Math.min(progress, 100).toFixed(2)}%) 
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-white text-center">
        Cargando información del usuario...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Error: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-white text-center">
        No hay datos disponibles para este usuario.
      </div>
    );
  }

  return (
    <div className="bg-indigo-700 text-white rounded-lg p-6 shadow-md max-w-md w-full sm:max-w-lg">
      <h2 className="text-lg font-bold mb-4 text-center">Información Usuario</h2>
      <div className="bg-indigo-800 rounded-lg p-4">
        <p className="text-lg font-semibold text-center">
          Hola {data.nombre_usuario}!!
        </p>
        <p className="text-sm mt-2">
          {data.cantidad_inscritas_actualmente === 0 ? (
            <>
              🎉 ¡Anímate! Aún no estás inscrito.{" "}
              <span className="font-bold">Inscríbete</span> para poder conseguir tu diploma. 🌟
            </>
          ) : (
            <>
              📋 Actualmente estás inscrito en{" "}
              <span className="font-bold">
                {data.cantidad_inscritas_actualmente}
              </span>{" "}
              {data.cantidad_inscritas_actualmente === 1
                ? "conferencia"
                : "conferencias"}
              . ¡Sigue así y no olvides asistir para alcanzar tus metas! 🌟
            </>
          )}
        </p>


        {/* Barra de progreso */}
        {renderProgressBar()}

        {/* Mensaje dinámico */}
        {renderMessage()}
      </div>

      {/* Botón de redirección */}
      <div className="mt-6 text-center">
        {tokenValido && (
          <button
            onClick={() => {
              if (id) {
                window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/colaborador/confirmar/${id}`;
              }
            }}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
          >
            Organizador
          </button>
        )}
      </div>
    </div>
  );
};

export default UserInfoCard;
