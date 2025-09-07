import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { BarChart3, Package, Link2, User, Wallet, Settings, LogOut } from 'lucide-react';

interface AffiliateTabsProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AffiliateTabs({ children, activeTab, onTabChange }: AffiliateTabsProps) {
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Linkly
            </h1>
            <div className="h-6 w-px bg-border" />
            <span className="text-sm text-muted-foreground">Dashboard Affilié</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                {profile?.name?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium">{profile?.name}</p>
              <p className="text-xs text-muted-foreground">Affilié</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <div className="container">
          <Tabs value={activeTab} onValueChange={onTabChange}>
            <TabsList className="bg-transparent h-auto p-0 space-x-8">
              <TabsTrigger 
                value="overview" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none py-4 px-0"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger 
                value="products" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none py-4 px-0"
              >
                <Package className="w-4 h-4 mr-2" />
                Produits Disponibles
              </TabsTrigger>
              <TabsTrigger 
                value="links" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none py-4 px-0"
              >
                <Link2 className="w-4 h-4 mr-2" />
                Mes Liens
              </TabsTrigger>
              <TabsTrigger 
                value="page" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none py-4 px-0"
              >
                <User className="w-4 h-4 mr-2" />
                Ma Page
              </TabsTrigger>
              <TabsTrigger 
                value="wallet" 
                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none py-4 px-0"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Portefeuille
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="container py-6">
        {children}
      </div>
    </div>
  );
}