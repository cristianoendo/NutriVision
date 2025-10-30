import { useState, useEffect } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { Barcode, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface BarcodeScannerProps {
  onBarcodeScanned: (barcode: string) => void
  onClose?: () => void
}

export function BarcodeScanner({ onBarcodeScanned, onClose }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false)

  useEffect(() => {
    if (!isScanning) return

    const scanner = new Html5QrcodeScanner(
      'barcode-scanner-container',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        supportedScanTypes: [],
      },
      false
    )

    const onScanSuccess = (decodedText: string) => {
      scanner.clear()
      setIsScanning(false)
      onBarcodeScanned(decodedText)
    }

    const onScanError = (error: string) => {
      // Ignore scanning errors (they happen constantly while scanning)
      console.debug('Scan error:', error)
    }

    scanner.render(onScanSuccess, onScanError)

    return () => {
      scanner.clear().catch((error) => {
        console.error('Failed to clear scanner:', error)
      })
    }
  }, [isScanning, onBarcodeScanned])

  if (!isScanning) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Barcode className="h-5 w-5" />
                Scanner de Código de Barras
              </CardTitle>
              <CardDescription>
                Escaneie o código de barras do produto
              </CardDescription>
            </div>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsScanning(true)} className="w-full" size="lg">
            <Barcode className="mr-2 h-4 w-4" />
            Iniciar Scanner
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Escaneando...</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsScanning(false)
              onClose?.()
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div
          id="barcode-scanner-container"
          className="overflow-hidden rounded-lg"
        />
        <p className="mt-3 text-center text-sm text-gray-500">
          Posicione o código de barras dentro do quadrado
        </p>
      </CardContent>
    </Card>
  )
}
