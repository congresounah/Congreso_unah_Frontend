"use client";
import React, { useEffect, useState } from "react";
import { UsuarioRecibo } from "@/interfaces/user";
import Image from 'next/image';
// import { useRouter } from 'next/navigation';
import { fetchUsuarioById, updateUser } from "@/services/user";
// import { ActualizarUser } from "@/interfaces/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import Cookies from 'js-cookie';
import Loader from "./Loading";
import { toast } from "react-toastify";
import {useRouter} from 'next/navigation';

const UserProfile: React.FC = ({ id }: { id?: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UsuarioRecibo | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ nombres: "", apellidos: "", correo: "", dni: null, contrasena: null });
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    console.log("Datos actualizados, refrescando...");
    router.refresh(); // Se ejecuta solo cuando alguna dependencia cambia.
  }, [router]);

  useEffect(() => {
    if (id) return;
    const processToken = () => {
      const token = Cookies.get("authToken");
      if (token) {
        try {
          const parts = token.split(".");
          const payload = JSON.parse(atob(parts[1]));
          if (payload.tipo_usuario === "comun") {
            setShowQR(true);
          }
          return payload.id_usuario;
        } catch (error) {
          console.error("Error al decodificar el token:", error);
        }
      }
      return null; // Retornar `null` si no hay token o no es válido
    };

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
              contrasena: null,
              dni: null
            });
          }
        } else {
          console.warn("No se encontró un ID de usuario válido.");
        }
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
      } finally {
        setIsLoading(false); // Finaliza el estado de carga
      }
    };

    const idUsuario = processToken();
    loadUser(idUsuario);
  }, []);


  // const router = useRouter();
  // const GotoChangePasswd = () => {
  //   router.push('/profile/change-psw')
  // }

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
        toast.success("Información actualizada exitosamente");
        setEditing(false);
      } else {
        toast.error("No se pudo actualizar la información del usuario.");
      }
    } catch (error) {
      console.error("Error al intentar actualizar el usuario:", error);
      toast.error("Error al intentar actualizar el usuario.");
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
        contrasena: null,
        dni: null
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (<>
    <h2 className="text-3xl text-black border-b-[1px] border-gray-300 pb-1">Datos Personales</h2>
    <div className="w-full flex lg:flex-row flex-col ">
      {showQR && (
        <div className="lg:w-1/4 w-full md:mt-16 mt-10 p-4 flex items-start justify-center">
          <div className="bg-orange-500 h-64 w-64 mt-2 relative">
            <Image
              src={user?.url_qr || "/imagen.svg"}
              alt="UserQR"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      )}
      <div className=" lg:w-3/4 w-full flex flex-col justify-center lg:pr-12 pr-4 md:mt-16 mt-8">
        {/* datos */}
        <div className=" w-full h-3/4 flex flex-col p-4 justify-center">
          {/* nombre */}
          <div className=" w-full h-12 mt-4 flex sm:flex-row flex-col mb-6 sm:mb-0">
            <label className="w-28 flex sm:justify-center items-center font-medium sm:text-xl text-lg text-gray-700  font-koulen ">
              NOMBRES
            </label>
            <input
              type="text"
              name="nombres"
              value={editing ? formData.nombres : user?.nombres || ""}
              onChange={handleInputChange}
              disabled={!editing}
              className="flex-1 sm:text-xl text-lg px-4 py-2 rounded bg-gray-200 text-gray-600 font-lekton border-none w-full"
            />
          </div>

          <div className=" w-full h-12 mt-4 flex sm:flex-row flex-col mb-6 sm:mb-0">
            <label className="w-28 flex sm:justify-center items-center font-medium sm:text-xl text-lg text-gray-700  font-koulen ">
              APELLIDOS
            </label>
            <input
              type="text"
              name="apellidos"
              value={editing ? formData.apellidos : user?.apellidos || ""}
              onChange={handleInputChange}
              disabled={!editing}
              className="flex-1 sm:text-xl text-lg px-4 py-2 rounded bg-gray-200 text-gray-600 font-lekton border-none w-full"
            />
          </div>

          {/* <div className=" w-full h-12 mt-4 flex flex-row">
            <label className="w-28 flex justify-center items-center font-medium text-xl text-gray-700  font-koulen ">
              TELEFONO
            </label>
            <input
              type="text"
              name="Nuevo_telefono"
              value={editing ? formData.Nuevo_telefono : user?.telefono || ""}
              onChange={handleInputChange}
              disabled={!editing}
              className="flex-1 text-xl px-4 py-2 rounded bg-gray-200 text-gray-600 font-lekton border-none w-full"
            />
          </div> */}

          <div className=" w-full h-12 mt-4 flex sm:flex-row flex-col mb-6 sm:mb-0">
            <label className="w-28 flex sm:justify-center items-center font-medium sm:text-xl text-lg text-gray-700  font-koulen ">
              CORREO
            </label>
            <input
              type="text"
              name="correo"
              value={user?.correo || ""}
              disabled
              className="flex-1 sm:text-xl text-lg px-4 py-2 rounded bg-gray-200 text-gray-600 font-lekton border-none w-full"
            />
          </div>

          {/* <div className=" w-full sm:h-12 h-24 mt-4 flex sm:flex-row flex-col sm:justify-between">
            <div className=" sm:w-2/5 w-full h-12 flex flex-row">
              <label className="text-center w-28 flex justify-center items-center font-medium text-xl text-gray-700  font-koulen ">
                FECHA DE NACIMIENTO
              </label>
              <input
                type={editing ? "date" : "text"}
                name="Nuevo_fechaNacimiento"
                value={
                  editing
                    ? formData.Nuevo_fechaNacimiento
                    : user?.fecha_nacimiento || ""
                }
                onChange={handleInputChange}
                disabled={!editing}
                className="flex-1 text-xl px-4 py-2 rounded bg-gray-200 text-gray-600 font-lekton border-none w-full"
              />
            </div>

            <div className=" sm:w-2/5 mt-4 sm:mt-0 w-full h-12 flex flex-row">
              <label className="w-28 flex justify-center items-center font-medium text-xl text-gray-700  font-koulen ">
                GENERO
              </label>
              {editing ? (
                <select
                  name="Nuevo_genero"
                  value={formData.Nuevo_genero}
                  onChange={handleInputChange}
                  className="flex-1 text-xl px-4 py-2 rounded bg-gray-200 text-gray-600 font-lekton border-none w-full"
                >
                  <option value="">Seleccionar</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              ) : (
                <input
                  type="text"
                  name="Nuevo_genero"
                  value={user?.genero || ""}
                  disabled
                  className="flex-1 text-xl px-4 py-2 rounded bg-gray-200 text-gray-600 font-roboto border-none w-full"
                />
              )}
            </div>
          </div> */}
        </div>

        {/* botones */}
        <div className=" w-full h-1/4 p-4">
          {editing ? (
            <div className="space-y-4">
              <button
                onClick={handleSave}
                className="w-60 flex items-center justify-between  border border-gray-500 text-gray-700 px-4 py-2 rounded-full shadow hover:bg-gray-100"
              >
                <h2 className="mr-4 font-koulen text-xl">Guardar</h2>
                <FontAwesomeIcon icon={faSave} className="mr-2" />
              </button>
              <button
                onClick={handleCancel}
                className="w-60 flex items-center justify-between  border border-gray-500 text-gray-700 px-4 py-2 rounded-full shadow hover:bg-gray-100"
              >
                <h2 className="mr-4 font-koulen text-xl">Cancelar</h2>
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {" "}
              {/* Añadido para hacer un stack de botones */}
              <button
                onClick={() => setEditing(true)}
                className="w-60 flex items-center justify-between  border border-gray-500 text-gray-700 px-4 py-2 rounded-full shadow hover:bg-gray-100"
              >
                <h2 className="mr-4 font-koulen text-xl">Editar Informacion</h2>
                <span className="material-symbols-outlined">edit_square</span>
              </button>
              {/* <button
                onClick={GotoChangePasswd}
                className="w-60 flex items-center justify-between border border-gray-500 text-gray-700 px-4 py-2 rounded-full shadow hover:bg-gray-100"
              >
                <h2 className="mr-4 font-koulen text-xl">Cambiar Clave</h2>
                <FontAwesomeIcon icon={faLock} className="mr-2" />
              </button> */}
            </div>
          )}
        </div>

        <div className="montserrat-font p-4">
          <h2>Recuerda: los datos proporcionados serán usados en la elaboración de certificados</h2>
        </div>
      </div>
    </div>
  </>
  );
};

export default UserProfile;
