import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, 
  Monitor, 
  Store, 
  QrCode, 
  Link2, 
  BarChart3, 
  Wallet, 
  Zap,
  Brain,
  Truck,
  Users,
  Shield
} from "lucide-react";

const Features = () => {
  const segments = [
    {
      icon: ShoppingBag,
      title: "E-commerce",
      description: "Produits physiques avec gestion stock, prix, commissions et suivi livraison",
      color: "text-blue-500"
    },
    {
      icon: Monitor,
      title: "Services & Logiciels",
      description: "Abonnements SaaS, formations, services avec liens externes et commissions récurrentes",
      color: "text-purple-500"
    },
    {
      icon: Store,
      title: "Commerces Physiques",
      description: "Restaurants, boutiques avec QR codes et menus numériques intégrés",
      color: "text-green-500"
    }
  ];

  const vendorFeatures = [
    {
      icon: Brain,
      title: "Landing Pages IA",
      description: "Collez un lien produit, l'IA génère automatiquement titre, description et visuels"
    },
    {
      icon: Truck,
      title: "Intégration Transporteur",
      description: "API Yalidine intégrée pour tracking automatique des commandes"
    },
    {
      icon: BarChart3,
      title: "Analytics Avancées",
      description: "Clics, conversions, ROI par affilié et source de trafic"
    },
    {
      icon: Wallet,
      title: "Wallet Intégré",
      description: "Gestion automatique des commissions et paiements"
    }
  ];

  const affiliateFeatures = [
    {
      icon: Link2,
      title: "Liens Trackés",
      description: "Génération automatique de liens uniques avec attribution précise"
    },
    {
      icon: QrCode,
      title: "QR Codes Affiliés",
      description: "Parfait pour le marketing offline et les commerces physiques"
    },
    {
      icon: Users,
      title: "Link-in-Bio",
      description: "Page publique personnalisable avec tous vos liens affiliés"
    },
    {
      icon: Shield,
      title: "Tracking Fiable",
      description: "Attribution par pixel JS, webhooks et codes promo"
    }
  ];

  return (
    <section id="features" className="py-24 lg:py-32 bg-muted/50">
      <div className="container">
        {/* Segments */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6">
            Multi-segments
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Une plateforme, trois univers
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            La première solution d'affiliation qui s'adapte à tous les types de commerce
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {segments.map((segment, index) => {
            const IconComponent = segment.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4">
                    <IconComponent className={`w-8 h-8 text-primary-foreground`} />
                  </div>
                  <CardTitle className="text-xl">{segment.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {segment.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Vendor Features */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">Pour les Vendeurs</h3>
            <p className="text-muted-foreground">Des outils puissants pour développer votre réseau d'affiliés</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vendorFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <IconComponent className="w-8 h-8 text-primary mb-2" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Affiliate Features */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">Pour les Affiliés</h3>
            <p className="text-muted-foreground">Monétisez votre audience avec des outils professionnels</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {affiliateFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <IconComponent className="w-8 h-8 text-primary mb-2" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;