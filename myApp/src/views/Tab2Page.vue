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
      <l-map
        style="height: 80vh; width: 100%;"
        :zoom="13"
        :center="mapCenter"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <!-- Markerid baaridele ja klubidele -->
        <l-marker
          v-for="(place, index) in places"
          :key="index"
          :lat-lng="[place.lat, place.lng]"
        >
          <l-popup>{{ place.name }} - {{ place.type }}</l-popup>
        </l-marker>

        <!-- Kasutaja marker -->
        <l-marker :lat-lng="userLocation" v-if="userLocation">
          <l-popup>Sinu asukoht</l-popup>
        </l-marker>

        <!-- Otsinguraadius -->
        <l-circle
          v-if="userLocation"
          :lat-lng="userLocation"
          :radius="5000"
          color="hotpink"
        />
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


import { ref, onMounted } from 'vue';

const userLocation = ref<[number, number] | null>(null);
const mapCenter = ref<[number, number]>([59.437, 24.753]);
const places = ref<any[]>([]);

onMounted(async () => {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    userLocation.value = [lat, lng];
    mapCenter.value = [lat, lng];

    // Overpass API päring baaride ja klubide leidmiseks 5km raadiuses
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node[amenity~"bar|nightclub"](around:3000,${lat},${lng});out;`;

    const response = await fetch(overpassUrl);
    const data = await response.json();

    places.value = data.elements.map((el: any) => ({
      name: el.tags?.name || 'Tundmatu koht',
      type: el.tags?.amenity || 'Tundmatu',
      lat: el.lat,
      lng: el.lon,
    }));
  });
});
</script>
