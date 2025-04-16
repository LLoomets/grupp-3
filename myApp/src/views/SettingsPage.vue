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
      <ion-button expand="block" @click="saveSettings" class="settings-save-button">
        Salvesta
      </ion-button>

      <ion-toast :is-open="toastOpen" :message="toastMessage" :duration="2000" position="bottom" color="primary"
        @didDismiss="toastOpen = false" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButtons, IonBackButton, IonButton, IonToast } from '@ionic/vue';
import { ref, onMounted } from 'vue';

const userName = ref('');
const toastOpen = ref(false);
const toastMessage = ref('');

onMounted(() => {
  userName.value = localStorage.getItem('userName') || '';
});

function saveSettings() {
  localStorage.setItem('userName', userName.value);

  toastMessage.value = 'Andmed on salvestatud!';
  toastOpen.value = true;
}
</script>