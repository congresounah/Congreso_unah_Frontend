import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '@/app/contexts/NotificationContext';

export default function FloatingNotification({msg, showBottom = false} : {msg: string, showBottom?: boolean}) {
    const { isNotificationVisible, hideNotification } = useNotification();

    return (
        <AnimatePresence>
            {isNotificationVisible && (
                <motion.div
    className={`fixed ${showBottom ? 'bottom-4' : 'top-4'} right-4 montserrat-font text-white p-4 rounded-lg shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:w-96 z-50`}
    style={{
        backgroundImage: 'url(/img/bg/sol.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }}
    initial={{ y: -20, scale: 0.9 }}
    animate={{
        y: 0,
        scale: 1,
        x: [0, -2, 2, -2, 2, 0], // Movimiento suave horizontal
    }}
    exit={{ y: -20, scale: 0.9 }}
    transition={{
        x: {
            duration: 1.5, // Más calmado
            repeat: Infinity,
            repeatType: 'loop',
            delay: 4, // Sacudida cada 4 segundos
            ease: 'easeInOut', // Movimiento fluido
        },
    }}
>
                    <div className="flex items-center justify-between w-full p-4 rounded-lg">
                        <div className="flex items-center gap-3">
{/*                             <span className="text-lg leading-6 xl:leading-5"> 
                            Verifica cuidadosamente la exactitud de <span className='font-extrabold'>todos tus datos personales</span>. Estos se usarán para generar certificados oficiales. 
                            </span> */}
                            {msg}
                        </div>
                        <button
                            onClick={hideNotification}
                            className="text-2xl font-semibold hover:text-gray-200 transition-colors duration-300 hover:scale-110"
                            aria-label="Cerrar notificación"
                        >
                            &times;
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
