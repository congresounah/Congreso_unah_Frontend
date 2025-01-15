import { sendCodeToVerifyUser, resendCodeToVerifyUser } from "@/services/userService";

export const verifyUser = async (email: string, code: string) => {
    try {
        const result = await sendCodeToVerifyUser(email, Number(code));
        return result;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Error desconocido al verificar usuario' };
    }
};

export const resendVerificationEmail = async (email: string) => {
    try {
        const result = await resendCodeToVerifyUser(email);
        return result;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Error desconocido al reenviar correo de verificación' };
    }
}
