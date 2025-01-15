'use client';

import React, { useState, useRef, useEffect } from "react";
import Image from 'next/image';
import { editarConferencia, obtenerConferencia } from "@/services/conferencias/conferencia";
import { CreateConferencia } from "@/interfaces/conferencias";
import Modal from "./modal";
import SubirPdf from "./subirArchivo";
import UploadModal from "./subirFoto";
import { ConferenciaCompleta } from "@/interfaces/conferencias";
import { fetchPonentes } from "@/services/ponentes/ponentes";
import { Ponentes } from "@/interfaces/ponentes";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loading";
import Button from "@/components/Button";
import { toast } from "react-toastify";

interface ConferenciaFormProps {
    id: string;
    isVisualizing?: boolean;
}

const ConferenciaForm: React.FC<ConferenciaFormProps> = ({ id, isVisualizing = true }) => {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const [isEditingConference, setEditingConference] = useState(false);
    const [ponenteImg, setPonenteImg] = useState<string | null>(null);
    const [conferenceImg, setConferenceImg] = useState<string | null>(null);;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"main" | "gallery" | "pdf">();
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [url_carpeta_zip, seturl_carpeta_zip] = useState<string | null>(null);
    const [, setnombre_conferencia] = useState("");
    const [conferencia, setConferencia] = useState<ConferenciaCompleta | null>(null);
    const [loading, setLoading] = useState(true);
    const [ponentes, setPonentes] = useState<Ponentes[]>([]);

    // Estados para manejar las categorías y el menú
    const [, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fechasCongreso = [{ value: "23/01/2025", label: "23 de enero de 2025" }, { value: "24/01/2025", label: "24 de enero de 2025" }, { value: "25/01/2025", label: "25 de enero de 2025" }];

    useEffect(() => {
        const loadPonentes = async () => {
            try {
                const data = await fetchPonentes();
                setPonentes(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error(err.message);
                } else {
                    console.error("Ocurrió un error desconocido");
                }
            } finally {
                setLoading(false);
            }
        };

        loadPonentes();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!id) return;
        const fetchConferencia = async () => {
            try {
                const result = await obtenerConferencia(id);
                setConferencia(result);
                setPonenteImg(result.img_ponente);
                setConferenceImg(result.img_conferencia);
                seturl_carpeta_zip(result.url_carpeta_zip);
            } catch (error) {
                console.error("Error al obtener la conferencia", error);
            } finally {
                setLoading(false);
            }

        }

        fetchConferencia();
    }, [id]);

    // Agregar o quitar categorías seleccionadas
    // Función para abrir el modal del PDF
    const handleOpenPdfModal = () => setIsPdfModalOpen(true);
    // Función para cerrar el modal del PDF
    const handleClosePdfModal = () => setIsPdfModalOpen(false);

    // Función para manejar la URL del PDF cargado
    const handlePdfUpload = (url: string) => {
        seturl_carpeta_zip(url);
        handleClosePdfModal();
    };

    const handleOpenModal = (type: "main" | "gallery" | "pdf") => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleUpload = (urls: string[]) => {
        if (modalType === "gallery") {
            // Solo guardamos la primera URL, ya que `conferenceImg` es de tipo `string | null`
            setConferenceImg(urls[0] || null);
        } else if (modalType === "main") {
            setPonenteImg(urls[0] || null);
        } else if (modalType === "pdf") {
            seturl_carpeta_zip(urls[0] || null);
        }
        handleCloseModal();
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!isEditingConference) {
            setLoading(false);
            return;
        }

        try {
            // Validamos que la fecha y las horas no estén vacías
            if (!conferencia?.fecha || !conferencia?.hora_inicio || !conferencia?.hora_final) {
                alert("Por favor, completa todos los campos de fecha y hora.");
                return;
            }

            // Creamos el objeto para enviar al backend
            const newConference: CreateConferencia = {
                id_conferencia: Number(id),
                nombre: conferencia.titulo,
                nombres_ponente: conferencia.nombres,
                apellidos_ponente: conferencia.apellidos,
                descripcion_ponente: conferencia.descripcion_ponente,
                img_ponente: ponenteImg || "",
                img_conferecia: conferenceImg || "",
                direccion: conferencia.lugar,
                fecha_conferencia: conferencia.fecha,
                hora_inicio: `${conferencia.fecha} ${conferencia.hora_inicio}`,
                hora_final: `${conferencia.fecha} ${conferencia.hora_final}`,
                cupos: conferencia.cupos,
                descripcion_conferencia: conferencia.descripcion_conferencia,
                url_carpeta_zip: url_carpeta_zip || "",
                id_ponente: conferencia.id_ponente || 0,
            };


            // Llamada al backend
            const response = await editarConferencia(newConference);

            if (response) {
                toast.success("Conferencia editada exitosamente");
            }

            // Reseteamos el estado y formulario
            setEditingConference(false);
        } catch (error) {
            toast.error("Error al editar la conferencia");
            console.error("Error al crear conferencia", error);
        } finally {
            setLoading(false);
        }
    };

