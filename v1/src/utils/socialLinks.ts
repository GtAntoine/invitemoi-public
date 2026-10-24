export function formatSocialLink(platform: string, value: string): string {
  // Si vide, retourner une chaîne vide
  if (!value.trim()) return '';

  // Nettoyer l'identifiant (enlever @ et espaces)
  const handle = value.startsWith('@') ? value.substring(1).trim() : value.trim();

  // Retourner l'identifiant nettoyé
  return handle;
}

export function getSocialUrl(platform: string, handle: string): string {
  if (!handle) return '';
  
  // Si c'est déjà une URL complète, la retourner telle quelle
  if (handle.startsWith('http://') || handle.startsWith('https://')) {
    return handle;
  }

  switch (platform) {
    case 'twitter':
      return `https://twitter.com/${handle}`;
    case 'instagram':
      return `https://instagram.com/${handle}`;
    default:
      return handle;
  }
}

export function extractSocialHandle(platform: string, url: string): string {
  if (!url) return '';
  
  // Si ce n'est pas une URL, retourner la valeur avec @
  if (!url.startsWith('http')) {
    return url.startsWith('@') ? url : '@' + url;
  }
  
  try {
    const urlObj = new URL(url);
    const handle = urlObj.pathname.split('/').join("") || '';
    
    return '@' + handle;
  } catch {
    return url.startsWith('@') ? url : '@' + url;
  }
}

export function getSocialInputPlaceholder(platform: string): string {
  switch (platform) {
    case 'twitter':
      return '@pseudo ou URL complète';
    case 'instagram':
      return '@pseudo ou URL complète';
    default:
      return 'Téléphone, email ou autre...';
  }
}