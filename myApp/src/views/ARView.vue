<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>AR Check-in</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content class="ar-content">
        <div class="ar-container">
          <a-scene
            embedded
            arjs="sourceType: webcam; debugUIEnabled: false;"
            vr-mode-ui="enabled: false"
            renderer="logarithmicDepthBuffer: true;"
          >
            <!-- 3D efekt: baariklaas või trofee -->
            <a-entity
              geometry="primitive: cone; radiusBottom: 0.4; radiusTop: 0.1; height: 1"
              material="color: gold;"
              position="0 0.5 0"
              animation="property: rotation; to: 0 360 0; loop: true; dur: 4000"
            ></a-entity>
  
            <a-light type="directional" intensity="1" position="0 2 1"></a-light>
            <a-camera-static />
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
  