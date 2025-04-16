<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <!-- Back button added here -->
          <ion-buttons slot="start">
            <ion-back-button default-href="/tabs/tab1" />
          </ion-buttons>
          <ion-title>Isiklikud sätted</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content class="ion-padding">
        <!-- Name input field -->
        <ion-item>
          <ion-label position="stacked">Sinu nimi</ion-label>
          <ion-input v-model="userName" placeholder="Sisesta nimi" />
        </ion-item>
  
        <!-- Save Button -->
        <ion-button expand="full" @click="saveSettings">
          Salvesta
        </ion-button>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButtons, IonBackButton, IonButton } from '@ionic/vue';
  import { ref, onMounted } from 'vue';
  
  const userName = ref('');
  
  // On mounted, fetch the user's name from localStorage
  onMounted(() => {
    userName.value = localStorage.getItem('userName') || '';
  });
  
  // Save settings to localStorage
  function saveSettings() {
    localStorage.setItem('userName', userName.value);
  }
  </script>
  