export const login = async (email: string, password: string): Promise<{ error?: string; codigoResultado?: number; token?: string; statusCode?: number }> => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${API_URL}/usuario/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo: email, contrasenia: password }),
        });

        /* si es un 403 quiero moestrar un modal */

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || 'Error', statusCode: response.status, codigoResultado: errorData.codigoResultado }; 
        }

        const data = await response.json();
        return { token: data.token }; 
    } catch (error) {
        console.error('Login error:', error);
        return { error: 'Network error or server unavailable' };
    }
};

/* Verifica si hay menos de 500 usuarios inscritos verificados para ver si ocultamos o no el boton de registro */
export const showRegister = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_URL) {
        throw new Error('API_URL is not defined');
    }

    try {
        const response = await fetch(`${API_URL}/usuario/pre-registro`, {
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