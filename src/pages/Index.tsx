import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight, 
  Upload, 
  Users, 
  TrendingUp, 
  ShoppingBag, 
  Laptop, 
  Store, 
  Building2,
  Zap,
  Brain,
  Shield,
  QrCode,
  Globe,
  Star,
  Check
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
        <div className="container relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Nouvelle génération d'affiliation
            </Badge>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
              L'e-commerce{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                accessible
              </span>{" "}
              pour tous
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Avec Linkly, vous lancez vos ventes sans budget pub, sans site, sans risque. 
              Nos affiliés s'occupent de la promotion, nos landing pages IA font le reste.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg" asChild>
                <a href="/vendor">
                  Commencer gratuitement
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#demo">
                  Voir une démo
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Comment ça marche</h2>
            <p className="text-xl text-muted-foreground">3 étapes simples pour commencer</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>1. Ajoutez votre produit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Import automatique depuis un lien → IA génère la fiche et la landing page optimisée
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>2. Les affiliés le partagent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Lien tracké, code promo ou QR code pour restaurants et boutiques physiques
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>3. Vous vendez → ils gagnent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Vous payez uniquement une commission sur ventes confirmées. Zéro risque.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solutions par segment */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Solutions pour chaque profil</h2>
            <p className="text-xl text-muted-foreground">Peu importe votre secteur, Linkly s'adapte</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <ShoppingBag className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">E-commerce</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Produits physiques, shop IG/Facebook, YouCan, Shopify → utilisez nos LP optimisées
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Laptop className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">SaaS & Formations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monétisez vos logiciels, abonnements, cours en ligne → commissions récurrentes
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Store className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Restaurants & Boutiques</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Générez des QR affiliés → scannés en caisse, ventes trackées automatiquement
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Building2 className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Grandes Entreprises</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Intégration directe du tracking via API, webhook et solutions sur mesure
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Points différenciants */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Pourquoi choisir Linkly ?</h2>
            <p className="text-xl text-muted-foreground">Les avantages qui font la différence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Zap className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Zéro budget pub</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Vos affiliés font la promotion, vous ne payez qu'au résultat</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Brain className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Landing pages IA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Générées et optimisées automatiquement pour maximiser les conversions</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Shield className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Sans risque</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Vous payez uniquement sur ventes confirmées, pas d'avance de frais</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <QrCode className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Multi-canaux</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Lien tracké, code promo, QR code - tous les formats supportés</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Globe className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Tout est affiliable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Produits, logiciels, services, restaurants - aucune limite</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact social */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">L'impact Linkly</h2>
            <p className="text-xl text-muted-foreground">Pour les vendeurs, affiliés et l'Algérie</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Pour les vendeurs</h3>
              <p className="text-muted-foreground">Augmentez vos ventes sans dépenser en publicité</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Pour les affiliés</h3>
              <p className="text-muted-foreground">Monétisez vos audiences sociales simplement</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Pour l'Algérie</h3>
              <p className="text-muted-foreground">Modernisation du commerce → du bouche-à-oreille au digital</p>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Ils nous font confiance</h2>
            <p className="text-xl text-muted-foreground">Premiers retours de nos utilisateurs pilotes</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <CardTitle className="text-lg">TechStore DZ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  "30 vendeurs pilotes connectés → 100 affiliés actifs → +200% de ventes en 3 mois"
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <CardTitle className="text-lg">Sarah Marketing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  "Enfin une plateforme qui comprend le marché algérien. Interface simple, tracking précis."
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <CardTitle className="text-lg">Restaurant El Bahdja</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  "Les QR codes affiliés ont révolutionné notre système de parrainage. Tracking automatique parfait."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Tarification simple</h2>
            <p className="text-xl text-muted-foreground">Commencez gratuitement, évoluez à votre rythme</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <div className="text-3xl font-bold">0 DA</div>
                <p className="text-muted-foreground">Pour tester</p>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">2 produits max</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">5% commission</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Landing pages IA</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-primary">
              <CardHeader>
                <Badge className="w-fit mb-2">Populaire</Badge>
                <CardTitle>Starter</CardTitle>
                <div className="text-3xl font-bold">2 500 DA</div>
                <p className="text-muted-foreground">Par mois</p>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">10 produits</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Analytics avancées</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">QR codes illimités</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <div className="text-3xl font-bold">5 000 DA</div>
                <p className="text-muted-foreground">Par mois</p>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">50 produits</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">API access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Support prioritaire</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <div className="text-3xl font-bold">15 000 DA</div>
                <p className="text-muted-foreground">Par mois</p>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Produits illimités</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Intégrations custom</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Account manager</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à lancer votre business sans budget ?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Rejoignez la révolution de l'affiliation en Algérie
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg mb-4" asChild>
            <a href="/vendor">
              Essayez Linkly gratuitement
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
          <p className="text-sm text-muted-foreground">
            Sans engagement. Sans carte bancaire. Sans risque.
          </p>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/70 rounded-md"></div>
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
