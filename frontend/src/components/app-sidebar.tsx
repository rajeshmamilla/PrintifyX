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
    <Sidebar collapsible="icon" className="bg-gray-900 border-none text-white dark">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2 group-data-[collapsible=icon]:justify-center">
            <div className="h-8 w-8 min-w-[2rem] rounded-lg bg-orange-500 flex items-center justify-center font-bold text-xl">P</div>
            <span className="text-xl font-bold tracking-tight group-data-[collapsible=icon]:hidden whitespace-nowrap">PrintifyX</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-gray-400 text-sm mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path} className="relative group perspective-1000">
                    <SidebarMenuButton 
                      render={<Link to={item.path} />}
                      tooltip={item.name} 
                      isActive={isActive}
                      className="text-base py-5 px-3 text-gray-400 font-medium transition-all duration-300 ease-out hover:bg-gray-800 hover:text-white data-[active=true]:bg-gray-800/80 data-[active=true]:backdrop-blur-md data-[active=true]:text-white data-[active=true]:translate-x-2 data-[active=true]:shadow-lg [&_svg]:size-5"
                    >
                       <item.icon className={`transition-colors duration-300 ${isActive ? 'text-orange-500' : ''}`} />
                       <span>{item.name}</span>
                    </SidebarMenuButton>
                    
                    {/* Floating Stylish Indicator to the Body */}
                    {isActive && (
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 h-4/5 w-1.5 bg-orange-500 rounded-l-full shadow-[0_0_12px_rgba(249,115,22,0.9)] opacity-100 transition-all duration-500 animate-in fade-in slide-in-from-left-2"></div>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
         <div className="p-2 border-t border-gray-800 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:border-none">
            <div className="flex items-center gap-3 p-2 text-sm group-data-[collapsible=icon]:justify-center">
               <div className="h-8 w-8 min-w-[2rem] rounded-full bg-gray-700 flex items-center justify-center">A</div>
               <div className="group-data-[collapsible=icon]:hidden truncate">
                  <p className="font-medium text-white">Administrator</p>
                  <p className="text-xs text-gray-400">Super Admin</p>
               </div>
            </div>
         </div>
      </SidebarFooter>
    </Sidebar>
  )
}
