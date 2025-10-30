import { useState, useEffect, useCallback } from 'react'

interface UseVoiceInputOptions {
  lang?: string
  continuous?: boolean
  interimResults?: boolean
  onResult?: (transcript: string) => void
  onError?: (error: string) => void
}

export function useVoiceInput(options: UseVoiceInputOptions = {}) {
  const {
    lang = 'pt-BR',
    continuous = false,
    interimResults = true,
    onResult,
    onError,
  } = options

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  useEffect(() => {
    // Check if Speech Recognition is supported
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      setIsSupported(true)

      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.lang = lang
      recognitionInstance.continuous = continuous
      recognitionInstance.interimResults = interimResults

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = ''
        let interimText = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            finalTranscript += result[0].transcript
          } else {
            interimText += result[0].transcript
          }
        }

        if (finalTranscript) {
          setTranscript((prev) => prev + ' ' + finalTranscript)
          onResult?.(finalTranscript.trim())
        }

        if (interimText) {
          setInterimTranscript(interimText)
        }
      }

      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        onError?.(event.error)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
        setInterimTranscript('')
      }

      setRecognition(recognitionInstance)
    } else {
      setIsSupported(false)
      console.warn('Speech Recognition not supported in this browser')
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [lang, continuous, interimResults])

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start()
        setIsListening(true)
        setTranscript('')
        setInterimTranscript('')
      } catch (error) {
        console.error('Error starting recognition:', error)
      }
    }
  }, [recognition, isListening])

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop()
      setIsListening(false)
    }
  }, [recognition, isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
  }, [])

  return {
    isListening,
    transcript: transcript.trim(),
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  }
}
