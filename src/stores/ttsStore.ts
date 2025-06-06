import { create } from 'zustand'

interface Voice {
  id: string
  name: string
  languageCode: string
  gender: string
  engine: string
}

interface VoiceFile {
  id: string
  filename: string
  text: string
  voiceId: string
  voiceName: string
  duration: number
  fileSize: number
  createdAt: string
  downloadUrl?: string
}

interface TtsState {
  voices: Voice[]
  voiceFiles: VoiceFile[]
  selectedVoice: Voice | null
  isConverting: boolean
  isLoading: boolean
  currentAudio: HTMLAudioElement | null
  isPlaying: boolean
  setVoices: (voices: Voice[]) => void
  setVoiceFiles: (files: VoiceFile[]) => void
  setSelectedVoice: (voice: Voice | null) => void
  setConverting: (converting: boolean) => void
  setLoading: (loading: boolean) => void
  setCurrentAudio: (audio: HTMLAudioElement | null) => void
  setPlaying: (playing: boolean) => void
  addVoiceFile: (file: VoiceFile) => void
  removeVoiceFile: (fileId: string) => void
}

export const useTtsStore = create<TtsState>((set) => ({
  voices: [],
  voiceFiles: [],
  selectedVoice: null,
  isConverting: false,
  isLoading: false,
  currentAudio: null,
  isPlaying: false,
  setVoices: (voices) => set({ voices }),
  setVoiceFiles: (voiceFiles) => set({ voiceFiles }),
  setSelectedVoice: (selectedVoice) => set({ selectedVoice }),
  setConverting: (isConverting) => set({ isConverting }),
  setLoading: (isLoading) => set({ isLoading }),
  setCurrentAudio: (currentAudio) => set({ currentAudio }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  addVoiceFile: (file) =>
    set((state) => ({
      voiceFiles: [file, ...state.voiceFiles],
    })),
  removeVoiceFile: (fileId) =>
    set((state) => ({
      voiceFiles: state.voiceFiles.filter((file) => file.id !== fileId),
    })),
}))
