'use client'

import { initializeApp, getApps } from 'firebase/app'
import { 
  getAuth, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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
  collection,
  getDocs,
  deleteDoc,
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

// Create/update user in Firestore
export const createOrUpdateUser = async (user: User) => {
  if (!db || !user) return
  try {
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
  } catch (error) {
    console.error('Error creating/updating user:', error)
  }
}

// Sign in with Google - try popup first, fall back to redirect
export const signInWithGoogle = async () => {
  if (!auth) {
    console.error('Auth not initialized')
    alert('Authentication not ready. Please refresh the page.')
    return null
  }
  
  try {
    // Try popup first
    const result = await signInWithPopup(auth, googleProvider)
    await createOrUpdateUser(result.user)
    return result.user
  } catch (error: any) {
    console.error('Sign-in error:', error.code, error.message)
    
    // If popup blocked or failed, use redirect
    if (error.code === 'auth/popup-blocked' || 
        error.code === 'auth/popup-closed-by-user' || 
        error.code === 'auth/cancelled-popup-request') {
      console.log('Popup blocked, using redirect...')
      try {
        await signInWithRedirect(auth, googleProvider)
      } catch (redirectError) {
        console.error('Redirect error:', redirectError)
        alert('Sign-in failed. Please try again.')
      }
      return null
    }
    
    // Handle unauthorized domain error
    if (error.code === 'auth/unauthorized-domain') {
      alert('This domain is not authorized for sign-in. Please contact the site administrator.')
      return null
    }
    
    // Handle other errors
    alert(`Sign-in error: ${error.message}`)
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

// ============== CONTENT MANAGEMENT (FIRESTORE) ==============

export interface Chapter {
  id: string
  title: string
  link: string
  content?: string
  type: 'story' | 'audiobook'
  creditName?: string
  creditLink?: string
  createdAt: string
}

export interface Series {
  id: string
  title: string
  description: string
  icon: string
  image?: string
  chapters: Chapter[]
  createdAt: string
}

// Get all series from Firestore
export const getAllSeriesFromFirestore = async (): Promise<Series[]> => {
  if (!db) return []
  try {
    const seriesCol = collection(db, 'series')
    const snapshot = await getDocs(seriesCol)
    const seriesList: Series[] = []
    snapshot.forEach((doc) => {
      seriesList.push({ id: doc.id, ...doc.data() } as Series)
    })
    return seriesList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error('Error getting series:', error)
    return []
  }
}

// Get single series by ID
export const getSeriesByIdFromFirestore = async (seriesId: string): Promise<Series | null> => {
  if (!db) return null
  try {
    const seriesRef = doc(db, 'series', seriesId)
    const seriesSnap = await getDoc(seriesRef)
    if (seriesSnap.exists()) {
      return { id: seriesSnap.id, ...seriesSnap.data() } as Series
    }
    return null
  } catch (error) {
    console.error('Error getting series:', error)
    return null
  }
}

// Add new series
export const addSeriesToFirestore = async (title: string, description: string, icon: string, image?: string): Promise<Series | null> => {
  if (!db) return null
  try {
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const newSeries: Omit<Series, 'id'> = {
      title,
      description,
      icon,
      image,
      chapters: [],
      createdAt: new Date().toISOString()
    }
    await setDoc(doc(db, 'series', id), newSeries)
    return { id, ...newSeries }
  } catch (error) {
    console.error('Error adding series:', error)
    return null
  }
}

// Delete series
export const deleteSeriesFromFirestore = async (seriesId: string): Promise<void> => {
  if (!db) return
  try {
    await deleteDoc(doc(db, 'series', seriesId))
  } catch (error) {
    console.error('Error deleting series:', error)
  }
}

// Add chapter to series
export const addChapterToFirestore = async (
  seriesId: string, 
  title: string, 
  link: string, 
  type: 'story' | 'audiobook', 
  content?: string,
  creditName?: string,
  creditLink?: string
): Promise<Chapter | null> => {
  if (!db) return null
  try {
    const seriesRef = doc(db, 'series', seriesId)
    const seriesSnap = await getDoc(seriesRef)
    if (!seriesSnap.exists()) return null
    
    const seriesData = seriesSnap.data() as Omit<Series, 'id'>
    const chapterId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now()
    
    const newChapter: Chapter = {
      id: chapterId,
      title,
      link,
      content,
      type,
      creditName,
      creditLink,
      createdAt: new Date().toISOString()
    }
    
    await updateDoc(seriesRef, {
      chapters: [...(seriesData.chapters || []), newChapter]
    })
    
    return newChapter
  } catch (error) {
    console.error('Error adding chapter:', error)
    return null
  }
}

// Delete chapter from series
export const deleteChapterFromFirestore = async (seriesId: string, chapterId: string): Promise<void> => {
  if (!db) return
  try {
    const seriesRef = doc(db, 'series', seriesId)
    const seriesSnap = await getDoc(seriesRef)
    if (!seriesSnap.exists()) return
    
    const seriesData = seriesSnap.data() as Omit<Series, 'id'>
    const updatedChapters = (seriesData.chapters || []).filter(c => c.id !== chapterId)
    
    await updateDoc(seriesRef, {
      chapters: updatedChapters
    })
  } catch (error) {
    console.error('Error deleting chapter:', error)
  }
}

// Update chapter
export const updateChapterInFirestore = async (
  seriesId: string,
  chapterId: string,
  updates: Partial<Chapter>
): Promise<void> => {
  if (!db) return
  try {
    const seriesRef = doc(db, 'series', seriesId)
    const seriesSnap = await getDoc(seriesRef)
    if (!seriesSnap.exists()) return
    
    const seriesData = seriesSnap.data() as Omit<Series, 'id'>
    const updatedChapters = (seriesData.chapters || []).map(c => 
      c.id === chapterId ? { ...c, ...updates } : c
    )
    
    await updateDoc(seriesRef, {
      chapters: updatedChapters
    })
  } catch (error) {
    console.error('Error updating chapter:', error)
  }
}

export { auth, db, signOut, onAuthStateChanged }
export type { User }
