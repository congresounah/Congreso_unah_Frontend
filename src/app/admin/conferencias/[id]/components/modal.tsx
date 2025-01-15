import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isVisible, onClose, children }: ModalProps) {
  if (!isVisible) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md mx-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          ✖
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
