import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupContent,
  SidebarGroupLabel
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Tag, Package, ShoppingBag } from "lucide-react"

const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Categories", path: "/admin/categories", icon: Tag },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar collapsible="icon" className="bg-zinc-950 border-none text-white dark">
      <SidebarHeader>
        <div className="flex items-center gap-3 p-4 group-data-[collapsible=icon]:justify-center">
            <div className="h-9 w-9 min-w-[2.25rem] rounded-xl bg-white flex items-center justify-center font-bold text-zinc-950 text-xl shadow-lg shadow-white/5">P</div>
            <span className="text-xl font-bold tracking-tight group-data-[collapsible=icon]:hidden whitespace-nowrap">Printify<span className="text-zinc-500">X</span></span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-zinc-500 text-xs font-semibold uppercase tracking-widest px-4 mb-4">
            Command Center
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path} className="relative">
                    <SidebarMenuButton 
                      render={<Link to={item.path} />}
                      tooltip={item.name} 
                      isActive={isActive}
                      className={`text-sm py-6 px-4 font-semibold transition-all duration-500 rounded-xl group/item ${
                        isActive 
                        ? 'bg-white text-zinc-950 shadow-xl shadow-white/5 translate-x-1' 
                        : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'
                      } [&_svg]:size-5`}
                    >
                       <item.icon className={`transition-all duration-500 ${isActive ? 'text-zinc-950 scale-110' : 'group-hover/item:text-white'}`} />
                       <span className="tracking-tight">{item.name}</span>
                    </SidebarMenuButton>
                    
                    {isActive && (
                      <div className="absolute -left-1 top-1/2 -translate-y-1/2 h-6 w-1 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
         <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:border-none">
            <div className="flex items-center gap-3 text-sm group-data-[collapsible=icon]:justify-center">
               <div className="h-10 w-10 min-w-[2.5rem] rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold ring-2 ring-zinc-800/50 shadow-inner">A</div>
               <div className="group-data-[collapsible=icon]:hidden truncate">
                  <p className="font-bold text-white text-xs tracking-tight">Administrator</p>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">System Access</p>
               </div>
            </div>
         </div>
      </SidebarFooter>
    </Sidebar>
  )
}
