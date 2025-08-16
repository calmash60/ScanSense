"use client";

import { useState } from 'react';
import { QrCode, Zap } from 'lucide-react';
import type { QrCodeSuccessCallback } from 'html5-qrcode';
import useLocalStorage from '@/hooks/use-local-storage';
import { getCategory } from './actions';
import type { Scan } from '@/lib/types';
import QrScanner from '@/components/qr-scanner';
import ScanHistory from '@/components/scan-history';
import ScanResultDialog from '@/components/scan-result-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const [history, setHistory] = useLocalStorage<Scan[]>('scan-history', []);
  const [activeScan, setActiveScan] = useState<Scan | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

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
            <QrCode className="w-10 h-10" />
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
                    <div className='relative w-full h-[480px]'>
                        <QrScanner onScanSuccess={handleScanSuccess} onScanError={handleScanError} />
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
