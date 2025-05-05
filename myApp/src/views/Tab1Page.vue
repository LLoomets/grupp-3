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

      <div v-if="latestCheckIns.length > 0">
        <h3>Viimased Check-in'id</h3>
        <ion-list>
          <ion-item
            v-for="(checkIn, index) in latestCheckIns"
            :key="index"
            button
            @click="goToProfile(checkIn)"
          >
            <ion-label>
              <h2>Check-in @ {{ checkIn.place?.name || 'Tundmatu koht' }}</h2>
              <p>{{ checkIn.visitDate }}</p>
              <img :src="checkIn.photo" alt="Check-in photo" style="width: 100px; height: 100px; object-fit: cover;" />
            </ion-label>
          </ion-item>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonSpinner, IonList, IonItem, IonLabel, onIonViewWillEnter } from '@ionic/vue';
import { ref, computed } from 'vue';
import { Geolocation } from '@capacitor/geolocation';
import { useRouter } from 'vue-router';

const router = useRouter();

const suggestedPlace = ref<any>(null);
const loading = ref(true);
const activityFeed = ref<any[]>([]);

// Arvutatud väärtus: 3 kõige uuemat check-in’i
const latestCheckIns = computed(() => {
  const sortedFeed = [...activityFeed.value].sort((a, b) => {
    return new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime();
  });
  return sortedFeed.slice(0, 3);
});

function goToProfile(checkIn: any) {
  // Edastame check-in'i andmed koos highlight väärtusega
  router.push({ path: '/tabs/tab5', query: { checkIn: JSON.stringify(checkIn), highlight: 'true' } });
}

onIonViewWillEnter(async () => {
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

    const knownPlaces = places.filter((p: any) => p.name !== 'Tundmatu koht');

    if (knownPlaces.length > 0) {
      const randomIndex = Math.floor(Math.random() * knownPlaces.length);
      suggestedPlace.value = knownPlaces[randomIndex];
    }

  } catch (error) {
    console.error('Soovitatud koha toomisel tekkis viga:', error);
  } finally {
    loading.value = false;
  }

  // Laeme activityFeed localStorage’ist
  const storedFeed = localStorage.getItem('activityFeed');
  if (storedFeed) {
    try {
      activityFeed.value = JSON.parse(storedFeed);
    } catch (error) {
      console.error('Vigane activityFeed JSON:', error);
    }
  }
});
</script>
