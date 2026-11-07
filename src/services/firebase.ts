import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

const env = import.meta.env;

const config = {
  apiKey: env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: env.VITE_FIREBASE_APP_ID as string | undefined,
};

/** O Firebase só é ativado se as variáveis mínimas estiverem presentes. */
export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(config);
    db = getFirestore(app);
  } catch (err) {
    console.warn('[Librarytrix] Falha ao inicializar Firebase, usando localStorage.', err);
    db = null;
  }
}

export { app, db };