/*     const formatToDDMMYYYY = (dateString: string) => {
        const date = new Date(dateString); // Asumiendo que dateString es "2025-01-24"
        const day = String(date.getDate()).padStart(2, '0'); // 24
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 01
        const year = date.getFullYear(); // 2025
        return `${day}/${month}/${year}`;
    }; */

/*     const formattedDate = formatToDDMMYYYY('2025-01-24');
 */

    const handleEditConference = () => {
        if (!conferenceImg) {
            toast.warning("Por favor, carga la imagen de la conferencia antes de continuar.");          
            return; // Detén la ejecución si no hay imagen
        }

        if (!ponenteImg) {
            toast.warning("Por favor, carga la imagen del ponente antes de continuar.");
            return; // Detén la ejecución si no hay imagen
        }

        /*         if (!url_carpeta_zip) {
                    toast.warning("Por favor, carga el archivo de la conferencia antes de continuar.");

                    return; // Detén la ejecución si no hay imagen
                } */

        setEditingConference(true);
        formRef.current?.requestSubmit(); // Envía el formulario si pasa la validación
    };


    if (loading) {
        return <>
            <div className="flex items-center gap-2 mb-6 text-3xl text-black border-b-[1px] border-gray-300 pb-1">
                <span className="material-symbols-outlined cursor-pointer hover:scale-125" onClick={() => router.push("/admin/conferencias")}>arrow_back_ios</span>
                <h2 className="text-3xl text-black">{isVisualizing ? "Visualizando Conferencia" : "Editando Conferencia"}</h2>

            </div>
            <div className="flex justify-center items-center h-96">
                <Loader />
            </div>

        </>;
    }

    if (!conferencia) {
        return <>
            <div className="flex items-center gap-2 mb-6 text-3xl text-black border-b-[1px] border-gray-300 pb-1">
                <span className="material-symbols-outlined cursor-pointer hover:scale-125" onClick={() => router.push("/admin/conferencias")}>arrow_back_ios</span>
                <h2 className="text-3xl text-black">{isVisualizing ? "Visualizando Conferencia" : "Editando Conferencia"}</h2>

            </div>
            <div className="flex justify-center items-center h-96">
                No se encontró la conferencia
            </div>

        </>;
    }

    const handlePonenteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPonenteId = Number(event.target.value);
        const selectedPonente = ponentes.find(
            (ponente) => ponente.id_ponente === selectedPonenteId
        );

        if (selectedPonente) {
            const nombresArray = selectedPonente.nombres.split(' ');
            const primerNombre = nombresArray[0] || '';
            const segundoNombre = nombresArray[1] || '';
            const primerApellido = nombresArray[2] || '';
            const segundoApellido = nombresArray[3] || '';

            // Actualizar conferencia
            setConferencia({
                ...conferencia,
                id_ponente: selectedPonenteId, // Asegura que el select esté sincronizado
                nombres: `${primerNombre} ${segundoNombre}`.trim(),
                apellidos: `${primerApellido} ${segundoApellido}`.trim(),
                descripcion_ponente: selectedPonente.descripcion,
                img_ponente: selectedPonente.img_perfil,
            });

            // Actualizar la imagen del ponente
            setPonenteImg(selectedPonente.img_perfil);
        } else {
            // Manejar casos donde no se seleccione un ponente válido
            setConferencia({ ...conferencia, id_ponente: selectedPonenteId });
        }
    };



    return (
        <div className="rounded-lg max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-6 text-3xl text-black border-b-[1px] border-gray-300 pb-1">
                <span className="material-symbols-outlined cursor-pointer hover:scale-125" onClick={() => router.push("/admin/conferencias")}>arrow_back_ios</span>
                <h2 className="text-3xl text-black">{isVisualizing ? "Visualizando Conferencia" : "Editando Conferencia"}</h2>

            </div>
{/*                 <NotificationCard
                    key={notificationMsg + Date.now()}  // Garantiza que el key cambie
                    msg={notificationMsg}
                    type={notificationType}
                /> */}


            <form ref={formRef} onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-4">
                        {/* Nombre de la Conferencia */}
                        <div>
                            <h2 className="text-xl text-gray-800">Información de la conferencia</h2>
                            <hr className="border-gray-300" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                value={conferencia.titulo}
                                onChange={(e) => setConferencia({ ...conferencia, titulo: e.target.value })}
                                required
                                readOnly={isVisualizing}
                                className="mt-2 p-2 border border-gray-300 rounded-lg w-full text-black"
                                placeholder="Escribe el nombre de la conferencia"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                            <textarea
                                value={conferencia.descripcion_conferencia}
                                onChange={(e) => setConferencia({
                                    ...conferencia,
                                    descripcion_conferencia: e.target.value
                                })}
                                readOnly={isVisualizing}
                                className="mt-2 p-2 border text-black border-gray-300 rounded-lg w-full"
                                placeholder="Describe la Conferencia"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Hora Inicio</label>
                                <input
                                    type="time"
                                    value={conferencia.hora_inicio}
                                    onChange={(e) => setConferencia({ ...conferencia, hora_inicio: e.target.value })}
                                    required
                                    readOnly={isVisualizing}
                                    className="mt-2 p-2 text-black border border-gray-300 rounded-lg w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Hora Final</label>
                                <input
                                    readOnly={isVisualizing}
                                    type="time"
                                    value={conferencia.hora_final}
                                    onChange={(e) => setConferencia({ ...conferencia, hora_final: e.target.value })}
                                    required
                                    className="mt-2 p-2 text-black border border-gray-300 rounded-lg w-full"
                                />
                            </div>

                        </div>
                        <div>
                            {/*                             <label className="block text-sm font-medium text-gray-700">Fecha</label>
                            <input
                                readOnly={isVisualizing}
                                type="date"
                                value={conferencia.fecha.split('/').reverse().join('-')}
                                onChange={(e) => setConferencia({ ...conferencia, fecha: formatToDDMMYYYY(e.target.value) })}
                                required
                                className="mt-2 p-2 border border-gray-300 rounded-lg w-full text-black"
                            /> */}
                            <label className="block text-sm font-medium text-gray-700">Fecha</label>
                            <select
                                className="mt-2 p-2 text-black border border-gray-300 rounded-lg w-full"
                                value={conferencia.fecha}
                                onChange={(e) => setConferencia({ ...conferencia, fecha: e.target.value })}
                            >
                                <option value="" hidden className="text-gray-400">Selecciona una fecha</option>
                                {fechasCongreso.map((congreso, key) => (
                                    <option key={key} value={congreso.value}>
                                        {congreso.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Cupos</label>
                            <input
                                readOnly={isVisualizing}
                                type="number"
                                value={conferencia.cupos}
                                onChange={(e) => setConferencia({ ...conferencia, cupos: e.target.value })}
                                required
                                className="mt-2 p-2 border border-gray-300 rounded-lg w-full text-black"
                                placeholder="Ingresa los Cupos necesarios"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Lugar</label>
                            <input
                                readOnly={isVisualizing}
                                type="text"
                                value={conferencia.lugar}
                                onChange={(e) => setConferencia({ ...conferencia, lugar: e.target.value })}
                                required
                                className="mt-2 p-2 border border-gray-300 rounded-lg w-full text-black"
                                placeholder="Aula Magna"
                            />
                        </div>
                        {/* Info del ponente */}
                        <div className="mt-6">
                            <h2 className="text-xl text-gray-800">Información del ponente</h2>
                            <hr />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Selecciona un ponente</label>
                            <select
                                name="ponente"
                                id="ponente"
                                className="mt-2 p-2 text-black border border-gray-300 rounded-lg w-full"
                                onChange={handlePonenteChange}
                                value={conferencia.id_ponente || ""} // Asegura que no sea undefined
                            >
                                <option value="" hidden>------</option>
                                {ponentes.map((ponente) => (
                                    <option key={ponente.id_ponente} value={ponente.id_ponente}>
                                        {ponente.nombres}
                                    </option>
                                ))}
                            </select>

                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombres</label>
                                <input
                                    readOnly={isVisualizing}
                                    type="text"
                                    value={conferencia.nombres}
                                    onChange={(e) => setConferencia({ ...conferencia, nombres: e.target.value })}
                                    required
                                    className="mt-2 p-2 text-black border border-gray-300 rounded-lg w-full"
                                    placeholder="Nombres"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Apellidos</label>
                                <input
                                    readOnly={isVisualizing}
                                    type="text"
                                    value={conferencia.apellidos}
                                    onChange={(e) => setConferencia({ ...conferencia, apellidos: e.target.value })}
                                    required
                                    className="mt-2 p-2 border text-black border-gray-300 rounded-lg w-full"
                                    placeholder="Apellidos"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                            <textarea
                                value={conferencia.descripcion_ponente}
                                onChange={(e) => setConferencia({ ...conferencia, descripcion_ponente: e.target.value })}
                                required
                                readOnly={isVisualizing}
                                className="mt-2 p-2 border text-black border-gray-300 rounded-lg w-full"
                                placeholder="Describe el Ponente"
                            />
                        </div>
                    </div>

                    {/* Right Column - Image Uploads */}
                    <div className="space-y-6">
                        {/* Main Image Upload */}
                        {/* Gallery Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Foto de la Conferencia</label>
                            <div
                                className="mt-2 border-dashed border-2 border-gray-300 p-4 text-center cursor-pointer rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                                onClick={() => {
                                    if (!isVisualizing) {
                                        handleOpenModal("gallery");
                                    }
                                }}
                            >
                                {conferenceImg ? (
                                    <div className="relative inline-block w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                                        <Image
                                            src={conferenceImg}
                                            alt="Conferencia imagen"
                                            layout="fill"
                                            objectFit="cover"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-gray-500">
                                        {isVisualizing ? "No hay archivos por mostrar" : "Click para cargar la imagen"}
                                    </p>
                                )}
                            </div>

                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Foto del Ponente</label>
                            <div
                                className="mt-2 border-dashed border-2 border-gray-300 p-4 text-center cursor-pointer rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                                onClick={() => { if (!isVisualizing) handleOpenModal("main") }}
                            >
                                {ponenteImg ? (
                                    <div className="relative inline-block w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                                        <Image
                                            src={ponenteImg}
                                            alt="Ponente imagen"
                                            layout="fill"  // Se ajusta automáticamente a la caja del contenedor
                                            objectFit="cover"  // Asegura que la imagen se ajuste a la caja sin distorsionarse
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-gray-500">{isVisualizing ? "No hay archivos por mostrar" : "Click para cargar la imagen"}</p>
                                )}
                            </div>

                        </div>

                        {/* PDF UPLOAD */}
                        <div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Archivos de la Conferencia</label>
                                <div
                                    className="mt-2 border-dashed border-2 border-gray-300 p-4 text-center cursor-pointer"
                                    onClick={() => {
                                        if (isVisualizing) {
                                            if (url_carpeta_zip) {
                                                handleOpenPdfModal(); // Ejecuta la función si url_carpeta_zip no está vacío
                                            }
                                        } else {
                                            handleOpenPdfModal();
                                        }
                                    }}
                                >
                                    {url_carpeta_zip ? (
                                        <p className="text-sm text-gray-600">Ya tienes un archivo subido, da click aqui para visualizarlo</p>

                                    ) : (
                                        <p className="text-gray-500">{isVisualizing ? "No hay archivos por mostrar" : "Click para cargar el archivo"}</p>
                                    )}
                                </div>
                            </div>
                            {/* Modal exclusivo para cargar el PDF */}
                            <Modal isVisible={isPdfModalOpen} onClose={handleClosePdfModal}>
                                <SubirPdf onSubmit={handlePdfUpload} nombre_prod={conferencia.titulo} setNombre_prod={setnombre_conferencia}
                                    initialUploadedFileUrl={url_carpeta_zip} soloVisualizar={isVisualizing} />
                            </Modal>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                {!isVisualizing && (
                    <div className="col-span-2 flex justify-end space-x-3 mt-4">
                        <Button
                            text="Volver"
                            action={() => { }}
                            variant="secondary"
                            styleType="fill"
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-600"
                            type="button"
                        />
                        <Button
                            text="Guardar Cambios"
                            action={handleEditConference}
                            variant="primary"
                            styleType="fill"
                        />
                    </div>
                )}
            </form>

            {/* Upload Modal */}
            {isModalOpen && (
                <UploadModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onImageUpload={handleUpload} // Maneja todos los tipos (main, gallery, pdf)
                    existingImages={
                        modalType === "gallery"
                            ? conferenceImg
                                ? [conferenceImg] // Convierte `conferenceImg` en un arreglo si no es `null`
                                : []
                            : modalType === "main"
                                ? ponenteImg
                                    ? [ponenteImg] // Convierte `ponenteImg` en un arreglo si no es `null`
                                    : []
                                : url_carpeta_zip
                                    ? [url_carpeta_zip] // Convierte `url_carpeta_zip` en un arreglo si no es `null`
                                    : []
                    } // Determina qué imágenes o PDF mostrar según el modalType
                    isGallery={modalType === "gallery"} // Define si es galería para lógica de múltiples archivos
                />
            )}

        </div>
    );
};

export default ConferenciaForm;