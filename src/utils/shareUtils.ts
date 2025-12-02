export async function shareEvent(title: string, url: string): Promise<boolean> {
  const shareData = {
    title,
    text: `Découvrez sur Invite Moi : ${title}`,
    url
  };

  try {
    // Vérifier si le partage natif est disponible et compatible
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
      return true;
    }
    
    // Fallback au presse-papier
    await navigator.clipboard.writeText(url);
    return true;
  } catch (err) {
    if (err instanceof Error && err.name === 'NotAllowedError') {
      // L'utilisateur a annulé le partage, pas besoin de gérer l'erreur
      return false;
    }
    
    // Dernier recours : copier uniquement l'URL
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      console.error('Failed to copy URL:', err);
      return false;
    }
  }
}