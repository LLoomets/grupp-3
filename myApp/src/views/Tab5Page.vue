<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Minu Statistika</ion-title>
        <ion-buttons slot="end">
          <ion-menu-button />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Display user name -->
      <h2>Tere, {{ userName || 'külaline' }}!</h2>

      <!-- Külastatud kohad -->
      <ion-list>
        <ion-item v-for="(place, index) in visitedPlaces" :key="index">
          <ion-label>
            <h2>{{ place.name }}</h2>
            <p>{{ place.visitDate }}</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <!-- Bucket List kohad -->
      <ion-list>
        <ion-item v-for="(wish, index) in wishList" :key="index">
          <ion-label>
            <h2>{{ wish.name }} - Bucket List</h2>
            <p>{{ wish.type }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButtons, IonMenuButton } from '@ionic/vue';
import { ref, onMounted, watch } from 'vue';

// User name stored locally
const userName = ref('');

// Data for visited places and wish list
const visitedPlaces = [
  { name: 'Club Hollywood', visitDate: '2025-03-01' },
  { name: 'Põhjala Tap Room', visitDate: '2025-02-20' },
];

const wishList = [
  { name: 'Venus Club', type: 'Ööklubi' },
  { name: 'Möku', type: 'Baar' },
];

onMounted(() => {
  // Fetch the user's name from localStorage
  userName.value = localStorage.getItem('userName') || '';
});

// Watch for changes in localStorage to update the userName when returning to this page
watch(() => localStorage.getItem('userName'), (newValue) => {
  userName.value = newValue || '';
});
</script>
