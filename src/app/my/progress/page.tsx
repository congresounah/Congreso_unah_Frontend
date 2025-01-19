"use client";
import { useState, useEffect } from "react";
import Cronograma from "@/components/cronograma";
import Cookies from "js-cookie";
import { downloadCertificateById, fetchAsistenciasByUsuarioId } from "@/services/user";
import { motion } from "framer-motion";
import Loader from "@/components/Loading";
import { Asistencias } from "@/interfaces/participantes";
import Button from "@/components/Button";

export default function MyInscriptions() {
  const [idUsuario, setIdUsuario] = useState<number>(0);
  const [asistenciasInfo, setAsistenciasInfo] = useState<Asistencias | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const obtenerMensajeMotivacional = (
    minimo: number,
    asistidas: number
  ): string => {
    // Condición: cantidad_asistidas >= minimo - 3
    if (asistidas > 0 && asistidas <= 3) {
      return "🎉 ¡Estás a un paso de alcanzar el mínimo de conferencias requeridas para obtener tu certificado! Aprovecha esta oportunidad y asiste a más conferencias. ¡Tú puedes lograrlo! 💪";
    }

    // Condición: cantidad_asistidas_a_inscribir > 0
    if (asistidas > 0 && asistidas == 3) {
      return `📝 ¡Aún puedes inscribirte en más conferencias! Solo te faltan ${asistidas} para alcanzar el mínimo necesario. ¡No dejes pasar esta oportunidad y asegura tu lugar! 🚀`;
    }

    // Condición: asistidas es igual a minimo (aún no se ha comenzado)
    if (asistidas == 0) {
      return "💡 ¡No te quedes atrás! Aún no has asistido a ninguna conferencia, pero nunca es tarde para comenzar. Inscríbete y participa para obtener conocimientos valiosos y tu certificado. 🌱";
    }

    // Condición: asistidas es 0 (cumplió con el mínimo necesario)
    if (asistidas >= minimo) {
      return "🎉 ¡Felicidades! Has cumplido con todas las conferencias necesarias para obtener tu certificado. ¡Gran trabajo! 🌟";
    }

    // Casos genéricos según el progreso
    if (asistidas <= minimo / 2) {
      return "💪 ¡Buen trabajo! Ya has cumplido más de la mitad del camino, sigue así.";
    }

    if (asistidas > minimo / 2 && asistidas <= (minimo * 3) / 4) {
      return "📈 Estás progresando, pero aún necesitas asistir a algunas conferencias más.";
    }

    // Si asistidas es mayor a (minimo * 3) / 4
    return "🌟 No te desanimes, ve a más conferencias y avanza hacia tu meta.";
  };

  const handleDescargar = async () => {
    try {
      if (!idUsuario) {
        console.error("ID de usuario no disponible para la descarga.");
        return;
      }
      await downloadCertificateById(idUsuario);
    } catch (error) {
      console.error("Error al intentar descargar recursos:", error);
    }
  };
  
  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      try {
        const parts = token.split(".");
        const payload = JSON.parse(atob(parts[1]));
        setIdUsuario(payload.id_usuario);

        // Llamar al API después de setear el ID
        (async () => {
          const data = await fetchAsistenciasByUsuarioId(payload.id_usuario);
          setAsistenciasInfo(data);
          setIsLoading(false);
        })();
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (idUsuario === null || asistenciasInfo === null || idUsuario == 0) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <p>Error al cargar los datos del usuario o las asistencias.</p>
      </div>
    );
  }

  if (idUsuario === null || idUsuario === 0) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-y-scroll flex flex-col">
      <h2 className="md:w-4/6 w-11/12 mx-auto text-3xl mt-10">
        Mis conferencias
      </h2>

      <div className="md:w-4/6 w-11/12 mx-auto flex flex-col space-y-6">
        <div className="relative mt-10 lg:w-1/2 w-full h-10 rounded-full bg-[#14110b] shadow-lg ">
          <h2 className="absolute inset-0 flex items-center justify-center text-center top-0 text-white">
            {asistenciasInfo.cantidad_asistidas}/
            {asistenciasInfo.cantidad_minima_conferencias}
          </h2>
          {/* {asistenciasInfo.cantidad_asistidas > 0 && (
            <motion.div
              className="h-full border border-[#F2AE30] bg-[#F2AE30] rounded-l-full"
              initial={{ width: "0%" }}
              animate={{
                width: `${
                  asistenciasInfo.cantidad_total_conferencias > 0
                    ? (asistenciasInfo.cantidad_asistidas /
                        asistenciasInfo.cantidad_minima_conferencias) *
                      100
                    : 0
                }%`,
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
            ></motion.div>
          )} */}

          {asistenciasInfo.cantidad_asistidas > 0 &&
            asistenciasInfo.cantidad_minima_conferencias -
              asistenciasInfo.cantidad_asistidas > 0 && (
              <motion.div
                className="h-full border border-[#F2AE30] bg-[#F2AE30] rounded-l-full"
                initial={{ width: "0%" }}
                animate={{
                  width: `${
                    asistenciasInfo.cantidad_total_conferencias > 0
                      ? (asistenciasInfo.cantidad_inscritas_actualmente /
                          asistenciasInfo.cantidad_minima_conferencias) *
                        100
                      : 0
                  }%`,
                }}
                transition={{ duration: 2, ease: "easeInOut" }}
              ></motion.div>
            )}
          {asistenciasInfo.cantidad_asistidas > 0 &&
            asistenciasInfo.cantidad_minima_conferencias -
              asistenciasInfo.cantidad_asistidas <=
              0 && (
              <motion.div
                className="h-full border border-[#F2AE30] bg-[#F2AE30] rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `100%` }}
                transition={{ duration: 2, ease: "easeInOut" }}
              ></motion.div>
            )}

          {/* <div
            className="h-full border border-[#F2AE30] bg-[#F2AE30] rounded-l-full"
            style={{
              width: `${
                asistenciasInfo.cantidad_total_conferencias > 0
                  ? (asistenciasInfo.cantidad_asistencias /
                      asistenciasInfo.cantidad_total_conferencias) *
                    100
                    : 0
                  }%`
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
            ></motion.div>
            {/* <div
              className="h-full border border-[#F2AE30] bg-[#F2AE30] rounded-l-full"
              style={{
                width: `${
                  asistenciasInfo.cantidad_total_conferencias > 0
                    ? (asistenciasInfo.cantidad_asistencias /
                        asistenciasInfo.cantidad_total_conferencias) *
                      100
                    : 0
                }%`,
              }}
            ></div> */}
        </div>

        <div>
          <h2 className="montserrat-font mt-6 text-lg text-center lg:text-left">
            {obtenerMensajeMotivacional(
              asistenciasInfo.cantidad_minima_conferencias,
              asistenciasInfo.cantidad_asistidas
            )}
          </h2>
        </div>
      </div>
      {asistenciasInfo &&
    asistenciasInfo.cantidad_asistidas >=
      asistenciasInfo.cantidad_minima_conferencias && (
      <div className="mx-auto lg:mb-12">
                <Button
                  text="Descargar Recursos"
                  action={handleDescargar}
                  variant="primary"
                  styleType="outlined"
                  className="w-full md:w-max mx-auto lg:mx-0 mt-4 tracking-wide"
                >
                  <span className="material-symbols-outlined">
                    download
                  </span>
                </Button>
      </div>
    )}
      <div className="lg:-mt-12">
        <Cronograma
          fetchPrompt="usuario"
          idUsuario={idUsuario}
          customStyles={{
            container: "border-[#101017] shadow-md shadow-slate-700",
            header: "bg-[#101017] text-slate-100",
            button: "border-slate-800 text-slate-800 hidden",
            imageContainer: "border-blue-400 border-b-transparent",
            ponente:
              "border-b-blue-200 border-x-blue-200 border-t-transparent montserrat-font",
            content: "border-transparent",
            datosimportantes: "text-slate-900 montserrat-font",
            dateStyles: "block"
          }}
          dayButtonStyles={{
            default: "text-[#101017] border-[#101017] hidden",
            selected: "bg-[#101017] text-slate-100 hidden",
            hover: "hover:text-[#101017] hidden",
          }}
          titleStyles="hidden"
          subtitleStyles="hidden"
        />
      </div>
    </div>
  );
}
