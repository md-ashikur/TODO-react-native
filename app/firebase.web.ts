import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../firebaseConfig';

let app: FirebaseApp;
if (getApps().length) {
  app = getApps()[0]!;
} else {
  app = initializeApp(firebaseConfig);
}

const auth = getAuth(app);
export { app, auth };

