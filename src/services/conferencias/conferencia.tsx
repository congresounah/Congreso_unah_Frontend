import { Conferencia, ConferenciaCompleta, CrearConferencia, CreateConferencia } from "@/interfaces/conferencias";
import axios from "axios";
const BASE_URL = "https://backend-congreso.vercel.app";

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('https://backend-congreso.vercel.app/image/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    const data = await response.json();
    return data.imageUrl; // Devuelve la URL de la imagen cargada
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Error uploading file');
  }
};


export const crearConferencia = async (data: CrearConferencia) => {
  try {
    const response = await axios.post(`${BASE_URL}/conferencias/insertar`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error al crear la conferencia:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Error al crear la conferencia");
    } else {
      console.error("Error inesperado:", error);
      throw new Error("Error inesperado al crear la conferencia");
    }
  }
};  

export const editarConferencia = async (data: CreateConferencia) => {
  try {
    const response = await axios.put(`${BASE_URL}/conferencias/editar`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error al editar la conferencia:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Error al editar la conferencia");
    } else {
      console.error("Error inesperado:", error);
      throw new Error("Error inesperado al editar la conferencia");
    }
  }
}

export async function obtenerConferencia(id : string): Promise<ConferenciaCompleta> {
  try {
    const response = await fetch(`${BASE_URL}/conferencias/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    return data.conferencia[0] as ConferenciaCompleta;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    throw error;
  }
}


export const obtenerConferencias = async (dia: string|null): Promise<Conferencia[]> =>{
    try {
      const response = await fetch(`${BASE_URL}/conferencias`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dia }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      return data.conferencias;
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      throw error;
    }
  }


  export const eliminarConferencia = async (id: number): Promise<{ message: string }> => {
    try {
      const response = await axios.delete(`${BASE_URL}/conferencias/eliminar/${id}`);
      return response.data; // Retorna el mensaje de la respuesta
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error al eliminar la conferencia:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Error al eliminar la conferencia");
      } else {
        console.error("Error inesperado:", error);
        throw new Error("Error inesperado al eliminar la conferencia");
      }
    }
  };

  export const inscribirseEnConferencia = async (id_usuario: number, id_conferencia: number) => {
    try {
      const response = await axios.post(`${BASE_URL}/usuario/inscripcion/conferencia`, {
        id_usuario,
        id_conferencia,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // console.error("Error al inscribirse en la conferencia:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Error al inscribirse en la conferencia");
      } else {
        console.error("Error inesperado:", error);
        throw new Error("Error inesperado al inscribirse en la conferencia");
      }
    }
  };
  

  export const cancelarInscripcionConferencia = async (id_usuario: number, id_conferencia: number) => {
    try {
      const response = await axios.delete(`${BASE_URL}/usuario/inscripcion/cancelarConferencia`, {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          id_usuario,
          id_conferencia,
        },
      });
  
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error al cancelar la inscripción de la conferencia:",
          error.response?.data || error.message
        );
        throw new Error(
          error.response?.data?.message ||
            "Error al cancelar la inscripción de la conferencia"
        );
      } else {
        console.error("Error inesperado:", error);
        throw new Error("Error inesperado al cancelar la inscripción de la conferencia");
      }
    }
  };
  