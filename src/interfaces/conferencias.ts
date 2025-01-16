export interface CreateConferencia {
  nombre: string;
  nombres_ponente: string;
  apellidos_ponente: string;
  descripcion_ponente: string;
  img_ponente: string;
  descripcion_conferencia: string;
  direccion: string;
  fecha_conferencia: string; // Formato de fecha: "YYYY-MM-DD"
  hora_inicio: string; // Formato completo de fecha y hora: "YYYY-MM-DD HH:mm"
  hora_final: string; // Formato completo de fecha y hora: "YYYY-MM-DD HH:mm"
  cupos: string; // Cambiado a número
  img_conferecia: string; // Cambiado a string para coincidir con el JSON
  url_carpeta_zip: string;
  finalizado?: boolean;
  inactivo?: boolean;
  id_ponente?: number;
}

  export interface Conferencia {
    id_conferencia: number;
    nombre_ponente: string;
    img_ponente: string;
    titulo: string;
    lugar: string;
    horario: string;
    datosimportantes: string[];
    fecha: string;
    cupos_disponibles: number;
    finalizado: boolean;
    inscrito: boolean;
    url_carpeta_zip: string;
  }

  export interface ConferenciaCompleta {
    nombres: string;
    apellidos: string;
    img_ponente: string;
    img_conferencia: string;
    titulo: string;
    lugar: string;
    hora_inicio: string;
    hora_final: string;
    descripcion_conferencia: string;
    descripcion_ponente: string;
    fecha: string;
    cupos: string;
    finalizado: boolean;
    url_carpeta_zip: string;
    id_ponente?: number;
  }





/*     { para interface
      "conferencia": [
          {
              "nombres": "Tommy Alejandro",
              "apellidos": "Lopez Matamoros",
              "img_ponente": "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              "img_conferencia": "https://cdn.masmovil.es/embed/f942e33f77a798f172fd7fbf1244c4a1600708225/Post_conferencias-sin.jpg",
              "titulo": "Introducción a la Inteligencia Artificial",
              "lugar": "Auditorio Principal",
              "hora_inicio": "09:00",
              "hora_final": "10:30",
              "descripcion_conferencia": "Exploración de conceptos básicos. Aplicaciones de la inteligencia artificial.",
              "descripcion_ponente": "Especialista en inteligencia artificial con experiencia en aprendizaje automático.",
              "fecha": "23/01/2025",
              "cupos": 500,
              "finalizado": false,
              "url_carpeta_zip": null
          }
      ]
  } */
      export interface CrearConferencia {
        nombre_conferencia:string;
        nombres_ponente?: string | null;
        apellidos_ponente?: string | null;
        descripcion_ponente?: string | null;
        img_perfil_ponente?: string | null;
        descripcion_conferencia: string;
        direccion: string;
        fecha_conferencia: string; // Formato de fecha: "YYYY-MM-DD"
        hora_inicio: string; // Formato completo de fecha y hora: "YYYY-MM-DD HH:mm"
        hora_final: string; // Formato completo de fecha y hora: "YYYY-MM-DD HH:mm"
        cupos: string; // Cambiado a número
        img_conferecia: string; // Cambiado a string para coincidir con el JSON
        url_carpeta_zip: string;
        id_ponente?: number | null;
      }
      