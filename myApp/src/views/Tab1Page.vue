<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <div style="display: flex; align-items: center;">
            <img src="/logo.png" alt="Logo" style="height: 50px; margin-right: 10px;" />
            <span>KlubiKompass</span>
          </div>
        </ion-title>
        <ion-buttons slot="end">
          <ion-menu-button />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h2>Tere tulemast!</h2>
      <p>Siin saad avastada erinevaid baare ja klubisid.</p>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton } from '@ionic/vue';
</script>
