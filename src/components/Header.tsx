import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { Link2, Users, Store, TrendingUp } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-md">
            <Link2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <Link to="/" className="font-bold text-xl">Linkly</Link>
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
          <Link to="/vendor" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Dashboard Vendeur
          </Link>
          <Link to="/affiliate" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Dashboard Affilié
          </Link>
          <Link to="/@sarahmarketingdz" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Link-in-bio
          </Link>
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <Button asChild variant="outline" size="sm">
            <Link to="/vendor">Espace Vendeur</Link>
          </Button>
          <Button asChild size="sm" className="bg-gradient-primary hover:opacity-90 transition-opacity">
            <Link to="/affiliate">Espace Affilié</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;