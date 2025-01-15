export interface User {
  nombre: string;
  apellido: string;
  correo: string;
  genero: string;
  telefono: string;
  fecha_nacimiento: string;
  imagen_url?: string;
}
export interface EditPerfilProps {
  userEmail: string;
}

export interface ActualizarUser{
  nombres: string, 
  apellidos: string, 
  correo: string, 
  dni? : number|null,
  contrasena? : number| null,
}

export interface resetPsw{
  
    correo: string;
    nuevaContrasena:string;
  
}

export interface ResetPwdResponse {
  codigo: number;
  mensaje: string;
}

export interface UsuarioRecibo {
  nombres: string;
  apellidos: string;
  correo: string;
  dni: string | null; // Actualizado para aceptar `null`
  contrasena: string | null; // Actualizado para aceptar `null`
  id_usuario: number;
  img_recibo?: string;
  codigo_recibo?: string;
  url_qr?: string;
  telefono?: string;
  numero_cuenta?: string;
}
