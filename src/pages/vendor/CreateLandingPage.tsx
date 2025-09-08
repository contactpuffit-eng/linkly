import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Sparkles, 
  Palette, 
  Monitor, 
  Smartphone, 
  Eye,
  Wand2,
  Layout,
  ShoppingBag,
  Star,
  Zap,
  Heart,
  Crown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LandingPageTheme {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: string;
  icon: any;
  features: string[];
  premium?: boolean;
}

const themes: LandingPageTheme[] = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Design épuré et moderne, parfait pour les produits tech',
    preview: '/api/placeholder/400/300',
    category: 'Business',
    icon: Layout,
    features: ['Hero minimaliste', 'Call-to-action puissant', 'Testimonials', 'FAQ']
  },
  {
    id: 'ecommerce-pro',
    name: 'E-commerce Pro',
    description: 'Template optimisé pour la vente en ligne',
    preview: '/api/placeholder/400/300',
    category: 'E-commerce',
    icon: ShoppingBag,
    features: ['Galerie produit', 'Prix en évidence', 'Urgence', 'Commande rapide']
  },
  {
    id: 'conversion-master',
    name: 'Conversion Master',
    description: 'Conçu pour maximiser les conversions',
    preview: '/api/placeholder/400/300',
    category: 'Marketing',
    icon: Zap,
    features: ['Psychologie des couleurs', 'Social proof', 'Scarcité', 'Multi-CTA'],
    premium: true
  },
  {
    id: 'premium-luxury',
    name: 'Premium Luxury',
    description: 'Template haut de gamme pour produits premium',
    preview: '/api/placeholder/400/300',
    category: 'Luxury',
    icon: Crown,
    features: ['Animations fluides', 'Typographie premium', 'Gradients', 'Parallax'],
    premium: true
  },
  {
    id: 'startup-launch',
    name: 'Startup Launch',
    description: 'Parfait pour lancer un nouveau produit',
    preview: '/api/placeholder/400/300',
    category: 'Startup',
    icon: Star,
    features: ['Countdown timer', 'Early bird', 'Beta access', 'Newsletter']
  },
  {
    id: 'health-wellness',
    name: 'Health & Wellness',
    description: 'Optimisé pour les produits santé et bien-être',
    preview: '/api/placeholder/400/300',
    category: 'Health',
    icon: Heart,
    features: ['Témoignages médicaux', 'Avant/après', 'Ingrédients', 'Garantie']
  }
];

export default function CreateLandingPage() {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [step, setStep] = useState<'theme' | 'customize' | 'generate'>('theme');
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    targetAudience: '',
    mainBenefit: '',
    urgency: '',
    customInstructions: ''
  });
  const { toast } = useToast();

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    setStep('customize');
  };

  const generateLandingPage = async () => {
    setStep('generate');
    
    try {
      // Simuler la génération IA
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Landing page générée !",
        description: "Votre landing page a été créée avec succès",
      });
      
      // Rediriger vers la preview
      const landingUrl = `/p/${formData.productName.toLowerCase().replace(/\s+/g, '-')}`;
      window.open(landingUrl, '_blank');
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer la landing page. Veuillez réessayer.",
        variant: "destructive"
      });
      setStep('customize');
    }
  };

  if (step === 'generate') {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Wand2 className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Génération de votre landing page...
            </h1>
            
            <p className="text-muted-foreground text-lg">
              L'IA crée votre landing page optimisée pour les conversions
            </p>
          </div>
          
          <div className="max-w-md mx-auto space-y-4">
            <div className="flex justify-between text-sm">
              <span>Analyse du produit</span>
              <span className="text-primary">✓</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Génération du contenu</span>
              <span className="text-primary animate-spin">⏳</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Optimisation des conversions</span>
              <span>⏳</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Finalisation</span>
              <span>⏳</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'customize') {
    const theme = themes.find(t => t.id === selectedTheme);
    
    return (
      <div className="container max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Personnaliser votre landing page</h1>
            <p className="text-muted-foreground">
              Thème sélectionné: <span className="font-medium">{theme?.name}</span>
            </p>
          </div>
          <Button variant="outline" onClick={() => setStep('theme')}>
            Changer de thème
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Aperçu en temps réel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[4/5] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Monitor className="w-12 h-12 mx-auto mb-4" />
                  <p>Aperçu de votre landing page</p>
                  <p className="text-sm">Se met à jour automatiquement</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Informations du produit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="productName">Nom du produit *</Label>
                  <Input
                    id="productName"
                    value={formData.productName}
                    onChange={(e) => setFormData({...formData, productName: e.target.value})}
                    placeholder="Ex: Machine à café premium"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description du produit *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Décrivez votre produit en détail..."
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Prix (DA)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="15000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="urgency">Urgence</Label>
                    <Input
                      id="urgency"
                      value={formData.urgency}
                      onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                      placeholder="Offre limitée"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Optimisation IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="targetAudience">Public cible</Label>
                  <Input
                    id="targetAudience"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                    placeholder="Ex: Femmes 25-45 ans, urbaines, revenus moyens+"
                  />
                </div>
                
                <div>
                  <Label htmlFor="mainBenefit">Principal bénéfice</Label>
                  <Input
                    id="mainBenefit"
                    value={formData.mainBenefit}
                    onChange={(e) => setFormData({...formData, mainBenefit: e.target.value})}
                    placeholder="Ex: Économise 2h par semaine"
                  />
                </div>
                
                <div>
                  <Label htmlFor="customInstructions">Instructions personnalisées</Label>
                  <Textarea
                    id="customInstructions"
                    value={formData.customInstructions}
                    onChange={(e) => setFormData({...formData, customInstructions: e.target.value})}
                    placeholder="Instructions spéciales pour l'IA..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={generateLandingPage}
              disabled={!formData.productName || !formData.description}
              className="w-full bg-gradient-primary hover:opacity-90 text-lg py-6"
            >
              <Wand2 className="w-5 h-5 mr-2" />
              Générer la landing page IA
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Créer une landing page IA
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Choisissez un thème professionnel et laissez l'IA créer votre landing page optimisée pour les conversions
        </p>
      </div>

      {/* Theme Categories */}
      <div className="flex flex-wrap gap-2 justify-center">
        {['Tous', 'Business', 'E-commerce', 'Marketing', 'Startup', 'Health', 'Luxury'].map((category) => (
          <Badge key={category} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            {category}
          </Badge>
        ))}
      </div>

      {/* Themes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => {
          const IconComponent = theme.icon;
          return (
            <Card 
              key={theme.id} 
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50"
              onClick={() => handleThemeSelect(theme.id)}
            >
              <CardHeader className="relative">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <IconComponent className="w-12 h-12 text-primary/60" />
                  {theme.premium && (
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{theme.name}</CardTitle>
                    <Badge variant="outline">{theme.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{theme.description}</p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Fonctionnalités incluses :</h4>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {theme.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-muted-foreground">
                        <div className="w-1 h-1 bg-primary rounded-full mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Palette className="w-4 h-4 mr-2" />
                  Choisir ce thème
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Custom Theme Option */}
      <Card className="border-dashed border-2 border-primary/30">
        <CardContent className="text-center py-12">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Wand2 className="w-8 h-8 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Thème 100% personnalisé</h3>
              <p className="text-muted-foreground">
                Laissez l'IA créer un thème unique basé sur votre produit et votre marque
              </p>
            </div>
            
            <Button variant="outline" className="mt-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Créer un thème personnalisé
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}