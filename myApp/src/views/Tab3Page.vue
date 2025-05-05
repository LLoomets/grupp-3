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
      <!-- Ava kaamera - tavaline foto -->
      <ion-button @click="openCamera" class="camera-button">Ava kaamera - tavaline foto</ion-button>
      <!-- Ava AR kaamera -->
      <ion-button @click="goToAR" class="ar-camera-button">Ava AR kaamera</ion-button>

      <!-- Otsing ja rippmenüü kohtade jaoks -->
      <ion-searchbar
        v-model="searchQuery"
        debounce="300"
        placeholder="Otsi baare või klubisid"
      ></ion-searchbar>

      <ion-label>Vali koht check-in'iks:</ion-label>
      <ion-select v-model="selectedPlace" placeholder="Vali koht">
        <ion-select-option
          v-for="(place, index) in filteredPlaces"
          :key="index"
          :value="place"
        >
          {{ place.name }} - {{ place.type }}
        </ion-select-option>
      </ion-select>

      <!-- Meeleolu, joogid ja märkmed -->
      <ion-input v-model="mood" placeholder="Lisa tuju" />
      <ion-input v-model="drinks" placeholder="Mis joogid olid?" />
      <ion-textarea v-model="notes" placeholder="Lisa märkmed"></ion-textarea>

      <!-- Salvesta check-in -->
      <ion-button @click="saveCheckIn" :disabled="!selectedPlace">Salvesta Check-in</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonMenuButton, IonButton, IonInput, IonTextarea,
  IonSearchbar, IonLabel, IonSelect, IonSelectOption
} from '@ionic/vue';

import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Geolocation } from '@capacitor/geolocation';
import { useRouter } from 'vue-router';
import { ref, onMounted, watch } from 'vue';

const router = useRouter();

const mood = ref('');
const drinks = ref('');
const notes = ref('');
const photoUrl = ref('');

// Kohtade ja otsingu muutujad
const places = ref<any[]>([]);
const searchQuery = ref('');
const filteredPlaces = ref<any[]>([]);
const selectedPlace = ref<any>(null);

// Kaamera avamine
const openCamera = async () => {
  try {
    const platform = Capacitor.getPlatform();

    if (platform === 'ios') {
      const photo = await Camera.getPhoto({
        source: CameraSource.Camera,
        resultType: CameraResultType.Uri,
        quality: 90,
        saveToGallery: true,
      });
      photoUrl.value = photo.webPath || '';
    } else {
      const photo = await Camera.getPhoto({
        source: CameraSource.Camera,
        resultType: CameraResultType.Base64,
        quality: 90,
      });
      const fileName = `photo_${Date.now()}.jpeg`;
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: photo.base64String!,
        directory: Directory.Documents,
      });
      photoUrl.value = savedFile.uri;
    }
  } catch (error) {
    console.error('Kaamera viga:', error);
  }
};

// AR vaate avamine
const goToAR = () => {
  router.push('/ar-view');
};

// Kohtade laadimine
onMounted(async () => {
  try {
    const position = await Geolocation.getCurrentPosition();
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node[amenity~"bar|nightclub"](around:3000,${lat},${lng});out;`;

    const response = await fetch(overpassUrl);
    const data = await response.json();

    places.value = data.elements.map((el: any) => ({
      name: el.tags?.name || 'Tundmatu koht',
      type: el.tags?.amenity || 'Tundmatu',
      lat: el.lat,
      lng: el.lon,
    }));

    filteredPlaces.value = places.value;
  } catch (error) {
    console.error('Geolocation või API viga:', error);
  }
});

// Otsingu jälgimine
watch(searchQuery, (newQuery) => {
  const query = newQuery.toLowerCase();
  filteredPlaces.value = places.value.filter(place =>
    place.name.toLowerCase().includes(query) ||
    place.type.toLowerCase().includes(query)
  );
});

// Salvesta check-in
const saveCheckIn = () => {
  const checkIn = {
    place: selectedPlace.value,
    photo: photoUrl.value,
    mood: mood.value,
    drinks: drinks.value,
    notes: notes.value,
    visitDate: new Date().toLocaleString(),
  };

  let activityFeed = JSON.parse(localStorage.getItem('activityFeed') || '[]');
  activityFeed.push(checkIn);
  localStorage.setItem('activityFeed', JSON.stringify(activityFeed));

  // Tühjenda väljad
  mood.value = '';
  drinks.value = '';
  notes.value = '';
  photoUrl.value = '';
  selectedPlace.value = null;
};
</script>
