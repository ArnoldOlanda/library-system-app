import { QRCodeSVG } from "qrcode.react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { QrCode, X } from "lucide-react";

interface Props{
    show: boolean;
    sessionId: string;
    setShow: (show: boolean) => void;
}

export const QrCodeScannerDialog = ({ show, sessionId, setShow }: Props) => {

    const SCANNER_URL = import.meta.env.VITE_SCANNER_URL || "http://localhost:5173/scanner";

    return (
        <Dialog open={show} onOpenChange={setShow}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <QrCode className="h-5 w-5" />
                        Vincular Escáner Móvil
                    </DialogTitle>
                    <DialogDescription>
                        Escanea este código QR desde tu móvil para vincular el escáner a este dispositivo.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center p-6 space-y-4">
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                        <QRCodeSVG
                            value={`${SCANNER_URL}?sessionId=${sessionId}`}
                            size={256}
                            level="H"
                            includeMargin={true}
                        />
                    </div>
                    {/* <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">
                            1. Abre <span className="font-semibold">{SCANNER_URL}</span> en tu móvil
                        </p>
                        <p className="text-sm text-muted-foreground">
                            2. Presiona "Vincular con código QR"
                        </p>
                        <p className="text-sm text-muted-foreground">
                            3. Escanea este código QR
                        </p>
                    </div> */}
                    <Button onClick={() => setShow(false)} variant="outline" className="w-full">
                        <X className="h-4 w-4 mr-2" />
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
