"use client";

import { useEffect, useRef, useLayoutEffect } from 'react';
import type { Html5QrcodeScanner, QrCodeSuccessCallback, QrCodeErrorCallback } from 'html5-qrcode';
import { cn } from '@/lib/utils';

interface QrScannerProps {
  onScanSuccess: QrCodeSuccessCallback;
  onScanError?: QrCodeErrorCallback;
  className?: string;
}

const QrScanner = ({ onScanSuccess, onScanError, className }: QrScannerProps) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerRegionId = "html5qr-code-full-region";

  useLayoutEffect(() => {
    // Dynamically import the scanner to avoid SSR issues
    import('html5-qrcode').then(({ Html5QrcodeScanner }) => {
      if (!scannerRef.current) {
        const scanner = new Html5QrcodeScanner(
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
            if (scannerRef.current) {
                // Check if we can pause before pausing
                if (scannerRef.current.getState() === 2) { // 2 === Html5QrcodeScannerState.SCANNING
                   scannerRef.current.pause(true);
                }
            }
            onScanSuccess(decodedText, decodedResult);
        };
  
        scanner.render(successCallback, onScanError);
        scannerRef.current = scanner;
      }
    });

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5-qrcode-scanner.", error);
        });
        scannerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id={scannerRegionId} className={cn("w-full h-full [&>div]:w-full [&>div]:h-full [&>div>span]:hidden [&>div>button]:hidden", className)}></div>
  );
};

export default QrScanner;
