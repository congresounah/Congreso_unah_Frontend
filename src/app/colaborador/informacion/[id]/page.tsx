'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import Header from '../../components/header';
import UserInfoCard from '../components/info';

const HomePage: React.FC = () => {
  const params = useParams(); // Hook para obtener los parámetros dinámicos de la URL
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id; // Aseguramos que sea un string

  return (
    <div className="flex flex-col min-h-screen bg-[#fff] text-white w-full">
      {/* Header siempre en la parte superior */}
      <Header />

      {/* Contenido principal */}
      <main className="flex flex-col items-center justify-center flex-grow px-4">
        {/* Escáner QR */}
        <div>
          {/* Pasamos el id como prop al componente UserInfoCard */}
          <UserInfoCard id={id} />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
