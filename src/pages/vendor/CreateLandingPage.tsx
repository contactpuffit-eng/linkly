import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Crown,
  Package,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [step, setStep] = useState<'product' | 'theme' | 'customize' | 'generate' | 'create-with-ai' | 'select-existing'>('product');
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [aiUrl, setAiUrl] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
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

  // Charger les produits
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true);
      
      if (data) {
        setProducts(data);
      }
    };
    
    fetchProducts();
  }, []);

  const importProductWithAI = async () => {
    setAiLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-import-product', {
        body: { url: aiUrl }
      });

      if (error) throw error;

      if (data.success) {
        // Ajouter le produit à la base de données
        const { data: productData, error: productError } = await supabase
          .from('products')
          .insert({
            title: data.extracted.title,
            description: data.extracted.description,
            price: data.extracted.price,
            commission_pct: 15,
            category: data.extracted.category || 'other',
            vendor_id: null,
            media_url: data.extracted.images?.[1]?.url || data.extracted.images?.[0]?.url || null,
            is_active: true
          })
          .select()
          .single();

        if (productError) throw productError;

        toast({
          title: "Produit créé avec l'IA !",
          description: "Le produit a été importé et ajouté à votre catalogue",
        });

        // Utiliser ce produit pour la landing page
        setSelectedProduct(productData.id);
        setFormData({
          ...formData,
          productName: data.extracted.title,
          description: data.extracted.description,
          price: data.extracted.price.toString()
        });
        setStep('theme');
        
      } else {
        throw new Error(data.error || "Échec de l'import IA");
      }
      
    } catch (error) {
      console.error('Error importing product:', error);
      toast({
        title: "Erreur d'import IA",
        description: "Impossible d'importer le produit depuis cette URL. Vérifiez le lien et réessayez.",
        variant: "destructive"
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleProductSelect = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(productId);
      setFormData({
        ...formData,
        productName: product.title,
        description: product.description,
        price: product.price.toString()
      });
      setStep('theme');
    }
  };

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

  if (step === 'product') {
    return (
      <div className="container max-w-6xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Choisir un produit
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Sélectionnez un produit existant ou créez-en un nouveau avec l'IA
          </p>
        </div>

        {/* Options principales */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50"
                onClick={() => setStep('create-with-ai')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Créer avec l'IA</CardTitle>
              <p className="text-muted-foreground">
                Fournissez un lien produit et l'IA créera automatiquement le produit et la landing page
              </p>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-primary hover:opacity-90">
                <Wand2 className="w-4 h-4 mr-2" />
                Commencer avec l'IA
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Produit existant</CardTitle>
              <p className="text-muted-foreground">
                Utilisez un produit déjà présent dans votre catalogue
              </p>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" 
                      disabled={products.length === 0}
                      onClick={() => setStep('select-existing')}>
                <ShoppingBag className="w-4 h-4 mr-2" />
                Choisir un produit
              </Button>
            </CardContent>
          </Card>
        </div>

        {products.length === 0 && (
          <div className="text-center py-8">
            <div className="bg-muted/50 rounded-lg p-6 max-w-md mx-auto">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Aucun produit dans le catalogue</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Créez votre premier produit avec l'IA ou ajoutez-en un manuellement
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/vendor/products'}>
                Gérer les produits
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (step === 'create-with-ai') {
    return (
      <div className="container max-w-2xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <Button variant="ghost" onClick={() => setStep('product')} className="mb-4">
            ← Retour
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Créer un produit avec l'IA
          </h1>
          <p className="text-muted-foreground">
            Collez le lien de votre produit et l'IA extraira automatiquement toutes les informations
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Import intelligent par IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="ai-url">URL du produit *</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="ai-url"
                  value={aiUrl}
                  onChange={(e) => setAiUrl(e.target.value)}
                  placeholder="https://example.com/produit-123"
                  className="flex-1"
                />
                <Button 
                  onClick={importProductWithAI}
                  disabled={!aiUrl || aiLoading}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  {aiLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Import...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Importer
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-sm">L'IA peut extraire:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center"><Check className="w-3 h-3 mr-2 text-green-500" /> Titre et description du produit</li>
                <li className="flex items-center"><Check className="w-3 h-3 mr-2 text-green-500" /> Prix et devise</li>
                <li className="flex items-center"><Check className="w-3 h-3 mr-2 text-green-500" /> Images principales</li>
                <li className="flex items-center"><Check className="w-3 h-3 mr-2 text-green-500" /> Catégorie appropriée</li>
                <li className="flex items-center"><Check className="w-3 h-3 mr-2 text-green-500" /> Mots-clés et tags</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'select-existing') {
    return (
      <div className="container max-w-6xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <Button variant="ghost" onClick={() => setStep('product')} className="mb-4">
            ← Retour
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Sélectionner un produit
          </h1>
          <p className="text-muted-foreground">
            Choisissez le produit pour lequel créer une landing page
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card 
              key={product.id}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50"
              onClick={() => handleProductSelect(product.id)}
            >
              <CardHeader>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4">
                  {product.media_url ? (
                    <img 
                      src={product.media_url} 
                      alt={product.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
                <div className="text-xl font-bold text-primary">
                  {product.price.toLocaleString()} DA
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {product.description}
                </p>
                <Button className="w-full">
                  Créer une landing page
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('product')}>
                Changer de produit
              </Button>
              <Button variant="outline" onClick={() => setStep('theme')}>
                Changer de thème
              </Button>
            </div>
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
          Choisir un thème
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Sélectionnez un thème professionnel pour votre landing page
        </p>
        {selectedProduct && (
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => setStep('product')}>
              Changer de produit
            </Button>
          </div>
        )}
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