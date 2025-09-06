import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Package, 
  BarChart3,
  ShoppingBag,
  Monitor,
  Store,
  Eye,
  ExternalLink,
  QrCode
} from "lucide-react";

const VendorDashboard = () => {
  const stats = [
    {
      title: "Revenus ce mois",
      value: "45,230 DA",
      change: "+12%",
      icon: DollarSign,
      positive: true
    },
    {
      title: "Affiliés actifs",
      value: "127",
      change: "+5",
      icon: Users,
      positive: true
    },
    {
      title: "Clics totaux",
      value: "8,432",
      change: "+18%",
      icon: TrendingUp,
      positive: true
    },
    {
      title: "Taux conversion",
      value: "3.2%",
      change: "+0.3%",
      icon: BarChart3,
      positive: true
    }
  ];

  const products = [
    {
      id: 1,
      title: "iPhone 15 Pro Max",
      category: "E-commerce",
      type: "ecommerce",
      price: "280,000 DA",
      commission: "5%",
      sales: 23,
      status: "active",
      icon: ShoppingBag
    },
    {
      id: 2,
      title: "Formation Marketing Digital",
      category: "Service",
      type: "service",
      price: "15,000 DA",
      commission: "30%",
      sales: 15,
      status: "active",
      icon: Monitor
    },
    {
      id: 3,
      title: "Menu Restaurant Le Gourmet",
      category: "Restaurant",
      type: "physical",
      price: "Variable",
      commission: "8%",
      sales: 42,
      status: "active",
      icon: Store
    }
  ];

  const affiliates = [
    {
      name: "Sarah Marketing",
      avatar: "S",
      sales: 12,
      commission: "4,500 DA",
      performance: "Excellent"
    },
    {
      name: "TechInfluencer",
      avatar: "T",
      sales: 8,
      commission: "3,200 DA",
      performance: "Bon"
    },
    {
      name: "BlogMode.dz",
      avatar: "B",
      sales: 6,
      commission: "2,800 DA",
      performance: "Moyen"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Vendeur</h1>
            <p className="text-muted-foreground">Gérez vos produits et affiliés</p>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau produit
          </Button>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className={`text-xs ${stat.positive ? 'text-success' : 'text-destructive'}`}>
                    {stat.change} par rapport au mois dernier
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Mes Produits
              </CardTitle>
              <CardDescription>
                Gérez vos offres et performances
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {products.map((product) => {
                const IconComponent = product.icon;
                return (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg">
                        <IconComponent className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{product.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.category} • Commission {product.commission}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{product.sales} ventes</div>
                      <Badge variant="secondary" className="text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        Voir
                      </Badge>
                    </div>
                  </div>
                );
              })}
              <Button variant="outline" className="w-full">
                Voir tous les produits
              </Button>
            </CardContent>
          </Card>

          {/* Top Affiliates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Top Affiliés
              </CardTitle>
              <CardDescription>
                Vos meilleurs partenaires ce mois
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {affiliates.map((affiliate, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-full text-primary-foreground font-semibold">
                      {affiliate.avatar}
                    </div>
                    <div>
                      <div className="font-medium">{affiliate.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {affiliate.sales} ventes • {affiliate.performance}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-success">{affiliate.commission}</div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                Gérer les affiliés
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;