<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Bucket List</ion-title>
        <ion-buttons slot="end">
          <ion-menu-button />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list v-if="bucketItems.length > 0">
        <ion-item v-for="(item, index) in bucketItems" :key="index">
          <ion-label>
            <h2>{{ item.name }}</h2>
            <p>{{ item.type }}</p>
          </ion-label>
          <ion-button fill="clear" @click="removeItem(index)">❌</ion-button>
        </ion-item>
      </ion-list>

      <div v-else class="empty-message">
        <p>Ühtegi salvestatud kohta pole veel! Lisa neid kaardilt 🌍</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonButtons, IonMenuButton, IonButton
} from '@ionic/vue';
import { ref, onMounted } from 'vue';

const bucketItems = ref<any[]>([]);

// Lae bucket list 'localStorage'ist
const loadBucketList = () => {
  const stored = localStorage.getItem('bucketlist');
  if (stored) {
    bucketItems.value = JSON.parse(stored);
  }
};

// Eemalda item bucket listist ja uuenda 'localStorage'it
const removeItem = (index: number) => {
  bucketItems.value.splice(index, 1);
  localStorage.setItem('bucketlist', JSON.stringify(bucketItems.value));
};

// Lae bucket list, kui komponent on montaažitud
onMounted(() => {
  loadBucketList();
});
</script>

<style scoped>
.empty-message {
  text-align: center;
  margin-top: 2rem;
  color: #666;
}
</style>
