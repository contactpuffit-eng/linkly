import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "0",
      description: "Parfait pour débuter",
      icon: Zap,
      features: [
        "2 produits maximum",
        "Commission 5%",
        "Dashboard de base",
        "Support communautaire"
      ],
      buttonText: "Commencer gratuitement",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Starter",
      price: "2 500",
      description: "Pour les petites entreprises",
      icon: Star,
      features: [
        "6 produits maximum",
        "Commission 5%",
        "Analytics avancées",
        "Support prioritaire",
        "Landing pages IA",
        "QR codes illimités"
      ],
      buttonText: "Choisir Starter",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Pro",
      price: "5 000",
      description: "Pour les entreprises en croissance",
      icon: Crown,
      features: [
        "15 produits maximum",
        "Commission 4%",
        "Tout de Starter +",
        "API webhooks",
        "Intégration transporteur",
        "Branding personnalisé"
      ],
      buttonText: "Choisir Pro",
      buttonVariant: "default" as const,
      popular: false
    },
    {
      name: "Premium",
      price: "15 000",
      description: "Pour les grandes entreprises",
      icon: Crown,
      features: [
        "Produits illimités",
        "Commission 3%",
        "Tout de Pro +",
        "Manager dédié",
        "SLA garantie",
        "Formations incluses"
      ],
      buttonText: "Contacter l'équipe",
      buttonVariant: "default" as const,
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 lg:py-32">
      <div className="container">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6">
            Tarification
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Choisissez votre plan vendeur
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Commencez gratuitement et évoluez selon vos besoins. 
            Commissions dégressives selon votre plan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary shadow-brand' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-primary text-primary-foreground">
                      Populaire
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="flex items-baseline justify-center mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">DA/mois</span>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-4 h-4 text-success mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className={`w-full ${plan.buttonVariant === 'default' ? 'bg-gradient-primary hover:opacity-90' : ''}`}
                    variant={plan.buttonVariant}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            💡 Les affiliés utilisent la plateforme gratuitement et gardent 100% de leurs commissions
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;