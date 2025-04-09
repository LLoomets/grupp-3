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
      <button @click="openCamera" class="camera-button">Ava kaamera - tavaline foto</button>
      <ion-button expand="block" color="tertiary" @click="goToAR">
        Ava AR kaamera
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton } from '@ionic/vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { useRouter } from 'vue-router'

const router = useRouter()

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

const goToAR = () => {
  router.push('/ar-view')
}

</script>