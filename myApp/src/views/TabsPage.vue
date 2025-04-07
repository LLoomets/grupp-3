<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/tab1">
          <ion-icon aria-hidden="true" :icon="homeOutline" />
          <ion-label>Kodu</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="explore" href="/tabs/tab2">
          <ion-icon aria-hidden="true" :icon="compassOutline" />
          <ion-label>Avasta</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="add" href="/tabs/tab3">
          <ion-icon aria-hidden="true" :icon="addCircleOutline" />
        </ion-tab-button>

        <ion-tab-button tab="bucket-list" href="/tabs/tab4">
          <ion-icon aria-hidden="true" :icon="wineSharp" />
          <ion-label>Bucket list</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/tabs/tab5">
          <ion-icon aria-hidden="true" :icon="personCircleOutline" />
          <ion-label>Profiil</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { wineSharp, personCircleOutline, homeOutline, addCircleOutline, compassOutline } from 'ionicons/icons';
</script>
