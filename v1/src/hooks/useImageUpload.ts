import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { validateImage, resizeImage } from '../utils/imageUtils';

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File, path: string): Promise<string | null> => {
    try {
      setUploading(true);
      setError(null);

      // Valider l'image
      const validationError = await validateImage(file);
      if (validationError) {
        setError(validationError);
        return null;
      }

      // Redimensionner l'image
      const processedImage = await resizeImage(file);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, processedImage.file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du téléchargement';
      setError(message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (url: string) => {
    try {
      const path = url.split('/').pop();
      if (!path) return;

      const { error } = await supabase.storage
        .from('avatars')
        .remove([path]);

      if (error) {
        throw error;
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading,
    error
  };
}