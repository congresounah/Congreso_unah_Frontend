"use client";
import React, { useEffect, useState } from "react";
import { UsuarioRecibo } from "@/interfaces/user";
import Image from 'next/image';
// import { useRouter } from 'next/navigation';
import { fetchUsuarioById, updateUser } from "@/services/user";
// import { ActualizarUser } from "@/interfaces/user";
import Loader from "@/components/Loading";
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Button from "@/components/Button";
import ReciboViewer from "@/components/ReceiptViewer";
import { toast } from "react-toastify";


interface UserProfileProps {
    isVisualizing: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ isVisualizing }) => {
    const { id } = useParams();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<UsuarioRecibo | null>(null);
    const [visualize, ] = useState(isVisualizing);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ nombres: "", apellidos: "", correo: "" });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const loadUser = async (idUsuario: number) => {
            try {
                setIsLoading(true);
                if (idUsuario) {
                    const userData = await fetchUsuarioById(idUsuario);
                    if (userData) {
                        setUser(userData);
                        setFormData({
                            nombres: userData.nombres,
                            apellidos: userData.apellidos,
                            correo: userData.correo,
                        });
                    } else {
                        setError("No se encontró un usuario con el ID proporcionado.");
                    }
                } else {
                    console.warn("No se encontró un ID de usuario válido.");
                }
            } catch (error) {
                toast.error("Error al cargar el usuario.");
                console.error("Error al cargar el usuario:", error);
            } finally {
                setIsLoading(false); // Finaliza el estado de carga
            }
        };

        loadUser(Number(id));
    }, [id]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        if (!user) return;

        try {
            setIsLoading(true);
            /* verificamos no vacios */
            if (!formData.nombres || !formData.apellidos || !formData.correo) {
                toast.warning("Por favor, Rellena todos los campos.");
                return;
            }

            const updatedUser = await updateUser(user.id_usuario, formData);

            if (updatedUser) {
                setUser((prevUser) =>
                    prevUser
                        ? {
                            ...prevUser,
                            ...formData,
                        }
                        : null
                );
                setEditing(false);
                toast.success("Usuario actualizado correctamente.");
            } else {
                toast.error("No se pudo actualizar la información del usuario.");
            }
        } catch (error) {
            toast.error("Error al intentar actualizar el usuario.");
            console.error("Error al intentar actualizar el usuario:", error);
        } finally {
            setIsLoading(false); // Finaliza el estado de carga
        }
    };

    const handleCancel = () => {
        setEditing(false);
        if (user) {
            setFormData({
                nombres: user.nombres,
                apellidos: user.apellidos,
                correo: user.correo,
            });
        }
    };

    function isValidUrl(url: string): boolean {
        try {
            new URL(url); // Intenta crear una nueva URL con el string dado.
            return true;
        } catch (e) {
            console.error("Error al validar la URL:", e);
            return false;
        }
    }


    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-lg max-w-5xl mx-auto">
                <div className="flex items-center gap-2 mb-6 text-3xl text-black border-b-[1px] border-gray-300 pb-1">
                <span className="material-symbols-outlined cursor-pointer hover:scale-125" onClick={() => router.push("/admin/home")}>arrow_back_ios</span>
                <h2>{visualize ? "Visualizando Perfil" : "Editando Perfil"}</h2>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="w-full flex flex-col justify-center col-span-2 order-2 lg:order-1">
                        {/* datos */}
                        <div className=" w-full h-3/4 flex flex-col gap-4 justify-center">
                            {/* nombre */}
                            <div>
                                <label className="block text-sm md:text-xs font-medium text-gray-700">Nombres</label>
                                <input
                                    type="text"
                                    name="nombres"
                                    value={editing ? formData.nombres : user?.nombres || ""}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!editing}
                                    className="mt-2 p-2 border border-gray-300 rounded-lg w-full text-black disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-700"
                                />
                            </div>

                            {/* apellidos */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Apellidos</label>
                                <input
                                    type="text"
                                    name="apellidos"
                                    value={editing ? formData.apellidos : user?.apellidos || ""}
                                    onChange={handleInputChange}
                                    disabled={!editing}
                                    required
                                    className="mt-2 p-2 border border-gray-300 rounded-lg w-full text-black disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-700"
                                />
                            </div>
                            {/* numero de cuenta */}
                            {user?.numero_cuenta && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Numero de cuenta</label>
                                    <input
                                        type="text"
                                        name="numero_cuenta"
                                        value={user.numero_cuenta}
                                        disabled
                                        className="mt-2 p-2 border border-gray-300 rounded-lg w-full text-black disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-700"
                                    />
                                </div>
                            )}

                            {/* SOLO LO MOSTRAMOS SI ES PARA VISUALIZACION */}
                            {visualize && (
                                <div>
                                    {/* correo */}
                                    <label className="block text-sm font-medium text-gray-700">Correo</label>
                                    <input
                                        type="email"
                                        name="correo"
                                        value={user?.correo || ""}
                                        disabled
                                        className="mt-2 p-2 border border-gray-300 rounded-lg w-full text-black disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-700"
                                    />
                                </div>
                            )}

                            {/* SOLO LOS MOSTRAMOS SI ES PARA VISUALIZACION */}
                            {visualize && (<>
                                {/* dni */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">DNI</label>
                                    <input
                                        type="text"
                                        name="dni"
                                        value={user?.dni || ""}
                                        disabled
                                        className="mt-2 p-2 border border-gray-300 rounded-lg w-full text-black disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-700"
                                    />
                                </div>

                                {/* telefono */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Telefono</label>
                                    <input
                                        type="text"
                                        name="telefono"
                                        value={user?.telefono || ""}
                                        disabled
                                        className="mt-2 p-2 border border-gray-300 rounded-lg w-full text-black disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-700"
                                    />
                                </div>

                                {/* recibo img*/}
                                {user?.img_recibo && (<ReciboViewer recibo={user?.img_recibo} />)}
                            </>)}


                        </div>


                    </div>
                    <div className="w-full flex items-start justify-center xl:justify-start col-span-1 order-1 lg:order-2">
                        <div className="bg-orange-500 h-64 w-64 relative">
                            <Image
                                src={
                                    user?.url_qr && (user?.url_qr.startsWith('data:image') || isValidUrl(user?.url_qr))
                                        ? user?.url_qr
                                        : '/imagen.svg'
                                }
                                alt="UserQR"
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                    </div>


                </div>
                {/* BOTONES, SOLO LOS MOSTRAMOS SI ES PARA EDITAR */}
                {!visualize && (
                    <div className=" w-full h-1/4 mt-10 flex flex-col md:flex-row justify-start gap-4">
                        {editing ? (
                            <>
                                <Button
                                    action={handleSave}
                                    text="Guardar"
                                    className="w-48"
                                    styleType="fill"
                                    variant="primary"
                                >
                                    <span className="material-symbols-outlined">save</span>
                                </Button>

                                <Button
                                    action={handleCancel}
                                    text="Cancelar"
                                    className="w-48"
                                    styleType="fill"
                                    variant="primary"
                                >
                                    <span className="material-symbols-outlined">cancel</span>
                                </Button>
                            </>
                        ) : (
                            <>
                                {/* Editar */}
                                <Button
                                    action={() => setEditing(true)}
                                    text="Editar Informacion"
                                    className="w-48"
                                    styleType="fill"
                                    variant="primary"
                                >
                                    <span className="material-symbols-outlined">edit_square</span>
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default UserProfile;
