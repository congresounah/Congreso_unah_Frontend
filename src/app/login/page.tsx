'use client'

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Cookies from 'js-cookie';

import Button from "@/components/Button";
import InputForm from "@/components/InputForm";

import { isLoginInputsValids } from "@/utils/loginFormValidators";
import { login, showRegister } from "./actions";
import { resendVerificationEmail } from "@/app/register/confirm-account/actionts";
import ModalWarning from "@/components/ModalWarning";

function Login() {
    const router = useRouter();
    const [sendingLogin, setSendingLogin] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [seconActionModal, setSecondActionModal] = useState<{ title: string, action: () => void; buttonDisabled: boolean } | null>(null);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    /* estados de inputs */
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [areInputsValids, setAreInputsValids] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [showRegisterButton, setShowRegisterButton] = useState(true);

    useEffect(() => {
        const checkRegister = async () => {
            try {
                const response = await showRegister();
                if (response.error) {
                    console.error('Error:', response.error);
                    return;
                }

                setShowRegisterButton(response.responseData.resultado);

            } catch (err) {
                console.error('Unexpected error:', err);
            }
        };

        checkRegister();
    });

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSendingLogin(true);
        setLoginError('');

        try {
            // Llamada al servicio de login
            const response = await login(email.toLowerCase(), password);

            if (response.error) {
                if (response.statusCode === 403) {
                    switch (response.codigoResultado) {
                        case -1:
                            setSecondActionModal(null);
                            setModalMessage(
                                'Lamentamos informarte que tu recibo de pago ha sido rechazado. Si consideras que esto es un error, por favor contáctanos a congresofacultadingenieriaunah@gmail.com.'
                            );
                            break;
                        case -2:
                            setSecondActionModal(null);
                            setModalMessage(
                                'Ha ocurrido un error inesperado. Te invitamos a intentar más tarde o, si lo prefieres, contacta con nosotros en congresofacultadingenieriaunah@gmail.com.'
                            );
                            break;
                        case -3:
                            localStorage.setItem('registerEmail', email);
                            setSecondActionModal({ title: 'Enviar Correo', action: () => { handleResendEmail() }, buttonDisabled: buttonDisabled });
                            setModalMessage(
                                'Parece que tu cuenta no ha sido validada aún. Enviaremos un correo con un código de verificación para que puedas completar tu registro.'
                            );
                            break;
                        case 2:
                            setSecondActionModal(null);
                            setModalMessage(
                                'Estamos validando tu recibo de pago. Por favor, espera unos minutos y vuelve a intentarlo.'
                            );
                            break;
                        default:
                            setSecondActionModal(null);
                            setModalMessage(
                                'Se ha producido un error desconocido. Si necesitas asistencia, no dudes en contactarnos.'
                            );
                            break;
                    }

                    setShowModal(true);
                    setLoginError('');

                } else {
                    setLoginError(response.error);
                }

                setSendingLogin(false);
                return;
            }

            // Limpiar errores y resetear formulario
            setLoginError('');
            setEmail('');
            setPassword('');
            setAreInputsValids(false);

            // Guardar el token
            if (response.token) {
                Cookies.remove('authToken');
                Cookies.set('authToken', response.token, {
                    expires: 1,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                    httpOnly: false
                });
            }

            // Redirigir a la página principal
            router.push('/my/profile');
        } catch (err) {
            console.error('Unexpected error during login:', err);
            setLoginError('Ocurrió un error inesperado. Intenta nuevamente.');
        } finally {
            setSendingLogin(false);
        }
    };

    function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setAreInputsValids(isLoginInputsValids(e.target.value, password));
        setEmail(e.target.value);
    }

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setAreInputsValids(isLoginInputsValids(email, e.target.value));
        setPassword(e.target.value);
    }

    const handleResendEmail = async () => {
        setButtonDisabled(true);


        try {
            const response = await resendVerificationEmail(email);
            if (response.error) {
                throw new Error(response.error);
            }

            localStorage.setItem('timerEndTime', (new Date().getTime() + 10 * 60 * 1000).toString());
            router.push('/register/confirm-account');
        } catch (error) {
            console.error('Error al reenviar el correo:', error);
            setModalMessage("Ocurrió un error al reenviar el correo. Por favor, intenta de nuevo.");
            setShowModal(true);
        } finally {
            setButtonDisabled(false);
        }
    };

    return (
        <>
            {/* formulario de login */}
            <h1 className="text-4xl">¡Bienvenido!</h1>

            <form action="" className="flex justify-center flex-col gap-4 py-16 px-2 w-[80%] md:w-[70%] lg:w-3/5">

                <InputForm placeholder="Correo Electrónico" iconName="email" type="email" id="email" onChange={handleEmailChange} />


                <div>
                    <InputForm placeholder="Contraseña" iconName="lock" type="password" id="password" value={password} onChange={handlePasswordChange} />

                    <Link className="block text-right text-xs text-[#f8b133] hover:cursor-pointer hover:underline" href="/login/forgot-password">¿Olvidaste tu contraseña?</Link>
                </div>


                {loginError && <p className="flex justify-center items-start gap-1 text-[#F8B133] text-sm text-center my-2">
                    <span className="material-symbols-outlined">
                        error
                    </span> {loginError}</p>}

                <div className="mt-4">
                    <Button text="Iniciar Sesión" action={handleLogin} variant='primary' styleType="fill" className="w-[100%] mb-2" disabled={!areInputsValids || sendingLogin} />
                </div>

                {showRegisterButton && (
                    <p className="text-sm text-white text-center">No tengo cuenta, <Link href="/register" className="text-[#f8b133] underline decoration-solid">Registrarme</Link></p>
                )}
            </form>

            {/* Modal de advertencia */}
            {showModal && (
                <ModalWarning
                    title={modalMessage}
                    setIsOpen={setShowModal}
                    isOpen={showModal}
                    secondAction={seconActionModal}
                    buttonDisabled={buttonDisabled}
                />
            )}


        </>);
}

export default Login;