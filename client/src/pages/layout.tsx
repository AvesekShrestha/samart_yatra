import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/custom/sidebar"
import { Outlet } from "react-router-dom"

export default function Layout() {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
                <AppSidebar />
                <main className="flex-1 flex flex-col min-w-0 relative">
                    <div className="flex-1 relative h-full w-full overflow-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}
