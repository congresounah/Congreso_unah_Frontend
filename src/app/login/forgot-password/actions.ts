import { sendEmailToResetPassword, sendCodeToResetPassword, sendNewPassword} from "@/services/userService";


export const sendEmailToResetPasswordF = async (email: string) => {
    try {
        const result = await sendEmailToResetPassword(email);
        return result;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Error desconocido al enviar correo' };
    }
}

export const sendCodeToResetPasswordF = async (email: string, code: number) => {
    try {
        const result = await sendCodeToResetPassword(email, code);
        return result;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Error desconocido al enviar codigo FP' };
    }
}

export const sendNewPasswordF = async (email: string, password: string) => {
    try {
        const result = await sendNewPassword(email, password);
        return result;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Error desconocido al enviar nueva contraseña' };
    }
}

