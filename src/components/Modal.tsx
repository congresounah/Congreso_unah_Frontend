import React from "react";
import Button from "./Button";

type ModalProps = {
  message?: string;
  subMessage?: string;
  onClose: () => void;
  successButtonText?: string;
  cancelButtonText?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  hideButtons?: boolean;
};


const Modal: React.FC<ModalProps> = ({
  message = "Are you sure?",
  subMessage,
  onClose,
  successButtonText = "Confirmar",
  cancelButtonText = "Cancelar",
  onSuccess,
  onCancel,
  hideButtons = false,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent click propagation
      >
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">{message}</h2>
          {subMessage && <p className="mt-2 text-sm text-gray-600">{subMessage}</p>}
        </div>
        {!hideButtons && ( // Condicional para mostrar u ocultar los botones
          <div className="mt-4 flex justify-end space-x-4">
            <Button
              text={cancelButtonText}
              action={onCancel || onClose}
              className="px-4 py-2"
              variant="secondary"
              styleType="fill"
            />
            <Button
              text={successButtonText}
              action={onSuccess || onClose}
              className="px-4 py-2"
              variant="primary"
              styleType="fill"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
