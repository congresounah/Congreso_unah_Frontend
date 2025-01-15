/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";

interface SelectFormProps {
    options: { name: string; id: number }[];
    id: string;
    iconName: string;
    legend: string;
    optionSelected?: number;
    onChange: (e? : any) => void | Promise<void> | any;
}

const SelectForm = ({ options, id, iconName, legend, optionSelected, onChange }: SelectFormProps) => {
    return (
        <div className="bg-transparent border-[1px] border-[#ab9a9a] rounded-md flex items-center gap-2 pl-2 active:outline-none text-base">
            <span className="material-symbols-outlined">{iconName}</span>
            <select
                id={id}
                name={id}
                className="bg-transparent w-full py-2 focus:outline-none"
                onChange={onChange}
                value={optionSelected}
            >
                <option value="" hidden className="text-gray">
                    {legend}
                </option>
                {options.map((option) => (
                    <option key={option.id} value={option.id} className="text-black">
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectForm;
