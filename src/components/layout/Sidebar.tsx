// frontend/src/components/layout/Sidebar.tsx
"use client"; // Needed for hooks like usePathname

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils"; // For combining class names
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore"; // To get user role

// Import icons from lucide-react
import {
    LayoutDashboard, // Dashboard icon
    BookOpenCheck, // My Plans/Assessments
    FileText,      // Lesson Planner
    ClipboardCheck, // Assessment Creator
    ListChecks,    // ToS Builder
    Scaling,       // Rubric Generator
    GraduationCap, // Student Hub (Placeholder)
    Users,         // PLC (Placeholder)
    UploadCloud,   // Admin Upload (Placeholder)
    LogOut,        // Logout
    Bot             // AI Assistant (Chat)
} from "lucide-react";

// Define navigation items structure
interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType; // Component type for the icon
    roles?: ('teacher' | 'student' | 'admin')[]; // Optional roles that can see this link
}

export function Sidebar() {
    const pathname = usePathname(); // Get current URL path
    const { user, clearAuth } = useAuthStore(); // Get user role and logout action
    const router = useRouter(); // For programmatic navigation on logout

    // Define navigation links based on roles
    const navItems: NavItem[] = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ['teacher', 'student', 'admin'] }, // All roles see dashboard
        // --- Teacher Tools ---
        { href: "/dashboard/lesson-planner", label: "Lesson Planner", icon: FileText, roles: ['teacher', 'admin'] },
        { href: "/dashboard/assessment-creator", label: "Assessment Creator", icon: ClipboardCheck, roles: ['teacher', 'admin'] },
        { href: "/dashboard/tos-builder", label: "ToS Builder", icon: ListChecks, roles: ['teacher', 'admin'] },
        { href: "/dashboard/rubric-generator", label: "Rubric Generator", icon: Scaling, roles: ['teacher', 'admin'] },
        { href: "/dashboard/my-lessons", label: "My Lesson Plans", icon: BookOpenCheck, roles: ['teacher', 'admin'] },
        { href: "/dashboard/my-assessments", label: "My Assessments", icon: BookOpenCheck, roles: ['teacher', 'admin'] }, // Add My Assessments link
        // --- Student Tools (Placeholders) ---
        // { href: "/dashboard/student-hub", label: "Learning Hub", icon: GraduationCap, roles: ['student'] },
        // --- Community (Placeholder) ---
        // { href: "/dashboard/plc", label: "PLC", icon: Users, roles: ['teacher', 'admin'] },
        // --- Admin Tools (Placeholder) ---
        // { href: "/dashboard/admin-uploads", label: "Admin Uploads", icon: UploadCloud, roles: ['admin'] },
        // --- AI Assistant ---
        { href: "/dashboard/ai-assistant", label: "AI Assistant", icon: Bot, roles: ['teacher', 'student', 'admin'] },
    ];

    // Filter nav items based on user role
    const filteredNavItems = navItems.filter(item => 
        !item.roles || (user?.role && item.roles.includes(user.role as any))
    );

    // Handle logout
    const handleLogout = () => {
        clearAuth();
        router.push('/');
    };

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-brand-darkblue border-r border-white/10">
            <div className="flex h-full flex-col">
                {/* Logo/Brand */}
                <div className="p-4 border-b border-white/10">
                    <Link href="/dashboard" className="flex items-center space-x-2">
                        <span className="text-xl font-arvo font-bold text-white">
                            LearnBridge<span className="text-brand-orange">Edu</span>
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4">
                    <ul className="space-y-2">
                        {filteredNavItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            buttonVariants({ variant: "ghost" }),
                                            "w-full justify-start text-white hover:bg-white/10",
                                            isActive && "bg-white/10"
                                        )}
                                    >
                                        <item.icon className="mr-2 h-5 w-5" />
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* User Info & Logout */}
                <div className="border-t border-white/10 p-4">
                    <div className="mb-4">
                        <p className="text-sm font-arvo font-medium text-white">
                            {user?.first_name} {user?.surname}
                        </p>
                        <p className="text-xs text-white/70 capitalize">{user?.role}</p>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-white hover:bg-white/10"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-2 h-5 w-5" />
                        Logout
                    </Button>
                </div>
            </div>
        </aside>
    );
}