"use client";
import { useState, useEffect } from "react";
import Cronograma from "@/components/cronograma";
import Cookies from "js-cookie";
import { fetchAsistenciasByUsuarioId } from "@/services/user";
import { motion } from "framer-motion";
import Loader from "@/components/Loading";
import { Asistencias } from "@/interfaces/participantes";
import { cancelarInscripcionConferencia, inscribirseEnConferencia } from "@/services/conferencias/conferencia";
import { Conferencia } from "@/interfaces/conferencias";

export default function MyInscriptions() {
  const [idUsuario, setIdUsuario] = useState<number>(0);
  const [asistenciasInfo, setAsistenciasInfo] = useState< Asistencias| null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [, setErrorMessage] = useState<string | null>(null);

    const handleInscripcion = async (conferencia: Conferencia) => {
      try {
        let response;
        if (conferencia.inscrito) {
          response = await cancelarInscripcionConferencia(idUsuario, conferencia.id_conferencia);
        } else {
          response = await inscribirseEnConferencia(idUsuario, conferencia.id_conferencia);
        }
    
        if (response.codigoResultado === -1) {
          setErrorMessage(response.message || "Ha ocurrido un error.");
        } else {
          console.assert("Acción exitosa:", response);
        }
      } catch (error) {
        console.error("Error durante la acción (inscribir o cancelar):", error);
        setErrorMessage("Error inesperado. Por favor intenta nuevamente."); // Mensaje de error genérico
      }
    };

    

    const obtenerMensajeMotivacional = (
      minimo: number,
      asistidas: number
    ): string => {
      // Condición: cantidad_asistidas >= minimo - 3
      if (asistidas > 0 && asistidas <= 3) {
        return "🎉 ¡Estás a un paso de alcanzar el mínimo de conferencias requeridas para obtener tu certificado! Aprovecha esta oportunidad e inscribite a más conferencias. ¡Tú puedes lograrlo! 💪";
      }
    
      // Condición: cantidad_asistidas_a_inscribir > 0
      if (asistidas > 0 && asistidas == 3) {
        return `📝 ¡Aún puedes inscribirte en más conferencias! Solo te faltan ${asistidas} para alcanzar el mínimo necesario. ¡No dejes pasar esta oportunidad y asegura tu lugar! 🚀`;
      }
    
      // Condición: asistidas es igual a minimo (aún no se ha comenzado)
      if (asistidas === 0) {
        return "💡 ¡No te quedes atrás! Aún no te has inscrito a ninguna conferencia, pero nunca es tarde para comenzar. Inscríbete y participa para obtener conocimientos valiosos y tu certificado. 🌱";
      }
    
      // Condición: asistidas es 0 (cumplió con el mínimo necesario)
      if (asistidas >= minimo) {
        return `🎉 ¡Felicidades! Te has inscrito en todas las conferencias necesarias (${minimo}), ahora asiste a todas ellas para obtener tu certificado. ¡Gran trabajo! 🌟 \n Puedes seguir inscribiéndote a más conferencias si lo deseas!`;
      }
    
      // Casos genéricos según el progreso
      if (asistidas <= Math.floor(minimo / 2) + (minimo % 2 === 1 ? 1 : 0)) {
        return "💪 ¡Buen trabajo! Ya has cumplido más de la mitad del camino, sigue así.";
      }
      
    
      if (asistidas > minimo / 2 && asistidas <= (minimo * 3) / 4) {
        return "📈 Estás progresando, pero aún necesitas inscribirte a algunas conferencias más.";
      }
    
      // Si asistidas es mayor a (minimo * 3) / 4
      return "🌟 No te desanimes, inscríbete en más conferencias y avanza hacia tu meta.";
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
      <h2 className="md:w-4/6 w-11/12 mx-auto text-3xl mt-8">
        Mis conferencias
      </h2>

      <div className="md:w-4/6 w-11/12 mx-auto flex flex-col space-y-6">
  <div className="relative mt-10 lg:w-1/2 w-full h-10 rounded-full bg-[#14110b] shadow-lg">
    <h2 className="absolute inset-0 flex items-center justify-center text-center top-0 text-white">
      {asistenciasInfo.cantidad_inscritas_actualmente}/
      {asistenciasInfo.cantidad_minima_conferencias}
    </h2>
    {asistenciasInfo.cantidad_inscritas_actualmente > 0 &&
      asistenciasInfo.cantidad_faltante_a_inscribir > 0 && (
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
    {asistenciasInfo.cantidad_inscritas_actualmente > 0 &&
      asistenciasInfo.cantidad_faltante_a_inscribir <= 0 && (
        <motion.div
          className="h-full border border-[#F2AE30] bg-[#F2AE30] rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `100%` }}
          transition={{ duration: 2, ease: "easeInOut" }}
        ></motion.div>
      )}
  </div>

  <div>
    <h2 className="montserrat-font text-lg text-center lg:text-left">
      {obtenerMensajeMotivacional(
        asistenciasInfo.cantidad_minima_conferencias,
        asistenciasInfo.cantidad_inscritas_actualmente
      )}
    </h2>
  </div>
</div>

        <Cronograma
        fetchPrompt="inscritas"
        idUsuario={idUsuario}
        customStyles={{
          container: "border-[#101017] shadow-md shadow-slate-700 ",
          header: "bg-[#101017] text-slate-100",
          // button: "border-slate-800 text-slate-800",
          button: "hidden",
          imageContainer: "border-blue-400 border-b-transparent",
          ponente: "border-b-blue-200 border-x-blue-200 border-t-transparent montserrat-font",
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
        onInscribirse={handleInscripcion}
      />
      </div>
  );
}
