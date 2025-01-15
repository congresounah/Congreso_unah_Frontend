export interface RegisterFormInterface {
    nombres: string;
    apellidos: string;
    telefono: string;
    dni: string;
    fecha_nacimiento: string;
    genero: number;
    id_universidad: number | null;
    identificador_unah: string | null;
    id_carrera_unah?: number | null;
    correo: string;
    contrasena: string;
    codigo_recibo?: string | null;
    codigo_organizador: string | null;
    img_recibo?: string | null;
    recibo?: File | null;

}

/* export interface RegisterFormInterface {

    nombres: string;

    apellidos: string;

    telefono: string;

    dni: string;

    fecha_nacimiento: string;

    genero: number;

    id_universidad: number | null;

    identificador_unah: string | null;

    correo: string;

    contrasena: string;

    codigo_recibo: string;

    codigo_organizador: string | null;

    recibo: string | null;

} */