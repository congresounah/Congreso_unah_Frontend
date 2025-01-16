import { Ponentes } from "@/interfaces/ponentes";


export const fetchPonentes = async (): Promise<Ponentes[]> => {
    const response = await fetch("https://congreso-unah-frontend.vercel.app/ponentes/");
    if (!response.ok) {
      throw new Error("Error al obtener los ponentes");
    }
    const data = await response.json();
    return data.ponentes;
  };