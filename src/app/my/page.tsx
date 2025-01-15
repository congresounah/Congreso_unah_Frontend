'use client'

import UserProfile from "@/components/editarPerfil";
export default function Conferences() {


    return (
        <div className='h-screen w-full'>
            <h2 className="text-3xl text-black border-b-[1px] border-gray-300 pb-1"></h2>
            <UserProfile
             />
        </div>
    );
}