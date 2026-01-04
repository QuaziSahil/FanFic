'use client'

import { initializeApp, getApps } from 'firebase/app'
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth'
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore'

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
let app: ReturnType<typeof initializeApp> | undefined
let auth: ReturnType<typeof getAuth> | undefined
let db: ReturnType<typeof getFirestore> | undefined
const googleProvider = new GoogleAuthProvider()

if (typeof window !== 'undefined') {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  auth = getAuth(app)
  db = getFirestore(app)
}

// Sign in with Google
export const signInWithGoogle = async () => {
  if (!auth) return null
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    
    // Create/update user document in Firestore
    if (db && user) {
      const userRef = doc(db, 'users', user.uid)
      const userSnap = await getDoc(userRef)
      
      if (!userSnap.exists()) {
        // New user - create profile
        await setDoc(userRef, {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          bookmarks: [],
          readingHistory: [],
          readingProgress: {},
          preferredTheme: 'night'
        })
      } else {
        // Existing user - update last login
        await updateDoc(userRef, {
          lastLogin: serverTimestamp()
        })
      }
    }
    
    return user
  } catch (error) {
    console.error('Error signing in with Google:', error)
    return null
  }
}

// Sign out
export const logOut = async () => {
  if (!auth) return
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

// User data types
export interface UserData {
  displayName: string
  email: string
  photoURL: string
  bookmarks: string[] // Array of series IDs
  readingHistory: { seriesId: string; chapterId: string; timestamp: Date }[]
  readingProgress: { [chapterId: string]: number } // Progress percentage
  preferredTheme: string
}

// Get user data from Firestore
export const getUserData = async (userId: string): Promise<UserData | null> => {
  if (!db) return null
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      return userSnap.data() as UserData
    }
    return null
  } catch (error) {
    console.error('Error getting user data:', error)
    return null
  }
}

// Update user bookmarks
export const toggleBookmark = async (userId: string, seriesId: string): Promise<boolean> => {
  if (!db) return false
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      const data = userSnap.data()
      const bookmarks = data.bookmarks || []
      const isBookmarked = bookmarks.includes(seriesId)
      
      if (isBookmarked) {
        await updateDoc(userRef, {
          bookmarks: bookmarks.filter((id: string) => id !== seriesId)
        })
      } else {
        await updateDoc(userRef, {
          bookmarks: [...bookmarks, seriesId]
        })
      }
      return !isBookmarked
    }
    return false
  } catch (error) {
    console.error('Error toggling bookmark:', error)
    return false
  }
}

// Update reading progress
export const updateReadingProgress = async (userId: string, chapterId: string, progress: number) => {
  if (!db) return
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      [`readingProgress.${chapterId}`]: progress
    })
  } catch (error) {
    console.error('Error updating reading progress:', error)
  }
}

// Add to reading history
export const addToReadingHistory = async (userId: string, seriesId: string, chapterId: string) => {
  if (!db) return
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      const data = userSnap.data()
      const history = data.readingHistory || []
      
      // Remove if already exists (to move to front)
      const filteredHistory = history.filter(
        (h: { chapterId: string }) => h.chapterId !== chapterId
      )
      
      // Add to front of history (max 50 items)
      const newHistory = [
        { seriesId, chapterId, timestamp: new Date() },
        ...filteredHistory
      ].slice(0, 50)
      
      await updateDoc(userRef, {
        readingHistory: newHistory
      })
    }
  } catch (error) {
    console.error('Error adding to reading history:', error)
  }
}

// Update preferred theme
export const updatePreferredTheme = async (userId: string, theme: string) => {
  if (!db) return
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      preferredTheme: theme
    })
  } catch (error) {
    console.error('Error updating preferred theme:', error)
  }
}

export { auth, db, signOut, onAuthStateChanged }
export type { User }
