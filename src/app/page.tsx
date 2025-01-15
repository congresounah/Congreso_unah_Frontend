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

export default function Home() {
  const router = useRouter();
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
    { name: "Nuestro Objetivo", icon: "bookmark_flag", link: "#objetivo" },
    { name: "Detalles de Pago", icon: "bookmark_flag", link: "#pago" },
    { name: "Conferencias", icon: "import_contacts", link: "#conferencias" },
    { name: "Ponentes", icon: "group", link: "#ponentes" },
  ];

  return (
    <div className="flex flex-col justify-center bg-[#101017] text-white font-extralight w-full overflow-hidden" suppressHydrationWarning >
      <Navbar options={navbarOptions}  />

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

        <h1 className="absolute top-1/3 xl:top-1/4 -translate-y-1/2 transform text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-white text-shadow-lg opacity-0 translate-y-10 animate-slide-up px-4 ml-8 tracking-widest">
          CONGRESO DE <br />
          INNOVACIÓN Y <br />
          TECNOLOGÍA <br />
          <span className="text-[#f8b133] text-shadow-none montserrat-font typing-effect">
            UNAH 2025
          </span>
          {showRegisterButton && (
              <Button
                text="Registrarme ahora"
                action={() => router.push("/register")}
                variant="primary"
                styleType="outlined"
                className="mt-4 tracking-wide"
              >
                <span className="material-symbols-outlined">
                  account_circle
                </span>
              </Button>
            )}
        </h1>

      </header>
      <div className="h-16 w-full bg-gradient-to-b from-[#010101] to-[#101017] overflow-hidden">
      </div>

      {/* Contenido principal */}
      <main className="w-4/5 mx-auto">
        {/* seccion de invitacion a descargar cronograma */}
        <section className="w-full mt-12 xl:mt-0 xl:h-screen flex flex-col lg:flex-row items-center justify-center gap-12 px-8 animate-from-right sm:flex-col-reverse opacity-0 translate-x-[80px]">
        <img
            src="/img/landing/promo.enc"
            alt="Cronograma del evento"
            className="rounded-tl-[40px] rounded-br-[40px] w-full md:w-[50%] max-w-[450px] shadow-[8px_8px_15px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.2)]"
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
            className="rounded-tl-[40px] rounded-tr-sm rounded-br-[40px] w-full md:w-[50%] max-w-[450px] shadow-[8px_8px_15px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.2)]"
          />
        </section>

        <section className="w-full my-28 xl:my-0 xl:h-screen flex flex-col lg:flex-row items-center justify-center gap-12 px-8 animate-from-right sm:flex-col-reverse opacity-0 translate-x-[80px]" id="pago">
        <img
            src="/img/landing/promo.enc"
            alt="Cronograma del evento"
            className="rounded-tl-[40px] rounded-br-[40px] w-full md:w-[50%] max-w-[450px] shadow-[8px_8px_15px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.2)]"
          />
          <div className="flex flex-col gap-8 text-center md:text-left text-3xl md:text-6xl leading-none">
            <h2 className="text-center lg:text-left">Detalles de Pago</h2>
            <p className="text-base montserrat-font text-center lg:text-left">Cuenta 282782</p>
          </div>
        </section>

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
      <footer className="relative py-4 bg-[#f8b133] mt-36 h-48 text-black overflow-hidden">
        {/* Contenido del footer */}
        <div className="flex flex-col items-start justify-center ml-12 h-full text-xl">
          <p>UNAH 2025</p>
          <ul className="list-none">
            <li>
              <strong>Teléfono:</strong> 2234-5678
            </li>
            <li>
              <strong>Email:</strong> contacto@unah.edu
            </li>
            <li>
              <strong>Dirección:</strong> Tegucigalpa, Honduras
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
