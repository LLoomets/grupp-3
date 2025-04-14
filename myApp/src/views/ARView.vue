<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>AR Check-in</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ar-content">
      <div class="ar-container">
        <a-scene embedded arjs>
          <a-light type="directional" intensity="1" position="2 4 -3" target="#glass"></a-light>
          <a-light type="ambient" color="#fff" intensity="0.5"></a-light>

          <!-- Marker -->
          <a-marker preset="hiro">
            <!-- Glass bowl -->
            <a-entity geometry="primitive: cone; radiusBottom: 0.5; radiusTop: 0; height: 1"
              material="color: #e0ffff; opacity: 0.4; metalness: 0.5; roughness: 0.1" position="0 1 0"
              rotation="180 0 0">
            </a-entity>

            <!-- Liquid inside the glass -->
            <a-entity geometry="primitive: cone; radiusBottom: 0.3; radiusTop: 0; height: 0.6"
              material="color: #ff6347; reflectivity: 0.2" position="0 0.85 0" rotation="180 0 0">
            </a-entity>

            <!-- Glass stem -->
            <a-entity geometry="primitive: cylinder; radius: 0.1; height: 0.6"
              material="color: #e0ffff; opacity: 0.6; metalness: 0.6; roughness: 0.2" position="0 0.4 0">
            </a-entity>

            <!-- Glass base -->
            <a-entity geometry="primitive: cylinder; radius: 0.25; height: 0.1"
              material="color: #e0ffff; opacity: 0.6; metalness: 0.4; roughness: 0.4" position="0 0.05 0">
            </a-entity>
          </a-marker>

          <!-- Camera -->
          <a-entity camera></a-entity>
        </a-scene>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue'
</script>

<style scoped>
.ar-container {
  width: 100%;
  height: 90vh;
  position: relative;
  overflow: hidden;
}

.ar-content {
  --background: transparent;
}
</style>
