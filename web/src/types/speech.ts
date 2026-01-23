/**
 * Web Speech API types (KISS – keep page.tsx clean)
 */

export interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

export interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
  length: number
}

export interface SpeechRecognitionResultList {
  length: number
  [index: number]: SpeechRecognitionResult
}

export interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onresult: ((e: SpeechRecognitionEvent) => void) | null
  onerror: ((e: Event) => void) | null
}

export interface WindowWithSpeechRecognition extends Window {
  webkitSpeechRecognition?: new () => SpeechRecognition
  SpeechRecognition?: new () => SpeechRecognition
  webkitAudioContext?: typeof AudioContext
}
