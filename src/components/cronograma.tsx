"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Conferencia } from "@/interfaces/conferencias";
import {
  fetchConferencias,
  fetchConferenciasInscritasPorUsuario,
  fetchConferenciasPorUsuario,
  fetchConferenciasPorUsuarioGeneral,
} from "@/services/conferencias";
import Button from "@/components/Button";
import Loader from "./Loading";
import Modal from "./Modal";

interface ConferenciaComponentProps {
  conferencia: Conferencia;
  customStyles?: {
    container?: string;
    header?: string;
    content?: string;
    imageContainer?: string;
    image?: string;
    ponente?: string;
    title?: string;
    lugar?: string;
    datosimportantes?: string;
    button?: string;
    dateStyles?: string;
  };
  onInscribirse?: (conferencia: Conferencia) => void;
  actualizarConferencias?: () => void;
}

const ConferenciaComponent = ({
  conferencia,
  customStyles,
  onInscribirse,
}: ConferenciaComponentProps) => {
  const [index, setIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [cancelshowModal, setCancelShowModal] = useState(false);

  const handleInscribirse = () => {
    setShowModal(true);
  };

  const handleCancelar = () => {
    setCancelShowModal(true);
  };

  const handleDescargar = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const datosFiltrados = conferencia.datosimportantes.filter(
    (dato) => dato.trim() !== ""
  );

  useEffect(() => {
    if (datosFiltrados.length > 0) {
      const intervalo = setInterval(() => {
        setIndex((prev) => (prev + 1) % datosFiltrados.length);
      }, 7500);
      return () => clearInterval(intervalo);
    }
  }, [datosFiltrados]);

  // const handleCupo = () => {
  //   // router.push("/login");
  // };

  return (
    <div
      className={`w-full overflow-hidden border flex flex-col mb-6 rounded-md ${customStyles?.container || "border-slate-100 border-b-[#ffffff82]"} `}
    >
      <div
        className={`w-full min-h-14 lg:flex-row flex-col flex items-center justify-center text-2xl p-3 font-bold montserrat-font sm:gap-0 lg:gap-4 ${customStyles?.header || ""}`}
      >
        <h3 className={`${customStyles?.dateStyles || "hidden"}`}>
          {conferencia.fecha}
        </h3>
        <p>
        {` ${conferencia.horario} `}

        </p>

      </div>
      <div
        className={`w-full border lg:h-52 lg:flex rounded-b-md ${customStyles?.content || "border-slate-100 border-t-[#ffffff82]"}`}
      >
        <div
          className={`p-5 lg:w-1/4 flex flex-col items-center justify-center ${customStyles?.imageContainer || ""}`}
        >
          <div
            className={`relative w-full lg:h-[80%] h-28 border ${customStyles?.image || "border-slate-200"}`}
          >
            <Image
              src={conferencia.img_ponente}
              alt={conferencia.nombre_ponente}
              fill
              className="object-cover object-center"
            />
          </div>
          <div
            className={`border w-full text-center text-sm ${customStyles?.ponente || "border-slate-200"}`}
          >
            {conferencia.nombre_ponente}
          </div>
        </div>
        <div
          className={`lg:w-2/4 flex flex-col p-5 ${customStyles?.content || ""}`}
        >
          <h2 className={`text-lg font-bold ${customStyles?.title || ""}`}>
            {conferencia.titulo}
          </h2>
          <div className={`text-base flex my-3${customStyles?.lugar || ""}`}>
            <span className="material-symbols-outlined">location_on</span>
            {conferencia.lugar}
          </div>
          {conferencia.finalizado ? (
            conferencia.url_carpeta_zip && (
              <Button
                text="Descargar Recursos"
                action={() => handleDescargar(conferencia.url_carpeta_zip)}
                variant="secondary"
                styleType="outlined"
                className={`w-full md:w-max ${customStyles?.button || ""}`}
              >
                <span className="material-symbols-outlined">download</span>
              </Button>
            )
          ) : (
            <Button
              text={
                conferencia.inscrito ? "Cancelar Inscripcion" : "Inscribirse"
              }
              action={conferencia.inscrito ? handleCancelar : handleInscribirse}
              variant="secondary"
              styleType="outlined"
              className={`w-full md:w-max ${customStyles?.button || ""}`}
            >
              <span className="material-symbols-outlined">
                {conferencia.inscrito ? "cancel" : "how_to_reg"}
              </span>
            </Button>
          )}
        </div>
        <div
          className={`overflow-hidden lg:w-1/4 relative p-4 pt-0 md:pt-4 cursor-pointer flex items-center`}
          onClick={() => setIndex((prev) => (prev + 1) % datosFiltrados.length)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`text-slate-200 font-medium pt-0 text-sm  ${customStyles?.datosimportantes || ""}`}
            >
              {conferencia.datosimportantes[index]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {showModal && (
        <Modal
          message="¿Deseas inscribirte en esta conferencia?"
          subMessage={conferencia.titulo}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            if (onInscribirse) {
              onInscribirse(conferencia);
            }
          }}
        />
      )}
      {/* {descargarshowModal && (
        <Modal
          message="¿Deseas Descargar estos recursos?"
          subMessage={conferencia.titulo}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            if (onInscribirse) {
              onInscribirse(conferencia);
            }
          }}
        />
      )} */}
      {cancelshowModal && (
        <Modal
          message="¿Deseas cancelar tu inscripción a esta conferencia?"
          subMessage={conferencia.titulo}
          onClose={() => setCancelShowModal(false)}
          onSuccess={() => {
            setCancelShowModal(false);
            if (onInscribirse) {
              onInscribirse(conferencia);
            }
          }}
        />
      )}
    </div>
  );
};

