import { useState, useRef } from 'react'
import { Camera, Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface PhotoUploadProps {
  onPhotoSelected: (imageData: string) => void
  onAnalyzing?: (isAnalyzing: boolean) => void
}

export function PhotoUpload({ onPhotoSelected, onAnalyzing }: PhotoUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageData = event.target?.result as string
      setSelectedImage(imageData)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = () => {
    if (!selectedImage) return

    setIsProcessing(true)
    onAnalyzing?.(true)

    // Simulate processing delay
    setTimeout(() => {
      onPhotoSelected(selectedImage)
      setIsProcessing(false)
      onAnalyzing?.(false)
      setSelectedImage(null)
    }, 1500)
  }

  const handleClear = () => {
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        setIsCameraActive(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Não foi possível acessar a câmera. Verifique as permissões.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
      setIsCameraActive(false)
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current) return

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')

    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0)
      const imageData = canvas.toDataURL('image/jpeg')
      setSelectedImage(imageData)
      stopCamera()
    }
  }

  return (
    <div className="space-y-4">
      {!selectedImage && !isCameraActive && (
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="h-24 flex-col gap-2"
          >
            <Upload className="h-8 w-8" />
            <span className="text-sm">Galeria</span>
          </Button>

          <Button
            variant="outline"
            onClick={startCamera}
            className="h-24 flex-col gap-2"
          >
            <Camera className="h-8 w-8" />
            <span className="text-sm">Câmera</span>
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {isCameraActive && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-900">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={capturePhoto} className="flex-1">
                  <Camera className="mr-2 h-4 w-4" />
                  Capturar Foto
                </Button>
                <Button variant="outline" onClick={stopCamera}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedImage && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <img
                  src={selectedImage}
                  alt="Selected food"
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={handleClear}
                  className="absolute right-2 top-2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analisando com IA...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-4 w-4" />
                    Analisar Foto
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <p className="text-center text-xs text-gray-500">
        💡 Tire uma foto clara da refeição para melhor análise
      </p>
    </div>
  )
}
