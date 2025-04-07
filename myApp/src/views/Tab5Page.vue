<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Minu Statistika</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
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
            <h2>{{ wish.name }} - Bucket List</h2> <!-- Silt, et see on bucket listis -->
            <p>{{ wish.type }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/vue';

const visitedPlaces = [
  { name: 'Club Hollywood', visitDate: '2025-03-01' },
  { name: 'Põhjala Tap Room', visitDate: '2025-02-20' },
];

const wishList = [
  { name: 'Venus Club', type: 'Ööklubi' },
  { name: 'Möku', type: 'Baar' },
];
</script>
