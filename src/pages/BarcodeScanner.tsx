import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { socketService, type ScanSuccessEvent, type ScanErrorEvent } from '@/services/socketService';
import { Loader2, Barcode, CheckCircle2, XCircle, Wifi, WifiOff, Camera, CameraOff } from 'lucide-react';
import type { Producto } from '@/modules/Products/interfaces';
import { Html5Qrcode } from 'html5-qrcode';
import { useSearchParams } from 'react-router-dom';

export default function BarcodeScanner() {

  const [searchParams] = useSearchParams();

  const [barcode, setBarcode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(searchParams.get('sessionId'));
  const [lastScanned, setLastScanned] = useState<Producto | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<Array<{ producto: Producto; timestamp: string }>>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  // const [showQRLinkDialog, setShowQRLinkDialog] = useState(false);
  // const [isLinkingQR, setIsLinkingQR] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<any>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const readerIdRef = useRef<string>('reader-' + Math.random().toString(36).substring(7));
  // const qrReaderIdRef = useRef<string>('qr-reader-' + Math.random().toString(36).substring(7));
  const lastScanRef = useRef<{ barcode: string; timestamp: number } | null>(null);

  useEffect(() => {
    // Definir handlers primero
    const handleScanSuccess = (data: ScanSuccessEvent) => {
      console.log('✅ Scan success recibido:', data);
      setLastScanned(data.producto);
      setSuccessMessage(
        `✅ Producto enviado a ${data.sentToClients} dispositivo${data.sentToClients !== 1 ? 's' : ''}`
      );
      setScanHistory(prev => [
        { producto: data.producto, timestamp: new Date().toISOString() },
        ...prev.slice(0, 9) // Mantener solo los últimos 10
      ]);
      setIsScanning(false);
      
      // Limpiar mensaje después de 3 segundos
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setSuccessMessage(null);
        setLastScanned(null);
      }, 3000);
    };

    const handleScanError = (data: ScanErrorEvent) => {
      console.log('❌ Scan error recibido:', data);
      setErrorMessage(data.message);
      setIsScanning(false);
      
      // Limpiar mensaje después de 3 segundos
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    };

    // Registrar listeners ANTES de conectar
    socketService.onScanSuccess(handleScanSuccess);
    socketService.onScanError(handleScanError);

    // Conectar o mostrar diálogo de vinculación
    const savedSessionId = localStorage.getItem('scanner-session-id');
    
    //
    const effectiveSessionId = sessionId || savedSessionId;

    if (effectiveSessionId) {
      console.log(
        sessionId && savedSessionId && sessionId === savedSessionId
          ? '📱 Reconectando con sessionId guardado:'
          : sessionId && !savedSessionId
            ? '📱 Guardando nuevo sessionId desde URL:'
            : '📱 Usando sessionId guardado:',
        effectiveSessionId
      );

      if (sessionId && !savedSessionId) {
        localStorage.setItem('scanner-session-id', sessionId);
      }

      socketService.connect('scanner', effectiveSessionId);
      setSessionId(effectiveSessionId);
      setIsConnected(true);
    }

    // Verificar estado de conexión cada 2 segundos
    const interval = setInterval(() => {
      setIsConnected(socketService.isConnected());
    }, 2000);

    // Enfocar input al cargar
    inputRef.current?.focus();

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      socketService.offScanSuccess(handleScanSuccess);
      socketService.offScanError(handleScanError);
      socketService.disconnect();
      stopCamera();
    };
  }, [sessionId]);

  // Helper para verificar si se debe procesar el escaneo (evitar duplicados)
  const shouldProcessScan = (code: string): boolean => {
    const now = Date.now();
    const last = lastScanRef.current;
    
    // Si es el mismo código escaneado hace menos de 2 segundos, ignorar
    if (last && last.barcode === code && (now - last.timestamp) < 2000) {
      console.log('⏭️ Escaneo duplicado ignorado:', code);
      return false;
    }
    
    // Actualizar último escaneo
    lastScanRef.current = { barcode: code, timestamp: now };
    return true;
  };

  const handleScan = async () => {
    if (!barcode.trim()) return;

    const code = barcode.trim();
    if (!shouldProcessScan(code)) {
      setBarcode('');
      return;
    }

    setIsScanning(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await socketService.scanBarcode(code);
      setBarcode('');
      // No quitar isScanning aquí - se quitará en handleScanSuccess o handleScanError
    } catch (error: any) {
      console.log(error);
      setErrorMessage(error.message || 'Error al escanear código de barras');
      setIsScanning(false);
    }
  };

  const startCamera = () => {
    setIsCameraActive(true);
  };

  // useEffect para inicializar la cámara cuando se activa
  useEffect(() => {
    if (!isCameraActive) return;

    const initCamera = async () => {
      try {
        const readerId = readerIdRef.current;
        console.log('🎥 Iniciando cámara con readerId:', readerId);
        
        // Pequeño delay para asegurar que el elemento está en el DOM
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Verificar que el elemento existe
        const element = document.getElementById(readerId);
        if (!element) {
          throw new Error(`Elemento con id ${readerId} no encontrado en el DOM`);
        }
        
        console.log('✅ Elemento encontrado, inicializando Html5Qrcode...');
        html5QrCodeRef.current = new Html5Qrcode(readerId);

        // Intentar primero cámara trasera, si falla usar cualquier cámara
        console.log('📹 Solicitando acceso a cámara trasera...');
        const cameraConfig = { facingMode: 'environment' };
        
        try {
          await html5QrCodeRef.current.start(
            cameraConfig,
            {
              fps: 10,
              qrbox: { width: 250, height: 140 },
              aspectRatio: 0.8,
            },
            async (decodedText) => {
              // Escaneo exitoso con cámara
              console.log('📦 Código escaneado con cámara:', decodedText);
              
              // Verificar si debe procesarse (evitar duplicados)
              if (!shouldProcessScan(decodedText.trim())) {
                return;
              }
              
              // NO cambiar isScanning para escaneo con cámara
              setErrorMessage(null);
              setSuccessMessage('📸 Escaneando...');

              // Enviar código sin cambiar loading del botón
              socketService.scanBarcode(decodedText.trim()).catch((error: any) => {
                setErrorMessage(error.message || 'Error al escanear código de barras');
              });
            },
            () => {
              // Error durante el escaneo (puede ignorarse)
            }
          );
          console.log('✅ Cámara iniciada correctamente');
        } catch (err: any) {
          console.log('⚠️ Fallo con facingMode, buscando cámaras disponibles...', err.message);
          // Si falla con facingMode, intentar con cualquier cámara disponible
          const devices = await Html5Qrcode.getCameras();
          console.log('📷 Cámaras encontradas:', devices.length, devices);
          
          if (devices && devices.length > 0) {
            console.log('🎯 Usando cámara:', devices[0].label || devices[0].id);
            await html5QrCodeRef.current.start(
              devices[0].id,
              {
                fps: 10,
                qrbox: { width: 250, height: 140 },
                aspectRatio: 0.8,
              },
              async (decodedText) => {
                console.log('📦 Código escaneado con cámara:', decodedText);
                
                // Verificar si debe procesarse (evitar duplicados)
                if (!shouldProcessScan(decodedText.trim())) {
                  return;
                }
                
                // NO cambiar isScanning para escaneo con cámara
                setErrorMessage(null);
                setSuccessMessage('📸 Escaneando...');

                // Enviar código sin cambiar loading del botón
                socketService.scanBarcode(decodedText.trim()).catch((error: any) => {
                  setErrorMessage(error.message || 'Error al escanear código de barras');
                });
              },
              () => {}
            );
            console.log('✅ Cámara iniciada correctamente');
          } else {
            throw new Error('No se encontraron cámaras disponibles. Verifica los permisos del navegador.');
          }
        }
      } catch (error: any) {
        console.error('❌ Error completo:', error);
        
        // Mensaje más claro para móviles
        let userMessage = error.message;
        if (error.message?.includes('NotFoundError') || error.message?.includes('not found')) {
          userMessage = '⚠️ No se puede acceder a la cámara. Para usar la cámara en móvil desde una IP remota, necesitas HTTPS. Usa el input manual o una pistola escáner USB como alternativa.';
        }
        
        setErrorMessage(userMessage);
        setIsCameraActive(false);
      }
    };

    initCamera();

    return () => {
      // Limpiar al desmontar o desactivar
      if (html5QrCodeRef.current) {
        console.log('🛑 Deteniendo cámara...');
        html5QrCodeRef.current.stop()
          .catch((err) => {
            // Ignorar error si el scanner no está corriendo
            if (!err.message?.includes('not running')) {
              console.error('Error stopping camera:', err);
            }
          })
          .finally(() => {
            html5QrCodeRef.current?.clear();
          });
      }
    };
  }, [isCameraActive]);

  const stopCamera = () => {
    setIsCameraActive(false);
  };

  const toggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // const handleLinkWithQR = (scannedSessionId: string) => {
  //   // Guardar sessionId en localStorage
  //   localStorage.setItem('scanner-session-id', scannedSessionId);
    
  //   // Conectar con el sessionId del POS
  //   socketService.connect('scanner', scannedSessionId);
  //   setSessionId(scannedSessionId);
  //   setIsConnected(true);
  //   setShowQRLinkDialog(false);
  //   setIsLinkingQR(false);
    
  //   // Detener cámara QR si está activa
  //   if (html5QrCodeRef.current) {
  //     html5QrCodeRef.current.stop().catch(() => {});
  //   }
  // };

  // const handleUnlink = () => {
  //   localStorage.removeItem('scanner-session-id');
  //   socketService.disconnect();
  //   setSessionId(null);
  //   setIsConnected(false);
  //   setShowQRLinkDialog(true);
  // };

  // const startQRLinking = () => {
  //   setIsLinkingQR(true);
    
  //   // Usar la cámara para escanear QR del POS
  //   setTimeout(async () => {
  //     try {
  //       const readerId = qrReaderIdRef.current;
  //       html5QrCodeRef.current = new Html5Qrcode(readerId);

  //       // Intentar primero con facingMode: environment (cámara trasera)
  //       try {
  //         await html5QrCodeRef.current.start(
  //           { facingMode: 'environment' },
  //           {
  //             fps: 10,
  //             qrbox: { width: 250, height: 250 },
  //           },
  //           (decodedText) => {
  //             // QR escaneado - vincular
  //             handleLinkWithQR(decodedText);
  //           },
  //           () => {}
  //         );
  //       } catch (err) {
  //         console.log(err)
  //         // Si falla, buscar explícitamente cámara trasera en la lista
  //         const devices = await Html5Qrcode.getCameras();
  //         // Buscar cámara trasera por label o usar la última (suele ser trasera)
  //         const backCamera = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear') || d.label.toLowerCase().includes('trasera'));
  //         const cameraId = backCamera ? backCamera.id : (devices.length > 1 ? devices[devices.length - 1].id : devices[0].id);

  //         await html5QrCodeRef.current.start(
  //           cameraId,
  //           {
  //             fps: 10,
  //             qrbox: { width: 250, height: 250 },
  //           },
  //           (decodedText) => {
  //             handleLinkWithQR(decodedText);
  //           },
  //           () => {}
  //         );
  //       }
  //     } catch (error: any) {
  //       setErrorMessage('Error al iniciar cámara QR: ' + error.message);
  //       setIsLinkingQR(false);
  //     }
  //   }, 100);
  // };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleScan();
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(value);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      {/* Modal para vincular con POS mediante QR */}
      {/* <Dialog open={showQRLinkDialog} onOpenChange={(open) => !isLinkingQR && setShowQRLinkDialog(open)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Vincular con POS
            </DialogTitle>
            <DialogDescription>
              Escanea el código QR del POS para vincular este escáner
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            {!isLinkingQR ? (
              <>
                <QrCode className="h-16 w-16 text-muted-foreground" />
                <p className="text-center text-sm text-muted-foreground">
                  1. En el POS, presiona el botón "Vincular Escáner"<br />
                  2. Se mostrará un código QR<br />
                  3. Presiona el botón de abajo para escanear
                </p>
                <Button onClick={startQRLinking} className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Escanear QR del POS
                </Button>
              </>
            ) : (
              <>
                <div 
                  id={qrReaderIdRef.current}
                  className="border-2 border-primary rounded-lg overflow-hidden w-full"
                />
                <p className="text-sm text-muted-foreground text-center">
                  Apunta la cámara al código QR del POS
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog> */}

      
      {/* Input para escanear */}
      <Card className="mb-4">
        <CardContent className="pt-6">
          {/* Botones de control de cámara */}
          <div className="flex gap-2 mb-4">
            <Button 
              onClick={toggleCamera}
              variant={isCameraActive ? 'destructive' : 'default'}
              className="flex-1"
            >
              {isCameraActive ? (
                <>
                  <CameraOff className="mr-2 h-4 w-4" />
                  Detener Cámara
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  Activar Cámara
                </>
              )}
            </Button>
          </div>

          {/* Visor de cámara */}
          {isCameraActive && (
            <div className="mb-4">
              <div 
                id={readerIdRef.current}
                className="border-2 border-primary rounded-lg overflow-hidden !max-h-[200px]"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Escanea o ingresa código de barras..."
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isScanning || !isConnected}
              className="text-lg"
              autoFocus
            />
            <Button 
              onClick={handleScan} 
              disabled={isScanning || !barcode.trim() || !isConnected}
              size="lg"
            >
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Escaneando...
                </>
              ) : (
                'Escanear'
              )}
            </Button>
          </div>

          {/* Mensajes de éxito/error */}
          {successMessage && (
            <Alert className="mt-4 border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {errorMessage && (
            <Alert className="mt-4 border-red-500 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Header con estado de conexión */}
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Barcode className="h-6 w-6" />
                Escáner de Códigos de Barras
              </CardTitle>
              <CardDescription>
                Escanea productos para agregarlos al POS
              </CardDescription>
            </div>
            <Badge variant={isConnected ? 'default' : 'destructive'} className="flex items-center gap-1">
              {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {isConnected ? 'Conectado' : 'Desconectado'}
            </Badge>
          </div>
        </CardHeader>
        {/* <CardContent>
          {sessionId && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                ID de Sesión: <code className="text-xs bg-muted px-1 py-0.5 rounded">{sessionId.substring(0, 20)}...</code>
              </p>
              <Button onClick={handleUnlink} variant="outline" size="sm">
                <LinkIcon className="h-3 w-3 mr-1" />
                Cambiar POS
              </Button>
            </div>
          )}
        </CardContent> */}
      </Card>

      {/* Último producto escaneado */}
      {lastScanned && (
        <Card className="mb-4 border-green-500">
          <CardHeader>
            <CardTitle className="text-lg">Último Producto Escaneado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-semibold text-lg">{lastScanned.nombre}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Código:</span> {lastScanned.codigo}
                </div>
                <div>
                  <span className="text-muted-foreground">Categoría:</span> {lastScanned.categoria.nombre}
                </div>
                <div>
                  <span className="text-muted-foreground">Precio:</span> {formatCurrency(Number(lastScanned.precioVenta))}
                </div>
                <div>
                  <span className="text-muted-foreground">Stock:</span> {lastScanned.stock} unidades
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historial de escaneos */}
      {scanHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Historial de Escaneos</CardTitle>
            <CardDescription>Últimos {scanHistory.length} productos escaneados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {scanHistory.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2 border rounded hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.producto.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.producto.codigo} • {formatCurrency(Number(item.producto.precioVenta))}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatTime(item.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
