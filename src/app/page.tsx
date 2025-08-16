"use client";

import { useState, useEffect, useRef } from 'react';
import { QrCode, Zap, Camera, AlertCircle } from 'lucide-react';
import type { QrCodeSuccessCallback } from 'html5-qrcode';
import useLocalStorage from '@/hooks/use-local-storage';
import { getCategory } from './actions';
import type { Scan } from '@/lib/types';
import QrScanner from '@/components/qr-scanner';
import ScanHistory from '@/components/scan-history';
import ScanResultDialog from '@/components/scan-result-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";


export default function Home() {
  const [history, setHistory] = useLocalStorage<Scan[]>('scan-history', []);
  const [activeScan, setActiveScan] = useState<Scan | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    let stream: MediaStream;
    const getCameraPermission = async () => {
      if (isScanning) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this app.',
          });
        }
      }
    };

    getCameraPermission();
    
    return () => {
        if(stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [isScanning, toast]);


  const handleScanSuccess: QrCodeSuccessCallback = async (decodedText) => {
    setIsScanning(false);
    setIsCategorizing(true);
    
    const tempScan: Scan = {
      id: new Date().toISOString(),
      content: decodedText,
      category: '...',
      timestamp: Date.now(),
    };
    setActiveScan(tempScan);
    setIsResultOpen(true);

    const category = await getCategory(decodedText);

    const newScan: Scan = { ...tempScan, category };
    
    setActiveScan(newScan);
    setHistory(prevHistory => [newScan, ...prevHistory].slice(0, 50)); // Keep history to 50 items
    setIsCategorizing(false);
  };
  
  const handleScanError = (errorMessage: string) => {
    if (!errorMessage.includes("No QR code found")) {
        console.error(`QR Code scan error: ${errorMessage}`);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
  };
  
  const handleHistoryItemSelect = (scan: Scan) => {
    setActiveScan(scan);
    setIsResultOpen(true);
  }

  const handleDialogClose = (open: boolean) => {
    setIsResultOpen(open);
    if(!open) {
      setActiveScan(null);
    }
  }

  const StartScanningButton = () => (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-10 text-center bg-accent/10 rounded-lg border-2 border-dashed border-accent/30">
        <div className="p-4 rounded-full bg-primary text-primary-foreground shadow-lg">
            <Camera className="w-10 h-10" />
        </div>
        <div className='space-y-2'>
            <h2 className="text-2xl font-bold text-primary/90">Ready to Scan</h2>
            <p className="text-muted-foreground max-w-sm">Press the button below to start your camera and scan a QR code. The content will be analyzed by AI.</p>
        </div>
        <Button size="lg" onClick={() => setIsScanning(true)} className="shadow-md">
            <Zap className="mr-2 h-5 w-5" /> Start Scanning
        </Button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto flex items-center gap-3 p-4 sm:p-6">
          <QrCode className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            ScanSense
          </h1>
        </div>
      </header>

      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <Card className="min-h-[480px] w-full overflow-hidden shadow-lg">
                <CardContent className="p-0 h-full">
                  {isScanning ? (
                    <div className='relative w-full h-[480px] flex flex-col justify-center items-center bg-black'>
                      <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                      <div className="absolute inset-0">
                        {hasCameraPermission === true && (
                          <QrScanner onScanSuccess={handleScanSuccess} onScanError={handleScanError} />
                        )}
                        {hasCameraPermission === false && (
                          <div className="w-full h-full flex flex-col justify-center items-center bg-black/50">
                            <Alert variant="destructive" className="m-4 max-w-sm">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Camera Access Required</AlertTitle>
                              <AlertDescription>
                                Please allow camera access to use this feature. You may need to grant permission in your browser settings.
                              </AlertDescription>
                            </Alert>
                          </div>
                        )}
                        {hasCameraPermission === null && (
                         <div className="w-full h-full flex justify-center items-center bg-black/50">
                           <div className="flex items-center space-x-2 text-white">
                             <div className="w-4 h-4 rounded-full bg-white animate-pulse"></div>
                             <div className="w-4 h-4 rounded-full bg-white animate-pulse [animation-delay:0.2s]"></div>
                             <div className="w-4 h-4 rounded-full bg-white animate-pulse [animation-delay:0.4s]"></div>
                             <span className="ml-2">Requesting camera access...</span>
                           </div>
                         </div>
                        )}
                      </div>

                      <Button variant="destructive" className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10" onClick={() => setIsScanning(false)}>Stop Scanning</Button>
                    </div>
                  ) : (
                    <StartScanningButton />
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 min-h-[480px]">
              <ScanHistory history={history} onClearHistory={handleClearHistory} onSelectHistoryItem={handleHistoryItemSelect} />
            </div>
          </div>
        </div>
      </main>
      
      <ScanResultDialog 
        isOpen={isResultOpen} 
        onOpenChange={handleDialogClose} 
        scan={activeScan} 
        isLoading={isCategorizing} 
      />
    </div>
  );
}
