"use client";

import type { Scan } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { History, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ScanHistoryProps {
  history: Scan[];
  onClearHistory: () => void;
  onSelectHistoryItem: (scan: Scan) => void;
}

const ScanHistory = ({ history, onClearHistory, onSelectHistoryItem }: ScanHistoryProps) => {

  return (
    <Card className="w-full h-full flex flex-col shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-primary" />
            <CardTitle className="text-primary/90">Scan History</CardTitle>
          </div>
          {history.length > 0 && (
            <Button variant="ghost" size="icon" onClick={onClearHistory} aria-label="Clear history">
              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
            </Button>
          )}
        </div>
        <CardDescription>Click on an item to see details and actions.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-0">
        <ScrollArea className="h-[380px]">
          <div className="p-6 pt-0">
            {history.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">
                <p>No scans yet.</p>
                <p className="text-sm">Your scanned QR codes will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((scan) => (
                  <button 
                    key={scan.id} 
                    className="w-full text-left p-4 rounded-lg border bg-background/50 hover:bg-accent/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring" 
                    onClick={() => onSelectHistoryItem(scan)}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-grow min-w-0">
                        <p className="font-semibold truncate">{scan.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(scan.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                      <Badge variant="secondary" className="flex-shrink-0">{scan.category}</Badge>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ScanHistory;
