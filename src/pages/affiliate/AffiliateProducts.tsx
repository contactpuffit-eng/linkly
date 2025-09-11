import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Package,
  TrendingUp,
  Link2,
  QrCode,
  Star,
  Copy,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  commission_pct: number;
  category: string;
  media_url: string;
  is_active: boolean;
  created_at: string;
}

export default function AffiliateProducts() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur détaillée:', error);
        throw error;
      }
      
      console.log('Produits chargés pour affiliés:', data);
      setProducts(data || []);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAffiliateLink = async (productId: string) => {
    const baseUrl = window.location.origin;
    const affiliateCode = `AFF_${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    
    // Chercher la landing page associée au produit
    const { data: landingPage } = await supabase
      .from('landing_pages')
      .select('slug')
      .eq('product_id', productId)
      .eq('is_published', true)
      .single();
    
    if (landingPage?.slug) {
      return `${baseUrl}/p/${landingPage.slug}?ref=${affiliateCode}`;
    }
    
    // Fallback vers la page de commande si pas de landing page
    return `${baseUrl}/order/${productId}?ref=${affiliateCode}`;
  };

  const copyAffiliateLink = async (productId: string, productTitle: string) => {
    const link = await generateAffiliateLink(productId);
    navigator.clipboard.writeText(link);
    toast({
      title: "Lien copié !",
      description: `Lien d'affiliation pour "${productTitle}" copié dans le presse-papiers`,
    });
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: products.length,
    avgCommission: products.length > 0 ? products.reduce((sum, p) => sum + p.commission_pct, 0) / products.length : 0,
    totalValue: products.reduce((sum, p) => sum + p.price, 0),
    highestCommission: products.length > 0 ? Math.max(...products.map(p => p.commission_pct)) : 0
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
          Produits Disponibles
        </h1>
        <p className="text-muted-foreground text-lg">
          Découvrez les produits à promouvoir et générez vos liens d'affiliation
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Produits Actifs</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Commission Moy.</p>
                <p className="text-2xl font-bold text-success">{stats.avgCommission.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Valeur Totale</p>
                <p className="text-2xl font-bold">{stats.totalValue.toLocaleString()} DA</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Max Commission</p>
                <p className="text-2xl font-bold text-orange-500">{stats.highestCommission}%</p>
              </div>
              <Star className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Rechercher des produits..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun produit trouvé</h3>
            <p className="text-muted-foreground">
              {products.length === 0 
                ? "Aucun produit disponible pour le moment"
                : "Essayez de modifier votre recherche"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
                {product.media_url ? (
                  <img
                    src={product.media_url}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-medium line-clamp-2 mb-1">{product.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-primary">
                    {product.price.toLocaleString()} DA
                  </span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {product.commission_pct}% commission
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={() => copyAffiliateLink(product.id, product.title)}
                    className="w-full bg-gradient-primary hover:opacity-90"
                    size="sm"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copier le lien d'affiliation
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={async () => {
                        const link = await generateAffiliateLink(product.id);
                        window.open(link, '_blank');
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Voir
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      QR Code
                    </Button>
                  </div>
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  Ajouté le {new Date(product.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}