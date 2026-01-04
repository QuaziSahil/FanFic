// Simple localStorage-based storage for content management

export interface Chapter {
  id: string
  title: string
  link: string
  content?: string // Rich text content stored directly
  type: 'story' | 'audiobook'
  creditName?: string // Creator/Author credit
  creditLink?: string // Link to creator's profile (optional)
  createdAt: string
}

export interface Series {
  id: string
  title: string
  description: string
  icon: string
  image?: string // Base64 image data URL
  chapters: Chapter[]
  createdAt: string
}

const STORAGE_KEY = 'fanfic_content'

export function getAllSeries(): Series[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return getDefaultSeries()
  try {
    return JSON.parse(data)
  } catch {
    return getDefaultSeries()
  }
}

export function saveSeries(series: Series[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(series))
}

export function addSeries(title: string, description: string, icon: string, image?: string): Series {
  const series = getAllSeries()
  const newSeries: Series = {
    id: generateId(title),
    title,
    description,
    icon,
    image,
    chapters: [],
    createdAt: new Date().toISOString()
  }
  series.push(newSeries)
  saveSeries(series)
  return newSeries
}

export function deleteSeries(seriesId: string): void {
  const series = getAllSeries()
  const filtered = series.filter(s => s.id !== seriesId)
  saveSeries(filtered)
}

export function addChapter(seriesId: string, title: string, link: string, type: 'story' | 'audiobook', content?: string, creditName?: string, creditLink?: string): Chapter | null {
  const series = getAllSeries()
  const seriesIndex = series.findIndex(s => s.id === seriesId)
  if (seriesIndex === -1) return null
  
  const newChapter: Chapter = {
    id: generateId(title),
    title,
    link,
    content,
    type,
    creditName,
    creditLink,
    createdAt: new Date().toISOString()
  }
  
  series[seriesIndex].chapters.push(newChapter)
  saveSeries(series)
  return newChapter
}

export function deleteChapter(seriesId: string, chapterId: string): void {
  const series = getAllSeries()
  const seriesIndex = series.findIndex(s => s.id === seriesId)
  if (seriesIndex === -1) return
  
  series[seriesIndex].chapters = series[seriesIndex].chapters.filter(c => c.id !== chapterId)
  saveSeries(series)
}

export function getSeriesById(seriesId: string): Series | null {
  const series = getAllSeries()
  return series.find(s => s.id === seriesId) || null
}

export function resetToDefaults(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

function generateId(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36)
}

function getDefaultSeries(): Series[] {
  // Start with empty data - no demo content
  return []
}
