<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <div style="display: flex; align-items: center;">
            <img src="/logo.png" alt="Logo" style="height: 50px; margin-right: 10px;" />
            <span class="logo-text">KlubiKompass</span>
          </div>
        </ion-title>
        <ion-buttons slot="end">
          <ion-menu-button />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h2>Tere tulemast!</h2>
      <p>Siin saad avastada erinevaid baare ja klubisid.</p>

      <div v-if="loading" style="margin-top: 20px;">
        <ion-spinner name="dots"></ion-spinner>
      </div>

      <div v-else-if="suggestedPlace" style="margin-top: 20px;">
        <h3>✨ Soovitatud koht</h3>
        <p><strong>{{ suggestedPlace.name }}</strong> – {{ suggestedPlace.type }}</p>
        <p v-if="suggestedPlace.address">📍 {{ suggestedPlace.address }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonButtons, IonMenuButton, IonSpinner
} from '@ionic/vue';

import { ref, onMounted } from 'vue';
import { Geolocation } from '@capacitor/geolocation';

const suggestedPlace = ref<any>(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const position = await Geolocation.getCurrentPosition();
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node[amenity~"bar|nightclub"](around:3000,${lat},${lng});out;`;

    const response = await fetch(overpassUrl);
    const data = await response.json();

    const places = data.elements.map((el: any) => {
      const tags = el.tags || {};
      const addressParts = [];

      if (tags['addr:street']) addressParts.push(tags['addr:street']);
      if (tags['addr:housenumber']) addressParts.push(tags['addr:housenumber']);
      if (tags['addr:city']) addressParts.push(tags['addr:city']);

      const address = addressParts.join(', ');

      return {
        name: tags.name || 'Tundmatu koht',
        type: tags.amenity || 'Tundmatu',
        address: address || 'Aadress puudub',
        lat: el.lat,
        lng: el.lon,
      };
    });

    const knownPlaces = places.filter((p:any) => p.name !== 'Tundmatu koht');

    if (knownPlaces.length > 0) {
      const randomIndex = Math.floor(Math.random() * knownPlaces.length);
      suggestedPlace.value = knownPlaces[randomIndex];
    }

  } catch (error) {
    console.error('Soovitatud koha toomisel tekkis viga:', error);
  } finally {
    loading.value = false;
  }
});

</script>
