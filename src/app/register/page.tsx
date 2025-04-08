// frontend/src/app/register/page.tsx
"use client"; // Required for forms and interactivity

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Use next/navigation for App Router
import * as z from "zod"; // For validation schema
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// --- CORRECTED IMPORT PATH for useToast ---
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"; // Import form components

// Define validation schema using Zod
const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  surname: z.string().min(2, { message: "Surname must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().optional(), // Optional field
  school: z.string().optional(), // Optional field
  location: z.string().optional(), // Optional field
  position: z.enum(["Teacher", "Student",  "Other"], { required_error: "Position is required."}), // Added required_error
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"], { required_error: "Gender is required."}), // Added required_error
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});


export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast(); // Initialize toast
  const [isLoading, setIsLoading] = useState(false);

  // Initialize react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { // Set initial empty values
      firstName: "",
      surname: "",
      email: "",
      phone: "",
      school: "",
      location: "",
      position: undefined, // Important for Select placeholder
      gender: undefined,
      password: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log("Form Submitted:", values); // Log values for debugging

    try {
      // Make API call to backend auth-service
      const response = await fetch('/api/auth/register', { // Use your Auth Service URL/Port
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values), // Send validated form values
        });

      const data = await response.json(); // Parse the JSON response body

        if (!response.ok) {
            // Handle backend errors (e.g., email already exists)
            console.error("Registration failed:", data);
            // Display error toast from backend message or a generic one
            toast({
                title: "Registration Failed",
                description: data.error || "An error occurred. Please try again.",
                variant: "destructive", // Use destructive style for errors
            });
        } else {
            // Handle success
            console.log("Registration successful:", data);
            toast({
                title: "Registration Successful!",
                description: "Please log in with your new account.",
            });
            // Redirect to login page after a short delay
             setTimeout(() => {
                router.push('/login');
            }, 1500); // 1.5 second delay
        }
    } catch (error) {
        // Handle network errors or other unexpected issues
        console.error("Network or unexpected error:", error);
        toast({
            title: "Error",
            description: "Could not connect to the server. Please check your connection.",
            variant: "destructive",
        });
    } finally {
       setIsLoading(false); // Stop loading indicator
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-brand-darkblue to-brand-midblue">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-arvo font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Fill in your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* First Name */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <div className="mb-1.5 text-sm font-medium text-slate-200">First Name *</div>
                      <FormControl>
                        <Input placeholder="e.g., Kwame" {...field} disabled={isLoading} className="bg-white/90 text-black placeholder:text-gray-500" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Surname */}
                <FormField
                  control={form.control}
                  name="surname"
                  render={({ field }) => (
                    <FormItem>
                      <div className="mb-1.5 text-sm font-medium text-slate-200">Surname *</div>
                      <FormControl>
                        <Input placeholder="e.g., Nkrumah" {...field} disabled={isLoading} className="bg-white/90 text-black placeholder:text-gray-500" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                 {/* Email */}
                 <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <div className="mb-1.5 text-sm font-medium text-slate-200">Email *</div>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} disabled={isLoading} className="bg-white/90 text-black placeholder:text-gray-500" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                 {/* Phone (Optional) */}
                 <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <div className="mb-1.5 text-sm font-medium text-slate-200">Phone Number</div>
                      <FormControl>
                        <Input type="tel" placeholder="+233 XXX XXX XXX" {...field} disabled={isLoading} className="bg-white/90 text-black placeholder:text-gray-500" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Password */}
                 <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="mb-1.5 text-sm font-medium text-slate-200">Password *</div>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} disabled={isLoading} className="bg-white/90 text-black placeholder:text-gray-500" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                 {/* School (Optional) */}
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <div className="mb-1.5 text-sm font-medium text-slate-200">School</div>
                      <FormControl>
                        <Input placeholder="e.g., Accra High School" {...field} disabled={isLoading} className="bg-white/90 text-black placeholder:text-gray-500" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Location (Optional) */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <div className="mb-1.5 text-sm font-medium text-slate-200">Location</div>
                      <FormControl>
                        <Input placeholder="e.g., Accra, Greater Accra" {...field} disabled={isLoading} className="bg-white/90 text-black placeholder:text-gray-500" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Position */}
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <div className="mb-1.5 text-sm font-medium text-slate-200">Position *</div>
                      <FormControl>
                        <select 
                          className="w-full rounded-md border border-input bg-white/90 text-black px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isLoading}
                        >
                          <option value="">Select your position</option>
                          <option value="Teacher">Teacher</option>
                          <option value="Student">Student</option>
                          <option value="Other">Other</option>
                        </select>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <div className="mb-1.5 text-sm font-medium text-slate-200">Gender *</div>
                      <FormControl>
                        <select 
                          className="w-full rounded-md border border-input bg-white/90 text-black px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isLoading}
                        >
                          <option value="">Select your gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="md:col-span-2">
                  <Button type="submit" className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold" disabled={isLoading}>
                    {isLoading ? 'Registering...' : 'Create account'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-orange hover:underline">
                Sign in
              </Link>
            </div>
            <Link href="/" className="text-sm text-center text-muted-foreground hover:underline">
              Back to home
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}