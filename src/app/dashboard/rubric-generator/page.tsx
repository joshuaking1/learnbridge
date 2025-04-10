// frontend/src/app/dashboard/rubric-generator/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from '@/stores/useAuthStore';

// Validation Schema for Rubric Inputs
const rubricSchema = z.object({
    assessmentTitle: z.string().min(5, { message: "Assessment Title is required (min 5 chars)." }),
    assessmentType: z.string().min(3, { message: "Assessment Type is required." }),
    classLevel: z.string().min(1, { message: "Class Level is required." }),
    taskDescription: z.string().min(20, { message: "Task Description is required (min 20 chars)." }),
    maxScore: z.coerce.number().positive({ message: "Max Score must be positive." }).optional(), // Optional, defaults on backend
});

type RubricFormValues = z.infer<typeof rubricSchema>;

export default function RubricGeneratorPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedRubric, setGeneratedRubric] = useState<string | null>(null);

    // --- Auth State & Hydration Fix ---
    const { user, token, isAuthenticated, isLoading: isLoadingAuth } = useAuthStore();
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => { setHasMounted(true); }, []);
    useEffect(() => {
        if (hasMounted && !isLoadingAuth && !isAuthenticated) {
            toast({ title: "Authentication Required", variant: "destructive" });
            router.push('/login');
        }
        // Optional: Add teacher role check
        // if (hasMounted && !isLoadingAuth && isAuthenticated && user?.role !== 'teacher') { /* ... */ }
    }, [hasMounted, isLoadingAuth, isAuthenticated, user, router, toast]);
    // --- End Auth ---

    const form = useForm<RubricFormValues>({
        resolver: zodResolver(rubricSchema),
        defaultValues: {
            assessmentTitle: "",
            assessmentType: "Essay", // Default type
            classLevel: "",
            taskDescription: "",
            maxScore: 100, // Default score on frontend
        },
    });

    async function onSubmit(values: RubricFormValues) {
        setIsGenerating(true);
        setGeneratedRubric(null);
        console.log("Requesting Rubric:", values);

        if (!token) { /* ... auth token check ... */ return; }

        try {
            const response = await fetch('https://learnbridge-ai-service.onrender.com/api/ai/generate/rubric', { // AI Service URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...values,
                    // Ensure number is sent correctly, handle potential empty string from input
                    maxScore: values.maxScore ? Number(values.maxScore) : undefined // Send undefined if empty/0 to use backend default
                }),
            });

            const data = await response.json();

            if (!response.ok) { /* ... error handling ... */
                toast({
                    title: `Generation Failed (${response.status})`,
                    description: data.error || "An error occurred generating the rubric.",
                    variant: "destructive",
                });
            } else { /* ... success handling ... */
                setGeneratedRubric(data.rubric);
                toast({ title: "Rubric Generated!", description: "Review the generated rubric below." });
            }
        } catch (error) { /* ... network error handling ... */
             toast({ title: "Network Error", description: "Could not connect to AI service.", variant: "destructive" });
        } finally {
            setIsGenerating(false);
        }
    }

    // --- Render Logic ---
    if (!hasMounted || isLoadingAuth) { /* ... loading state ... */
         return ( <div className="flex items-center justify-center min-h-screen bg-slate-100"> <Loader2 className="h-8 w-8 animate-spin mr-3 text-brand-midblue" /> Loading... </div> );
    }
    if (!isAuthenticated || !user) { /* ... not authenticated state ... */
         return ( <div className="flex items-center justify-center min-h-screen bg-slate-100"> Redirecting to login... </div> );
    }
    // Add role check display if needed here

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8">
             {/* Header */}
             <header className="mb-6 flex justify-between items-center">
                 <div>
                     <h1 className="text-3xl font-bold text-brand-darkblue">AI Rubric Generator</h1>
                     <nav className="text-sm text-gray-500">
                         <Link href="/dashboard" className="hover:underline">Dashboard</Link>
                         {' / '}
                         <span>Rubric Generator</span>
                     </nav>
                 </div>
                 <Button variant="outline" onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
             </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Input Form Card */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Assessment Details for Rubric</CardTitle>
                        <CardDescription>Provide details about the assessment.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                {/* Assessment Title */}
                                <FormField control={form.control} name="assessmentTitle" render={({ field }) => (
                                    <FormItem> <FormLabel>Assessment Title *</FormLabel> <FormControl><Input placeholder="e.g., JHS 1 Photosynthesis Essay" {...field} disabled={isGenerating} /></FormControl> <FormMessage /> </FormItem>
                                )} />
                                {/* Assessment Type */}
                                <FormField control={form.control} name="assessmentType" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Assessment Type *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isGenerating}>
                                            <FormControl>
                                                <SelectTrigger> <SelectValue placeholder="Select assessment type" /> </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-white border shadow-md z-50">
                                                <SelectItem value="Essay">Essay</SelectItem>
                                                <SelectItem value="Project">Project</SelectItem>
                                                <SelectItem value="Presentation">Presentation</SelectItem>
                                                <SelectItem value="Practical">Practical</SelectItem>
                                                <SelectItem value="Short Answer Test">Short Answer Test</SelectItem>
                                                <SelectItem value="Report">Report</SelectItem>
                                                <SelectItem value="Debate">Debate</SelectItem>
                                                <SelectItem value="Portfolio">Portfolio</SelectItem>
                                                {/* Add more */}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                {/* Class Level */}
                                <FormField control={form.control} name="classLevel" render={({ field }) => (
                                    <FormItem> <FormLabel>Class Level *</FormLabel> <FormControl><Input placeholder="e.g., JHS 1, SHS 2" {...field} disabled={isGenerating} /></FormControl> <FormMessage /> </FormItem>
                                )} />
                                {/* Task Description */}
                                <FormField control={form.control} name="taskDescription" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Task Description / Prompt *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe the task given to students..."
                                                {...field}
                                                rows={6} // More space for description
                                                disabled={isGenerating}
                                            />
                                        </FormControl>
                                        <FormDescription>Be specific about what students need to do.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                 {/* Max Score */}
                                 <FormField control={form.control} name="maxScore" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Maximum Score (Optional)</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="1" placeholder="e.g., 100"
                                                {...field}
                                                onChange={event => field.onChange(event.target.value === '' ? undefined : +event.target.value)} // Handle empty string -> undefined
                                                disabled={isGenerating}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <Button type="submit" className="w-full bg-brand-orange hover:bg-brand-orange/90" disabled={isGenerating}>
                                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    {isGenerating ? 'Generating Rubric...' : 'Generate Rubric'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Generated Rubric Display Area */}
                <Card className="lg:col-span-2" id="generated-rubric-section">
                    <CardHeader>
                        <CardTitle>Generated Rubric</CardTitle>
                        <CardDescription>Review the AI-generated rubric below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isGenerating && !generatedRubric && (
                            <div className="flex items-center justify-center h-[70vh]">
                                <Loader2 className="h-8 w-8 animate-spin mr-3 text-brand-midblue" />
                                <span>Generating your rubric...</span>
                            </div>
                        )}
                        {!isGenerating && !generatedRubric && (
                            <div className="flex items-center justify-center h-[70vh] text-gray-500">
                                <p>Fill out the form and click &quot;Generate Rubric&quot; to create a rubric.</p>
                            </div>
                        )}
                        {generatedRubric && (
                            <ScrollArea className="h-[70vh] p-4 border rounded-md bg-white">
                                <div className="prose prose-sm sm:prose-base max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ /* ...table styling components... */
                                        table: ({...props}) => <table className="table-auto w-full border-collapse border border-slate-400" {...props} />,
                                        thead: ({...props}) => <thead className="bg-slate-100" {...props} />,
                                        th: ({...props}) => <th className="border border-slate-300 px-2 py-1 text-left" {...props} />,
                                        td: ({...props}) => <td className="border border-slate-300 px-2 py-1 align-top" {...props} />, // Added align-top
                                    }}>
                                        {generatedRubric}
                                    </ReactMarkdown>
                                </div>
                            </ScrollArea>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}