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
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonButton } from '@ionic/vue';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { useRouter } from 'vue-router'

const router = useRouter()

const openCamera = async () => {
  try {
    // Detect platform (android / ios / web)
    const platform = Capacitor.getPlatform()

    // iOS: save to gallery
    if (platform === 'ios') {
      const photo = await Camera.getPhoto({
        source: CameraSource.Camera,
        resultType: CameraResultType.Uri,
        quality: 90,
        saveToGallery: true,
      })

      console.log('iOS: pilt salvestati galeriisse, URI:', photo.webPath)

     
    } else {  // Android: save to filesystem
      const photo = await Camera.getPhoto({
        source: CameraSource.Camera,
        resultType: CameraResultType.Base64, // vajalik failisüsteemi salvestamiseks
        quality: 90,
      })

      const fileName = `photo_${Date.now()}.jpeg`

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: photo.base64String!,
        directory: Directory.Documents, // show in gallery
      })

      console.log('Android: pilt salvestatud:', savedFile.uri)
    }
  } catch (error) {
    console.error('Kaamera viga:', error)
  }
}

const goToAR = () => {
  router.push('/ar-view')
}

</script>