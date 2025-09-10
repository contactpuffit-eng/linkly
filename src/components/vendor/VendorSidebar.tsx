import { useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  BarChart3,
  Package,
  Users,
  DollarSign,
  Wallet,
  Wand2,
  FileText,
  ShoppingCart,
  Truck,
  Code,
  Link2,
  QrCode,
  Settings,
  LogOut
} from 'lucide-react';

const menuItems = [
  { title: 'Vue d\'ensemble', url: '/vendor', icon: BarChart3 },
  { title: 'Gérer Produits', url: '/vendor/products', icon: Package },
  { title: 'Créer Landing Page IA', url: '/vendor/ai-landing', icon: Wand2 },
  { title: 'Mes Landing Pages', url: '/vendor/landing-pages', icon: FileText },
  { title: 'Commandes', url: '/vendor/orders', icon: ShoppingCart },
  { title: 'Gestion Stock', url: '/vendor/stock', icon: Package },
  { title: 'Commissions', url: '/vendor/commissions', icon: DollarSign },
  { title: 'Livraison', url: '/vendor/shipping', icon: Truck },
  { title: 'Performance Affiliés', url: '/vendor/affiliates', icon: Users },
  { title: 'Scanner QR', url: '/vendor/qr-scanner', icon: QrCode },
];

export function VendorSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const currentPath = location.pathname;

  // Mock profile data
  const profile = {
    name: 'Vendeur Demo',
    avatar_url: null
  };

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-muted text-primary font-medium' : 'hover:bg-muted/50';

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-64'} collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        {/* User Profile */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                {profile?.name?.charAt(0) || 'V'}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{profile?.name}</p>
                <p className="text-xs text-muted-foreground">Vendeur</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom Actions */}
        <div className="mt-auto p-4 space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            {!collapsed && 'Paramètres'}
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link to="/">
              <LogOut className="mr-2 h-4 w-4" />
              {!collapsed && 'Retour accueil'}
            </Link>
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}