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
          <!-- Check-in nupp viib tab 3-le -->
          <ion-button fill="clear" @click="goToTab3(item)">Check-in</ion-button>
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
  IonList, IonItem, IonLabel, IonButtons, IonMenuButton, IonButton, onIonViewWillEnter
} from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Vue Routeri importimine

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

// Liikumine tab 3-le, kui check-in nuppule vajutatakse ja eemaldatakse bucketlistist
const router = useRouter();
const goToTab3 = (item: any) => {
  // Leia indeksi alusel ja eemalda bucketlistist
  const index = bucketItems.value.findIndex(
    (i) => i.name === item.name && i.type === item.type
  );
  if (index !== -1) {
    bucketItems.value.splice(index, 1);
    localStorage.setItem('bucketlist', JSON.stringify(bucketItems.value));
  }

  // Seejärel suuna tab3-le
  router.push({ path: '/tabs/tab3', query: { name: item.name, type: item.type } });
};


// Lae bucket list, kui komponent on montaažitud
onIonViewWillEnter(() => {
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
