import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Store, Users, BarChart3, Package } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Bienvenue sur Linkly
          </h1>
          <p className="text-muted-foreground text-lg">
            Choisissez votre espace de travail
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Vendor Space */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Store className="w-5 h-5" />
                  <span>Espace Vendeur</span>
                </div>
                <Badge variant="default">Vendeur</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Créez et gérez vos produits, suivez vos ventes et vos affiliés
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <Package className="w-4 h-4 mr-2 text-success" />
                  Création de produits
                </li>
                <li className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2 text-success" />
                  Génération de landing pages
                </li>
                <li className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-success" />
                  Gestion des affiliés
                </li>
                <li className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2 text-success" />
                  Suivi des commissions
                </li>
              </ul>
              <Button className="w-full" asChild>
                <Link to="/vendor">
                  Accéder à l'espace vendeur
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Affiliate Space */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Espace Affilié</span>
                </div>
                <Badge variant="secondary">Affilié</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Promouvez des produits et gagnez des commissions
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <Package className="w-4 h-4 mr-2 text-info" />
                  Recherche de produits
                </li>
                <li className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2 text-info" />
                  Génération de liens affiliés
                </li>
                <li className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2 text-info" />
                  Suivi des performances
                </li>
                <li className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-info" />
                  Link in bio personnalisé
                </li>
              </ul>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/affiliate">
                  Accéder à l'espace affilié
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}