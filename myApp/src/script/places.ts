import { ref } from 'vue';
import { Geolocation } from '@capacitor/geolocation';

const places = ref<any[]>([]);

export const fetchPlaces = async (lat: number, lng: number) => {
  try {
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node[amenity~"bar|nightclub"](around:3000,${lat},${lng});out;`;
    const response = await fetch(overpassUrl);
    const data = await response.json();

    return data.elements.map((el: any) => ({
      name: el.tags?.name || 'Tundmatu koht',
      type: el.tags?.amenity || 'Tundmatu',
      lat: el.lat,
      lng: el.lon,
      address: getAddress(el.tags) 
    }));
  } catch (error) {
    console.error('API päringu viga:', error);
    return [];
  }
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
