<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Baarid ja Klubid</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item v-for="(place, index) in places" :key="index">
          <ion-label>
            <h2>{{ place.name }}</h2>
            <p>{{ place.type }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/vue';

const places = [
  { name: 'Club Hollywood', type: 'Ööklubi' },
  { name: 'Põhjala Tap Room', type: 'Baar' },
  { name: 'Venus Club', type: 'Ööklubi' },
  { name: 'Möku', type: 'Baar' },
  { name: 'Nimeta', type: 'Baar' },
  { name: 'HALL', type: 'Ööklubi' },
];
</script>
