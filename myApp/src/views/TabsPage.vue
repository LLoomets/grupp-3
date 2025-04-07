<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/tab1">
          <ion-icon aria-hidden="true" :icon="triangle" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="bars" href="/tabs/tab2">
          <ion-icon aria-hidden="true" :icon="ellipse" />
          <ion-label>Bars & Clubs</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/tabs/tab3">
          <ion-icon aria-hidden="true" :icon="square" />
          <ion-label>Profile</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { ellipse, square, triangle } from 'ionicons/icons';
</script>
