import { translations } from '../translations/fr';

export const MAJOR_FRENCH_CITIES = [
  'Paris',
  'Marseille',
  'Lyon',
  'Toulouse',
  'Nice'
];

export function getCurrentCity(): Promise<string | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api-adresse.data.gouv.fr/reverse/?lon=${longitude}&lat=${latitude}`
          );
          const data = await response.json();
          const city = data.features[0]?.properties?.city;
          resolve(city || null);
        } catch (error) {
          console.error('Error getting city from coordinates:', error);
          resolve(null);
        }
      },
      () => resolve(null)
    );
  });
}