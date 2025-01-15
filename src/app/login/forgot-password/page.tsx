'use client'

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import InputForm from "@/components/InputForm";
import InputFields from "@/components/InputCodeForm";
import SuccessScreen from "@/components/SuccesScreenForms";
import ModalWarning from "@/components/ModalWarning";

import { validateConfirmPassword, validateEmailForgotPassword, validatePassword } from "@/utils/registerFormValidators";
import { sendCodeToResetPasswordF, sendEmailToResetPasswordF, sendNewPasswordF } from "./actions";

export default function ForgotPassword() {
  const router = useRouter()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [showInputEmail, setShowInputEmail] = useState(true);
  const [showInputCode, setShowInputCode] = useState(false);
  const [showInputNewPassword, setShowInputNewPssword] = useState(false);
  const [sending, setSending] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  /* estados de inputs */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
    general: ""
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setErrors((prev) => ({
      ...prev,
      password: validatePassword(e.target.value)
    }))
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);

    setErrors((prev) => ({
      ...prev,
      confirmPassword: validateConfirmPassword(password, e.target.value),
    }));
  };

  const handleInputCodeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      e.target.value = value;
      if (value && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      e.target.value = "";
    }
  };

  const handleSendEmail = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setSending(true);
    setErrors((prev) => ({
      ...prev,
      general: ""
    }));

    const emailError = validateEmailForgotPassword(email.toLowerCase());
    setErrors((prevErrors) => ({ ...prevErrors, email: emailError }));

    if (emailError) {
      setSending(false);
      return;
    }

    try {
      const response = await sendEmailToResetPasswordF(email.toLowerCase());

      if (response.error) {
        setErrors((prev) => ({
          ...prev,
          email: "Lo sentimos, no pudimos encontrar tu correo. Por favor, intenta de nuevo."
        }))
        return;
      }

      setShowInputEmail(false);
      setShowInputCode(true);
    } catch {
      setModalMessage("Ocurrió un error al enviar el código. Por favor, intenta de nuevo.")
      setShowModal(true)
      console.error("Ocurrio problema al enviar codigo al correo FP")
    } finally {
      setSending(false);
    }
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true);
    setErrors((prev) => ({
      ...prev,
      general: ""
    }));

    const errorElement = document.getElementById('error-paragraph');
    if (errorElement) {
      errorElement.classList.remove('shake');
      void errorElement.offsetWidth;
    }

    // Recorre los inputs y valida si están vacíos
    for (const input of inputRefs.current) {
      if (input?.value === "") {
        if (errorElement) {
          errorElement.classList.add('shake');
        }
        setErrors((prev) => ({
          ...prev,
          code: "Por favor, ingresa el código completo"
        }))
        input?.focus();
        setSending(false);
        return;
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, code: "" }));

    // Obtiene el código ingresado
    const code = inputRefs.current.map((input) => input?.value).join("");

    // Valida si el correo está presente
    if (!email) {
      setErrors((prev) => ({
        ...prev,
        email: "Error al identificar el correo. Por favor, intenta de nuevo"
      }));
      return; // Detiene la ejecución
    }

    try {
      // Envía la petición para verificar el código
      const response = await sendCodeToResetPasswordF(email.toLowerCase(), Number(code));
      if (response.error) {
        console.error('Error al verificar el código:', response.error);
        setErrors((prev) => ({
          ...prev,
          code: "El código ingresado es incorrecto o ha expirado."
        }));
        return;
      }

      setShowInputCode(false);
      setShowInputNewPssword(true);

    } catch (error) {
      console.error('Error inesperado:', error);
      setModalMessage("Ocurrió un error al verificar el código. Por favor, intenta de nuevo.")
      setShowModal(true)
    } finally {
      setSending(false);
    }
  };

  const handleSendNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setErrors((prev) => ({
      ...prev,
      general: ""
    }));

    const validation = validateConfirmPassword(password, confirmPassword);
    const validationPassword = validatePassword(password);

    if (validation || validationPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validation,
        password: validationPassword
      }))
      setSending(false);
      return;
    }

    try {
      const response = await sendNewPasswordF(email.toLowerCase(), password);

      if (response.error) {
        console.error('Error al enviar la nueva contraseña:', response.error);
        return;
      }

      setShowInputNewPssword(false);
      setFinished(true)
    } catch {
      setModalMessage("Ocurrió un error al enviar la nueva contraseña. Por favor, intenta de nuevo.")
      setShowModal(true)
      console.error("Ocurrio problema al enviar nueva contrasena FP")
    } finally {
      setSending(false);
    }
  }

  function handleCancel(e: React.FormEvent): void {
    e.preventDefault();
    router.push('/login');
  }

  return (
    <>
      {!finished && <>
        <h1 className="text-4xl font-semibold">Recupera tu cuenta</h1>
        <form action="" className="flex justify-center flex-col gap-2 py-16 px-2 w-[80%] md:w-4/5 xl:w-3/5">
          {/* Muestra input para ingresar email y luego codigo */}
          {showInputEmail && (
            <>
              <p className="text-sm text-[#ab9a9a] leading-4 mb-6 text-center">
                Ingresa tu correo electrónico para enviarte un código de verificación y recuperar tu cuenta.
              </p>

              <div>
                <InputForm
                  placeholder="Correo Electrónico"
                  iconName="email"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />

                {errors.email && <p className="text-[#F8B133] text-sm leading-4">{errors.email}</p>}

              </div>
            </>
          )}

          {showInputCode && (
            <div>
              <div className="flex flex-col gap-2 text-center">
                <p className="leading-4 text-[#ab9a9a] text-center">Ingresa el código que acabamos de enviarte a
                  <span className="text-white font-semibold">{" "}{email}</span> para verificar que eres tú</p>
                <p className="text-[#ab9a9a]">Si no lo encuentras revisa la bandeja de <span className="text-white">spam.</span></p>
                <InputFields inputRefs={inputRefs} handleInputChange={handleInputCodeChange} />

              </div>
              {errors.code && <p className="text-[#F8B133] text-sm mt-3 text-center" id="error-paragraph">{errors.code}</p>}
            </div>

          )}



          {/* Muestra campos para cambio de contraseña */}
          {showInputNewPassword && (
            <div>
              <div className="flex flex-col gap-4">
                <p className="leading-4 text-[#ab9a9a] text-center">Establece una nueva contraseña para acceder a tu cuenta.</p>
                <div>
                  <InputForm
                    placeholder="Nueva Contraseña"
                    iconName="lock"
                    type="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  {errors.password && <p className="text-[#F8B133] text-sm">{errors.password}</p>}
                </div>
                <div>
                  <InputForm
                    placeholder="Confirmar Contraseña"
                    iconName="lock"
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                  {errors.confirmPassword && <p className="text-[#F8B133] text-sm">{errors.confirmPassword}</p>}
                </div>

              </div>
              {errors.code && <p className="text-[#F8B133] text-sm mt-3" id="error-paragraph">{errors.code}</p>}
            </div>

          )}

          {/* Botones de navegacion */}
          {!finished && (
            <div className="flex flex-col gap-2 mt-6">
              <Button
                text={showInputEmail ? "Buscar Correo" : showInputCode ? "Verificar" : "Cambiar Contraseña"}
                action={showInputEmail ? handleSendEmail : showInputCode ? handleSendCode : handleSendNewPassword}
                variant="primary"
                styleType="fill"
                className="w-full mt-6"
                disabled={sending}
              />
              <Button
                text={"Cancelar"}
                action={handleCancel}
                variant="secondary"
                styleType="fill"
                disabled={sending}
              />

            </div >
          )}
        </form >
      </>}

      {errors.general && <p className="text-[#F8B133] text-sm mt-3">{errors.general}</p>}

      {/* Mostrar pantalla de exito cuando haya finalizado todo el proceso */}
      {finished && !showInputCode && !showInputNewPassword && (
        <SuccessScreen
          title="Cambio de contraseña exitoso"
          comment="Tu contraseña se ha actualizado correctamente. Ahora puedes iniciar sesión utilizando tus nuevas credenciales."
          buttonTitle="Ir a Iniciar Sesión"
          redirectionRoute="/login"
          router={router}
        />
      )}

      {showModal && (
        <ModalWarning
          title={modalMessage}
          isOpen={showModal}
          setIsOpen={setShowModal}  
        />

      )}
    </>
  )
}