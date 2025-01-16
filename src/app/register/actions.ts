import { RegisterFormInterface } from '@/interfaces/RegisterForm';
import { university, UniversityExtended } from '@/interfaces/University';
import { register as registerUser, emailExists, uploadReceiptImage } from '@/services/userService';

export const handleRegister = async (formData: RegisterFormInterface) => {
    try {
        if (formData.recibo) {
            const response = await handleUploadReceiptImage(formData.recibo);
            if ('error' in response) {
                throw new Error(response.error);
            }


            formData = { ...formData, img_recibo: response.responseData.imageUrl };
        }


        const result = await registerUser(formData);
        return result; // Devuelve la respuesta para ser manejada en el componente
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Error desconocido al registrar usuario' };
    }
};

const handleUploadReceiptImage = async (image: File) => {
    try {
        const result = await uploadReceiptImage(image);
        return result;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Error desconocido al subir la imagen' };
    }
}

export const getUniversities = async () => {

    try {
        const response = await fetch(`https://congreso-unah-backend.vercel.app/usuario/universidades`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || 'Error' };
        }

        const data = await response.json();

        const universities: university[] = data.map((university: UniversityExtended) => {
            return { id: university.id_universidad, name: university.universidad };
        });

        return { universities };
    } catch (error) {
        console.error('get universities error:', error);
        return { error: 'Network error or server unavailable' };
    }
};

export const getCareers = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${API_URL}/usuario/carreras`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || 'Error' };
        }

        const data = await response.json();

        return { data };
    } catch (error) {
        console.error('get careers error:', error);
        return { error: 'Network error or server unavailable' };
    }
}


export const checkEmailExists = async (email: string) => {
    try {
        const result = await emailExists(email);
        return result;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Error desconocido al verificar correo' };
    }
};


