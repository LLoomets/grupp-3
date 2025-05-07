<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <div style="display: flex; align-items: center;">
            <img src="/logo.png" alt="Logo" style="height: 50px; margin-right: 10px;" />
            <span class="logo-text">KlubiKompass</span>
          </div>
        </ion-title>
        <ion-buttons slot="end">
          <ion-menu-button />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Päeva tarkus kast -->
      <ion-grid>
        <ion-row>
          <ion-col size="12">
            <ion-card class="stat-card dark-card">
              <ion-card-header>
                <ion-card-title class="stats-title">🍻 Päeva tarkus</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <p class="large-text">{{ todayQuote }}</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>

        <ion-row v-if="suggestedPlace" style="margin-top: 10px;">
          <ion-col size="12">
            <ion-card class="stat-card dark-card">
              <ion-card-header>
                <ion-card-title class="stats-title">✨ Soovitatud koht</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <p class="large-text"><strong>{{ suggestedPlace.name }}</strong> – {{ suggestedPlace.type }}</p>
                <p class="large-text" v-if="suggestedPlace.address">📍 {{ suggestedPlace.address }}</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <div v-if="loading" style="margin-top: 20px;">
        <ion-spinner name="dots"></ion-spinner>
      </div>


      <!-- Viimased külastused -->
      <div v-if="latestCheckIns.length > 0" style="margin-top: 40px;">
        <h3>Viimased külastused</h3>
        <ion-list lines="none">
          <ion-item
            v-for="(checkIn, index) in latestCheckIns"
            :key="index"
            button
            @click="goToProfile(checkIn)"
          >
            <ion-label class="checkin-label">
              <div class="checkin-text-with-button">
                <div>
                  <h3 class="checkin-title">Check-in @ {{ checkIn.place?.name || 'Tundmatu koht' }}</h3>
                  <p v-if="checkIn.visitDate"><strong>Kuupäev:</strong> {{ checkIn.visitDate }}</p>
                  <p v-if="checkIn.mood"><strong>Tuju:</strong> {{ checkIn.mood }}</p>
                  <p v-if="checkIn.drinks"><strong>Joogid:</strong> {{ checkIn.drinks }}</p>
                  <p v-if="checkIn.notes"><strong>Märkmed:</strong> {{ checkIn.notes }}</p>
                </div>
              </div>
              <img
                v-if="checkIn.photo"
                :src="checkIn.photo"
                alt="Check-in photo"
                class="checkin-photo"
              />
            </ion-label>
          </ion-item>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonSpinner,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  onIonViewWillEnter
} from '@ionic/vue';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { fetchPlaces, getUserLocation } from '../script/places';
import { quotes } from '../data/quotes'; // Import quotes

const places = ref<any[]>([]);
const suggestedPlace = ref<any>(null);
const loading = ref(true);
const activityFeed = ref<any[]>([]);
const todayQuote = ref<string>('');
const router = useRouter();

// Arvutatud väärtus: 3 kõige uuemat check-in’i
const latestCheckIns = computed(() => {
  const sortedFeed = [...activityFeed.value].sort((a, b) => {
    return new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime();
  });
  return sortedFeed.slice(0, 3);
});

function goToProfile(checkIn: any) {
  router.push({ path: '/tabs/tab5', query: { checkIn: JSON.stringify(checkIn), highlight: 'true' } });
}

// Juhuslik tsitaadi valimine
function getQuoteOfTheDay() {
  const today = new Date();
  const dayIndex = today.getFullYear() * 365 + today.getMonth() * 31 + today.getDate(); // piisavalt varieeruv
  const quoteIndex = dayIndex % quotes.length;
  todayQuote.value = quotes[quoteIndex];
}


onIonViewWillEnter(async () => {
  try {
    const location = await getUserLocation();
    if (location) {
      const [lat, lng] = location;
      places.value = await fetchPlaces(lat, lng);

      const knownPlaces = places.value.filter((p: any) => p.name !== 'Tundmatu koht');

      if (knownPlaces.length > 0) {
        const randomIndex = Math.floor(Math.random() * knownPlaces.length);
        suggestedPlace.value = knownPlaces[randomIndex];
      }
    }
  } catch (error) {
    console.error('Kohtade laadimisel tekkis viga:', error);
  } finally {
    loading.value = false;
  }

  // Laeme activityFeed localStorage’ist
  const storedFeed = localStorage.getItem('activityFeed');
  if (storedFeed) {
    try {
      activityFeed.value = JSON.parse(storedFeed);
    } catch (error) {
      console.error('Vigane activityFeed JSON:', error);
    }
  }

  // Juhusliku tsitaadi valimine
  getQuoteOfTheDay();
});
</script>

<style scoped>
.checkin-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--ion-color-primary);
}

.checkin-text-with-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.checkin-photo {
  width: 100%;
  height: auto;
  max-height: 300px;
  margin-top: 10px;
  border-radius: 12px;
  object-fit: cover;
}

.stat-card {
  margin: 4px 0;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #1e1e1e;
  color: #ffffff;
}

.stats-title {
  font-size: 1.4rem;
  font-weight: bold;
}

.dark-card {
  --background: #1e1e1e;
  --color: #ffffff;
}

.large-text {
  font-size: 1.1rem; /* Suurendab teksti suurust */
  line-height: 1.6;
}
</style>
