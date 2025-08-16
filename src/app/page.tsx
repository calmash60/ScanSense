
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, LogIn, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';


export default function WelcomePage() {
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
                                <Link href="/scanner">
                                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                        <div>
                            <Card className="shadow-2xl overflow-hidden">
                                <CardContent className="p-0">
                                    <Image 
                                        src="https://placehold.co/600x400.png"
                                        alt="A person scanning a QR code with their phone"
                                        width={600}
                                        height={400}
                                        className="object-cover"
                                        data-ai-hint="person scanning qr code"
                                    />
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
