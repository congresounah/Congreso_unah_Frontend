'use client';

import ConferenciaForm from "./components/EditConferenceForm";
import { useSearchParams } from 'next/navigation';
import { useParams } from 'next/navigation';

const EditarConferenciaPage: React.FC = () => {
  // Usar useParams para obtener el ID desde la URL
  const { id } = useParams();

  const searchParams = useSearchParams();
  const visualizar = searchParams.get('visualizar');
  const isVisualizing = visualizar === 'true';

  return (
    <main className="container mx-auto pt-1">
      <ConferenciaForm id={id as string} isVisualizing={isVisualizing} />
    </main>
  );
};

export default EditarConferenciaPage;
