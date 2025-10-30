import { useEffect } from 'react'
import { Mic, MicOff, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useVoiceInput } from '@/hooks/useVoiceInput'
import { cn } from '@/lib/utils'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  onClose?: () => void
}

export function VoiceInput({ onTranscript, onClose }: VoiceInputProps) {
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceInput({
    continuous: true,
    interimResults: true,
    onResult: (_text) => {
      // Automatically submit after 2 seconds of silence
      // This would be implemented with a debounce in production
    },
  })

  useEffect(() => {
    // Auto-start listening when component mounts
    if (isSupported) {
      startListening()
    }

    return () => {
      stopListening()
    }
  }, [isSupported])

  const handleSubmit = () => {
    if (transcript) {
      onTranscript(transcript)
      resetTranscript()
      onClose?.()
    }
  }

  if (!isSupported) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MicOff className="h-12 w-12 text-gray-300 mb-4" />
          <p className="text-center text-gray-500">
            Seu navegador não suporta reconhecimento de voz.
            <br />
            Tente usar Chrome, Edge ou Safari.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Entrada por Voz
        </CardTitle>
        <CardDescription>
          Fale os alimentos que você consumiu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Listening Animation */}
        <div className="flex flex-col items-center justify-center py-8">
          <div
            className={cn(
              'relative flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300',
              isListening
                ? 'bg-red-500 animate-pulse'
                : 'bg-gray-200 dark:bg-gray-700'
            )}
          >
            {isListening ? (
              <Mic className="h-12 w-12 text-white" />
            ) : (
              <MicOff className="h-12 w-12 text-gray-400" />
            )}

            {/* Pulsing rings when listening */}
            {isListening && (
              <>
                <div className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-20" />
                <div className="absolute inset-0 animate-pulse rounded-full bg-red-500 opacity-40" />
              </>
            )}
          </div>

          <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400">
            {isListening ? '🎤 Ouvindo...' : '🔇 Pausado'}
          </p>
        </div>

        {/* Transcript Display */}
        <div className="min-h-24 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          {transcript || interimTranscript ? (
            <>
              <p className="text-gray-900 dark:text-white">
                {transcript}
                {transcript && interimTranscript && ' '}
                <span className="text-gray-400 dark:text-gray-500">
                  {interimTranscript}
                </span>
              </p>
            </>
          ) : (
            <p className="text-center text-gray-400 dark:text-gray-500">
              Comece a falar... Ex: "arroz, feijão, frango grelhado e salada"
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            variant={isListening ? 'destructive' : 'default'}
            onClick={isListening ? stopListening : startListening}
            className="flex-1"
          >
            {isListening ? (
              <>
                <MicOff className="mr-2 h-4 w-4" />
                Pausar
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Retomar
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleSubmit}
            disabled={!transcript}
            className="flex-1"
          >
            <Volume2 className="mr-2 h-4 w-4" />
            Analisar
          </Button>
        </div>

        {/* Tips */}
        <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            💡 <strong>Dica:</strong> Fale de forma clara e pausada. Mencione os alimentos e as quantidades quando possível.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
