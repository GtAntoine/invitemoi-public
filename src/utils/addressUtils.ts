/**
 * Formate une adresse OpenStreetMap en une version plus concise
 * Ne garde que les informations essentielles : nom du lieu, numéro, rue, code postal et ville
 */
export function formatAddress(osmAddress: any): string {
  const components = [];


  // Ajouter le nom du lieu s'il existe
  if (osmAddress?.name) {
components.push(osmAddress.name);
  }
  
  // Ajouter le numéro et la rue
  const street = [
    osmAddress.address?.house_number,
    osmAddress.address?.road || osmAddress.address?.pedestrian
  ].filter(Boolean).join(' ');
  
  if (street) {
    components.push(street);
  }

  // Ajouter le code postal et la ville
  const city = [
    osmAddress.address?.postcode,
    osmAddress.address?.city || osmAddress.address?.town || osmAddress.address?.village
  ].filter(Boolean).join(' ');
  
  if (city) {
    components.push(city);
  }

  // Ajouter le pays si différent de France
  if (osmAddress.address?.country && osmAddress.address.country !== 'France') {
    components.push(osmAddress.address.country);
  }

  const joinec = components.join(', ');
  console.log(joinec);
  
  return components.join(', ');
}
