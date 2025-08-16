"use client";

import { useEffect, useLayoutEffect } from 'react';
import type { Html5QrcodeScanner, QrCodeSuccessCallback, QrCodeErrorCallback } from 'html5-qrcode';
import { cn } from '@/lib/utils';

interface QrScannerProps {
  onScanSuccess: QrCodeSuccessCallback;
  onScanError?: QrCodeErrorCallback;
  className?: string;
}

const QrScanner = ({ onScanSuccess, onScanError, className }: QrScannerProps) => {
  const scannerRegionId = "html5qr-code-full-region";

  useLayoutEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    // Dynamically import the scanner to avoid SSR issues
    import('html5-qrcode').then(({ Html5QrcodeScanner }) => {
        scanner = new Html5QrcodeScanner(
          scannerRegionId,
          {
            fps: 10,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
              const qrboxSize = Math.floor(minEdge * 0.8);
              return {
                width: qrboxSize,
                height: qrboxSize,
              };
            },
            rememberLastUsedCamera: true,
            supportedScanTypes: [],
          },
          false // verbose
        );
  
        const successCallback: QrCodeSuccessCallback = (decodedText, decodedResult) => {
            if (scanner) {
                // Check if we can pause before pausing
                if (scanner.getState() === 2) { // 2 === Html5QrcodeScannerState.SCANNING
                   scanner.pause(true);
                }
            }
            onScanSuccess(decodedText, decodedResult);
        };
  
        scanner.render(successCallback, onScanError);
    });

    return () => {
      if (scanner) {
        scanner.clear().catch(error => {
          console.error("Failed to clear html5-qrcode-scanner.", error);
        });
        scanner = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id={scannerRegionId} className={cn("w-full h-full", className)}></div>
  );
};

export default QrScanner;
