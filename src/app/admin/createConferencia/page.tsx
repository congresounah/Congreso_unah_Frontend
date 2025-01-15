'use client'

import ConferenciaForm from "./components/ConferenciasForm";

const HomePage: React.FC = () => {
  return (
    <main className="container mx-auto px-4 pt-1">
      <ConferenciaForm />
    </main>
  );
};

export default HomePage;