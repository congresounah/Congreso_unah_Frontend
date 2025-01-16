import { Ponentes } from "@/interfaces/ponentes";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;


export const fetchPonentes = async (): Promise<Ponentes[]> => {
    const response = await fetch(`${BASE_URL}/ponentes/`);
    if (!response.ok) {
      throw new Error("Error al obtener los ponentes");
    }
    const data = await response.json();
    return data.ponentes;
  };