import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link2, Users, Store, TrendingUp } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-md">
            <Link2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">Linkly</span>
          <Badge variant="secondary" className="ml-2 text-xs">
            SaaS
          </Badge>
        </div>
        
        <nav className="flex items-center space-x-6 ml-6 text-sm font-medium">
          <a href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Fonctionnalités
          </a>
          <a href="#pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Tarifs
          </a>
          <a href="#demo" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Démo
          </a>
          <a href="/vendor" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Dashboard Vendeur
          </a>
          <a href="/affiliate" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Dashboard Affilié
          </a>
          <a href="/@sarahmarketingdz" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Link-in-bio
          </a>
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            Connexion
          </Button>
          <Button size="sm" className="bg-gradient-primary hover:opacity-90 transition-opacity">
            Commencer gratuitement
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;