// frontend-user/src/app/dashboard/generate/page.tsx
'use client'

import { useEffect, useState, useMemo, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'
import { apiClient } from '@/lib/api'
import { Loader2 } from 'lucide-react'

interface Voice {
  id: string
  name: string
  language: string
  gender: string
}

interface UsageStats {
  charactersUsed: number
  charactersLimit: number
  remainingCharacters: number
}

export default function GeneratePage() {
  const router = useRouter()
  const { token, isAuthenticated } = useAuth()

  const [voices, setVoices] = useState<Voice[]>([])
  const [languages, setLanguages] = useState<string[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')
  const [filteredVoices, setFilteredVoices] = useState<Voice[]>([])
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('')

  const [text, setText] = useState<string>('')
  const [sampleText, setSampleText] = useState<string>('Hello, this is a preview.')
  const [usage, setUsage] = useState<UsageStats | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false)
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null)
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string>('')
  const [error, setError] = useState<string>('')

  const MAX_CHARS_PER_REQUEST = 3000

  // 1) Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // 2) Fetch voices and usage on mount
  useEffect(() => {
    if (!isAuthenticated || !token) return

    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch available voices
        const { success: voicesOk, data: voiceData, error: voiceErr } = await apiClient.getVoices()
        if (!voicesOk) throw new Error(voiceErr || 'Failed to load voices')
        const fetchedVoices: Voice[] = voiceData as Voice[]
        setVoices(fetchedVoices)

        // Derive sorted unique languages
        const langs = Array.from(new Set(fetchedVoices.map((v) => v.language))).sort()
        setLanguages(langs)
        if (langs.length) {
          setSelectedLanguage(langs[0])
          const initialVoices = fetchedVoices.filter((v) => v.language === langs[0])
          setFilteredVoices(initialVoices)
          if (initialVoices.length) {
            setSelectedVoiceId(initialVoices[0].id)
          }
        }

        // Fetch usage statistics
        const { success: usageOk, data: usageData, error: usageErr } = await apiClient.getUsageStats()
        if (!usageOk) throw new Error(usageErr || 'Failed to load usage')
        setUsage({
          charactersUsed: usageData.charactersUsed,
          charactersLimit: usageData.charactersLimit,
          remainingCharacters: usageData.remainingCharacters,
        })
      } catch (err: unknown) {
        const e = err instanceof Error ? err : new Error('Unknown error')
        console.error('Fetch error:', e)
        setError(e.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated, token])

  // 3) Update filtered voices when language changes
  useEffect(() => {
    const filtered = voices.filter((v) => v.language === selectedLanguage)
    setFilteredVoices(filtered)
    if (filtered.length) {
      setSelectedVoiceId(filtered[0].id)
    } else {
      setSelectedVoiceId('')
    }
  }, [selectedLanguage, voices])

  // 4) Handle text input (limit by smaller of MAX_CHARS_PER_REQUEST and remainingCharacters)
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value
    const maxAllowed = Math.min(
      MAX_CHARS_PER_REQUEST,
      usage?.remainingCharacters ?? MAX_CHARS_PER_REQUEST
    )
    if (input.length <= maxAllowed) {
      setText(input)
    }
  }

  // 5) Handle “Generate Audio”
  const handleGenerate = async () => {
    if (isGenerating) return
    setError('')

    if (!isAuthenticated || !token) {
      router.push('/login')
      return
    }
    if (!usage || usage.remainingCharacters <= 0) {
      setError('You have no remaining characters this month.')
      return
    }
    if (!text.trim() || !selectedVoiceId) {
      setError('Please select a voice and enter text.')
      return
    }

    const charCount = text.length
    const maxAllowed = Math.min(MAX_CHARS_PER_REQUEST, usage.remainingCharacters)
    if (charCount > maxAllowed) {
      setError(`Cannot exceed ${maxAllowed} characters.`)
      return
    }

    setIsGenerating(true)
    try {
      const { success, data, error: genErr } = await apiClient.convertTextToSpeech({
        text,
        voiceId: selectedVoiceId,
        outputFormat: 'mp3',
      })
      if (!success) throw new Error(genErr || 'Generation failed')

      // Display audio inline
      const { voiceFile, usage: newUsage } = data
      setGeneratedAudioUrl(voiceFile.audioUrl)
      setUsage({
        charactersUsed: newUsage.charactersUsed,
        charactersLimit: newUsage.charactersLimit,
        remainingCharacters: newUsage.remaining,
      })
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error('Unknown error')
      console.error('Generate error:', e)
      setError(e.message)
    } finally {
      setIsGenerating(false)
    }
  }

  // 6) Handle voice preview
  const handlePreview = async () => {
    if (isPreviewing) {
      previewAudio?.pause()
      setPreviewAudio(null)
      setIsPreviewing(false)
      return
    }
    if (!selectedVoiceId) {
      setError('Please select a voice first.')
      return
    }
    setError('')
    setIsPreviewing(true)
    try {
      const { success, data, error: prevErr } = await apiClient.previewVoice(
        selectedVoiceId,
        sampleText.slice(0, 100)
      )
      if (!success) throw new Error(prevErr || 'Preview failed')

      const audio = new Audio(data.audioUrl)
      audio.onended = () => {
        setIsPreviewing(false)
        setPreviewAudio(null)
      }
      setPreviewAudio(audio)
      audio.play()
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error('Unknown error')
      console.error('Preview error:', e)
      setError(e.message)
      setIsPreviewing(false)
    }
  }

  // 7) Cleanup preview audio on unmount
  useEffect(() => {
    return () => {
      previewAudio?.pause()
      setPreviewAudio(null)
    }
  }, [previewAudio])

  // 8) Determine if “Generate” should be enabled
  const canGenerate = useMemo(() => {
    if (
      isGenerating ||
      !selectedVoiceId ||
      !text.trim() ||
      !usage
    )
      return false
    return text.length <= Math.min(MAX_CHARS_PER_REQUEST, usage.remainingCharacters)
  }, [isGenerating, selectedVoiceId, text, usage])

  // 9) Show spinner while loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center">
          Generate Premium Text-to-Speech
        </h1>

        {error && (
          <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-md shadow-sm">
            {error}
          </div>
        )}

        <Card className="shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-white p-6">
            <CardTitle className="text-xl font-semibold">Configuration</CardTitle>
            <CardDescription className="text-gray-500">
              Choose voice, preview it, and enter your text.
            </CardDescription>
          </CardHeader>

          <CardContent className="bg-white p-6 space-y-6">
            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Voice Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Voice</label>
              <select
                value={selectedVoiceId}
                onChange={(e) => setSelectedVoiceId(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
              >
                {filteredVoices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} — {v.gender}
                  </option>
                ))}
                {filteredVoices.length === 0 && (
                  <option value="" disabled>
                    No voices available
                  </option>
                )}
              </select>
            </div>

            {/* Voice Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Voice Preview ({sampleText.length}/100)
              </label>
              <div className="flex gap-2">
                <textarea
                  value={sampleText}
                  onChange={(e) => setSampleText(e.target.value.slice(0, 100))}
                  rows={2}
                  className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 resize-none"
                  placeholder="Type up to 100 chars to preview voice"
                />
                <Button
                  variant="outline"
                  onClick={handlePreview}
                  disabled={!selectedVoiceId}
                  className="shrink-0"
                >
                  {isPreviewing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Stop
                    </span>
                  ) : (
                    'Preview'
                  )}
                </Button>
              </div>
            </div>

            {/* Main Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Text{' '}
                <span className="text-gray-500">
                  ({text.length}/
                  {Math.min(MAX_CHARS_PER_REQUEST, usage?.remainingCharacters ?? MAX_CHARS_PER_REQUEST)})
                </span>
              </label>
              <textarea
                value={text}
                onChange={handleTextChange}
                rows={8}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 resize-none h-40 sm:h-52"
                placeholder="Enter up to your allowed characters..."
              />
              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-indigo-500"
                  style={{
                    width: `${(text.length /
                      Math.min(
                        MAX_CHARS_PER_REQUEST,
                        usage?.remainingCharacters ?? MAX_CHARS_PER_REQUEST
                      )) *
                      100}%`,
                  }}
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="text-right">
              <Button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="inline-flex items-center gap-2"
              >
                {isGenerating && <Loader2 className="h-5 w-5 animate-spin" />}
                Generate Audio
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Audio Player */}
        {generatedAudioUrl && (
          <Card className="shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="bg-white p-6">
              <CardTitle className="text-xl font-semibold">Your Generated Audio</CardTitle>
            </CardHeader>
            <CardContent className="bg-white p-6 flex flex-col gap-4">
              <audio controls className="w-full">
                <source src={generatedAudioUrl} type="audio/mpeg" />
                Your browser does not support audio playback.
              </audio>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/files')}
                className="w-full"
              >
                View All Files
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Monthly Usage Summary */}
        {usage && (
          <Card className="shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="bg-white p-6">
              <CardTitle className="text-xl font-semibold">Monthly Usage Summary</CardTitle>
              <CardDescription className="text-gray-500">
                Track your character usage and limits
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-white p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Characters Used</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {usage.charactersUsed.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  / {usage.charactersLimit.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Remaining Characters</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {usage.remainingCharacters.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <Button onClick={() => router.push('/dashboard/files')}>Manage Files</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
