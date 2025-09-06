import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  TrendingUp, 
  Eye, 
  DollarSign, 
  Link2, 
  Wallet,
  ShoppingBag,
  Monitor,
  Store,
  QrCode,
  ExternalLink,
  Copy,
  BarChart3
} from "lucide-react";

const AffiliateDashboard = () => {
  const stats = [
    {
      title: "Revenus ce mois",
      value: "12,450 DA",
      change: "+23%",
      icon: DollarSign,
      positive: true
    },
    {
      title: "Clics générés",
      value: "3,247",
      change: "+15%",
      icon: Eye,
      positive: true
    },
    {
      title: "Taux conversion",
      value: "2.8%",
      change: "+0.5%",
      icon: TrendingUp,
      positive: true
    },
    {
      title: "Solde wallet",
      value: "28,350 DA",
      change: "Disponible",
      icon: Wallet,
      positive: true
    }
  ];

  const activeLinks = [
    {
      id: 1,
      title: "iPhone 15 Pro Max",
      vendor: "TechStore DZ",
      type: "ecommerce",
      commission: "5%",
      clicks: 234,
      sales: 12,
      earnings: "4,200 DA",
      status: "active",
      icon: ShoppingBag
    },
    {
      id: 2,
      title: "Formation Marketing Digital",
      vendor: "EduTech",
      type: "service",
      commission: "30%",
      clicks: 156,
      sales: 8,
      earnings: "3,600 DA",
      status: "active",
      icon: Monitor
    },
    {
      id: 3,
      title: "Menu Restaurant Le Gourmet",
      vendor: "Le Gourmet",
      type: "physical",
      commission: "8%",
      clicks: 89,
      sales: 15,
      earnings: "2,100 DA",
      status: "active",
      icon: Store
    }
  ];

  const recentEarnings = [
    {
      product: "iPhone 15 Pro Max",
      amount: "840 DA",
      date: "Il y a 2h",
      status: "confirmed"
    },
    {
      product: "Formation Marketing",
      amount: "450 DA",
      date: "Il y a 4h",
      status: "pending"
    },
    {
      product: "Menu Gourmet",
      amount: "120 DA",
      date: "Hier",
      status: "confirmed"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Affilié</h1>
            <p className="text-muted-foreground">Gérez vos liens et suivez vos performances</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </Button>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau lien
            </Button>
          </div>
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
                  <p className={`text-xs ${stat.positive ? 'text-success' : 'text-muted-foreground'}`}>
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Link2 className="w-5 h-5 mr-2" />
                Mes Liens Actifs
              </CardTitle>
              <CardDescription>
                Suivez les performances de vos liens affiliés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg">
                        <IconComponent className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{link.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {link.vendor} • {link.clicks} clics • {link.sales} ventes
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-success">{link.earnings}</div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <BarChart3 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Button variant="outline" className="w-full">
                Voir tous mes liens
              </Button>
            </CardContent>
          </Card>

          {/* Recent Earnings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="w-5 h-5 mr-2" />
                Gains Récents
              </CardTitle>
              <CardDescription>
                Vos dernières commissions validées
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentEarnings.map((earning, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{earning.product}</div>
                    <div className="text-sm text-muted-foreground">{earning.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-success">{earning.amount}</div>
                    <Badge 
                      variant={earning.status === 'confirmed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {earning.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                    </Badge>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <Button className="w-full bg-gradient-primary hover:opacity-90">
                  <Wallet className="w-4 h-4 mr-2" />
                  Demander un retrait
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Link-in-bio preview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Ma Page Link-in-bio</CardTitle>
            <CardDescription>
              Votre page publique pour partager tous vos liens : linkly.com/@votrepseudo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  A
                </div>
                <div>
                  <div className="font-medium">@affilieuralgerien</div>
                  <div className="text-sm text-muted-foreground">3 liens actifs • 2,4K vues ce mois</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copier le lien
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Voir la page
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AffiliateDashboard;