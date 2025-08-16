
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, LogIn, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function WelcomePage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const getStartedLink = user ? '/scanner' : '/login';

    if (loading) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
              <div className="w-4 h-4 rounded-full bg-primary animate-pulse [animation-delay:0.2s]"></div>
              <div className="w-4 h-4 rounded-full bg-primary animate-pulse [animation-delay:0.4s]"></div>
              <span className="ml-2">Loading...</span>
            </div>
          </div>
        );
    }
    
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 p-4 sm:p-6">
                    <div className="flex items-center gap-3">
                        <QrCode className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-bold tracking-tight text-primary">
                        ScanSense
                        </h1>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/login">
                            <LogIn className="mr-2 h-4 w-4" /> Login / Sign Up
                        </Link>
                    </Button>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl w-full mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary">
                                The Smart QR Scanner
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Scan, categorize, and manage QR codes effortlessly. ScanSense uses AI to intelligently understand the content of any QR code, making your life easier.
                            </p>
                            <Button asChild size="lg">
                                <Link href={getStartedLink}>
                                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                        <div>
                            <Card className="shadow-2xl overflow-hidden aspect-square flex items-center justify-center bg-primary/5 border-2 border-dashed">
                                <CardContent className="p-0">
                                    <QrCode className="w-48 h-48 text-primary/30" strokeWidth={1} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-6 px-4 border-t">
                <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
                    &copy; {new Date().getFullYear()} ScanSense. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
