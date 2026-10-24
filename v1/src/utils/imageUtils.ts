import { MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES, MAX_DIMENSIONS } from '../config/constants';

export interface ProcessedImage {
  file: File;
  width: number;
  height: number;
}

export async function validateImage(file: File): Promise<string | null> {
  // Vérifier le type de fichier
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Format de fichier non supporté. Utilisez JPG, PNG ou WebP.';
  }

  // Vérifier la taille du fichier
  /*if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(1);
    return `L'image est trop volumineuse (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum : ${sizeMB}MB`;
  }*/

  // Vérifier les dimensions pour les images bitmap
  if (file.type !== 'image/svg+xml') {
    try {
      const dimensions = await getImageDimensions(file);
      if (!dimensions) {
        return 'Impossible de lire les dimensions de l\'image';
      }
    } catch (err) {
      return 'Format d\'image invalide';
    }
  }

  return null;
}

function getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };

    img.src = url;
  });
}

export function resizeImage(file: File): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    // Ne pas traiter les SVG
    if (file.type === 'image/svg+xml') {
      reject(new Error('Les fichiers SVG ne sont pas supportés'));
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      const maxWidth = MAX_DIMENSIONS.width;
      const maxHeight = MAX_DIMENSIONS.height;

      // Redimensionner si nécessaire
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      // Créer un canvas pour le redimensionnement
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Impossible de créer le contexte canvas'));
        return;
      }

      // Dessiner l'image redimensionnée
      ctx.drawImage(img, 0, 0, width, height);

      // Convertir en Blob avec compression
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Échec de la conversion en blob'));
            return;
          }

          // Créer un nouveau fichier
          const resizedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });

          resolve({
            file: resizedFile,
            width: Math.round(width),
            height: Math.round(height),
          });
        },
        'image/jpeg',
        0.8 // Qualité de compression
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Erreur lors du chargement de l\'image'));
    };

    img.src = url;
  });
}