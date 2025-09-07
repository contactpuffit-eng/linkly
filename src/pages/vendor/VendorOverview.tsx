import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  ArrowUp,
  ArrowDown,
  Wand2
} from 'lucide-react';

const VendorOverview = () => {
  const kpiCards = [
    {
      title: "Vues totales",
      value: "45,230",
      change: "+12%",
      icon: Eye,
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
      title: "Commandes validées",
      value: "156",
      change: "+23%",
      icon: ShoppingBag,
      positive: true
    },
    {
      title: "Commandes annulées",
      value: "12",
      change: "-8%",
      icon: Package,
      positive: false
    },
    {
      title: "Taux de conversion",
      value: "3.2%",
      change: "+0.3%",
      icon: BarChart3,
      positive: true
    }
  ];

  const recentProducts = [
    {
      id: 1,
      title: "iPhone 15 Pro Max",
      category: "Electronics",
      price: "280,000 DA",
      commission: "5%",
      views: 1250,
      clicks: 234,
      orders: 23,
      status: "active",
      icon: ShoppingBag
    },
    {
      id: 2,
      title: "Formation Marketing Digital",
      category: "Service",
      price: "15,000 DA",
      commission: "30%",
      views: 980,
      clicks: 156,
      orders: 15,
      status: "active",
      icon: Monitor
    },
    {
      id: 3,
      title: "Menu Restaurant Le Gourmet",
      category: "Restaurant",
      price: "Variable",
      commission: "8%",
      views: 650,
      clicks: 89,
      orders: 42,
      status: "active",
      icon: Store
    }
  ];

  const topAffiliates = [
    {
      name: "Sarah Marketing",
      avatar: "S",
      sales: 12,
      commission: "4,500 DA",
      performance: "Excellent",
      trend: "up"
    },
    {
      name: "TechInfluencer",
      avatar: "T",
      sales: 8,
      commission: "3,200 DA",
      performance: "Bon",
      trend: "up"
    },
    {
      name: "BlogMode.dz",
      avatar: "B",
      sales: 6,
      commission: "2,800 DA",
      performance: "Moyen",
      trend: "down"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Vue d'ensemble</h1>
          <p className="text-muted-foreground">Graphiques de performance et KPIs</p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau produit
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpiCards.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center text-xs">
                  {kpi.positive ? (
                    <ArrowUp className="w-3 h-3 text-success mr-1" />
                  ) : (
                    <ArrowDown className="w-3 h-3 text-destructive mr-1" />
                  )}
                  <span className={kpi.positive ? 'text-success' : 'text-destructive'}>
                    {kpi.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Performance Produits Récents
            </CardTitle>
            <CardDescription>
              Vos produits les plus performants ce mois
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProducts.map((product) => {
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
                  <div className="text-right space-y-1">
                    <div className="text-sm">
                      <span className="font-medium">{product.views}</span> vues • 
                      <span className="font-medium"> {product.clicks}</span> clics
                    </div>
                    <div className="font-medium text-success">{product.orders} commandes</div>
                  </div>
                </div>
              );
            })}
            <Button variant="outline" className="w-full">
              Voir toutes les performances
            </Button>
          </CardContent>
        </Card>

        {/* Top Affiliates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Top Affiliés du Mois
            </CardTitle>
            <CardDescription>
              Vos meilleurs partenaires ce mois
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topAffiliates.map((affiliate, index) => (
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
                  <div className="flex items-center">
                    {affiliate.trend === 'up' ? (
                      <ArrowUp className="w-3 h-3 text-success" />
                    ) : (
                      <ArrowDown className="w-3 h-3 text-destructive" />
                    )}
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Gérer tous les affiliés
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>
            Gestion rapide de votre plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Wand2 className="w-6 h-6 mb-2" />
              <span className="text-sm">Créer Landing IA</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <BarChart3 className="w-6 h-6 mb-2" />
              <span className="text-sm">Voir Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="w-6 h-6 mb-2" />
              <span className="text-sm">Gérer Affiliés</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <DollarSign className="w-6 h-6 mb-2" />
              <span className="text-sm">Portefeuille</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorOverview;