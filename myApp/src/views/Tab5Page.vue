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
      <!-- Kuvame kasutaja nime -->
      <h2>Tere, {{ userName || 'külaline' }}!</h2>

      <!-- Külastatud kohad -->
      <ion-list>
        <ion-item v-for="(checkIn, index) in activityFeed" :key="index">
          <ion-label>
            <h2>Check-in @ {{ checkIn.place?.name || 'Tundmatu koht' }} - {{ checkIn.visitDate }}</h2>
            <p>tuju: {{ checkIn.mood }}</p>
            <p>joogid: {{ checkIn.drinks }}</p>
            <p>märkmed: {{ checkIn.notes }}</p>
            <img :src="checkIn.photo" alt="Check-in photo" style="width: 100px; height: 100px; object-fit: cover;" />
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButtons, IonMenuButton } from '@ionic/vue';
import { ref, watch } from 'vue';
import { onIonViewWillEnter } from '@ionic/vue';

const userName = ref('');
const activityFeed = ref<any[]>([]);

onIonViewWillEnter(() => {
  // Laeme kasutaja nime localStorage-st
  userName.value = localStorage.getItem('userName') || '';

  // Laeme salvestatud activity feed
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
