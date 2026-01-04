import { initializeApp, getApps } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCDrS8-a7N7Q7UmmTtQCu05J-ik6PGcysw",
  authDomain: "fanfic-7046e.firebaseapp.com",
  projectId: "fanfic-7046e",
  storageBucket: "fanfic-7046e.firebasestorage.app",
  messagingSenderId: "736228417736",
  appId: "1:736228417736:web:f2f61d24afc690f47f45fd",
  measurementId: "G-B3XR1MXS3L"
}

// Initialize Firebase only if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)

export { auth, signInWithEmailAndPassword, signOut, onAuthStateChanged }
export type { User }
