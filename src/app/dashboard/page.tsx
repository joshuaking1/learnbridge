// frontend/src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { AiChatInterface } from '@/components/ai/AiChatInterface';
import Link from 'next/link';
import { useAuthStore } from '@/stores/useAuthStore';
import { Loader2, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// Add declaration for lucide-react to fix TypeScript error
declare module 'lucide-react';

// Keep User interface or enhance it based on actual DB fields
interface User {
    id: number;
    email: string;
    first_name: string;
    surname?: string;
    role: string;
    school?: string;
    location?: string;
    phone?: string;
    gender?: string;
    email_verified: boolean;
    created_at: string;
    updated_at: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const { toast } = useToast();
    
    // --- State to prevent hydration mismatch ---
    const [hasMounted, setHasMounted] = useState(false);
    
    // --- Get state and actions from the store ---
    // Only access auth state after component has mounted
    const { user, isAuthenticated, isLoading: isLoadingAuth, clearAuth } = useAuthStore();

    // --- Effect to set hasMounted on client ---
    useEffect(() => {
        setHasMounted(true);
        console.log("Component mounted, auth state:", { 
            isLoading: isLoadingAuth, 
            isAuthenticated, 
            hasUser: !!user 
        });
    }, [isAuthenticated, user, isLoadingAuth]);

    // --- Effect to handle authentication ---
    useEffect(() => {
        if (hasMounted && !isLoadingAuth && !isAuthenticated) {
            console.log("Not authenticated, redirecting to login");
            router.push('/login');
        }
    }, [hasMounted, isAuthenticated, isLoadingAuth, router]);

    // --- Loading state ---
    if (!hasMounted || isLoadingAuth) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
            </div>
        );
    }

    // --- Not authenticated state ---
    if (!isAuthenticated) {
        return null; // Will redirect in useEffect
    }

    // --- Logout handler ---
    const handleLogout = () => {
        clearAuth();
        router.push('/');
    };

    // --- Render dashboard ---
    return (
        <div className="bg-gradient-to-br from-brand-darkblue to-brand-midblue p-2 sm:p-4">
            <div className="container mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
                    <h1 className="text-2xl sm:text-3xl font-arvo font-bold text-white">
                        Welcome, {user?.first_name || 'User'}
                    </h1>
                    <Button 
                        onClick={handleLogout}
                        variant="outline"
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 w-full sm:w-auto"
                    >
                        Logout
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Dashboard Cards */}
                    <Link href="/dashboard/lesson-planner" className="block">
                        <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-white/20 hover:bg-white/20 transition-all">
                            <h2 className="text-lg sm:text-xl font-arvo font-bold text-white mb-2">Lesson Planner</h2>
                            <p className="text-white/80 text-sm sm:text-base">Create and manage your lesson plans with AI assistance</p>
                        </div>
                    </Link>

                    <Link href="/dashboard/my-lessons" className="block">
                        <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-white/20 hover:bg-white/20 transition-all">
                            <h2 className="text-lg sm:text-xl font-arvo font-bold text-white mb-2">My Lessons</h2>
                            <p className="text-white/80 text-sm sm:text-base">View and manage your saved lesson plans</p>
                        </div>
                    </Link>

                    <Link href="/dashboard/assessment-creator" className="block">
                        <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-white/20 hover:bg-white/20 transition-all">
                            <h2 className="text-lg sm:text-xl font-arvo font-bold text-white mb-2">Assessment Creator</h2>
                            <p className="text-white/80 text-sm sm:text-base">Generate assessments and quizzes for your students</p>
                        </div>
                    </Link>

                    <Link href="/dashboard/my-assessments" className="block">
                        <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-white/20 hover:bg-white/20 transition-all">
                            <h2 className="text-lg sm:text-xl font-arvo font-bold text-white mb-2">My Assessments</h2>
                            <p className="text-white/80 text-sm sm:text-base">View and manage your saved assessments</p>
                        </div>
                    </Link>

                    <Link href="/dashboard/rubric-generator" className="block">
                        <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-white/20 hover:bg-white/20 transition-all">
                            <h2 className="text-lg sm:text-xl font-arvo font-bold text-white mb-2">Rubric Generator</h2>
                            <p className="text-white/80 text-sm sm:text-base">Create grading rubrics for your assessments</p>
                        </div>
                    </Link>

                    <Link href="/dashboard/tos-builder" className="block">
                        <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-white/20 hover:bg-white/20 transition-all">
                            <h2 className="text-lg sm:text-xl font-arvo font-bold text-white mb-2">TOS Builder</h2>
                            <p className="text-white/80 text-sm sm:text-base">Generate terms of service for your educational content</p>
                        </div>
                    </Link>
                </div>

                {/* AI Chat Interface */}
                <div className="mt-6 sm:mt-8">
                    <AiChatInterface />
                </div>

                {/* Role-specific content */}
                {user && user.role === 'admin' && (
                    <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                        <div className="p-4 sm:p-6 bg-white border rounded-lg shadow space-y-3">
                            <h3 className="text-lg sm:text-xl font-semibold text-brand-orange">Admin Tools</h3>
                            <div className="flex flex-wrap gap-2">
                                <Link href="/admin/uploads"><Button variant="secondary" className="w-full sm:w-auto">Upload Documents</Button></Link>
                                {/* Add links to user management, etc. later */}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- OTHER ROLES (Generic Welcome) --- */}
                {user && user.role !== 'teacher' && user.role !== 'student' && user.role !== 'admin' && (
                    <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white border rounded-lg shadow">
                        <h3 className="text-lg sm:text-xl font-semibold text-brand-orange">Welcome</h3>
                        <p className="text-slate-600">Your dashboard content will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- NEW: Student Content Viewer Component (defined in the same file for simplicity initially) ---

interface ContentChunk {
    id: number;
    content: string;
    source_document_name: string | null;
    chunk_index: number;
    similarity?: number; // Optional similarity score from search
}

function StudentContentViewer() {
    const { token } = useAuthStore(); // Need token for API calls
    const { toast } = useToast();

    // State for selections and content
    const [selectedSubject, setSelectedSubject] = useState<string>("");
    const [selectedGrade, setSelectedGrade] = useState<string>(""); // Assuming grade maps to class_level
    const [selectedTopic, setSelectedTopic] = useState<string>(""); // Optional topic input
    const [contentChunks, setContentChunks] = useState<ContentChunk[]>([]);
    const [isLoadingContent, setIsLoadingContent] = useState(false);
    const [errorLoadingContent, setErrorLoadingContent] = useState<string | null>(null);

    // TODO: Populate these dynamically later if needed
    const subjects = ["Integrated Science", "Mathematics", "English Language", "Social Studies", "Art and Design Studio", "Computing"];
    const grades = ["JHS 1", "JHS 2", "JHS 3", "SHS 1", "SHS 2", "SHS 3"];

    const fetchContent = async () => {
        if (!selectedSubject || !selectedGrade || !token) {
            setContentChunks([]); // Clear content if inputs are missing
            return;
        }

        setIsLoadingContent(true);
        setErrorLoadingContent(null);
        setContentChunks([]); // Clear previous content

        // Construct query parameters
        const params = new URLSearchParams({
            subject: selectedSubject,
            grade: selectedGrade,
        });
        if (selectedTopic.trim()) {
            params.append('topic', selectedTopic.trim());
        }

        try {
            const response = await fetch(`https://content-service-e54f.onrender.com/api/content/student-material?${params.toString()}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                let errorMsg = `Failed to fetch content (Status: ${response.status})`;
                try { 
                    const data = await response.json(); 
                    errorMsg = data.error || errorMsg; 
                } catch {
                    // Ignore JSON parse error
                }
                throw new Error(errorMsg);
            }

            const data = await response.json();
            setContentChunks(data.chunks || []);

        } catch (error: Error | unknown) {
            console.error("Error fetching student content:", error);
            const errorMessage = error instanceof Error ? error.message : "Could not load learning material.";
            setErrorLoadingContent(errorMessage);
            toast({ 
                title: "Loading Error", 
                description: errorMessage, 
                variant: "destructive" 
            });
        } finally {
            setIsLoadingContent(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Learning Material</CardTitle>
                <CardDescription>Select your subject and grade to find relevant SBC content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Selection Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Subject Select */}
                    <div className="space-y-1">
                        <Label htmlFor="student-subject">Subject</Label>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger id="student-subject">
                                <SelectValue placeholder="Select Subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Grade Select */}
                    <div className="space-y-1">
                        <Label htmlFor="student-grade">Grade/Level</Label>
                        <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                            <SelectTrigger id="student-grade">
                                <SelectValue placeholder="Select Grade" />
                            </SelectTrigger>
                            <SelectContent>
                                {grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Topic Input (Optional) */}
                    <div className="space-y-1">
                        <Label htmlFor="student-topic">Topic (Optional)</Label>
                        <Input
                            id="student-topic"
                            placeholder="Enter specific topic..."
                            value={selectedTopic}
                            onChange={(e) => setSelectedTopic(e.target.value)}
                        />
                    </div>
                </div>
                {/* Fetch Button */}
                <Button onClick={fetchContent} disabled={!selectedSubject || !selectedGrade || isLoadingContent} className="w-full sm:w-auto">
                    {isLoadingContent ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Load Material
                </Button>

                <Separator />

                {/* Content Display Area */}
                <div className="mt-4 space-y-4">
                    {isLoadingContent && (
                        <div className="flex justify-center items-center py-6"><Loader2 className="h-6 w-6 animate-spin text-brand-midblue" /></div>
                    )}
                    {!isLoadingContent && errorLoadingContent && (
                        <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{errorLoadingContent}</AlertDescription></Alert>
                    )}
                    {!isLoadingContent && !errorLoadingContent && contentChunks.length === 0 && (
                        <p className="text-center text-gray-500 py-6">Select subject and grade, then click &quot;Load Material&quot;. No content found for the current selection.</p>
                    )}
                    {!isLoadingContent && !errorLoadingContent && contentChunks.length > 0 && (
                        <ScrollArea className="h-[40vh] sm:h-[50vh] p-3 sm:p-4 border rounded-md bg-white text-black"> {/* Scrollable content */}
                            <h3 className="text-base sm:text-lg font-semibold mb-3 text-brand-darkblue">Relevant Content:</h3>
                            {contentChunks.map(chunk => (
                                <div key={chunk.id} className="mb-4 pb-4 border-b last:border-b-0">
                                    <p className="text-xs text-gray-500 mb-1">
                                        Source: {chunk.source_document_name || 'Unknown'} (Chunk {chunk.chunk_index})
                                        {chunk.similarity && ` | Similarity: ${(chunk.similarity * 100).toFixed(1)}%`}
                                    </p>
                                    {/* Render chunk content using Markdown */}
                                    <div className="prose prose-sm max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {chunk.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            ))}
                        </ScrollArea>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}