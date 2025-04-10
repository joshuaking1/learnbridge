// frontend/src/app/dashboard/layout.tsx
import { Sidebar } from "@/components/layout/Sidebar"; // Import the Sidebar

export default function DashboardLayout({
  children, // Will be the page content for routes like /dashboard, /dashboard/my-lessons, etc.
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar /> {/* Render the fixed sidebar */}
      {/* Main content area with padding to offset the sidebar width */}
      <main className="flex-1 pl-0 pt-16 md:pt-0 md:pl-64 transition-all duration-300 relative z-30"> {/* Added pt-16 for mobile menu button, z-30 for proper stacking */}
        {children} {/* Render the actual page content here */}
      </main>
    </div>
  );
}