<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Check-in</ion-title>
        <ion-buttons slot="end">
          <ion-menu-button />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <ion-button @click="goToAR" class="ar-camera-button">Ava AR kaamera</ion-button>

      <!-- Otsing ja rippmenüü kohtade jaoks -->
      <div class="search-wrapper">
        <ion-searchbar v-model="searchQuery" debounce="300" placeholder="Otsi baare või klubisid"></ion-searchbar>

        <ion-list v-if="showResults && filteredPlaces.length && !manualEntryActive" class="search-results-list">
          <ion-item v-for="(place, index) in filteredPlaces" :key="'result-' + index" button
            @click="selectPlace(place)">
            {{ place.name }}
            <ion-note slot="end">{{ place.type }}</ion-note>
          </ion-item>
        </ion-list>
      </div>

      <!-- Või lisa uus koht käsitsi -->
      <ion-label>Ei leidnud sobivat? </ion-label>
      <ion-toggle v-model="manualEntryActive">Lisa koht käsitsi</ion-toggle>

      <div v-if="manualEntryActive" class="manual-entry">
        <ion-input v-model="manualPlaceName" placeholder="Koha nimi" />
        <ion-input v-model="manualPlaceType" placeholder="Tüüp (nt bar, nightclub)" />
      </div>

      <!-- Meeleolu, joogid ja märkmed -->
      <ion-input v-model="mood" placeholder="Kuidas tuju?" />
      <ion-input v-model="drinks" placeholder="Mis jooke jõid?" />
      <ion-textarea v-model="notes" placeholder="Lisa märkmeid"></ion-textarea>

      <ion-button @click="openCamera" class="camera-button">Tee pilti</ion-button>

      <!-- Salvesta check-in -->
      <ion-button class="save-button" @click="saveCheckIn" :disabled="!canSaveCheckIn">Salvesta Check-in</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonMenuButton, IonButton, IonInput, IonTextarea,
  IonSearchbar, IonLabel, IonItem, IonToggle,
  onIonViewWillEnter, alertController, IonList
} from '@ionic/vue';

import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Geolocation } from '@capacitor/geolocation';
import { useRouter, useRoute } from 'vue-router';
import { ref, computed, watch } from 'vue';

import { fetchPlaces } from '../script/places';

// Bucket list muudatused
const bucketItems = ref<any[]>(JSON.parse(localStorage.getItem('bucketlist') || '[]'));

// Ülejäänud muutujad
const router = useRouter();
const route = useRoute();

const mood = ref('');
const drinks = ref('');
const notes = ref('');
const photoUrl = ref('');

// Kohtade ja otsingu muutujad
const places = ref<any[]>([]);
const searchQuery = ref('');

const selectedPlace = ref<any>(null);
const showResults = ref(false);

// Käsitsi lisamine
const manualEntryActive = ref(false);
const manualPlaceName = ref('');
const manualPlaceType = ref('');

watch(searchQuery, (newQuery) => {
  showResults.value = !!newQuery.trim();
});

const selectPlace = (place: any) => {
  selectedPlace.value = place;
  searchQuery.value = place.name;
  showResults.value = false;
};

const filteredPlaces = computed(() => {
  const query = searchQuery.value.toLowerCase();
  if (!query) return places.value;
  return places.value.filter(place =>
    place.name.toLowerCase().includes(query) ||
    place.type.toLowerCase().includes(query)
  );
});


// Kaamera avamine
const openCamera = async () => {
  try {
    const photo = await Camera.getPhoto({
      source: CameraSource.Camera,
      resultType: CameraResultType.Base64,
      quality: 90,
      saveToGallery: true,
    });

    const fileName = `photo_${Date.now()}.jpeg`;

    // Salvestame seadmesse
    await Filesystem.writeFile({
      path: fileName,
      data: photo.base64String!,
      directory: Directory.Data,
    });

    const fileUri = await Filesystem.getUri({
      path: fileName,
      directory: Directory.Data,
    });

    const webPath = Capacitor.convertFileSrc(fileUri.uri);
    photoUrl.value = webPath;

    // 🔄 Salvesta viide localStorage'i
    localStorage.setItem('lastPhotoUrl', webPath);
  } catch (error) {
    console.error('Kaamera või salvestamise viga:', error);
  }
};

// AR vaate avamine
const goToAR = () => {
  router.push('/ar-view');
};

// Kui valiti koht bucketlistist
const preselectPlaceFromQuery = () => {
  const name = route.query.name as string;
  const type = route.query.type as string;

  if (name && type) {
    const match = places.value.find(
      (p) => p.name === name && p.type === type
    );
    if (match) {
      selectedPlace.value = match;
      searchQuery.value = match.name;
    } else {
      // Kui ei leitud sobivat kohta, siis lisa käsitsi
      manualEntryActive.value = true;
      manualPlaceName.value = name;
      manualPlaceType.value = type;
    }
  }
};

// Kohtade laadimine vaate avamisel
onIonViewWillEnter(async () => {
  try {
    // Hangi asukoht
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    });
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    // Lae kohad
    places.value = await fetchPlaces(lat, lng);

    // Kontrolli bucketlisti valikut
    preselectPlaceFromQuery();

    const savedPhotoUrl = localStorage.getItem('lastPhotoUrl');
    if (savedPhotoUrl) {
      photoUrl.value = savedPhotoUrl;
    }

  } catch (error) {
    console.error('Geolocation või API viga:', error);
  }
});


// Salvesta check-in
const saveCheckIn = async () => {
  const place = manualEntryActive.value
    ? {
      name: manualPlaceName.value.trim(),
      type: manualPlaceType.value.trim() || 'Määramata',
      lat: null,
      lng: null,
    }
    : selectedPlace.value;

  const checkIn = {
    place,
    photo: photoUrl.value,
    mood: mood.value,
    drinks: drinks.value,
    notes: notes.value,
    visitDate: new Date().toLocaleString(),
  };

  const activityFeed = JSON.parse(localStorage.getItem('activityFeed') || '[]');
  activityFeed.push(checkIn);
  localStorage.setItem('activityFeed', JSON.stringify(activityFeed));

  // Uuenda bucketlisti
  if (selectedPlace.value) {
    const index = bucketItems.value.findIndex(
      (i) => i.name === selectedPlace.value.name && i.type === selectedPlace.value.type
    );
    if (index !== -1) {
      bucketItems.value.splice(index, 1);
      localStorage.setItem('bucketlist', JSON.stringify(bucketItems.value));
    }
  }

  // Tühjenda väljad
  mood.value = '';
  drinks.value = '';
  notes.value = '';
  photoUrl.value = '';
  localStorage.removeItem('lastPhotoUrl');
  selectedPlace.value = null;
  manualPlaceName.value = '';
  manualPlaceType.value = '';
  manualEntryActive.value = false;

  await showAlert();
};

// Nupp "Salvesta" on aktiivne ainult kui koht on valitud või käsitsi sisestatud nimi on olemas
const canSaveCheckIn = computed(() => {
  return manualEntryActive.value
    ? manualPlaceName.value.trim().length > 0
    : selectedPlace.value !== null;
});

// Kuvab kinnitusakna
const showAlert = async () => {
  const alert = await alertController.create({
    header: 'Check-in salvestatud',
    message: 'Sinu külastus on lisatud sinu profiili alla.',
    buttons: ['OK'],
  });
  await alert.present();
};
</script>

<style>
.search-wrapper {
  position: relative;
}

.search-results-list {
  position: absolute;
  top: 48px;
  left: 0;
  right: 0;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #000000;
  border-radius: 4px;
}
</style>