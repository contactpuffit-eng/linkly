import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Package, 
  Sparkles, 
  Upload,
  Link2,
  Wand2,
  ShoppingBag,
  Tag,
  DollarSign,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  images: Array<{
    url: string;
    isCover: boolean;
  }>;
  tags: string[];
}

export default function ProductCatalog() {
  const [mode, setMode] = useState<'list' | 'manual' | 'ai'>('list');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: 0,
    category: 'other',
    images: [],
    tags: []
  });
  const [aiUrl, setAiUrl] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const { toast } = useToast();

  const addProduct = async (productData: ProductFormData) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          title: productData.title,
          description: productData.description,
          price: productData.price,
          commission_pct: 15, // Commission par défaut de 15%
          category: productData.category as any,
          vendor_id: '00000000-0000-0000-0000-000000000000',
          media_url: productData.images.find(img => img.isCover)?.url || productData.images[0]?.url || null,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Produit ajouté !",
        description: "Le produit a été ajouté à votre catalogue avec succès",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        price: 0,
        category: 'other',
        images: [],
        tags: []
      });
      setMode('list');
      
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const importProductWithAI = async () => {
    if (!aiUrl.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une URL valide",
        variant: "destructive"
      });
      return;
    }

    setAiLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-import-product', {
        body: { url: aiUrl }
      });

      if (error) throw error;

      if (data && data.extracted) {
        const importedProduct: ProductFormData = {
          title: data.extracted.title || 'Produit importé',
          description: data.extracted.description || data.ai_generated?.seo_description || 'Description générée par IA',
          price: data.extracted.price || 0,
          category: 'other',
          images: data.extracted.images?.map((img: any) => ({
            url: img.url,
            isCover: img === data.extracted.images[0]
          })) || [],
          tags: data.extracted.tags || []
        };

        await addProduct(importedProduct);
        setAiUrl('');
        
        toast({
          title: "Produit importé avec succès !",
          description: "Le produit a été analysé et ajouté à votre catalogue",
        });
      }
      
    } catch (error) {
      console.error('Error importing product:', error);
      toast({
        title: "Erreur d'importation",
        description: "Impossible d'importer le produit. Vérifiez l'URL et réessayez.",
        variant: "destructive"
      });
    } finally {
      setAiLoading(false);
    }
  };

  if (mode === 'ai') {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Créer un produit avec l'IA</h1>
              <p className="text-muted-foreground">
                Décrivez votre produit et laissez l'IA optimiser tous les détails
              </p>
            </div>
            <Button variant="outline" onClick={() => setMode('list')}>
              Retour au catalogue
            </Button>
          </div>

          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-primary" />
                Assistant IA pour produits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="aiUrl">URL du produit à importer</Label>
                <Input
                  id="aiUrl"
                  type="url"
                  value={aiUrl}
                  onChange={(e) => setAiUrl(e.target.value)}
                  placeholder="https://example.com/produit"
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Collez l'URL de n'importe quel produit en ligne. L'IA va extraire automatiquement toutes les informations.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-primary/5">
                  <CardContent className="p-4 text-center">
                    <Wand2 className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Titre optimisé</h4>
                    <p className="text-xs text-muted-foreground">Génère un titre accrocheur</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/5">
                  <CardContent className="p-4 text-center">
                    <Package className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Description SEO</h4>
                    <p className="text-xs text-muted-foreground">Description optimisée pour Google</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/5">
                  <CardContent className="p-4 text-center">
                    <Tag className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold text-sm">Prix intelligent</h4>
                    <p className="text-xs text-muted-foreground">Prix basé sur le marché</p>
                  </CardContent>
                </Card>
              </div>

              <Button 
                onClick={importProductWithAI}
                disabled={!aiUrl.trim() || aiLoading}
                className="w-full bg-gradient-primary hover:opacity-90 text-lg py-6"
              >
                {aiLoading ? (
                  <>
                    <div className="animate-spin w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Link2 className="w-5 h-5 mr-2" />
                    Importer avec l'IA
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (mode === 'manual') {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Ajouter un produit manuellement</h1>
              <p className="text-muted-foreground">
                Remplissez tous les détails de votre produit
              </p>
            </div>
            <Button variant="outline" onClick={() => setMode('list')}>
              Retour au catalogue
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations générales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Nom du produit *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Ex: Machine à café premium"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Décrivez votre produit en détail..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Prix (DA) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price || ''}
                        onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                        placeholder="15000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Catégorie</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="other">Autre</SelectItem>
                          <SelectItem value="electronics">Électronique</SelectItem>
                          <SelectItem value="fashion">Mode</SelectItem>
                          <SelectItem value="home">Maison</SelectItem>
                          <SelectItem value="health">Santé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Images du produit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2">Glissez vos images ici</p>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Choisir des fichiers
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Aperçu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto mb-2" />
                      <p>Aperçu du produit</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold">{formData.title || 'Nom du produit'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formData.description || 'Description du produit'}
                    </p>
                    <div className="text-lg font-bold text-primary">
                      {formData.price ? `${formData.price.toLocaleString()} DA` : 'Prix'}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={() => addProduct(formData)}
                disabled={!formData.title || !formData.description || formData.price <= 0 || loading}
                className="w-full bg-gradient-primary hover:opacity-90 text-lg py-6"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Ajout en cours...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Ajouter au catalogue
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Catalogue de produits</h1>
          <p className="text-muted-foreground">
            Gérez votre catalogue et ajoutez de nouveaux produits
          </p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 group"
          onClick={() => setMode('ai')}
        >
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-xl font-semibold mb-2">Créer avec l'IA</h3>
            <p className="text-muted-foreground mb-4">
              Décrivez votre produit et laissez l'IA optimiser tous les détails pour maximiser les ventes
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary">Titre optimisé</Badge>
              <Badge variant="secondary">Description SEO</Badge>
              <Badge variant="secondary">Prix intelligent</Badge>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 group"
          onClick={() => setMode('manual')}
        >
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            
            <h3 className="text-xl font-semibold mb-2">Ajouter manuellement</h3>
            <p className="text-muted-foreground mb-4">
              Contrôlez chaque détail de votre produit avec un formulaire complet et personnalisable
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline">Contrôle total</Badge>
              <Badge variant="outline">Personnalisable</Badge>
              <Badge variant="outline">Rapide</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Produits du catalogue ({products.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Aucun produit</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par ajouter votre premier produit au catalogue
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => setMode('ai')}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Créer avec l'IA
                </Button>
                <Button variant="outline" onClick={() => setMode('manual')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter manuellement
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
                      <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h4 className="font-semibold mb-1">{product.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                    <div className="text-lg font-bold text-primary">{product.price.toLocaleString()} DA</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}