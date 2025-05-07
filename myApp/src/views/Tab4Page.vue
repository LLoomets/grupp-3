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
          <!-- Kontrollige, kas check-in on pooleli, et muuta nupp -->
          <ion-button 
            fill="clear" 
            @click="goToTab3(item, index)">
            {{ item.isCheckingIn ? 'Check-in pooleli' : 'Check-in' }}
          </ion-button>
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

// Liikumine tab 3-le, kui check-in nuppule vajutatakse
const router = useRouter();
const goToTab3 = (item: any, index: number) => {
  // Kontrollige, kas item sisaldab kõiki vajalikke andmeid
  console.log('Valitud koht bucket listist: ', item);

  // Kui check-in ei ole pooleli, siis märgi see pooleli ja suuna tab3-le
  if (!item.isCheckingIn) {
    bucketItems.value[index].isCheckingIn = true;
    localStorage.setItem('bucketlist', JSON.stringify(bucketItems.value));
  }

  // Suunda tab3-le, edastades valitud koha andmed query kaudu
  router.push({
    path: '/tabs/tab3',
    query: { name: item.name, type: item.type }
  });
};

// Lae bucket list, kui komponent on montaažitud
onIonViewWillEnter(() => {
  loadBucketList();
});

// Kui check-in on salvestatud, uuenda bucket listi ja eemalda see koht
const saveCheckIn = (item: any, index: number) => {
  bucketItems.value.splice(index, 1);
  localStorage.setItem('bucketlist', JSON.stringify(bucketItems.value));
};
</script>

<style scoped>
.empty-message {
  text-align: center;
  margin-top: 2rem;
  color: #666;
}
</style>
