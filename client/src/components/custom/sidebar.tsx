import {
    ChevronUp,
    LayoutDashboard,
    User2,
    Bus,
    Map,
    History,
    MapPin,
} from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/authContext";
import { Link } from "react-router-dom";

const publicItems = [
    { title: "Home", url: "/", icon: LayoutDashboard },
    { title: "Live Map", url: "/map", icon: Map },
    { title: "Route History", url: "/history", icon: History },
];

const adminItems = [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Manage Vehicle", url: "/admin/vehicles", icon: Bus },
    { title: "Manage Route", url: "/admin/routes", icon: MapPin },
    { title: "Manage Busstops", url: "/admin/busstops", icon: MapPin },
];

export function AppSidebar() {
    const { user, logout } = useAuth();

    const items = user?.role === "admin" ? adminItems : publicItems;

    return (
        <Sidebar collapsible="icon" className="border-r border-slate-200">
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
                        <Bus size={20} />
                    </div>
                    <span className="font-bold text-slate-800 group-data-[collapsible=icon]:hidden">
                        Smart Yatra
                    </span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        {user?.role === "admin" ? "Management" : "Application"}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <Link to={item.url} className="flex items-center gap-3">
                                            <item.icon className="text-slate-500" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="h-12 w-full justify-start gap-3">
                                    <User2 className="text-slate-500" />
                                    <span className="group-data-[collapsible=icon]:hidden">
                                        {user?.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : "User"}
                                    </span>
                                    <ChevronUp className="ml-auto group-data-[collapsible=icon]:hidden" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem>Account</DropdownMenuItem>
                                <DropdownMenuItem onClick={logout} className="text-red-500">Sign out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