interface CronogramaProps {
  fetchPrompt?: "usuario" | "todos" | "general" | "inscritas";
  idUsuario?: number;
  customStyles?: ConferenciaComponentProps["customStyles"];
  dayButtonStyles?: {
    default?: string;
    selected?: string;
    hover?: string;
  };
  titleStyles?: string;
  subtitleStyles?: string;
  onInscribirse?: (conferencia: Conferencia) => void;
}

export default function Cronograma({
  fetchPrompt = "todos",
  idUsuario,
  customStyles,
  dayButtonStyles,
  titleStyles,
  subtitleStyles,
  onInscribirse,
}: CronogramaProps) {
  const [conferencias, setConferencias] = useState<Conferencia[]>([]);
  const [loading, setLoading] = useState(true);

  const dias = [
    { fecha: "17/01/2025", label: "Viernes 17" },
    { fecha: "18/01/2025", label: "Sabado 18" },
    { fecha: "23/01/2025", label: "Jueves 23" },
    { fecha: "24/01/2025", label: "Viernes 24" },
    { fecha: "27/01/2025", label: "Lunes 27" },
    
    
  ];

  const [diaSeleccionado, setDiaSeleccionado] = useState(dias[0].fecha);

  const actualizarConferencias = async () => {
    setLoading(true);
    try {
      if (fetchPrompt === "usuario" && idUsuario !== undefined) {
        const respuesta = await fetchConferenciasPorUsuario(idUsuario, null);
        setConferencias(respuesta);
      } else if (fetchPrompt === "general" && idUsuario !== undefined) {
        const respuesta = await fetchConferenciasPorUsuarioGeneral(
          idUsuario,
          diaSeleccionado
        );
        setConferencias(respuesta);
      } else if (fetchPrompt === "inscritas" && idUsuario !== undefined) {
        const respuesta = await fetchConferenciasInscritasPorUsuario(
          idUsuario,
          diaSeleccionado
        );
        setConferencias(respuesta);
      } else {
        const respuesta = await fetchConferencias(diaSeleccionado);
        setConferencias(respuesta);
      }
    } catch (error) {
      console.error("Error al traer conferencias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchGets() {
      setLoading(true);
      if (idUsuario != 0) {
        try {
          if (fetchPrompt === "usuario" && idUsuario !== undefined) {
            const respuesta = await fetchConferenciasPorUsuario(
              idUsuario,
              null
            );
            setConferencias(respuesta);
          } else if (fetchPrompt === "general" && idUsuario !== undefined) {
            const respuesta = await fetchConferenciasPorUsuarioGeneral(
              idUsuario,
              diaSeleccionado
            );
            setConferencias(respuesta);
          } else if (fetchPrompt === "inscritas" && idUsuario !== undefined) {
            const respuesta = await fetchConferenciasInscritasPorUsuario(
              idUsuario,
              null
            );
            setConferencias(respuesta);
          } else {
            const respuesta = await fetchConferencias(diaSeleccionado);
            setConferencias(respuesta);
          }
        } catch (error) {
          console.error("Error al traer conferencias:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchGets();
  }, [diaSeleccionado, fetchPrompt, idUsuario]);

  return (
    <div className="w-5/6 px-4 md:px-8 mt-10 w-full flex flex-col items-center select-none mx-auto">
      <h2 className={`sm:text-6xl text-5xl mb-10 ${titleStyles || ""}`}>
        Conferencias
      </h2>
      <div className="flex lg:w-3/5 w-full flex-nowrap justify-between gap-1 overflow-x-auto">
        {dias.map((dia) => (
          <div
            key={dia.fecha}
            onClick={() => setDiaSeleccionado(dia.fecha)}
            className={`border whitespace-nowrap flex-shrink-0 lg:text-base text-sm text-center flex rounded-md h-10 items-center justify-center 
      transition-all duration-300 cursor-pointer sm:w-1/5 sm:max-w-[22%] w-1/3
      ${
        diaSeleccionado === dia.fecha
          ? dayButtonStyles?.selected || "bg-[#F2AE30] text-[#32378C]"
          : dayButtonStyles?.default || "bg-[#32378C]"
      } 
      ${
        diaSeleccionado !== dia.fecha
          ? dayButtonStyles?.hover || "hover:bg-[#F2AE30] hover:text-[#32378C]"
          : ""
      }`}
          >
            {dia.label}
          </div>
        ))}
      </div>

      <h3 className={`text-4xl m-10 ${subtitleStyles || ""}`}>
        {dias.find((dia) => dia.fecha === diaSeleccionado)?.label} de Enero
      </h3>

      <div id="conferencias" className="w-full md:w-6/6 lg:w-4/6">
        {loading ? (
          <div className="mt-10 h-full w-full flex justify-center">
            <Loader />
          </div>
        ) : (
          conferencias.map((conferencia,) => (
            <ConferenciaComponent
              key={conferencia.id_conferencia}
              conferencia={conferencia}
              customStyles={customStyles}
              onInscribirse={async (conferencia) => {
                if (onInscribirse) {
                  await onInscribirse(conferencia);
                  actualizarConferencias();
                }
              }}
              actualizarConferencias={actualizarConferencias}
            />
          ))
        )}
      </div>
    </div>
  );
}
