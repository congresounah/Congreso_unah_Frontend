'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */


interface PrimaryButtonProps  {
    text: string;
    action: (e? : any) => void | Promise<void> | any;
    children?: React.ReactNode;
    className?: string;
    variant: "primary" | "secondary" | "danger" | "success" | "warning" | "info" | "light" | "dark";
    styleType: "fill" | "outlined";
    disabled?: boolean,
    type?: "button" | "submit" | "reset" ;
}

export default function Button({ text, action, children, className, variant, styleType, disabled = false, type = "submit" }: PrimaryButtonProps){

    const typeButtons = {
        primary: {
            fill: "bg-[#F8B133] text-[#101017] border border-[#F8B133] hover:bg-[#e0a22e] hover:text-[#FFFFFF]",
            outlined: "bg-transparent text-[#F8B133] border border-[#F8B133] hover:bg-[#F8B133] hover:text-[#101017]"
        },
        secondary: {
            fill: "bg-[#E7E8F2] text-[#101017] border border-[#E7E8F2] hover:bg-[#d6d7e8] hover:text-[#000]",
            outlined: "bg-transparent text-[#E7E8F2] border border-[#E7E8F2] hover:bg-[#E7E8F2] hover:text-[#101017]"
        },
        danger: {
            fill: "bg-[#FF0000] text-[#101017] border border-[#FF0000] hover:bg-[#e60000] hover:text-[#FFFFFF]",
            outlined: "bg-transparent text-[#FF0000] border border-[#FF0000] hover:bg-[#FF0000] hover:text-[#101017]"
        },
        success: {
            fill: "bg-[#00FF00] text-[#101017] border border-[#00FF00] hover:bg-[#00e600] hover:text-[#FFFFFF]",
            outlined: "bg-transparent text-[#00FF00] border border-[#00FF00] hover:bg-[#00FF00] hover:text-[#101017]"
        },
        warning: {
            fill: "bg-[#FFFF00] text-[#101017] border border-[#FFFF00] hover:bg-[#e6e600] hover:text-[#FFFFFF]",
            outlined: "bg-transparent text-[#FFFF00] border border-[#FFFF00] hover:bg-[#FFFF00] hover:text-[#101017]"
        },
        info: {
            fill: "bg-[#0000FF] text-[#101017] border border-[#0000FF] hover:bg-[#0000e6] hover:text-[#FFFFFF]",
            outlined: "bg-transparent text-[#0000FF] border border-[#0000FF] hover:bg-[#0000FF] hover:text-[#101017]"
        },
        light: {
            fill: "bg-[#FFFFFF] text-[#101017] border border-[#FFFFFF] hover:bg-[#f2f2f2] hover:text-[#101017]",
            outlined: "bg-transparent text-[#FFFFFF] border border-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#101017]"
        },
        dark: {
            fill: "bg-[#101017] text-[#F8B133] border border-[#101017] hover:bg-[#000000] hover:text-[#F8B133]",
            outlined: "bg-transparent text-[#101017] border border-[#101017] hover:bg-[#101017] hover:text-[#F8B133]"
        }
    };

    return (
        <button
            type={type}
            className={`flex justify-center items-center gap-1 px-4 py-2 text-sm capitalize rounded-md font-semibold transition-all 
        ${typeButtons[variant][styleType]} 
        ${disabled ? "opacity-50" : "hover:bg-[#F8B133] hover:text-[#101017]"}
        ${className}
    `}
            onClick={disabled ? () => { } : action}
            disabled={disabled}
        >
            {children} {text} 
        </button>
    )
}
