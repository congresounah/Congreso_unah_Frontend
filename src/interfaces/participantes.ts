export interface Participantes {
    id_usuario: number;
    dni: string;
    nombre_completo: string;
    correo: string;
    img_recibo:string;
    codigo_recibo:string;
  }

  export interface Asistencias {
      nombre_usuario: string;
      cantidad_asistidas: number;
      cantidad_total_conferencias: number;
      cantidad_minima_conferencias: number;
      cantidad_inscritas_actualmente: number;
      cantidad_faltante_a_inscribir: number;
  }
  