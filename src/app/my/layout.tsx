'use client';

import { NotificationProvider } from '@/app/contexts/NotificationContext';
import FloatingNotification from '@/components/FloatingNotification';
import HomeLayout from '../layouts/HomeLayout';
import { ReactNode } from 'react';
import { NavbarProvider } from '../contexts/NavbarContext';

interface HomeProps {
    children: ReactNode;
}

export default function Home({ children }: HomeProps) {
    const navOptions = [
        { name: "Mi Perfil", icon: "person", link: "/my/profile", default: true },
        { name: "Conferencias", icon: "library_books", link: "/my/conferences", default: false },
        { name: "Mis Inscripciones", icon: "school", link: "/my/inscriptions", default: false },
        { name: "Mi Progreso", icon: "school", link: "/my/progress", default: false },
    ];

    return (
        <NavbarProvider>
        <NotificationProvider>
            <HomeLayout navOptions={navOptions}>
                {/* Mostrar la notificación flotante */}
                <FloatingNotification />
                {children}
            </HomeLayout>
        </NotificationProvider>
        </NavbarProvider>
    );
}
