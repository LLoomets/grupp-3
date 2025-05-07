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
      <!-- Otsing -->
      <ion-searchbar v-model="searchQuery" placeholder="Otsi baari või klubi" debounce="300" clearInput></ion-searchbar>

      <div style="position: relative; height: 75vh; width: 100%;">
        <!-- Kaart -->
        <l-map style="height: 100%; width: 100%;" :zoom="13" :center="mapCenter">
          <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <l-marker v-for="(place, index) in filteredPlaces" :key="index" :lat-lng="[place.lat, place.lng]">
            <l-popup>
              <div style="display: flex; flex-direction: column; width: 200px; height: 75px;">
                <strong>{{ place.name }}</strong>
                <small>{{ place.type }}</small>
                <ion-button size="small" color="primary" @click="addToBucketlist(place)"
                  :disabled="isPlaceSaved(place)">
                  {{ isPlaceSaved(place) ? 'Salvestatud' : 'Lisa bucket listi' }}
                </ion-button>
              </div>
            </l-popup>
          </l-marker>

          <l-marker :lat-lng="userLocation" v-if="userLocation" :icon="userIcon">
            <l-popup>Sinu asukoht</l-popup>
          </l-marker>

          <l-circle v-if="userLocation" :lat-lng="userLocation" :radius="3000" color="hotpink" />
        </l-map>

        <!-- otsingu tulemused -->
        <ion-list v-if="searchQuery && filteredPlaces.length && showResults"
          style="position: absolute; top: 0; left: 0; width: 100%; z-index: 9999; max-height: 70%; overflow-y: auto;">
          <ion-item v-for="(place, index) in filteredPlaces" :key="'overlay-' + index" button @click="centerMap(place)">
            {{ place.name }}
            <ion-note slot="end">{{ place.type }}</ion-note>
          </ion-item>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonMenuButton, IonItem, IonList, IonNote, IonButton, onIonViewWillEnter, IonSearchbar
} from '@ionic/vue';

import { LMap, LTileLayer, LMarker, LPopup, LCircle } from '@vue-leaflet/vue-leaflet';
//import { Geolocation } from '@capacitor/geolocation';
import { ref, computed, watch } from 'vue';
import L from 'leaflet';

import { fetchPlaces, getUserLocation } from '../script/places';

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
const searchQuery = ref('');
const showResults = ref(true);

const centerMap = (place: any) => {
  mapCenter.value = [place.lat, place.lng];
  showResults.value = false;
  searchQuery.value = place.name;
};

watch(searchQuery, (newQuery) => {
  if (newQuery.trim().length > 0) {
    showResults.value = true;
  }
});

const filteredPlaces = computed(() => {
  const query = searchQuery.value.toLowerCase();
  if (!query) return places.value;
  return places.value.filter(place =>
    place.name.toLowerCase().includes(query)
  );
});

onIonViewWillEnter(async () => {
  const location = await getUserLocation();
  if (location) {
    const [lat, lng] = location;
    userLocation.value = [lat, lng];
    mapCenter.value = [lat, lng];

    // Hangi kohad places.ts kaudu
    places.value = await fetchPlaces(lat, lng);
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
