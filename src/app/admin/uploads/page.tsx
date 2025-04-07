// frontend/src/app/admin/uploads/page.tsx
"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast"; // Corrected useToast import path
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/useAuthStore'; // <-- Import Auth Store
import { Loader2 } from 'lucide-react'; // Import Loader

// User interface defined in auth store, no need to redefine unless different fields needed
// interface User { ... }

export default function AdminUploadPage() {
    const router = useRouter();
    const { toast } = useToast();
    // --- Get Auth State ---
    const { user, token, isAuthenticated, isLoading: isLoadingAuth } = useAuthStore();

    // --- Component State ---
    // Removed local user state, using global store now
    // Removed isLoadingUser, using isLoadingAuth from store
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [hasMounted, setHasMounted] = useState(false); // <-- Add hasMounted state

    // --- Effect to set hasMounted on client ---
    useEffect(() => {
        setHasMounted(true);
    }, []);

    // --- Authentication and Authorization Check ---
    useEffect(() => {
        // Check after mount and after auth state is loaded
        if (hasMounted && !isLoadingAuth) {
            if (!isAuthenticated) {
                toast({ title: "Access Denied", description: "Please log in.", variant: "destructive" });
                router.push('/login');
            } else if (user?.role !== 'admin') { // Check role AFTER confirming user exists
                toast({ title: "Access Denied", description: "You do not have permission to view this page.", variant: "destructive" });
                router.push('/dashboard'); // Redirect non-admins away
            }
        }
    }, [hasMounted, isLoadingAuth, isAuthenticated, user, router, toast]); // Add dependencies


    // --- File Handling ---
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // ... (keep existing file change logic) ...
         if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (file.type !== 'application/pdf') {
                 toast({ title: "Invalid File Type", description: "Please select a PDF file.", variant: "destructive" });
                 setSelectedFile(null);
                 if (fileInputRef.current) { fileInputRef.current.value = ""; }
                 return;
            }
             if (file.size > 25 * 1024 * 1024) {
                toast({ title: "File Too Large", description: "File size cannot exceed 25MB.", variant: "destructive" });
                setSelectedFile(null);
                if (fileInputRef.current) { fileInputRef.current.value = ""; }
                return;
            }
            setSelectedFile(file);
            setUploadProgress(0);
        } else {
            setSelectedFile(null);
        }
    };

    // --- Form Submission ---
    const handleUpload = async () => {
        if (!selectedFile) { /* ... no file check ... */ return; }
        // Re-check role just before upload for extra safety
        if (!user || user.role !== 'admin') { /* ... auth check ... */ return; }
        // --- Use token from store ---
         if (!token) {
            toast({ title: "Authentication Error", description: "Token not found. Please log in again.", variant: "destructive" });
             router.push('/login');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        const formData = new FormData();
        formData.append('sbcFile', selectedFile);

        try {
             setUploadProgress(50); // Simulate progress

            const response = await fetch('http://localhost:3003/api/content/upload/sbc', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Use token from store
                },
                body: formData,
            });

             setUploadProgress(100);

            const data = await response.json();

            if (!response.ok) { /* ... error handling ... */
                 console.error("Upload failed:", data);
                toast({
                    title: `Upload Failed (${response.status})`,
                    description: data.error || "An error occurred during upload.",
                    variant: "destructive",
                });
            } else { /* ... success handling ... */
                 console.log("Upload successful:", data);
                toast({
                    title: "Upload Successful!",
                    description: `File "${selectedFile.name}" uploaded. Path: ${data.filePath}`,
                });
                setSelectedFile(null);
                 if (fileInputRef.current) { fileInputRef.current.value = ""; }
            }

        } catch (error) { /* ... network error handling ... */
             console.error("Network or unexpected error during upload:", error);
            setUploadProgress(0);
            toast({
                title: "Upload Error",
                description: "Could not connect to the server or an unexpected error occurred.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
             setTimeout(() => setUploadProgress(0), 2000);
        }
    };

    // --- Render Logic ---

    // --- Initial Render (Pre-Mount/Hydration) ---
    if (!hasMounted) {
        return null;
    }

    // --- Loading State (for initial auth check) ---
    if (isLoadingAuth) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100">
                 <Loader2 className="h-8 w-8 animate-spin mr-3 text-brand-midblue" /> Checking permissions...
            </div>
        );
    }

    // --- Not Authenticated or Not Admin State ---
    // This check runs after mount and loading are complete
    if (!isAuthenticated || !user || user.role !== 'admin') {
         // The useEffect should have already redirected, but this is a fallback UI state
         return (
             <div className="flex items-center justify-center min-h-screen bg-slate-100 text-red-600">
                 Access Denied. You must be an administrator logged in to view this page.
            </div>
         );
    }

    // --- Main Admin Upload Page Content ---
    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
                    <div>
                        <h1 className="text-3xl font-bold text-brand-darkblue">
                            Admin - Upload SBC Document
                        </h1>
                        <p className="text-slate-500 mt-1">Upload and manage curriculum documents</p>
                    </div>
                    <Button variant="outline" onClick={() => router.push('/dashboard')} className="border-brand-darkblue text-brand-darkblue hover:bg-brand-darkblue/10">
                        Back to Dashboard
                    </Button>
                </header>

                <Card className="w-full shadow-md border-0">
                    <CardHeader className="bg-brand-darkblue/5 border-b border-slate-200">
                        <CardTitle className="text-brand-darkblue">Upload New Document</CardTitle>
                        <CardDescription>Select a PDF file (Max 25MB) containing SBC curriculum, handbook, etc.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="sbc-file" className="text-sm font-medium text-slate-700">Select PDF File</Label>
                            <div className="relative">
                                <Input
                                    id="sbc-file"
                                    name="sbcFile"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                    ref={fileInputRef}
                                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-orange file:text-white hover:file:bg-brand-orange/90 border-slate-300 focus:border-brand-darkblue focus:ring-brand-darkblue/20"
                                />
                            </div>
                        </div>

                        {selectedFile && (
                            <div className="mt-2 p-4 bg-slate-50 rounded-md border border-slate-200">
                                <div className="flex items-center">
                                    <div className="p-2 bg-brand-darkblue/10 rounded-full mr-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-darkblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">Selected File:</p>
                                        <p className="text-sm text-slate-600">{selectedFile.name}</p>
                                        <p className="text-xs text-slate-500 mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {isUploading && (
                            <div className="mt-4 space-y-3 p-4 bg-slate-50 rounded-md border border-slate-200">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium text-slate-700">Upload Progress:</p>
                                    <p className="text-sm font-medium text-brand-darkblue">{uploadProgress}%</p>
                                </div>
                                <Progress value={uploadProgress} className="h-2 bg-slate-200" />
                            </div>
                        )}

                        <Button
                            onClick={handleUpload}
                            disabled={!selectedFile || isUploading}
                            className="w-full bg-brand-darkblue hover:bg-brand-darkblue/90 h-11 text-base font-medium shadow-sm"
                        >
                            {isUploading ? (
                                <div className="flex items-center justify-center">
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Uploading...
                                </div>
                            ) : 'Upload File'}
                        </Button>
                    </CardContent>
                </Card>

                {/* TODO: List uploaded documents */}
                <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-brand-darkblue mb-4">Uploaded Documents</h2>
                    <p className="text-slate-500">No documents uploaded yet.</p>
                </div>
            </div>
        </div>
    );
}