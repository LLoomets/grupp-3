<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Baarid ja Klubid</ion-title>
        <ion-buttons slot="end">
          <ion-menu-button />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <l-map style="height: 80vh; width: 100%;" :zoom="13" :center="mapCenter">
        <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <!-- Markerid baaridele ja klubidele -->
        <l-marker
          v-for="(place, index) in places"
          :key="index"
          :lat-lng="[place.lat, place.lng]"
        >
          <l-popup>
            <div style="display: flex; flex-direction: column; width: 200px; height: 75px;">
              <strong>{{ place.name }}</strong>
              <small>{{ place.type }}</small>
              <ion-button
                size="small"
                color="primary"
                @click="addToBucketlist(place)"
                :disabled="isPlaceSaved(place)"
              >
                {{ isPlaceSaved(place) ? 'Salvestatud' : 'Lisa bucket listi' }}
              </ion-button>
            </div>
          </l-popup>
        </l-marker>

        <!-- Kasutaja marker -->
        <l-marker :lat-lng="userLocation" v-if="userLocation" :icon="userIcon">
          <l-popup>Sinu asukoht</l-popup>
        </l-marker>

        <!-- Otsinguraadius -->
        <l-circle v-if="userLocation" :lat-lng="userLocation" :radius="3000" color="hotpink" />
      </l-map>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonMenuButton
} from '@ionic/vue';

import { LMap, LTileLayer, LMarker, LPopup, LCircle } from '@vue-leaflet/vue-leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { ref, onMounted } from 'vue';
import L from 'leaflet';

// Kohandatud punane marker
const userIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userLocation = ref<[number, number] | null>(null);
const mapCenter = ref<[number, number]>([59.437, 24.753]);
const places = ref<any[]>([]);

onMounted(async () => {
  try {
    const position = await Geolocation.getCurrentPosition();
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    userLocation.value = [lat, lng];
    mapCenter.value = [lat, lng];

    // Overpass API päring baaride ja klubide leidmiseks 3km raadiuses
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node[amenity~"bar|nightclub"](around:3000,${lat},${lng});out;`;

    const response = await fetch(overpassUrl);
    const data = await response.json();

    places.value = data.elements.map((el: any) => ({
      name: el.tags?.name || 'Tundmatu koht',
      type: el.tags?.amenity || 'Tundmatu',
      lat: el.lat,
      lng: el.lon,
    }));
  } catch (error) {
    console.error('Geolocation error:', error);
  }
});

const addToBucketlist = (place: any) => {
  const saved = JSON.parse(localStorage.getItem('bucketlist') || '[]');
  const alreadySaved = saved.some((p: any) => p.lat === place.lat && p.lng === place.lng);
  if (!alreadySaved) {
    saved.push(place);
    localStorage.setItem('bucketlist', JSON.stringify(saved));
  }
};

const isPlaceSaved = (place: any) => {
  const saved = JSON.parse(localStorage.getItem('bucketlist') || '[]');
  return saved.some((p: any) => p.lat === place.lat && p.lng === place.lng);
};

</script>
