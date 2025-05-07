import { ref } from 'vue';
import { Geolocation } from '@capacitor/geolocation';

const places = ref<any[]>([]);

export const fetchPlaces = async (lat: number, lng: number) => {
  const CACHE_KEY = 'cachedPlaces';
  const MAX_DISTANCE_METERS = 300; // kui kaugus on väiksem kui 300m, kasuta cache'i
  const MAX_AGE_MINUTES = 60;

  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');

    if (cached) {
      const { data, timestamp, location } = cached;
      const now = Date.now();
      const ageMinutes = (now - timestamp) / 1000 / 60;

      const distance = getDistanceFromLatLonInMeters(lat, lng, location.lat, location.lng);

      if (distance < MAX_DISTANCE_METERS && ageMinutes < MAX_AGE_MINUTES) {
        //console.log('Kasutame cached kohti');
        return data;
      }
    }

    // Kui ei leitud sobivat cache'i või see on liiga vana, tee uus päring
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node[amenity~"bar|nightclub"](around:3000,${lat},${lng});out;`;
    const response = await fetch(overpassUrl);
    const data = await response.json();

    const places = data.elements.map((el: any) => ({
      name: el.tags?.name || 'Tundmatu koht',
      type: el.tags?.amenity || 'Tundmatu',
      lat: el.lat,
      lng: el.lon,
      address: getAddress(el.tags),
    }));

    // Salvesta cache'i
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data: places,
        timestamp: Date.now(),
        location: { lat, lng },
      })
    );

    return places;
  } catch (error) {
    console.error('API või cache viga:', error);
    return [];
  }
};

// Helper funktsioon vahemaa arvutamiseks kahe koordinaadi vahel meetrites
const getDistanceFromLatLonInMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; // Maakerra raadius meetrites
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};


const getAddress = (tags: any) => {
  const addressParts: string[] = [];
  if (tags['addr:street']) addressParts.push(tags['addr:street']);
  if (tags['addr:housenumber']) addressParts.push(tags['addr:housenumber']);
  return addressParts.join(', ') || 'Aadress puudub';
};

export const getUserLocation = async () => {
  try {
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    });
    return [position.coords.latitude, position.coords.longitude];
  } catch (error) {
    console.error('Geolocation error:', error);
    return null; 
  }
};

// Kohad, mida saab mujale importida
export const usePlaces = () => places;
