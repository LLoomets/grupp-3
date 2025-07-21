<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Logi sisse / Registreeru</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-input v-model="email" type="email" placeholder="Sinu e-mail" />
            <ion-input v-model="password" type="password" placeholder="Parool" />

            <ion-button expand="block" @click="register">Registreeru</ion-button>
            <ion-button expand="block" @click="login">Logi sisse</ion-button>

            <ion-text color="danger" v-if="errorMessage">{{ errorMessage }}</ion-text>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonText,
    IonButton,
    IonInput
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const register = async () => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

        // Loo Firestore’is kasutaja dokument
        await setDoc(doc(db, 'users', user.uid), {
            userName: user.email,
            email: user.email,
            photoURL: '',
            joinedAt: serverTimestamp(),
        });

        router.push('/tabs/tab1');
    } catch (err: any) {
        errorMessage.value = err.message;
    }
};

const login = async () => {
    try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        router.push('/tabs/tab1');
    } catch (err: any) {
        errorMessage.value = err.message;
    }
};
</script>
