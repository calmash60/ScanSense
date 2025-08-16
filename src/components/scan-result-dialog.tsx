"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, ExternalLink } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import type { Scan } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface ScanResultDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  scan: Scan | null;
  isLoading: boolean;
}

const ScanResultDialog = ({ isOpen, onOpenChange, scan, isLoading }: ScanResultDialogProps) => {
  const { toast } = useToast();
  const [isShareAvailable, setIsShareAvailable] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.share) {
      setIsShareAvailable(true);
    }
  }, []);

  const handleCopy = () => {
    if (scan?.content) {
        navigator.clipboard.writeText(scan.content);
        toast({ title: "Copied to clipboard!" });
    }
  };

  const handleShare = async () => {
    if (scan?.content && navigator.share) {
      try {
        await navigator.share({
          title: 'Scanned Content',
          text: scan.content,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        toast({ title: "Could not share content", variant: "destructive" });
      }
    } else {
      toast({ title: "Web Share API not supported in your browser.", variant: "destructive" });
    }
  };
  
  const isUrl = (text: string | undefined) => !!text && /^(https|http):\/\/[^\s$.?#].[^\s]*$/.test(text);

  const handleOpenUrl = () => {
      if (scan?.content && isUrl(scan.content)) {
          window.open(scan.content, '_blank', 'noopener,noreferrer');
      }
  }

  const renderLoadingState = () => (
    <>
      <div className="py-4 space-y-4">
        <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-muted-foreground">Category</p>
            <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4 mt-2" />
        </div>
      </div>
      <DialogFooter className="gap-2 sm:justify-start">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-24" />
      </DialogFooter>
    </>
  );

  const renderResultState = () => (
    <>
      <div className="py-4 space-y-4">
          <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-muted-foreground">Category</p>
              <Badge variant="secondary">{scan?.category}</Badge>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg break-words max-h-40 overflow-y-auto">
              <p className="font-mono text-sm">{scan?.content}</p>
          </div>
      </div>
      <DialogFooter className="gap-2 flex-wrap sm:justify-start">
          {isUrl(scan?.content) && (
              <Button onClick={handleOpenUrl}>
                  <ExternalLink className="mr-2 h-4 w-4" /> Open Link
              </Button>
          )}
          <Button variant="outline" onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" /> Copy
          </Button>
          {isShareAvailable && (
              <Button variant="outline" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
          )}
      </DialogFooter>
    </>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isLoading ? "Processing Scan" : "Scan Result"}</DialogTitle>
          <DialogDescription>
            {isLoading
              ? "AI is categorizing the content. Please wait."
              : "Content has been successfully scanned and categorized."}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? renderLoadingState() : renderResultState()}
      </DialogContent>
    </Dialog>
  );
};

export default ScanResultDialog;
