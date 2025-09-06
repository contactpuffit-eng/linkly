import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Marketplace from "@/components/Marketplace";
import DemoCallout from "@/components/DemoCallout";
import Pricing from "@/components/Pricing";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <Marketplace />
      <DemoCallout />
      <Pricing />
      
      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-md"></div>
                <span className="font-bold text-xl">Linkly</span>
              </div>
              <p className="text-muted-foreground max-w-md">
                La plateforme SaaS d'affiliation multi-segments qui connecte vendeurs et affiliés 
                à travers l'e-commerce, les services numériques et les commerces physiques.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Pour les Vendeurs</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Créer des offres</li>
                <li>Gérer les affiliés</li>
                <li>Analytics avancées</li>
                <li>API & Intégrations</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Pour les Affiliés</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Marketplace</li>
                <li>Liens & QR codes</li>
                <li>Link-in-bio</li>
                <li>Suivi des gains</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Linkly. Tous droits réservés. Made with ❤️ in Algeria</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
