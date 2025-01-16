import { Conferencia } from "@/interfaces/conferencias";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchConferencias = async (dia: string): Promise<Conferencia[]> => {
  const response = await fetch(`${BASE_URL}/conferencias`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dia }),
  });

  if (!response.ok) {
    throw new Error("Error al obtener las conferencias");
  }

  const data = await response.json();
  return data.conferencias;
};


export const fetchConferenciasPorUsuario = async (idUsuario: number, dia: string | null): Promise<Conferencia[]> => {
  const response = await fetch(`${BASE_URL}/conferencias/usuario`, {
    method: "POST", // Cambié el método a POST porque coincide con el ejemplo que proporcionaste.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idUsuario, dia }),
  });

  if (!response.ok) {
    throw new Error("Error al obtener las conferencias del usuario");
  }

  const data = await response.json();
  return data.conferencias;
};

export const fetchConferenciasPorUsuarioGeneral = async (idUsuario: number, fecha: string | null): Promise<Conferencia[]> => {
  const response = await fetch(`${BASE_URL}/conferencias/usuario/general`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idUsuario, fecha }),
  });

  if (!response.ok) {
    throw new Error("Error al obtener las conferencias del usuario");
  }

  const data = await response.json();
  return data.conferencias;
};

export const fetchConferenciasInscritasPorUsuario = async (
  idUsuario: number,
  fecha: string | null
): Promise<Conferencia[]> => {
  const response = await fetch(
    `${BASE_URL}/conferencias/usuario/inscritas`,
    {
      method: "POST", // Método POST como en el ejemplo
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idUsuario, fecha }), // Cuerpo según lo solicitado
    }
  );

  if (!response.ok) {
    throw new Error("Error al obtener las conferencias inscritas del usuario");
  }

  const data = await response.json(); // Parsear el JSON retornado
  return data.conferencias;
};
