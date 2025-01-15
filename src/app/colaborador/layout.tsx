'use client';

import HomeLayout from '../layouts/HomeLayout';
import { NavbarProvider } from '../contexts/NavbarContext';

import { ReactNode } from 'react';

interface HomeProps {
    children: ReactNode;
}


export default function Home({ children }: HomeProps) {

    const navOptions = [
        { name: "Escanear", icon: "qr_code_scanner", link: "/colaborador/escaner", default: true },
        { name: "Mi Perfil", icon: "person", link: "/colaborador/perfil", default: false },
    ];

    return (
        <NavbarProvider>
            <HomeLayout navOptions={navOptions} className="py-0"> 
                { children }
            </HomeLayout >
        </NavbarProvider>
/*         <HomeLayout navOptions={navOptions} className="px-0 lg:px-0"> 
            { children }
        </HomeLayout >
 */
    );
}