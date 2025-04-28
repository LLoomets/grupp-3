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
      <!-- Email input field -->
      <ion-item>
        <ion-label position="stacked">Email</ion-label>
        <ion-input v-model="userEmail" placeholder="Sisesta email" />
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
const userEmail = ref('');
const toastOpen = ref(false);
const toastMessage = ref('');

onMounted(() => {
  userName.value = localStorage.getItem('userName') || '';
  userEmail.value = localStorage.getItem('userEmail') || '';
});

async function saveSettings() {
  // save locally
  localStorage.setItem('userName', userName.value);
  localStorage.setItem('userEmail', userEmail.value);

  // post to server
  try {
    const response = await fetch('https://reqres.in/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'reqres-free-v1',
      },
      body: JSON.stringify({
        name: userName.value,
        email: userEmail.value 
      })
    });

    if (!response.ok) {
      throw new Error('Serveri viga');
    }

    const data = await response.json();
    console.log('Serveri vastus:', data);
    toastMessage.value = 'Andmed on salvestatud!';
  } catch (error) {
    console.error('Andmete saatmine ebaõnnestus:', error);
    toastMessage.value = 'Andmete saatmine ebaõnnestus!';
  }

  toastOpen.value = true;
}
</script>