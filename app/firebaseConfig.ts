// Firebase yapılandırma dosyası
// Kendi Firebase projenizi oluşturduktan sonra aşağıdaki alanları doldurun.
// Firebase web config bilgilerinizi almak için:
// 1. https://console.firebase.google.com/ adresine gidin
// 2. Projenizi seçin veya yeni bir proje oluşturun
// 3. Soldaki menüden "Project settings" (Proje ayarları) kısmına tıklayın
// 4. "Your apps" bölümünde web (</>) uygulaması ekleyin veya mevcut uygulamayı seçin
// 5. "Firebase SDK snippet" altında "Config" seçeneğini seçin
// 6. Aşağıdaki alanları kendi bilgilerinizle doldurun

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 