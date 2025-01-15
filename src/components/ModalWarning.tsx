'use client';

import Button from './Button';

export default function ModalWarning({ title, isOpen, setIsOpen, secondAction = null, buttonDisabled = false}: { title: string; isOpen: boolean; setIsOpen: (isOpen: boolean) => void; secondAction? : {title: string; action: () => void} | null; buttonDisabled?: boolean }) {

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    aria-modal="true"
                    role="dialog"
                >
                    <div className="fixed p-4 w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-700">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                            <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="p-4 md:p-5 text-center">
                            <svg
                                className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                {title}
                            </h3>
                            <div className='flex flex-col gap-2'>
                                {secondAction && (
                                    <Button 
                                        text={secondAction.title}
                                        disabled={buttonDisabled}
                                        action={secondAction.action}
                                        variant="secondary"
                                        styleType="fill"
                                        className="w-full"
                                    />
                                )}
                                <Button
                                    text="Cerrar"
                                    action={() => {localStorage.removeItem('registerEmail') ;setIsOpen(false)}}
                                    variant="primary"
                                    styleType="fill"
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>

            )}
        </>
    );
}
