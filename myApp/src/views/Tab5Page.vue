<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>KlubiKompassi aruanne</ion-title>
        <ion-buttons slot="end">
          <ion-menu-button />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="welcome-text">
        <h2>Tere, <span class="username">{{ userName || 'külaline' }}</span>!</h2>
      </div>

      <!-- Statistika kaardid -->
      <ion-grid>
        <ion-row>
          <ion-col size="12">
            <ion-card class="stat-card dark-card">
              <ion-card-header>
                <ion-card-title class="stats-title">Kokku külastusi</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <h1>{{ totalCheckIns }}</h1>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col size="12">
            <ion-card class="stat-card dark-card">
              <ion-card-header>
                <ion-card-title class="stats-title">Top 3 kõige rohkem külastatud</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ul class="top-places">
                  <li v-for="(entry, index) in placeFrequency" :key="index">
                    {{ entry[0] }} – {{ entry[1] }}x
                  </li>
                </ul>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Check-in logi -->
      <ion-list lines="none">
        <ion-item 
          v-for="(checkIn, index) in activityFeed" 
          :key="index" 
          :class="[
            highlightedCheckIn && highlightedCheckIn.place?.name === checkIn.place?.name ? 'highlighted' : '',
            temporaryHighlight && temporaryHighlight.place?.name === checkIn.place?.name ? 'highlight-bg' : ''
          ]"
          style="margin-bottom: 20px;"
        >
          <ion-label class="checkin-label">
            <h3 class="checkin-title">Check-in @ {{ checkIn.place?.name || 'Tundmatu koht' }}</h3>
            <p v-if="checkIn.visitDate"><strong>Kuupäev:</strong> {{ checkIn.visitDate }}</p>
            <p v-if="checkIn.mood"><strong>Tuju:</strong> {{ checkIn.mood }}</p>
            <p v-if="checkIn.drinks"><strong>Joogid:</strong> {{ checkIn.drinks }}</p>
            <p v-if="checkIn.notes"><strong>Märkmed:</strong> {{ checkIn.notes }}</p>
            
            <img 
              v-if="checkIn.photo" 
              :src="checkIn.photo" 
              alt="Check-in photo" 
              class="checkin-photo" 
            />
          </ion-label>
        </ion-item>
      </ion-list>
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
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  IonMenuButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonAvatar,
  onIonViewWillEnter
} from '@ionic/vue';
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const userName = ref('');
const activityFeed = ref<any[]>([]);
const highlightedCheckIn = ref<any>(null);
const temporaryHighlight = ref<any>(null);

const route = useRoute();

onIonViewWillEnter(() => {
  const checkInParam = route.query.checkIn ? JSON.parse(route.query.checkIn as string) : null;
  if (checkInParam) {
    highlightedCheckIn.value = checkInParam;
    temporaryHighlight.value = checkInParam;

    setTimeout(() => {
      temporaryHighlight.value = null;
    }, 1000);
  }
});

onIonViewWillEnter(() => {
  userName.value = localStorage.getItem('userName') || '';
  const storedFeed = localStorage.getItem('activityFeed');
  if (storedFeed) {
    try {
      const parsedFeed = JSON.parse(storedFeed);
      activityFeed.value = parsedFeed.sort((a: any, b: any) => {
        return new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime();
      });
    } catch (error) {
      console.error('Vigane activityFeed JSON:', error);
    }
  }
});

const totalCheckIns = computed(() => activityFeed.value.length);

const placeFrequency = computed(() => {
  const freqMap: Record<string, number> = {};
  activityFeed.value.forEach((checkIn) => {
    const name = checkIn.place?.name || 'Tundmatu koht';
    freqMap[name] = (freqMap[name] || 0) + 1;
  });
  return Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
});
</script>

<style scoped>
.welcome-text {
  text-align: left;
  margin-bottom: 1rem;
}

.username {
  color: var(--ion-color-primary);
  font-weight: 600;
}

.stat-card {
  margin: 4px 0;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #1e1e1e;
  color: #ffffff;
}


.stat-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stats-title {
  font-size: 1.4rem;
  font-weight: bold;
}

.dark-card {
  --background: #1e1e1e;
  --color: #ffffff;
}

.top-places {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.top-places li {
  padding: 4px 0;
}

checkin-card {
  border: 2px solid #ccc; 
  border-radius: 12px; 
  padding: 10px;
  background-color: #1e1e1e; 
}

.checkin-card ion-card-header {
  background-color: #333;
  color: white;
}

.checkin-card ion-card-content {
  padding: 10px;
  color: white;
}

.checkin-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--ion-color-primary);
}

.checkin-photo {
  width: 100%;
  height: auto;
  max-height: 300px;
  margin-top: 10px;
  border-radius: 12px;
  object-fit: cover;
}

ion-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.highlighted {
  border-left: 5px solid hotpink;
}

.highlight-bg::part(native) {
  background-color: hotpink !important;
  transition: background-color 0.3s ease;
}
</style>
