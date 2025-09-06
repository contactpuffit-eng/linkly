import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Store, QrCode, TrendingUp } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
      
      <div className="container relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6">
            <TrendingUp className="w-4 h-4 mr-2" />
            Plateforme d'affiliation nouvelle génération
          </Badge>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
            Connectez{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              vendeurs
            </span>{" "}
            et{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              affiliés
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            La première plateforme SaaS multi-segments qui unit e-commerce, services numériques 
            et commerces physiques. Trackez, gérez et optimisez vos programmes d'affiliation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-brand" asChild>
              <a href="/vendor">
                <Store className="w-4 h-4 mr-2" />
                Je suis vendeur
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/affiliate">
                <Users className="w-4 h-4 mr-2" />
                Je suis affilié
              </a>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">3</div>
              <div className="text-sm text-muted-foreground">Segments couverts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">QR</div>
              <div className="text-sm text-muted-foreground">Codes générés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">AI</div>
              <div className="text-sm text-muted-foreground">Landing pages IA</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;