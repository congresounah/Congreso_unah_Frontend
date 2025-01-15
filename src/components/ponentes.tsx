'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { Ponentes } from "@/interfaces/ponentes";
import { fetchPonentes } from "@/services/ponentes/ponentes";

export default function PonentesComponente() {
  const [ponentes, setPonentes] = useState<Ponentes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPonentes = async () => {
      try {
        const data = await fetchPonentes();
        setPonentes(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ocurrió un error desconocido");
        }
      } finally {
        setLoading(false);
      }
    };
  
    loadPonentes();
  }, []);
  

  if (loading) {
    return <p className="text-center text-white text-xl">Cargando ponentes...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 text-xl">Error: {error}</p>;
  }

  return (
    <div>
      <h1 className="text-[#E7E8F2] text-3xl md:text-5xl text-center mb-6">
        Ponentes
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-12">
        {ponentes.map((ponente, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-lg shadow-lg "
          >
            {/* Imagen */}
            <Image
              src={ponente.img_perfil}
              alt={ponente.nombres}
              width={468}
              height={592}
              className="w-full h-64 object-cover group-hover:opacity-20 transition-opacity duration-300"
            />
            {/* Nombre con fondo semitransparente */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white text-center p-4">
              <h3 className="text-lg font-bold">{ponente.nombres}</h3>
            </div>
            {/* Descripción en hover */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-75 p-4">
              <p className="text-sm text-gray-300">{ponente.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}