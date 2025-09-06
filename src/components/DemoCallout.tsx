import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Users, 
  TrendingUp, 
  Zap, 
  ArrowRight,
  CheckCircle
} from "lucide-react";

const DemoCallout = () => {
  const stats = [
    { label: "Vendeurs actifs", value: "847", icon: Users },
    { label: "Affiliés connectés", value: "3.2K", icon: TrendingUp },
    { label: "Commissions générées", value: "2.8M DA", icon: Zap }
  ];

  return (
    <section className="py-16 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 bg-background/10"></div>
      
      <div className="container relative z-10">
        <div className="text-center text-primary-foreground">
          <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
            <Play className="w-4 h-4 mr-2" />
            Plateforme en action
          </Badge>
          
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Rejoignez +4,000 utilisateurs qui transforment 
            <br />leur business avec Linkly
          </h2>
          
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Découvrez comment nos utilisateurs génèrent des revenus passifs 
            grâce à notre écosystème d'affiliation multi-segments
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mx-auto mb-3">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-primary-foreground/80">{stat.label}</div>
                </div>
              );
            })}
          </div>
          
          {/* Success Stories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
            <Card className="bg-white/10 border-white/20 text-left">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">TechStore DZ</div>
                    <div className="text-sm text-primary-foreground/80">Vendeur E-commerce</div>
                  </div>
                </div>
                <p className="text-primary-foreground/90 text-sm">
                  "Avec Linkly, nous avons augmenté nos ventes de 340% en 3 mois grâce à 
                  notre réseau de 127 affiliés actifs. La plateforme est intuitive et les 
                  analytics nous aident à optimiser nos campagnes."
                </p>
                <div className="mt-4 text-sm font-medium text-white">
                  +127 affiliés • 2.8M DA générés
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 text-left">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-10 h-10 bg-info rounded-full flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">Sarah Marketing</div>
                    <div className="text-sm text-primary-foreground/80">Affiliée Pro</div>
                  </div>
                </div>
                <p className="text-primary-foreground/90 text-sm">
                  "En tant qu'influenceuse, Linkly m'a permis de monétiser efficacement 
                  mon audience. Les QR codes pour les restaurants et les liens trackés 
                  me rapportent 15K DA/mois de commissions passives."
                </p>
                <div className="mt-4 text-sm font-medium text-white">
                  15K DA/mois • 3.2K followers
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Démarrer gratuitement
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Play className="w-4 h-4 mr-2" />
              Voir la démo (2min)
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoCallout;