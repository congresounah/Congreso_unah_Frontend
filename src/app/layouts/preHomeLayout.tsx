'use client'

import Button from '@/components/Button';
import { ToastContainer } from 'react-toastify';

export default function PreHomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            {/* banner izquierdo */}
            <div className="w-full md:w-2/5 xl:w-3/5 hidden md:grid md:bg-[url('/img/landing/promo.enc')] md:bg-repeat md:bg-center md:bg-black md:brightness-90 xl:bg-[#080816] xl:bg-none z-10 relative">
                <div className="hiddden md:absolute inset-0 bg-black bg-opacity-40 z-10 xl:hidden"></div>
                <Button
                    text='Regresar a Inicio'
                    action={() => window.location.href = '/'}
                    variant='primary'
                    styleType='outlined'
                    type='button'
                    className='fixed left-4 top-4 z-10 py-1'
                >
                    <span className="material-symbols-outlined">
                        arrow_back
                    </span></Button>

{/*                 <button className='absolute left-4 top-4 z-10 bg-white'>Regresar a landing </button>
 */}                <img
                    src="/img/landing/promo2.jpg"
                    alt="login ilustracion"
                    className="w-[60%] rounded-lg shadow-[8px_8px_15px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.2)] fade-in-up place-self-center hidden xl:block"
                />
            </div>


            {/* formulario de login */}
            <div className="box-border w-full md:w-3/5 xl:w-2/5 bg-[#101017] text-white py-4">
                <ToastContainer />

                <div className="flex flex-col justify-center items-center w-full min-h-screen fade-in-up">
                    <img src="/logos/logo_cit_blanco.webp" alt="logo" className="w-16 mb-2" />
                    {children}
                </div>
            </div>

        </div>
    );
}
