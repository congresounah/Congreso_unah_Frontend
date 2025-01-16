import { RegisterFormInterface } from "@/interfaces/RegisterForm";

import { genders } from '@/app/constants/genders';

export const logout = async (email: string) => {
   
    if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('API_URL is not defined');
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({correo : email}),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || `Error ${response.status}: ${response.statusText}` };
        }

        const responseData = await response.json();
        return { responseData };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Network error or server unavailable' };
    }
}

export const register = async (formData: RegisterFormInterface) => {
   
    if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('API_URL is not defined');
    }

    const gender = genders.find((genderItem) => genderItem.id === Number(formData.genero));
    if (!gender) {
        return { error: 'Invalid gender provided' };
    }

    const newFormData = {
        ...formData,
        genero: gender.abrev,
    };

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/registrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newFormData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || `Error ${response.status}: ${response.statusText}` };
        }

        const responseData = await response.json();
        return { responseData };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Network error or server unavailable' };
    }
};

export const sendCodeToVerifyUser = async (email: string, code: number) => {
    
    if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('API_URL is not defined');
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/verificarcodigo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo: email, codigo_verificacion: code }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || `Error ${response.status}: ${response.statusText}` };
        }

        const responseData = await response.json();
        if(responseData.codigo_resultado == 1){
            return { responseData };
        }

        return { error: responseData.message || `Error ${response.status}: ${response.statusText}` };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Network error or server unavailable' };
    }
}

export const emailExists = async (email: string) => {
    
    if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('API_URL is not defined');
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/verificacion/existe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo: email }),
        }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || `Error ${response.status}: ${response.statusText}` };
        }

        const responseData = await response.json();
        return { responseData };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Network error or server unavailable' };
    }
}

export const uploadReceiptImage = async (image: File) => {
    
    if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('API_URL is not defined');
    }

    const formData = new FormData();
    formData.append('file', image);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || `Error ${response.status}: ${response.statusText}` };
        }

        const responseData = await response.json();
        return { responseData };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Network error or server unavailable' };
    }
}

/* Para cambio de contraseña (forgot-password) */
export const sendEmailToResetPassword = async (email: string) => {

    if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('API_URL is not defined');
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/verificacion/contrasena`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo: email }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || `Error ${response.status}: ${response.statusText}` };
        }

        const responseData = await response.json();
        return { responseData };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Network error or server unavailable' };
    }
}

export const sendCodeToResetPassword = async (email : string, code : number) => {
    
    if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('API_URL is not defined');
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/verificarcodigo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo: email, codigo_verificacion : code }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || `Error ${response.status}: ${response.statusText}` };
        }


        const responseData = await response.json();
        if(responseData.codigo_resultado === "1"){
            return { responseData };
        }

        return { error: responseData.message || `Error ${response.status}: ${response.statusText}` };

    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Network error or server unavailable' };
    }


}

export const resendCodeToVerifyUser = async (email : string) => {
    
    if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('API_URL is not defined');
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/verificacion/reenviarcorreo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo: email }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || `Error ${response.status}: ${response.statusText}` };
        }

        const responseData = await response.json();
        return { responseData };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Network error or server unavailable' };
    }
}

export const sendNewPassword = async (email : string, password : string) => {
    
    if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('API_URL is not defined');
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/cambiarcontrasena`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo: email, nueva_contrasena: password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || `Error ${response.status}: ${response.statusText}` };
        }

        const responseData = await response.json();
        return { responseData };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Network error or server unavailable' };
    }
}

export const isRegisterAvailable = async () => {
    
    if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('API_URL is not defined');
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuario/pre-registro`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || `Error ${response.status}: ${response.statusText}` };
        }

        const responseData = await response.json();
        return { responseData };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Network error or server unavailable' };
    }
}

/* obtiene el usuario actual directo de las cookies */

