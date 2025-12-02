import React, { useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';
import clsx from 'clsx';

interface ImageUploadProps {
  currentImage?: string;
  onImageSelect: (file: File) => void;
  onImageRemove?: () => void;
  className?: string;
}

export function ImageUpload({ 
  currentImage, 
  onImageSelect, 
  onImageRemove,
  className 
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    
    if (file) {
      onImageSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.onerror = () => {
        setError('Erreur lors de la lecture du fichier');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onImageRemove) {
      setPreviewUrl(null);
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onImageRemove();
    }
  };

  const imageUrl = previewUrl || currentImage;

  return (
    <div className="relative">
      <div 
        onClick={handleClick}
        className={clsx(
          'relative group cursor-pointer overflow-hidden',
          className
        )}
      >
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt="Profile"
              className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg hover:shadow-xl transition-all duration-300"
            />
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Camera className="w-8 h-8 text-white" />
            </div>
            {onImageRemove && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600 z-10"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Camera className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>

      {error && (
        <div className="absolute -bottom-8 left-0 right-0 text-center text-sm text-red-500">
          {error}
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}