'use client';

import HomeLayout from '@/app/layouts/HomeLayout';
import { NavbarProvider } from '@/app/contexts/NavbarContext';

import { ReactNode } from 'react';

interface HomeProps {
    children: ReactNode;
}


export default function Home({ children }: HomeProps) {

    const navOptions = [
        { name: "Mi Perfil", icon: "person", link: "/organizador/perfil", default: false },
        { name: "Participantes", icon: "person", link: "/organizador", default: true },
    ];

    return (
        <NavbarProvider>
            <HomeLayout navOptions={navOptions}>
                {children}
            </HomeLayout >
        </NavbarProvider>

    );
}