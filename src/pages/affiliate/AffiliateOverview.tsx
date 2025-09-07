import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  TrendingUp, 
  ShoppingBag, 
  DollarSign,
  ArrowUp,
  ArrowDown,
  Plus,
  ExternalLink,
  Link2,
  QrCode
} from 'lucide-react';

const AffiliateOverview = () => {
  const kpiCards = [
    {
      title: "Vues totales",
      value: "12,450",
      change: "+23%",
      icon: Eye,
      positive: true
    },
    {
      title: "Clics générés",
      value: "3,247",
      change: "+15%",
      icon: TrendingUp,
      positive: true
    },
    {
      title: "Ventes validées",
      value: "89",
      change: "+12%",
      icon: ShoppingBag,
      positive: true
    },
    {
      title: "Gains du mois",
      value: "8,750 DA",
      change: "+28%",
      icon: DollarSign,
      positive: true
    }
  ];

  const recentLinks = [
    {
      id: 1,
      title: "iPhone 15 Pro Max",
      vendor: "TechStore DZ",
      commission: "5%",
      views: 450,
      clicks: 89,
      sales: 8,
      earnings: "2,800 DA",
      status: "active"
    },
    {
      id: 2,
      title: "Formation Marketing Digital",
      vendor: "EduTech",
      commission: "30%",
      views: 320,
      clicks: 67,
      sales: 5,
      earnings: "2,250 DA",
      status: "active"
    },
    {
      id: 3,
      title: "Menu Restaurant Le Gourmet",
      vendor: "Le Gourmet",
      commission: "8%",
      views: 180,
      clicks: 34,
      sales: 12,
      earnings: "960 DA",
      status: "active"
    }
  ];

  const recentActivity = [
    {
      type: "sale",
      product: "iPhone 15 Pro Max",
      amount: "700 DA",
      time: "Il y a 2h",
      status: "confirmed"
    },
    {
      type: "click",
      product: "Formation Marketing",
      amount: null,
      time: "Il y a 3h",
      status: "tracked"
    },
    {
      type: "sale",
      product: "Menu Gourmet",
      amount: "80 DA",
      time: "Il y a 5h",
      status: "pending"
    },
    {
      type: "view",
      product: "iPhone 15 Pro Max",
      amount: null,
      time: "Il y a 1h",
      status: "tracked"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button className="bg-gradient-primary hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau lien
        </Button>
        <Button variant="outline">
          <QrCode className="w-4 h-4 mr-2" />
          Générer QR Code
        </Button>
        <Button variant="outline">
          <ExternalLink className="w-4 h-4 mr-2" />
          Ma page publique
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    {kpi.change} ce mois
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Link2 className="w-5 h-5 mr-2" />
              Mes Meilleurs Liens
            </CardTitle>
            <CardDescription>
              Vos liens les plus performants ce mois
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentLinks.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{link.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {link.vendor} • {link.commission} commission
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {link.views} vues • {link.clicks} clics • {link.sales} ventes
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-success">{link.earnings}</div>
                  <Badge variant="secondary" className="text-xs mt-1">
                    Actif
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Voir tous mes liens
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
            <CardDescription>
              Vos dernières interactions et gains
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'sale' ? 'bg-success' :
                    activity.type === 'click' ? 'bg-primary' : 'bg-muted-foreground'
                  }`} />
                  <div>
                    <div className="text-sm font-medium">
                      {activity.type === 'sale' ? 'Vente' :
                       activity.type === 'click' ? 'Clic' : 'Vue'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activity.product}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {activity.amount && (
                    <div className="text-sm font-medium text-success">
                      +{activity.amount}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Voir l'historique complet
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Graphiques de Performance</CardTitle>
          <CardDescription>
            Evolution de vos stats sur les 30 derniers jours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-muted">
            <div className="text-center space-y-2">
              <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Graphiques de performance temporels
              </p>
              <p className="text-xs text-muted-foreground">
                (Implementation en cours avec Recharts)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateOverview;