import React from 'react';
import Image from 'next/image';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onValidate: () => void;
  onDeny: () => void;
  invoiceCode: string;
  invoiceImage: string;
  isAccepted?: boolean | null;
  loading?: boolean;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  onValidate,
  onDeny,
  invoiceCode,
  invoiceImage,
  isAccepted = null,
  loading=false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-100 rounded-lg shadow-lg p-6 w-[90%] max-w-md relative">
        {/* Código de la factura */}
        <h2 className="text-xl font-bold text-center mb-4">
          CÓDIGO: {invoiceCode}
        </h2>

        {/* Imagen de la factura */}
        <div className="relative w-full h-96 mb-6">
          {invoiceImage ?  (
            <Image
              src={invoiceImage}
              alt="Factura"
              layout="fill"
              objectFit="contain"
              className="rounded-md border border-gray-300"
            />
          ) : <p className="text-center">No hay imagen</p>}
        </div>

        {/* Botones */}
        <div className="flex justify-around mt-4">
          {isAccepted === null && (
            <>
              <button
                onClick={onValidate}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition hover:scale-105 disabled:opacity-50"
                disabled={loading}
              >
                Aceptar
              </button>
              <button
                onClick={onDeny}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition hover:scale-105 disabled:opacity-50"
                disabled={loading}
              >
                Denegar
              </button>
            </>
          )}

          {isAccepted === false && (
            <button
              onClick={onValidate}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition hover:scale-105 disabled:opacity-50"
              disabled={loading}
            >
              Aceptar
            </button>
          )}

          {isAccepted === true && (
            <button
              onClick={onDeny}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition hover:scale-105 disabled:opacity-50"
              disabled={loading}
            >
              Denegar
            </button>
          )}
        </div>

        {/* Cerrar modal */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default InvoiceModal;
