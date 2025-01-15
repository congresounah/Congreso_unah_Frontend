'use client';

import { useState } from "react";

const InputForm = ({ placeholder, iconName, type, id, value, onChange, onBlur }: InputFormInterface) => {
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    const handleTogglePassword = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    const isPasswordType = type === "password";

    return (
        <div className="bg-transparent border-[1px] border-[#ab9a9a] rounded-md flex items-center gap-2 pl-2 active:outline-none text-white text-base">
            <span className="material-symbols-outlined">{iconName}</span>
            <input
                type={isPasswordType && isPasswordVisible ? "text" : type}
                id={id}
                name={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className="bg-transparent active:border-none placeholder:text-gray py-2 w-full focus:outline-none"
            />
            {isPasswordType && (
                <button
                    type="button"
                    onClick={handleTogglePassword}
                    className="pr-2 text-gray-500 hover:text-gray-300 focus:outline-none flex items-center gap-1"
                    aria-label="Toggle password visibility"
                >
                    {isPasswordVisible ? <span className="material-symbols-outlined">
                        visibility_off
                    </span> : <span className="material-symbols-outlined">
                        visibility
                    </span>}
                </button>
            )}
        </div>
    );
};

interface InputFormInterface {
    placeholder: string;
    iconName: string;
    type: string;
    id: string;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export default InputForm;
