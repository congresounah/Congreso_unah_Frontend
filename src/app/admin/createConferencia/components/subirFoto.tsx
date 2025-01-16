import React, { useState, useEffect } from "react";
import Image from 'next/image';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageUpload: (urls: string[]) => void;
  existingImages: string[];
  isGallery: boolean;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onImageUpload, existingImages, isGallery }) => {
  const [tempImages, setTempImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTempImages(existingImages);
    }
  }, [isOpen, existingImages]);

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    setUploading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`https://congreso-unah-backend.vercel.app/image/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Error uploading file');
        }

        const data = await response.json();
        urls.push(data.imageUrl); // Asegúrate de que el backend retorne `imageUrl`
      }
    } catch (err) {
      console.error('Error uploading files:', err);
      setError('Error uploading files');
    } finally {
      setUploading(false);
    }

    return urls;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const uploadedUrls = await uploadFiles(files);
    setTempImages((prev) => [...prev, ...uploadedUrls]);
  };

  const handleRemoveImage = (url: string) => {
    setTempImages(tempImages.filter((img) => img !== url));
  };

  const handleConfirm = () => {
    onImageUpload(tempImages); // Update main component only on confirm
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">{isGallery ? "Subir Foto de la Conferencia" : "Subir Foto del Ponente"}</h2>

        {/* Mostrar error si existe */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Preview of Selected Images */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {tempImages.map((url, index) => (
            <div key={index} className="relative">
              <Image
                src={url}
                alt={`Selected ${index + 1}`}
                width={300}
                height={300}
                style={{ width: 'auto', height: 'auto' }}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleRemoveImage(url)}
                className="absolute top-0 right-0 bg-red-500 text-white px-1 rounded-full"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* File Input */}
        <input
          type="file"
          multiple={isGallery}
          onChange={handleFileChange}
          className="mb-4"
          disabled={uploading}
        />
        {uploading && <p className="text-blue-500">Subiendo...</p>}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded">Cerrar</button>
          <button onClick={handleConfirm} className="px-4 py-2 bg-blue-600 text-white rounded">Listo</button>
        </div>

      </div>
    </div>
  );
};

export default UploadModal;
