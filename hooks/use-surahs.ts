import { useQuery } from '@tanstack/react-query'
import { SurahDetail, Surah } from '@/types/quran'


const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-quran.onrender.com"

async function fetchSurahs(): Promise<Surah[]> {
  const response = await fetch(API_URL + '/surahs')
  
  if (!response.ok) {
    throw new Error('Failed to fetch surahs')
  }
  
  return response.json()
}

async function fetchSurahById(id: string | number): Promise<SurahDetail> {
  const response = await fetch(`${API_URL}/surahs/${id}`)
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Surah with id ${id} not found`)
    }
    throw new Error(`Failed to fetch surah: ${response.status}`)
  }
  
  return response.json()
}

// Hook untuk mengambil semua surah
export function useSurahs() {
  return useQuery<Surah[]>({
    queryKey: ['surahs'],
    queryFn: fetchSurahs,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })
}

// Hook untuk mengambil detail surah berdasarkan ID
export function useSurah(id: string | number) {
  return useQuery<SurahDetail>({
    queryKey: ['surah', id],
    queryFn: () => fetchSurahById(id),
    staleTime: 10 * 60 * 1000, // 10 menit untuk detail surah
    gcTime: 15 * 60 * 1000, // 15 menit cache time
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    enabled: !!id, // hanya jalankan query jika id tersedia
  })
}