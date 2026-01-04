// Firestore-based storage for content management
// Content is stored in Firebase and visible to ALL users

import {
  getAllSeriesFromFirestore,
  getSeriesByIdFromFirestore,
  addSeriesToFirestore,
  deleteSeriesFromFirestore,
  addChapterToFirestore,
  deleteChapterFromFirestore,
  updateChapterInFirestore,
  Series,
  Chapter
} from './firebase'

// Re-export types
export type { Series, Chapter }

// Local cache for performance
let seriesCache: Series[] | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 30000 // 30 seconds

// Get all series (with caching)
export async function getAllSeriesAsync(): Promise<Series[]> {
  const now = Date.now()
  if (seriesCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return seriesCache
  }
  
  const series = await getAllSeriesFromFirestore()
  
  // If Firestore is empty, return default series
  if (series.length === 0) {
    return getDefaultSeries()
  }
  
  seriesCache = series
  cacheTimestamp = now
  return series
}

// Sync version for initial render (returns cache or default)
export function getAllSeries(): Series[] {
  if (seriesCache) return seriesCache
  return getDefaultSeries()
}

// Get series by ID
export async function getSeriesByIdAsync(seriesId: string): Promise<Series | null> {
  // Check cache first
  if (seriesCache) {
    const cached = seriesCache.find(s => s.id === seriesId)
    if (cached) return cached
  }
  
  const series = await getSeriesByIdFromFirestore(seriesId)
  if (series) return series
  
  // Fallback to default
  const defaults = getDefaultSeries()
  return defaults.find(s => s.id === seriesId) || null
}

// Sync version
export function getSeriesById(seriesId: string): Series | null {
  if (seriesCache) {
    return seriesCache.find(s => s.id === seriesId) || null
  }
  const defaults = getDefaultSeries()
  return defaults.find(s => s.id === seriesId) || null
}

// Add series
export async function addSeries(title: string, description: string, icon: string, image?: string): Promise<Series | null> {
  const result = await addSeriesToFirestore(title, description, icon, image)
  if (result) {
    seriesCache = null // Invalidate cache
  }
  return result
}

// Delete series
export async function deleteSeries(seriesId: string): Promise<void> {
  await deleteSeriesFromFirestore(seriesId)
  seriesCache = null // Invalidate cache
}

// Add chapter
export async function addChapter(
  seriesId: string,
  title: string,
  link: string,
  type: 'story' | 'audiobook',
  content?: string,
  creditName?: string,
  creditLink?: string
): Promise<Chapter | null> {
  const result = await addChapterToFirestore(seriesId, title, link, type, content, creditName, creditLink)
  if (result) {
    seriesCache = null // Invalidate cache
  }
  return result
}

// Delete chapter
export async function deleteChapter(seriesId: string, chapterId: string): Promise<void> {
  await deleteChapterFromFirestore(seriesId, chapterId)
  seriesCache = null // Invalidate cache
}

// Update chapter
export async function updateChapter(seriesId: string, chapterId: string, updates: Partial<Chapter>): Promise<void> {
  await updateChapterInFirestore(seriesId, chapterId, updates)
  seriesCache = null // Invalidate cache
}

// Invalidate cache (call after admin changes)
export function invalidateCache(): void {
  seriesCache = null
  cacheTimestamp = 0
}

// Initialize cache from Firestore
export async function initializeCache(): Promise<void> {
  await getAllSeriesAsync()
}

// Save series (legacy compatibility - now does nothing, use individual functions)
export function saveSeries(_series: Series[]): void {
  // No-op for Firestore - changes are saved immediately
  console.warn('saveSeries is deprecated with Firestore. Changes are saved automatically.')
}

// Reset to defaults (for admin use)
export function resetToDefaults(): void {
  seriesCache = null
  cacheTimestamp = 0
}

// Default series (shown when Firestore is empty)
function getDefaultSeries(): Series[] {
  return [
    {
      id: 'shadow-slave-peaceful-dreams',
      title: 'Shadow Slave - Peaceful Dreams',
      description: 'An alternate universe story featuring Sunny, Cassie, Nephis and more characters from the Shadow Slave universe.',
      icon: '🌙',
      chapters: [],
      createdAt: new Date().toISOString()
    }
  ]
}
