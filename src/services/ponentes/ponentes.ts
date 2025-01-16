import { Ponentes } from "@/interfaces/ponentes";



export const fetchPonentes = async (): Promise<Ponentes[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ponentes/`);
    if (!response.ok) {
      throw new Error("Error al obtener los ponentes");
    }
    const data = await response.json();
    return data.ponentes;
  };