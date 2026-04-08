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
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-gray-400">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    render={<Link to={item.path} />}
                    tooltip={item.name} 
                    isActive={location.pathname === item.path}
                    className="text-gray-400 font-medium hover:bg-gray-800 hover:text-white data-[active=true]:bg-gray-800 data-[active=true]:text-white transition-colors"
                  >
                     <item.icon />
                     <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
