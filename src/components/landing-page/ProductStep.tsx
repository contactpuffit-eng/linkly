import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Sparkles, 
  Package, 
  ShoppingBag,
  Wand2,
  Check,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProductStepProps {
  products: any[];
  onNext: (productData: any) => void;
}

export const ProductStep = ({ products, onNext }: ProductStepProps) => {
  const [mode, setMode] = useState<'choose' | 'existing' | 'ai'>('choose');
  const [aiUrl, setAiUrl] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const { toast } = useToast();

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

        // Passer au thème suivant avec les données du produit
        onNext({
          ...productData,
          isNew: true
        });
        
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

  if (mode === 'choose') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Choisissez votre produit
          </h2>
          <p className="text-muted-foreground text-lg">
            Sélectionnez un produit existant ou créez-en un nouveau avec l'IA
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 group"
            onClick={() => setMode('ai')}
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Créer avec l'IA</CardTitle>
              <p className="text-muted-foreground">
                Collez un lien produit et l'IA créera automatiquement votre produit et landing page
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Import automatique des infos
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Optimisation IA du contenu
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Ajout direct au catalogue
                </div>
              </div>
              <Button className="w-full mt-4 bg-gradient-primary hover:opacity-90">
                <Wand2 className="w-4 h-4 mr-2" />
                Commencer avec l'IA
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 group"
            onClick={() => setMode('existing')}
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Produit existant</CardTitle>
              <p className="text-muted-foreground">
                Utilisez un produit déjà présent dans votre catalogue
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-2xl font-bold text-primary mb-2">
                  {products.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  produit{products.length > 1 ? 's' : ''} disponible{products.length > 1 ? 's' : ''}
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                disabled={products.length === 0}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Choisir un produit
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (mode === 'ai') {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <Button variant="ghost" onClick={() => setMode('choose')} className="mb-4">
            ← Retour
          </Button>
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Créer un produit avec l'IA
          </h2>
          <p className="text-muted-foreground">
            Collez le lien de votre produit et l'IA extraira automatiquement toutes les informations
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-primary" />
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
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Importer
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-6 space-y-4">
              <h4 className="font-semibold text-primary flex items-center">
                <Wand2 className="w-4 h-4 mr-2" />
                L'IA peut extraire automatiquement:
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Titre optimisé
                </div>
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Description SEO
                </div>
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Prix et devise
                </div>
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Images HD
                </div>
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Catégorie adaptée
                </div>
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Mots-clés pertinents
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === 'existing') {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <Button variant="ghost" onClick={() => setMode('choose')} className="mb-4">
            ← Retour
          </Button>
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Sélectionner un produit
          </h2>
          <p className="text-muted-foreground">
            Choisissez le produit pour lequel créer une landing page
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card 
              key={product.id}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50"
              onClick={() => onNext(product)}
            >
              <CardHeader>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                  {product.media_url ? (
                    <img 
                      src={product.media_url} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
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
                <Button className="w-full group-hover:bg-primary/90">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Créer la landing page
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return null;
};