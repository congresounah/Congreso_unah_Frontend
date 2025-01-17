"use client"; // Necesario para que el código se ejecute en el cliente

import { useEffect, useState } from "react";
import Cronograma from "@/components/cronograma";
import Carousel from "@/components/ejes_tematicos";
import Navbar from "@/components/Navbar";
import Ponentes from "@/components/ponentes";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { showRegister } from "./login/actions";
import Image from "next/image";
import FloatingNotification from "@/components/FloatingNotification";
import { NotificationProvider } from "./contexts/NotificationContext";

export default function Home() {
  const router = useRouter();
  const [showRegisterButton, setShowRegisterButton] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

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

  const useIntersectionAnimation = () => {
    useEffect(() => {

      const animateSections = (selector: string, animationClass: string): (() => void) => {
        const sections = document.querySelectorAll<HTMLElement>(selector);

        const observer = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add(animationClass);
                observer.unobserve(entry.target);

                if (!showNotification && entry.target.id === "pago") {
                  console.log("showing notification");
                  setShowNotification(true);
                }
              }

            });
          },
          { threshold: 0 }
        );

        sections.forEach((section) => observer.observe(section));

        return () => {
          sections.forEach((section) => observer.unobserve(section));
        };
      };

      // Define the animations
      const animations = [
        { selector: ".intersection-animate", class: "float-from-bottom" },
        { selector: ".animate-from-right", class: "float-from-right" },
        { selector: ".animate-from-left", class: "float-from-left" },
      ];

      // Apply the animations
      const cleanupFunctions = animations.map(({ selector, class: animationClass }) =>
        animateSections(selector, animationClass)
      );

      // Cleanup observers on unmount
      return () => cleanupFunctions.forEach((cleanup) => cleanup && cleanup());
    }, []);
  };

  useIntersectionAnimation();

  useEffect(() => {
    const animatedSections = document.querySelectorAll(".intersection-animate");

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("float-from-bottom");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0,
    });

    animatedSections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      animatedSections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  const navbarOptions = [
    { name: "Inicio", icon: "home", link: "#inicio" },
    { name: "Objetivo", icon: "bookmark_flag", link: "#objetivo" },
    { name: "Inscripción", icon: "edit", link: "#pago" },
    { name: "Conferencias", icon: "import_contacts", link: "#conferencias" },
    { name: "Ponentes", icon: "group", link: "#ponentes" },
  ];


  return (
    <div className="flex flex-col justify-center bg-[#101017] text-white font-extralight w-full overflow-hidden" suppressHydrationWarning >
      <Navbar options={navbarOptions} />

      {/* imagen promocional de inicio */}
      <header className="relative w-full h-screen overflow-hidden" id="inicio">
        <div className="relative w-full h-full">
          {/* Imagen */}
          <img
            src="/img/landing/congreso-header.webp"
            alt="Imagen del congreso"
            className="w-full h-full object-cover scale-x-[] animate-fade-in"
          />
          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        </div>

        <h1 className="absolute top-1/3 xl:top-1/4 -translate-y-1/2 transform text-5xl sm:text-5xl md:text-7xl lg:text-7xl leading-tight text-white text-shadow-lg opacity-0 translate-y-10 animate-slide-up px-4 ml-8 tracking-widest">
          CONGRESO DE <br />
          INNOVACIÓN Y <br />
          TECNOLOGÍA <br />
          <p className="text-[#f8b133] text-lg md:text-2xl text-shadow-none montserrat-font">
            DEL 23 AL 28 DE ENERO
          </p>
          <span className="text-[#f8b133] text-shadow-none montserrat-font typing-effect">
            UNAH 2025
          </span>

          {showRegisterButton && (
            <Button
              text="Registrarme ahora"
              action={() => router.push("/register")}
              variant="primary"
              styleType="outlined"
              className="sm:mt-6 md:mt-10 lg:mt-4 tracking-wide"
            >
              <span className="material-symbols-outlined">
                account_circle
              </span>
            </Button>
          )}
        </h1>

      </header>

      <NotificationProvider>
        {showNotification && <FloatingNotification msg={"Si eres estudiante de la UNAH, se te otorgarán 35 horas VOAE (15 académicas, 15 sociales y 5 culturales) a quienes hayan acumulado al menos el 80% de asistencia."} showBottom={true} />}
      </NotificationProvider>
      <div className="h-16 w-full bg-gradient-to-b from-[#010101] to-[#101017] overflow-hidden">
      </div>

      {/* Contenido principal */}
      <main className="w-4/5 mx-auto">
        {/* seccion de invitacion a descargar cronograma */}
        <section className="w-full mt-12 xl:mt-0 xl:h-screen flex flex-col lg:flex-row items-center justify-center gap-12 px-8 animate-from-right sm:flex-col-reverse opacity-0 translate-x-[80px]" id="cron">
          <img
            src="/img/landing/promo2.webp"
            alt="Cronograma del evento"
            className="rounded-xl w-full md:w-[50%] max-w-[450px] shadow-[8px_8px_15px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.2)]"
          />
          <div className="flex flex-col gap-8 text-center md:text-left text-3xl md:text-6xl leading-none">
            <h2 className="text-center lg:text-left">Inteligencia, Innovación y
              Sostenibilidad en Acción</h2>
            {showRegisterButton && (
              <a href="/pdf/cronograma.pdf" download="Cronograma_CIT">
                <Button
                  text="Descargar cronograma"
                  action={() => (console.info("e"))}
                  variant="primary"
                  styleType="outlined"
                  className="w-full md:w-max mx-auto mx-auto lg:mx-0 mt-4 tracking-wide"
                >
                  <span className="material-symbols-outlined">
                    download
                  </span>
                </Button>
              </a>
            )}
          </div>
        </section>

        <section className="w-full mt-28 xl:mt-0 xl:h-screen flex flex-col-reverse lg:flex-row items-center justify-center gap-12 px-8 animate-from-left mb-16 xl:mb-0 opacity-0 translate-x-[-80px] md:flex-col" id="objetivo">
          <div className="flex flex-col gap-8 text-center md:text-left text-3xl md:text-6xl leading-none">
            <h2 className="text-center lg:text-left">
              Nuestro Objetivo
            </h2>
            <p className="text-base montserrat-font text-center lg:text-left">
              Crear un espacio
              interdisciplinario que fomente el diálogo y el
              intercambio de conocimientos sobre los temas
              cruciales de Sociedad del Futuro, Inteligencia
              Artificial, Sostenibilidad e Innovación.
            </p>
            <p className="text-base montserrat-font text-center lg:text-left">
              Mediante conferencias, paneles y actividades de
              networking, el Congreso busca involucrar a
              estudiantes, académicos y profesionales en
              discusiones profundas sobre los retos y
              oportunidades que estos temas representan para el
              desarrollo social, económico y tecnológico.

            </p>
          </div>
          <img
            src="/img/landing/nuestro-objetivo.webp"
            alt="Cronograma del evento"
            className="rounded-xl w-full md:w-[50%] max-w-[450px] shadow-[8px_8px_15px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.2)]"
          />
        </section>

        <section className="w-full my-28 xl:my-0 xl:h-screen flex flex-col lg:flex-row items-center justify-center gap-12 px-8 animate-from-right sm:flex-col-reverse opacity-0 translate-x-[80px]" id="pago">
          <img
            src="/img/landing/all-devices.webp"
            alt="Cronograma del evento"
            className="rounded-xl w-full md:w-[50%] max-w-[450px] shadow-[8px_8px_15px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.2)]"
          />
          <div className="flex flex-col gap-8 text-center md:text-left text-3xl md:text-6xl leading-none">
            <h2 className="text-center lg:text-left">¿Cómo me inscribo?</h2>
            <div className="text-base montserrat-font text-center lg:text-left">
              {/*               <ol className="list-decimal list-inside flex flex-col gap-4 list:">
                <li>Recoge tu orden de pago
                  Puedes obtenerla los días lunes 20 y martes 21 de enero de 2025 en cualquiera de estos puntos:
                  <ul className="list-disc list-inside ml-4">
                    <li>Entrada de la Facultad de Ingeniería.</li>
                    <li>Decanatura de la Facultad de Ciencias Económicas, con el Secretario Académico.</li>
                    <li>Recepción Académica del Polideportivo.</li>
                  </ul>
                </li>
                <li>Realiza el pago en Banco LAFISE
                  Presenta tu orden de pago y cancela los L.300 de inscripción.</li>
                <li>Guarda tu comprobante
                  Toma una foto del recibo para subirlo al crear tu cuenta en esta aplicación.</li>
              </ol> */}

              <ol className="flex flex-col gap-4">
                <li className="flex flex-col md:flex-row md:items-start md:gap-4 gap-2">
                  <p className="w-10 aspect-square flex justify-center items-center border-2 border-[#F8B133] rounded-full font-bold text-[#F8B133] mx-auto md:mx-0">
                    1
                  </p>
                  <div className="text-center md:text-left md:flex-1">
                    <h3 className="font-semibold">Recoge tu orden de pago</h3>
                    <p>
                      Disponible solo <strong>20 y 21 de enero</strong> en:
                    </p>
                    <ul className="list-disc list-inside mt-2">
                      <li>Entrada de la Facultad de Ingeniería.</li>
                      <li>Decanatura de Ciencias Económicas.</li>
                      <li>Recepción Académica del Polideportivo.</li>
                    </ul>
                  </div>
                </li>
                <li className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
                  <p className="w-10 aspect-square flex justify-center items-center border-2 border-[#F8B133] rounded-full font-bold text-[#F8B133] mx-auto md:mx-0">
                    2
                  </p>
                  <div className="text-center md:text-left md:flex-1">
                    <h3 className="font-semibold">Paga en banco LAFISE</h3>
                    <p>
                      Lleva tu orden y cancela <strong>L.300</strong>.
                    </p>
                  </div>
                </li>
                <li className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
                  <p className="w-10 aspect-square flex justify-center items-center border-2 border-[#F8B133] rounded-full font-bold text-[#F8B133] mx-auto md:mx-0">
                    3
                  </p>
                  <div className="text-center md:text-left md:flex-1">
                    <h3 className="font-semibold">Guarda el comprobante</h3>
                    <p>
                      Fotografía tu recibo para subirlo al hacer tu registro.
                    </p>
                  </div>
                </li>
                <li className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
                  <p className="w-10 aspect-square flex justify-center items-center border-2 border-[#F8B133] rounded-full font-bold text-[#F8B133] mx-auto md:mx-0">
                    4
                  </p>
                  <div className="text-center md:text-left md:flex-1">
                    <h3 className="font-semibold">Completa tu registro</h3>
                    <p>
                      Registra tus datos y sube tu comprobante de pago en esta aplicación.
                    </p>
                  </div>
                </li>

                <p>Unicamente contamos con 450 cupos disponibles. <span className="font-semibold">¡No te quedes fuera!</span></p>
              </ol>



            </div>
          </div>
        </section>
        <div>
        </div>


        <div className="w-full min-h-screen flex flex-col bg-[101017]">
          <div className="bg-[101017] flex-grow w-full mt-10">
            <div className="container flex flex-col gap-10 mx-auto px-4">
              <section className="intersection-animate">
                <div>
                  <Carousel></Carousel>
                </div>
              </section>
              <section id="conferencias" className="intersection-animate">
                <Cronograma
                  customStyles={{
                    button: "hidden",
                  }}
                >

                </Cronograma>
              </section>
              <section id="ponentes" className="intersection-animate pt-16">
                <div className="flex justify-center">
                  <Ponentes></Ponentes>
                </div>
                <div></div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <footer className="relative py-4 bg-[#f8b133] mt-36 h-48 text-gray-800 overflow-hidden">
        {/* Contenido del footer */}
        <div className="flex flex-col items-start justify-center ml-12 h-full text-xl">
          <p>UNAH 2025</p>
          <ul className="list-none">
            <li>
            </li>
            <li>
              <strong>Correo:</strong> congresodeinnovacionunah@gmail.com
            </li>
            <li>
              <strong>Dirección:</strong> Ciudad Universitaria, Tegucigalpa, Honduras
            </li>
          </ul>
        </div>

        {/* Imagen pegada al lado derecho abajo */}
        <div className="absolute bottom-0 right-0 hidden md:block">
          <Image
            src="/img/bg/sol-docto-fondo.jpg"
            alt="Imagen decorativa"
            width={150}
            height={150}
            className="w-auto h-auto  max-h-full object-contain"
          />
        </div>
      </footer>


    </div>
  );
}
