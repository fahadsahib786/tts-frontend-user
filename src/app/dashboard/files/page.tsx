// frontend-user/src/app/dashboard/files/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileAudio,
  Play,
  Pause,
  Download,
  Trash2,
  Search,           // ← import Search here
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { useTtsStore } from '@/stores/ttsStore'
import { useAuth } from '@/context/AuthContext'
import { apiClient } from '@/lib/api'

//
// Utility formatters
//
const formatDate = (isoString: string): string => {
  const d = new Date(isoString)
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

const formatDuration = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

interface VoiceFileItem {
  id: string
  filename: string
  voiceName: string
  duration: number
  fileSize: number
  createdAt: string
}

export default function FilesPage() {
  const router = useRouter()
  const { token, isAuthenticated } = useAuth()
  const { voiceFiles, setVoiceFiles } = useTtsStore()

  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [playingFileId, setPlayingFileId] = useState<string | null>(null)
  const [error, setError] = useState<string>('')
  const [authChecked, setAuthChecked] = useState(false)

  // Pagination state:
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const PAGE_SIZE = 10

  //
  // 1) On mount, verify authentication & redirect if not logged in
  //
  useEffect(() => {
    if (!isAuthenticated) {
      setAuthChecked(true)
      router.push('/login')
    } else {
      setAuthChecked(true)
    }
  }, [isAuthenticated, router])

  //
  // 2) Fetch voice files with pagination when auth is confirmed
  //
  useEffect(() => {
    if (!authChecked) return

    if (!token) {
      setIsLoading(false)
      return
    }

    const fetchFiles = async () => {
      setIsLoading(true)
      setError('')
      try {
        // GET /user/voice-files?page=currentPage&limit=PAGE_SIZE
        const resp = await apiClient.getVoiceFiles(currentPage, PAGE_SIZE)
        // Expected: { success, data: { voiceFiles: [...], pagination: { current, pages, total, hasNext, hasPrev } } }
        if (resp.success) {
          const items = (resp.data.voiceFiles as any[]).map((vf) => ({
            id: vf._id,
            filename: vf.filename,
            voiceName: vf.voice.name,
            duration: vf.duration,
            fileSize: vf.fileSize,
            createdAt: vf.createdAt,
          })) as VoiceFileItem[]
          setVoiceFiles(items)
          setTotalPages(resp.data.pagination.pages)
        } else {
          setError(resp.error || 'Failed to load files')
        }
      } catch (err) {
        console.error('Error fetching files:', err)
        setError((err as any).message || 'Unexpected error fetching files')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFiles()
  }, [authChecked, token, currentPage, setVoiceFiles])

  //
  // 3) Cleanup any playing audio when component unmounts or currentAudio changes
  //
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause()
        setCurrentAudio(null)
      }
    }
  }, [currentAudio])

  //
  // 4) Delete a voice file
  //
  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      const resp = await apiClient.deleteVoiceFile(fileId)
      if (resp.success) {
        setVoiceFiles(voiceFiles.filter((f) => f.id !== fileId))
        if (playingFileId === fileId) {
          handleStopAudio()
        }
      } else {
        alert(resp.error || 'Failed to delete file')
      }
    } catch (err) {
      console.error('Error deleting file:', err)
      alert((err as any).message || 'Unexpected error deleting file')
    }
  }

  //
  // 5) Download a voice file
  //
  const handleDownload = async (fileId: string, filename: string) => {
    try {
      const resp = await apiClient.getDownloadUrl(fileId)
      if (resp.success) {
        const link = document.createElement('a')
        link.href = resp.data.downloadUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        alert(resp.error || 'Failed to get download URL')
      }
    } catch (err) {
      console.error('Error getting download URL:', err)
      alert((err as any).message || 'Unexpected error')
    }
  }

  //
  // 6) Play or pause audio
  //
  const handlePlayAudio = async (fileId: string) => {
    try {
      if (currentAudio) {
        currentAudio.pause()
        setCurrentAudio(null)
        setPlayingFileId(null)
      }

      const resp = await apiClient.getDownloadUrl(fileId)
      if (resp.success) {
        const audio = new Audio(resp.data.downloadUrl)
        audio.onended = () => {
          setPlayingFileId(null)
          setCurrentAudio(null)
        }
        setCurrentAudio(audio)
        setPlayingFileId(fileId)
        audio.play()
      } else {
        alert(resp.error || 'Failed to get playback URL')
      }
    } catch (err) {
      console.error('Error playing audio:', err)
      alert((err as any).message || 'Unexpected error')
    }
  }

  const handleStopAudio = () => {
    if (currentAudio) {
      currentAudio.pause()
      setCurrentAudio(null)
      setPlayingFileId(null)
    }
  }

  //
  // 7) Filter voice files by search term (client-side)
  //
  const filteredFiles = voiceFiles.filter(
    (f) =>
      f.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.voiceName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  //
  // 8) Show loading spinner until initial fetch finishes
  //
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  //
  // 9) Main render
  //
  return (
    <div className="px-4 py-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Audio Files</h1>
            <p className="mt-1 text-sm text-gray-600">
              All your generated text-to-speech files
            </p>
          </div>
          <Button
            onClick={() => router.push('/dashboard/generate')}
            className="mt-4 sm:mt-0"
          >
            Generate New
          </Button>
        </header>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Search Bar */}
        <div className="sticky top-4 z-10">
          <Input
            placeholder="Search by filename or voice..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-10 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        {/* Files Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredFiles.map((file) => (
            <Card
              key={file.id}
              className="bg-white shadow-md hover:shadow-xl transition-shadow rounded-lg"
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <FileAudio className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                  <h2 className="text-lg font-medium text-gray-900 truncate">
                    {file.filename}
                  </h2>
                </div>
                <div className="mt-3 flex flex-wrap text-sm text-gray-500 space-x-4">
                  <span>Voice: {file.voiceName}</span>
                  <span>⏱ {formatDuration(file.duration)}</span>
                  <span>💾 {formatFileSize(file.fileSize)}</span>
                  <span>📅 {formatDate(file.createdAt)}</span>
                </div>
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() =>
                      playingFileId === file.id
                        ? handleStopAudio()
                        : handlePlayAudio(file.id)
                    }
                    className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors text-indigo-600"
                    aria-label={playingFileId === file.id ? 'Pause' : 'Play'}
                  >
                    {playingFileId === file.id ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDownload(file.id, file.filename)}
                    className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition-colors text-green-600"
                    aria-label="Download"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors text-red-600"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <nav className="flex justify-center items-center space-x-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              ← Prev
            </Button>
            <span className="px-3 py-1 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next →
            </Button>
          </nav>
        )}
      </div>
    </div>
  )
}
