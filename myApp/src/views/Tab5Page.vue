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
      <h2>Tere, {{ userName || 'külaline' }}!</h2>

      <ion-list>
        <ion-item 
          v-for="(checkIn, index) in activityFeed" 
          :key="index" 
          :class="[
            highlightedCheckIn && highlightedCheckIn.place?.name === checkIn.place?.name ? 'highlighted' : '',
            temporaryHighlight && temporaryHighlight.place?.name === checkIn.place?.name ? 'highlight-bg' : ''
          ]"
        >
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
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  IonMenuButton,
  onIonViewWillEnter
} from '@ionic/vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const userName = ref('');
const activityFeed = ref<any[]>([]);
const highlightedCheckIn = ref<any>(null);
const temporaryHighlight = ref<any>(null);

const route = useRoute();

onIonViewWillEnter(() => {
  const checkInParam = route.query.checkIn ? JSON.parse(route.query.checkIn as string) : null;
  if (checkInParam) {
    highlightedCheckIn.value = checkInParam;
    temporaryHighlight.value = checkInParam;

    setTimeout(() => {
      temporaryHighlight.value = null;
    }, 1000);
  }
});

onIonViewWillEnter(() => {
  userName.value = localStorage.getItem('userName') || '';
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

<style scoped>
.highlighted {
  border-left: 5px solid hotpink;
}

/* Terve ion-item highlight */
.highlight-bg::part(native) {
  background-color: hotpink !important;
  transition: background-color 0.3s ease;
}
</style>
