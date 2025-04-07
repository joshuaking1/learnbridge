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
      <main className="flex-1 pl-64"> {/* pl-64 matches sidebar width w-64 */}
        {children} {/* Render the actual page content here */}
      </main>
    </div>
  );
}