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
      <ion-select v-model="selectedPlace" placeholder="Vali koht" :disabled="manualEntryActive">
        <ion-select-option
          v-for="(place, index) in filteredPlaces"
          :key="index"
          :value="place"
        >
          {{ place.name }} - {{ place.type }}
        </ion-select-option>
      </ion-select>

      <!-- Või lisa uus koht käsitsi -->
      <ion-item lines="none">
        <ion-label>Ei leidnud sobivat? </ion-label>
        <ion-toggle v-model="manualEntryActive">Lisa koht käsitsi</ion-toggle>
      </ion-item>

      <div v-if="manualEntryActive" class="manual-entry">
        <ion-input v-model="manualPlaceName" placeholder="Koha nimi" />
        <ion-input v-model="manualPlaceType" placeholder="Tüüp (nt bar, nightclub)" />
      </div>

      <!-- Meeleolu, joogid ja märkmed -->
      <ion-input v-model="mood" placeholder="Kuidas tuju?" />
      <ion-input v-model="drinks" placeholder="Mis jooke jõid?" />
      <ion-textarea v-model="notes" placeholder="Lisa märkmeid"></ion-textarea>

      <!-- Salvesta check-in -->
      <ion-button @click="saveCheckIn" :disabled="!canSaveCheckIn">Salvesta Check-in</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonMenuButton, IonButton, IonInput, IonTextarea,
  IonSearchbar, IonLabel, IonSelect, IonSelectOption, IonItem, IonToggle,
  onIonViewWillEnter, alertController
} from '@ionic/vue';

import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Geolocation } from '@capacitor/geolocation';
import { useRouter, useRoute } from 'vue-router';
import { ref, watch, computed } from 'vue';

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
const filteredPlaces = ref<any[]>([]);
const selectedPlace = ref<any>(null);

// Käsitsi lisamine
const manualEntryActive = ref(false);
const manualPlaceName = ref('');
const manualPlaceType = ref('');

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
    } else {
      // Kui ei leitud automaatselt sobivat kohta, lisa käsitsi
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
    const position = await Geolocation.getCurrentPosition();
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    // Küsi ümbruskonna baarid ja klubid Overpass API kaudu
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node[amenity~"bar|nightclub"](around:3000,${lat},${lng});out;`;

    const response = await fetch(overpassUrl);
    const data = await response.json();

    // Salvesta kohtade andmed
    places.value = data.elements.map((el: any) => ({
      name: el.tags?.name || 'Tundmatu koht',
      type: el.tags?.amenity || 'Tundmatu',
      lat: el.lat,
      lng: el.lon,
    }));

    filteredPlaces.value = places.value;

    // Kontrolli, kas bucketlistist tuli automaatne valik
    preselectPlaceFromQuery();
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
const saveCheckIn = async () => {
  // Koht vastavalt valikule või käsitsi sisestusele
  const place = manualEntryActive.value
    ? {
        name: manualPlaceName.value.trim(),
        type: manualPlaceType.value.trim() || 'Määramata',
        lat: null,
        lng: null,
      }
    : selectedPlace.value;

  // Koosta check-in objekt
  const checkIn = {
    place,
    photo: photoUrl.value,
    mood: mood.value,
    drinks: drinks.value,
    notes: notes.value,
    visitDate: new Date().toLocaleString(),
  };

  // Salvesta localStorage'i
  let activityFeed = JSON.parse(localStorage.getItem('activityFeed') || '[]');
  activityFeed.push(checkIn);
  localStorage.setItem('activityFeed', JSON.stringify(activityFeed));

  // Kui check-in lõppes, uuenda bucket list
  if (selectedPlace.value) {
    const index = bucketItems.value.findIndex(
      (i) => i.name === selectedPlace.value.name && i.type === selectedPlace.value.type
    );
    if (index !== -1) {
      bucketItems.value.splice(index, 1); // Eemalda koht bucket listist
      localStorage.setItem('bucketlist', JSON.stringify(bucketItems.value)); // Uuenda 'localStorage'
    }
  }
  
  // Tühjenda väljad
  mood.value = '';
  drinks.value = '';
  notes.value = '';
  photoUrl.value = '';
  selectedPlace.value = null;
  manualPlaceName.value = '';
  manualPlaceType.value = '';
  manualEntryActive.value = false;

  // Näita kinnitust
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
