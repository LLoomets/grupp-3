<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Lisa</ion-title>
        <ion-buttons slot="end">
          <ion-menu-button />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <button @click="openCamera">Ava kaamera</button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton } from '@ionic/vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

const openCamera = async () => {
  try {
    const photo = await Camera.getPhoto({
      source: CameraSource.Camera,
      resultType: CameraResultType.Uri,
      quality: 90,
    })

    console.log('Foto URI:', photo.webPath)
  } catch (error) {
    console.error('Kaamera viga:', error)
  }
}

</script>