"use client"

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Button from "./Button";
import Image from 'next/image';

export default function Nav({ options }: NavProps) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavClick = (
        event: React.MouseEvent<HTMLAnchorElement>,
        link: string,
        closeDisclosure?: () => void
    ) => {
        event.preventDefault();

        const targetElement = document.querySelector(link);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }

        if (closeDisclosure) closeDisclosure();
    };

    return (
        <Disclosure
            as="nav"
            className="h-14 px-4 text-sm fixed top-2 z-10 w-[95%] left-1/2 transform -translate-x-1/2 bg-[#000]/50 backdrop-blur-md text-white rounded-full border border-gray-900 shadow-lg"
        >
            {({ close }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-14 items-center justify-between">
                            {/* Menú móvil */}
                            <div className="inset-y-0 left-0 flex items-center sm:hidden">
                                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-[#30303d] hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#F8B133]">
                                    {isMenuOpen ? (
                                        <span
                                            aria-hidden="true"
                                            className="hidden material-symbols-outlined cursor-pointer text-xl group-data-[open]:block"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            close
                                        </span>

                                    ) : (
                                        <span
                                            aria-hidden="true"
                                            className="block material-symbols-outlined text-xl group-data-[open]:hidden"
                                            onClick={() => setIsMenuOpen(true)}
                                        >
                                            menu
                                        </span>
                                    )}


                                </DisclosureButton>
                            </div>

                            {/* Logo */}
                            <div className="flex shrink-0 items-center">
                                <Link href="#inicio">
                                    <Image
                                        src="/logos/logo_cit_blanco.webp"
                                        alt="Logo del congreso"
                                        width={100}
                                        height={100}
                                        className="w-14"
                                    />
                                </Link>
                            </div>

                            {/* Menú desktop */}
                            <div className="hidden sm:ml-6 sm:block">
                                <div className="flex space-x-4">
                                    {options.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.link}
                                            onClick={(e) => handleNavClick(e, item.link)} // Agregar el manejador de clic
                                            className="text-gray-300 hover:text-[#F8B133] transition px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined">{item.icon}</span>
                                            {item.name}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Botón de iniciar sesión */}
                            <Button
                                text="Iniciar sesión"
                                variant="primary"
                                styleType="fill"
                                action={() => router.push("/login")}
                                className="hidden xl:block"
                            />
                        </div>
                    </div>

                    {/* Menú móvil desplegable */}
                    <DisclosurePanel className="sm:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2 bg-[#101017]">
                            {options.map((item) => (
                                <DisclosureButton
                                    key={item.name}
                                    as="a"
                                    href={item.link}
                                    onClick={(e) => handleNavClick(e, item.link, close)}
                                    className="text-gray-300 hover:bg-[#30303d] hover:text-[#F8B133] block px-3 py-2 rounded-md text-base font-medium flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined">{item.icon}</span>
                                    {item.name}
                                </DisclosureButton>
                            ))}
                            <Button
                                text="Iniciar sesión"
                                variant="primary"
                                styleType="fill"
                                action={() => router.push("/login")}
                                className='mt-16 ml-3'
                            />
                        </div>
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    );
}

interface Option {
    name: string;
    icon: string;
    link: string;
}

interface NavProps {
    options: Option[];
}
