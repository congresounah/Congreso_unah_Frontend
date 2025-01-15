"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import InputForm from "@/components/InputForm";
import SelectForm from "@/components/SelectForm";
import ModalWarning from "@/components/ModalWarning";
import Loader from "@/components/Loading";

import { RegisterFormInterface } from "@/interfaces/RegisterForm";
import { university } from "@/interfaces/University";
import {
    validateNames,
    validateLastNames,
    validateBirthDate,
    validateConfirmPassword,
    validateDni,
    validateEmail,
    validateOrganizerCode,
    validatePassword,
    validatePhone,
    validateReceiptCode,
    validateStudentCode,
    validateReceiptImage,
    validateGender,
    validateUniversity,
    validateCareer,
} from "@/utils/registerFormValidators";
import { checkEmailExists, getUniversities, getCareers, handleRegister } from "./actions";
import { genders } from "../constants/genders";
import { Career } from "@/interfaces/Career";
import Image from "next/image";
import { toast } from "react-toastify";

const Register = () => {
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState(1);
    const [universities, setUniversities] = useState<university[]>([]);
    const [carrers, setCarrers] = useState<Career[]>([]);
    const [UNAHId, setUNAHId] = useState<number>(-1);
    const [isOrganizer, setIsOrganizer] = useState<boolean>(false);
    const [sending, setSending] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [loadingUnivMsg, setLoadingUnivMsg] = useState("Cargando universidades...");
    const [loadingCareersMsg, setLoadingCareersMsg] = useState("Cargando carreras...");

    /* estados de inputs */
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [universityID, setUniversityID] = useState<number>(-1);
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [dni, setDni] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState(-1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [studentCode, setStudentCode] = useState("");
    const [careerId, setCareerId] = useState<number>(-1);
    const [receiptCode, setReceiptCode] = useState("");
    const [organizerCode, setOrganizerCode] = useState("");
    const [isStudent, setIsStudent] = useState(true);
    const [rec, setRec] = useState<File | null>(null);

    /* estado para setear errores */
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        secondName: "",
        secondLastName: "",
        birthDate: "",
        dni: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        studentCode: "",
        career: "",
        receiptCode: "",
        organizerCode: "",
        gender: "",
        university: "",
        general: "",
        receiptImage: "",
    });

    useEffect(() => {
        toast.info("¡Bienvenido/a! Ten a mano una foto de tu recibo para completar el registro.", {
            position: "top-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined, 
        });

    }, []);

    /* Trae todas las universidades y carreras para el select */
    useEffect(() => {
        const getUniversitiesFromAPI = async () => {
            const response = await getUniversities();
            if (response.error) {
                setLoadingUnivMsg("Error al obtener universidades, contacte al administrador");
                return;
            }

            if (response.universities) {
                setUniversities(response.universities);
            }
        };

        const getCareersFromAPI = async () => {
            const response = await getCareers();
            if (response.error) {
                setLoadingCareersMsg("Error al obtener carreras, contacte al administrador");
                return;
            }

            setCarrers(response.data);
        }

        getUniversitiesFromAPI();
        getCareersFromAPI();
    }, []);

    /* Setea el ID de la UNAH para exigir numero de cuenta si el estudiante selecciona UNAH */
    useEffect(() => {
        if (universities.length > 0) {
            const unah = universities.find(
                (university) =>
                    university.name === "Universidad Nacional Autónoma de Honduras"
            );
            if (unah) {
                setUNAHId(unah.id);
            } else {
                console.warn("UNAH no encontrada");
            }
        }
    }, [universities]);


    /*Funciones para setear errores en inputs en tiempo real */
    function handleFirstNameChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setErrors((prev) => ({
            ...prev,
            firstName: validateNames(e.target.value),
        }));
        setFirstName(e.target.value);
    }

    function handleLastNameChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setErrors((prev) => ({
            ...prev,
            lastName: validateLastNames(e.target.value),
        }));
        setLastName(e.target.value);
    }

    function handleBirthDateChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setErrors((prev) => ({
            ...prev,
            birthDate: validateBirthDate(e.target.value),
        }));
        setBirthDate(new Date(e.target.value));
    }

    function handleDniChange(e: React.ChangeEvent<HTMLInputElement>): void {
        if (!isNaN(Number(e.target.value))) {
            setDni(e.target.value);
        }
        setErrors((prev) => ({
            ...prev,
            dni: validateDni(e.target.value),
        }));
    }

    function handleGenderChange(e: React.ChangeEvent<HTMLSelectElement>): void {
        setErrors((prev) => ({
            ...prev,
            gender: validateGender(Number(e.target.value)),
        }));
        setGender(Number(e.target.value));
    }

    function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setErrors((prev) => ({
            ...prev,
            phone: validatePhone(e.target.value),
        }));
        if (!isNaN(Number(e.target.value))) {
            setPhone(e.target.value);
        }
    }

    function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setErrors((prev) => ({
            ...prev,
            email: validateEmail(e.target.value, isStudent && universityID === UNAHId ),
        }));
        setEmail(e.target.value);
    }

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setErrors((prev) => ({
            ...prev,
            password: validatePassword(e.target.value),
        }));
        setPassword(e.target.value);
    }

    function handleConfirmPasswordChange(
        e: React.ChangeEvent<HTMLInputElement>
    ): void {
        setErrors((prev) => ({
            ...prev,
            confirmPassword: validateConfirmPassword(password, e.target.value),
        }));
        setConfirmPassword(e.target.value);
    }

    function handleStudentCodeChange(
        e: React.ChangeEvent<HTMLInputElement>
    ): void {
        setErrors((prev) => ({
            ...prev,
            studentCode: validateStudentCode(e.target.value),
        }));
        setStudentCode(e.target.value);
    }

    function handleChangeCarreer(e: React.ChangeEvent<HTMLInputElement>): void {
        const selectedCareer = Number(e.target.value);

        const error = validateCareer(carrers, selectedCareer);

        if (error === "") {
            const selectedCareerObj = carrers.find(carreer => carreer.id_carrera_unah === selectedCareer);
            setCareerId(selectedCareerObj ? selectedCareerObj.id_carrera_unah : -1);
            setErrors((prev) => ({
                ...prev,
                career: "",
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                career: error,
            }));
        }
    }

    function handleReceiptCodeChange(
        e: React.ChangeEvent<HTMLInputElement>
    ): void {
        setErrors((prev) => ({
            ...prev,
            receiptCode: validateReceiptCode(e.target.value),
        }));
        setReceiptCode(e.target.value);
    }

    function handleOrganizerCodeChange(
        e: React.ChangeEvent<HTMLInputElement>
    ): void {
        setErrors((prev) => ({
            ...prev,
            organizerCode: validateOrganizerCode(e.target.value),
        }));
        setOrganizerCode(e.target.value);
    }

    const handleUniversityChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setUniversityID(Number(event.target.value));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files ? e.target.files[0] : null;

        if (file) {
            const error = validateReceiptImage(file);
            if (error) {
                setErrors((prev) => ({ ...prev, receiptImage: error }));
                setRec(null);
                setPreview(null);
            } else {
                setErrors((prev) => ({ ...prev, receiptImage: "" }));
                setRec(file);
                setPreview(URL.createObjectURL(file));
            }
        }
    };

    const checkEmailExistsF = async (email: string): Promise<boolean> => {
        try {
            const response = await checkEmailExists(email);

            if (response?.error) {
                console.error('Error al verificar correo:', response.error);
                return false; // Considerar como fallo en caso de error
            }

            return response.responseData.resultado;
        } catch (error) {
            console.error('Error inesperado:', error);
            return false; // Retorna false si ocurre un error inesperado
        }
    };

    const handleEmailBlur = async () => {

        errors.email = validateEmail(email, isStudent && universityID === UNAHId);
        if (errors.email) {
            return;
        }

        await checkEmailExistsF(email);

    };

    /* Funciones auxiliares de operacion */
    const handleNextStep = async (event: React.FormEvent) => {
        event.preventDefault();

        const newErrors = { ...errors };

        // Validaciones por paso
        const stepValidations: { [key: number]: () => Promise<void> | void } = {
            1: () => {
                newErrors.firstName = validateNames(firstName);
                newErrors.lastName = validateLastNames(lastName);
            },
            2: () => {
                newErrors.birthDate = validateBirthDate(birthDate ? birthDate.toISOString().slice(0, 10) : null);
                newErrors.dni = validateDni(dni);
                newErrors.phone = validatePhone(phone);
                newErrors.gender = validateGender(gender);
            },
            3: () => {
                if (isStudent) {
                    newErrors.university = validateUniversity(universityID);
                    if (universityID === UNAHId && universityID) {
                        newErrors.studentCode = validateStudentCode(studentCode);
                        newErrors.career = validateCareer(carrers, careerId);
                    }
                }
            },
            4: async () => {
                newErrors.email = validateEmail(email, isStudent && universityID === UNAHId);
                if (newErrors.email) return;
                const exists = await checkEmailExistsF(email);
                if (exists) {
                    newErrors.email = "El correo ya está registrado";
                }
                newErrors.password = validatePassword(password);
                newErrors.confirmPassword = validateConfirmPassword(password, confirmPassword);
            },
            5: () => {
                if (isOrganizer) {
                    newErrors.organizerCode = validateOrganizerCode(organizerCode);
                } else {
                    newErrors.receiptCode = validateReceiptCode(receiptCode);
                    newErrors.receiptImage = validateReceiptImage(rec);
                }
            },
        };

        // Ejecutar validaciones del paso actual
        if (stepValidations[currentStep]) {
            await stepValidations[currentStep]();
        }

        // Comprobar si hay errores solo en los campos del paso actual
        const currentStepErrors = Object.keys(newErrors)
            .filter((key): key is keyof typeof newErrors => validateFieldsForStep(currentStep).includes(key)) // Campos del paso actual
            .some((field) => newErrors[field] !== '');

        // Manejar errores o avanzar
        setErrors(newErrors);

        if (!currentStepErrors) {
            if (currentStep < 5) {
                setCurrentStep(currentStep + 1);
            } else {
                handleSubmit();
            }
        }
    };

    const validateFieldsForStep = (step: number): string[] => {
        const fieldsByStep: { [key: number]: string[] } = {
            1: ['firstName', 'lastName'],
            2: ['birthDate', 'dni', 'phone', 'gender'],
            3: ['university', 'studentCode', 'career'],
            4: ['email', 'password', 'confirmPassword'],
            5: ['organizerCode', 'receiptCode', 'receiptImage'],
        };

        return fieldsByStep[step] || [];
    };

    function handleBackStep(event: React.FormEvent): void {
        event.preventDefault(); // Detiene el envío del formulario

        setCurrentStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
    }

    const buildFormData = (): RegisterFormInterface => {
        const getUniversityID = (): number | null => {
            if (!isStudent) return null;
            return universityID !== -1 ? universityID : null;
        };

        const getUNAHIdentifier = (): string | null => {
            if (isStudent && universityID === UNAHId) return studentCode;
            return null;
        };

        const getReceiptCode = (): string | null => {
            return !isOrganizer ? receiptCode : null;
        };

        const getOrganizerCode = (): string | null => {
            return isOrganizer ? organizerCode : null;
        };

        const getReceiptFile = (): File | null => {
            return !isOrganizer ? rec : null;
        };

        const getCareer = (): number | null => {
            if (isStudent && universityID === UNAHId) return careerId;
            return null;
        };

        return {
            nombres: firstName,
            apellidos: lastName,
            telefono: phone,
            dni: dni,
            fecha_nacimiento: birthDate?.toISOString() || "",
            genero: gender,
            id_universidad: getUniversityID(),
            identificador_unah: getUNAHIdentifier(),
            id_carrera_unah: getCareer(),
            correo: email.toLowerCase(),
            contrasena: password,
            codigo_recibo: getReceiptCode(),
            codigo_organizador: getOrganizerCode(),
            recibo: getReceiptFile()
        };
    };

    const handleSubmit = async () => {
        setSending(true);
        const formData: RegisterFormInterface = buildFormData();

        try {
            const response = await handleRegister(formData);

            if (response.error) {
                console.error('Error al registrar usuario:', response.error);
                    setModalMessage("Lo sentimos, hubo un error al procesar tu registro. Por favor, inténtalo de nuevo más tarde. Si el problema persiste, contacta al soporte. ¡Gracias por tu paciencia!. El servidor respondio con:" + response.error);
                    setShowModal(true);
                return;
            }

            localStorage.setItem('registerEmail', email);
            router.push(`/register/confirm-account?new=true`);
            setSending(false);
        } catch (error) {
            setModalMessage("Lo sentimos, hubo un error al procesar tu registro. Por favor, inténtalo de nuevo más tarde. Si el problema persiste, contacta al soporte. ¡Gracias por tu paciencia!");
            setShowModal(true); // Mostrar el modal
            console.error('Error inesperado:', error);
        } finally {
            setSending(false);
        }
    };

    if (sending) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader isLight={true} />
            </div>
        );
    }

    return (
        <>
            <h1 className="text-4xl font-bold text-white mb-2">Regístrate</h1>
            <p className="text-base text-gray-300">Un proceso sencillo y rápido</p>

            {/* Barra de progreso */}
            <section className="flex justify-between items-center gap-2 text-black font-semibold py-4">
                {[1, 2, 3, 4, 5].map((step) => (
                    <div
                        key={step}
                        className={`grid place-items-center w-10 h-10 cursor-pointer rounded-full
                                ${step > currentStep ? "bg-gray-400" : ""}
                                ${step === currentStep
                                ? "bg-[#f8b133] w-12 h-12"
                                : "bg-[#fff]"
                            } 
                               `}
                        onClick={() => {
                            // Solo permitir hacer clic en pasos previos al actual
                            if (step <= currentStep) {
                                setCurrentStep(step);
                            }
                        }}
                    >
                        {step}
                    </div>
                ))}
            </section>

            <form
                className="flex flex-col gap-4 py-8 px-2 w-[80%] md:w-[70%] lg:w-3/5"
                onSubmit={handleNextStep}
            >
                {/* Estado 1 */}
                {currentStep === 1 && (
                    <div className="flex flex-col gap-4">
                        <div>
                            <InputForm
                                placeholder="Nombres"
                                iconName="person"
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={handleFirstNameChange}
                            />
                            {errors.firstName && (
                                <p className="text-[#F8B133] text-sm">{errors.firstName}</p>
                            )}
                        </div>

                        <div>
                            <InputForm
                                placeholder="Apellidos"
                                iconName="person"
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={handleLastNameChange}
                            />
                            {errors.lastName && (
                                <p className="text-[#F8B133] text-sm">{errors.lastName}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Estado 2 */}
                {currentStep === 2 && (
                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="text-[#ab9a9a]">Fecha de nacimiento</p>
                            <InputForm
                                placeholder="Fecha de Nacimiento"
                                iconName="date_range"
                                type="date"
                                id="birthDate"
                                value={birthDate instanceof Date && !isNaN(birthDate.getTime()) ? birthDate.toISOString().slice(0, 10) : ""}
                                onChange={handleBirthDateChange}
                            />

                            {errors.birthDate && (
                                <p className="text-[#F8B133] text-sm">{errors.birthDate}</p>
                            )}
                        </div>
                        <div>
                            <InputForm
                                placeholder="DNI o Pasaporte (extranjeros)"
                                iconName="id_card"
                                type="number"
                                id="dni"
                                value={dni}
                                onChange={handleDniChange}
                            />
                            {errors.dni && (
                                <p className="text-[#F8B133] text-sm">{errors.dni}</p>
                            )}
                        </div>
                        <div>
                            <InputForm
                                placeholder="Celular (sin espacios ni guiones)"
                                iconName="phone"
                                type="number"
                                id="phone"
                                value={phone}
                                onChange={handlePhoneChange}
                            />
                            {errors.phone && (
                                <p className="text-[#F8B133] text-sm">{errors.phone}</p>
                            )}
                        </div>

                        <div>
                            <SelectForm
                                id="gender"
                                options={genders}
                                iconName="wc"
                                legend="Selecciona tu género"
                                onChange={handleGenderChange}
                                optionSelected={gender}
                            />
                            {errors.gender && (
                                <p className="text-[#F8B133] text-sm">{errors.gender}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Estado 3 */}
                {currentStep === 3 && (
                    <div className="flex flex-col gap-4">
                        <p className="text-[#ab9a9a]">¿Actualmente eres un estudiante universitario?</p>
                        <div className="flex gap-4">
                            <label htmlFor="student-yes" className="flex items-center">
                                <input
                                    type="radio"
                                    name="student"
                                    id="student-yes"
                                    className="mr-2"
                                    onChange={() => setIsStudent(true)}
                                    checked={isStudent}
                                />
                                Sí
                            </label>
                            <label htmlFor="student-no" className="flex items-center">
                                <input
                                    type="radio"
                                    name="student"
                                    id="student-no"
                                    className="mr-2"
                                    onChange={() => {
                                        setIsStudent(false); setErrors((prev) => ({
                                            ...prev, university: "",
                                            studentCode: "",
                                            career: "",
                                            email: ""
                                        }))
                                    }}
                                    checked={!isStudent}
                                />
                                No
                            </label>
                        </div>

                        {isStudent && (
                            <>
                                <div>
                                    {universities.length === 0 ? (
                                        <p className="text-white">{loadingUnivMsg}</p>
                                    ) : (
                                        <SelectForm
                                            id="university"
                                            options={universities}
                                            iconName="school"
                                            legend="Selecciona tu universidad"
                                            onChange={handleUniversityChange}
                                            optionSelected={universityID}
                                        />
                                    )}

                                    {errors.university && (
                                        <p className="text-[#F8B133] text-sm">
                                            {errors.university}
                                        </p>
                                    )}
                                </div>
                                {universityID === UNAHId && universityID !== -1 && (
                                    <>
                                        <div>
                                            <InputForm
                                                placeholder="Número de cuenta"
                                                iconName="school"
                                                type="text"
                                                id="studentCode"
                                                value={studentCode}
                                                onChange={handleStudentCodeChange}
                                            />
                                            {errors.studentCode && (
                                                <p className="text-[#F8B133] text-sm">
                                                    {errors.studentCode}
                                                </p>
                                            )}
                                        </div>
                                        {carrers.length === 0 ? (
                                            <p className="text-white">{loadingCareersMsg}</p>
                                        ) :
                                            <div>
                                                <SelectForm
                                                    id="career"
                                                    options={carrers.map((carreer) => ({ name: carreer.carrera_unah, id: carreer.id_carrera_unah }))} // TODO: Cambiar a carreras de la universidad seleccionada
                                                    iconName="school"
                                                    legend="Selecciona tu carrera"
                                                    onChange={handleChangeCarreer}
                                                    optionSelected={careerId}
                                                />
                                                {errors.career && (<p className="text-[#F8B133] text-sm">{errors.career}</p>)}
                                            </div>
                                        }
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Estado 4 */}
                {currentStep === 4 && (
                    <div className="flex flex-col gap-4">
                        <div>
                            {universityID === UNAHId && universityID !== -1 && isStudent && <p className="">Por favor, utiliza tu correo institucional (UNAH)</p>

                            }
                            <InputForm
                                placeholder="Correo Electrónico"
                                iconName="email"
                                type="email"
                                id="email"
                                value={email}
                                onChange={handleEmailChange}
                                onBlur={handleEmailBlur}
                            />
                            {errors.email && (
                                <p className="text-[#F8B133] text-sm">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <InputForm
                                placeholder="Contraseña"
                                iconName="lock"
                                type="password"
                                id="password"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            {errors.password && (
                                <p className="text-[#F8B133] text-sm leading-4">
                                    {errors.password}
                                </p>
                            )}
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
                            {errors.confirmPassword && (
                                <p className="text-[#F8B133] text-sm">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Estado 5 */}
                {currentStep === 5 && (
                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="text-[#ab9a9a]">¿Eres parte del equipo organizador de la conferencia?</p>
                            <div className="flex gap-4">
                                <label htmlFor="organizer-yes" className="flex items-center">
                                    <input
                                        type="radio"
                                        name="organizer"
                                        id="organizer-yes"
                                        className="mr-2"
                                        onChange={() => {
                                            setIsOrganizer(true); setErrors((prev) => ({
                                                ...prev, receiptCode: "", receiptImage: ""
                                            }))
                                        }}
                                        checked={isOrganizer}
                                    />
                                    Sí
                                </label>
                                <label htmlFor="organizer-no" className="flex items-center">
                                    <input
                                        type="radio"
                                        name="organizer"
                                        id="organizer-no"
                                        className="mr-2"
                                        onChange={() => {
                                            setIsOrganizer(false); setErrors((prev) => ({
                                                ...prev, organizerCode: ""
                                            })); setRec(null); setPreview(null)
                                        }}
                                        checked={!isOrganizer}
                                    />
                                    No
                                </label>
                            </div>
                        </div>

                        {isOrganizer ? (
                            <>
                                <div>
                                    <p className="text-[#ab9a9a]">Ingresa el código proporcionado</p>
                                    <InputForm
                                        placeholder="Código de organizador"
                                        iconName="123"
                                        type="text"
                                        id="organizerCode"
                                        value={organizerCode}
                                        onChange={handleOrganizerCodeChange}
                                    />
                                    {errors.organizerCode && (
                                        <p className="text-[#F8B133] text-sm">
                                            {errors.organizerCode}
                                        </p>
                                    )}
                                </div>
                            </>


                        ) : (
                            <>
                                <div>
                                    <legend className="text-[#ab9a9a]">Sube tu recibo de inscripción</legend>
                                    <div className="bg-transparent border-[1px] border-[#ab9a9a] rounded-md flex items-center gap-2 pl-2 active:outline-none text-white text-base">
                                        <label
                                            htmlFor="file-upload"
                                            className="bg-transparent active:border-none placeholder:text-gray py-2 w-full focus:outline-none flex items-center gap-2 cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined">upload</span>
                                            <span className="text-[#ab9a9a] cursor-pointer hover:underline">Haz clic aquí para subir tu recibo</span>
                                        </label>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            accept="image/png, image/jpeg"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    {preview && (
                                        <div className="mt-4">
                                            <p className="text-sm text-[#ab9a9a]">Vista previa:</p>
                                            <Image
                                                src={preview}
                                                alt="Vista previa del recibo"
                                                width={400}
                                                height={100}
                                                className="max-w-full h-auto rounded-lg"
                                            />
                                        </div>
                                    )}
                                    {errors.receiptImage && (
                                        <p className="text-[#F8B133] text-sm">{errors.receiptImage}</p>
                                    )}
                                </div>
                                <div>
                                    <InputForm
                                        placeholder="Código de recibo"
                                        iconName="numbers"
                                        type="text"
                                        id="receiptCode"
                                        value={receiptCode}
                                        onChange={handleReceiptCodeChange}
                                    />
                                    {errors.receiptCode && (
                                        <p className="text-[#F8B133] text-sm">{errors.receiptCode}</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Botones de navegación */}
                <div className="mt-4 flex flex-col gap-2">
                    <Button
                        text={currentStep < 5 ? "Continuar" : "Finalizar"}
                        action={() => handleNextStep}
                        variant="primary"
                        styleType="fill"
                        className="w-[100%]"
                        disabled={sending}
                    />
                    {currentStep > 1 && (
                        <Button
                            text="Retroceder"
                            type="button"
                            action={handleBackStep}
                            variant="secondary"
                            styleType="fill"
                            className="w-[100%]"
                            disabled={sending}
                        />
                    )}
                </div>

                <p className="text-sm text-white text-center">
                    Ya tengo cuenta,{" "}
                    <Link
                        href="/login"
                        className="text-[#f8b133] underline underline-offset-4"
                    >
                        Iniciar Sesión
                    </Link>
                </p>

                {showModal && (
                    <ModalWarning
                        title={modalMessage}
                        setIsOpen={setShowModal}
                        isOpen={showModal}
                    />
                )}
            </form>
        </>
    );
};

export default Register;