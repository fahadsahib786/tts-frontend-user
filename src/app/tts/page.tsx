// frontend-user/src/app/tts/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'
import { useTtsStore } from '@/stores/ttsStore'
import { apiClient } from '@/lib/api'

//
// Interface for a voice returned by GET /tts/voices
//
interface Voice {
  id: string
  name: string
  languageCode: string
  gender: string
  engine: string
}

export default function TtsPage() {
  //
  // Pull needed state & actions from our Zustand store (ttsStore.ts)
  //
  const {
    voices,
    selectedVoice,
    isConverting,
    setVoices,
    setSelectedVoice,
    setConverting,
    addVoiceFile,
  } = useTtsStore()

  //
  // Local component state
  //
  const [text, setText] = useState('')
  const [outputFormat, setOutputFormat] = useState<'mp3' | 'wav' | 'ogg'>('mp3')
  const [engine, setEngine] = useState<'standard' | 'neural'>('standard')
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  //
  // 1) On mount, fetch all available voices from GET /tts/voices
  //
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        // apiClient.getVoices() → returns { success: boolean, data: Voice[], error?: string }
        const result = await apiClient.getVoices()
        if (result.success) {
          const fetchedVoices = result.data as Voice[]
          setVoices(fetchedVoices)
          // If none selected yet, default to first
          if (fetchedVoices.length > 0 && !selectedVoice) {
            setSelectedVoice(fetchedVoices[0])
          }
        } else {
          throw new Error(result.error || 'Failed to load voices')
        }
      } catch (err: unknown) {
        console.error('Error fetching voices:', err)
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError(String(err))
        }
      }
    }

    fetchVoices()
    // Run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //
  // 2) Handle “Preview Voice” via POST /tts/preview
  //
  const handlePreviewVoice = async (voice: Voice) => {
    try {
      // Stop existing preview if playing
      if (previewAudio) {
        previewAudio.pause()
        setPreviewAudio(null)
        setIsPlaying(false)
      }

      // apiClient.previewVoice(voiceId, sampleText) → returns { success: boolean, data: { audioUrl: string }, error?: string }
      const result = await apiClient.previewVoice(voice.id, 'Hello, this is a preview of this voice.')
      if (result.success) {
        const audioUrl = result.data.audioUrl as string
        const audio = new Audio(audioUrl)
        audio.onended = () => setIsPlaying(false)
        setPreviewAudio(audio)
        setIsPlaying(true)
        audio.play()
      } else {
        throw new Error(result.error || 'Preview generation failed')
      }
    } catch (err: unknown) {
      console.error('Error previewing voice:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(String(err))
      }
    }
  }

  //
  // Stop any currently playing preview
  //
  const handleStopPreview = () => {
    if (previewAudio) {
      previewAudio.pause()
      setPreviewAudio(null)
      setIsPlaying(false)
    }
  }

  //
  // 3) Handle “Convert to Speech” via POST /tts/convert
  //
  const handleConvert = async () => {
    if (!text.trim()) {
      setError('Please enter some text to convert')
      return
    }
    if (!selectedVoice) {
      setError('Please select a voice')
      return
    }

    setConverting(true)
    setError('')
    setSuccess('')

    try {
      // apiClient.convertTextToSpeech → returns { success: boolean, data: { voiceFile: { … } }, error?: string }
      const result = await apiClient.convertTextToSpeech({
        text: text.trim(),
        voiceId: selectedVoice.id,
        outputFormat,
        engine,
      })

      if (result.success) {
        //
        // Backend’s response structure:
        //   result.data.voiceFile: {
        //     id: string,
        //     filename: string,
        //     audioUrl: string,
        //     duration: number,
        //     fileSize: number,
        //     voice: { id, name, language, gender },
        //     originalText: string,
        //     createdAt: string
        //   }
        //
        const vf = result.data.voiceFile
        const newFile = {
          id: vf.id as string,
          filename: vf.filename as string,
          text: vf.originalText as string,
          voiceId: vf.voice.id as string,
          voiceName: vf.voice.name as string,
          duration: vf.duration as number,
          fileSize: vf.fileSize as number,
          createdAt: vf.createdAt as string,
          downloadUrl: vf.audioUrl as string,
        }
        addVoiceFile(newFile)
        setSuccess('Text converted successfully!')
        setText('')
      } else {
        throw new Error(result.error || 'Conversion failed')
      }
    } catch (err: unknown) {
      console.error('Error during conversion:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(String(err))
      }
    } finally {
      setConverting(false)
    }
  }

  //
  // 4) Group voices by languageCode for display
  //
  const groupedVoices = voices.reduce((acc, voice) => {
    const key = voice.languageCode
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(voice)
    return acc
  }, {} as Record<string, Voice[]>)

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-8">
        <div>
          <h1 className="text-3xl font-bold">Text to Speech</h1>
          <p className="text-muted-foreground">
            Convert your text into natural-sounding speech
          </p>
        </div>

        {/* Two-column layout: left = text input, right = voice selection */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* ----------- Left: Text Input & Convert Button ----------- */}
          <Card>
            <CardHeader>
              <CardTitle>Enter Text</CardTitle>
              <CardDescription>
                Type or paste the text you want to convert to speech
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <textarea
                  className="w-full min-h-[200px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={3000}
                />
                <div className="text-sm text-muted-foreground mt-2">
                  {text.length}/3000 characters
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Output Format</label>
                  <select
                    className="w-full mt-1 p-2 border rounded-md"
                    value={outputFormat}
                    onChange={(e) =>
                      setOutputFormat(e.target.value as 'mp3' | 'wav' | 'ogg')
                    }
                  >
                    <option value="mp3">MP3</option>
                    <option value="wav">WAV</option>
                    <option value="ogg">OGG</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Engine</label>
                  <select
                    className="w-full mt-1 p-2 border rounded-md"
                    value={engine}
                    onChange={(e) =>
                      setEngine(e.target.value as 'standard' | 'neural')
                    }
                  >
                    <option value="standard">Standard</option>
                    <option value="neural">Neural (Premium)</option>
                  </select>
                </div>
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}
              {success && <div className="text-sm text-green-600">{success}</div>}

              <Button
                onClick={handleConvert}
                disabled={isConverting || !text.trim() || !selectedVoice}
                className="w-full"
              >
                {isConverting ? 'Converting...' : 'Convert to Speech'}
              </Button>
            </CardContent>
          </Card>

          {/* ----------- Right: Voice Selection & Preview Buttons ----------- */}
          <Card>
            <CardHeader>
              <CardTitle>Select Voice</CardTitle>
              <CardDescription>
                Choose from our collection of natural-sounding voices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 max-h-[400px] overflow-y-auto">
                {Object.entries(groupedVoices).map(
                  ([languageCode, voiceList]) => (
                    <div key={languageCode}>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">
                        {languageCode.toUpperCase()}
                      </h4>
                      <div className="space-y-2">
                        {voiceList.map((voice) => (
                          <div
                            key={voice.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedVoice?.id === voice.id
                                ? 'border-primary bg-primary/5'
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              setError('')
                              setSuccess('')
                              setSelectedVoice(voice)
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{voice.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {voice.gender} • {voice.engine}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                className="p-2"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (
                                    isPlaying &&
                                    selectedVoice?.id === voice.id
                                  ) {
                                    handleStopPreview()
                                  } else {
                                    handlePreviewVoice(voice)
                                  }
                                }}
                              >
                                {isPlaying && selectedVoice?.id === voice.id ? (
                                  <Pause className="h-4 w-4" />
                                ) : (
                                  <Play className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
