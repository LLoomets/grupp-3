<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
        <ion-buttons slot="start">
            <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Disclaimer</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content class="ion-padding">
        <ion-list>
          <ion-item lines="none">
            <ion-label>
              <h2>🔞 Vanusepiirang</h2>
              <ul>
              <li>See rakendus on mõeldud ainult kasutajatele, kes on vähemalt 18-aastased (või 21+, sõltuvalt kohaliku alkoholi tarbimise seaduslikust vanusest).</li>
            </ul>
            </ion-label>
          </ion-item>
  
          <ion-item lines="none">
            <ion-label>
              <h2>🍻 Tarbi Alkoholi Vastutustundlikult</h2>
              <ul>
              <li>Me ei soodusta ega julgusta liigset alkoholitarbimist.</li> 
              <li>Tarbi alkoholi alati mõõdukalt ja joo palju vett!</li>
              </ul>
            </ion-label>
          </ion-item>
  
          <ion-item lines="none">
            <ion-label>
              <h2>📍 Asukohad</h2>
              <ul>
              <li>Kõik andmed baaride, klubide ja pubide kohta on kasutajate loodud või avalikest allikatest kogutud.</li> 
              <li>Rakendus ei taga täpsust, täielikkust ega saadavust loetletud kohtade osas.</li>
            </ul>
            </ion-label>
          </ion-item>
  
          <ion-item lines="none">
            <ion-label>
              <h2>📷 Kasutaja Loodud Sisu</h2>
              <ul>
                <li>Kasutajad vastutavad ise oma üleslaetud fotode ja kommentaaride eest.</li> 
                <li>Ära postita solvavat, ebaseaduslikku või autoriõigustega kaitstud sisu.</li>
            </ul>
            </ion-label>
          </ion-item>
  
          <ion-item lines="none">
            <ion-label>
              <h2>📝 Andmete Täpsus</h2>
              <ul>
              <li>Sinu isiklikud märkmed ja registreerimised salvestatakse sinu mugavuseks.</li>
              </ul>
            </ion-label>
          </ion-item>
  
          <ion-item lines="none">
            <ion-label>
                <h2>📱 Piiratud Vastutus</h2>
                <ul>
                <li>Rakendus on kättesaadav „nagu on“ põhimõttel, ilma garantiideta. Me ei vastuta:
                    <ul class="sublist">
                    <li>Vigastuste, kahjude või kahjude eest, mis tulenevad rakenduse kasutamisest</li>
                    <li>Probleemide eest, mis on põhjustatud kolmandate osapoolte teenustest või kohtadest</li>
                    </ul>
                </li>
                </ul>
            </ion-label>
            </ion-item>
            
          <ion-item lines="none">
            <ion-label>
              <h2>🛡️ Safety First</h2>
              <ul>
              <li>Ära kasuta rakendust autoroolis, jalgrattal või ohtlikes olukordades.</li> 
              <li>Ole ettevaatlik, kui suhtled võõrastega või jagad oma asukohta.</li> 
              <li>Ära jäta oma jooki järelevalveta! Ära võta vastu tundmatult isikult pakutud aineid ega jooke!</li>
            </ul>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonList, IonButtons, IonBackButton} from '@ionic/vue';
  </script>
  
  <style scoped>
  ion-label ul,
  ion-label li {
    font-size: 14px;
    line-height: 1.5;
    margin: 0;
    padding: 0;
    color: #A0A0A0;
    list-style-position: inside;
  }
  .sublist {
  margin-left: 1.5rem;
}
  </style>
  
  
  