import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Star, ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

export default function ProductPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const affiliateCode = searchParams.get('ref');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Erreur chargement produit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = () => {
    if (product) {
      const orderUrl = `/simple-order/${product.id}${affiliateCode ? `?ref=${affiliateCode}` : ''}`;
      window.location.href = orderUrl;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-4"></div>
          <p>Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Produit non trouvé</h2>
          <p className="text-muted-foreground">Ce produit n'existe pas ou n'est plus disponible.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image du produit */}
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            {product.media_url ? (
              <img
                src={product.media_url}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-20 h-20 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Informations du produit */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-4xl font-bold text-primary">
                  {product.price.toLocaleString()} DA
                </span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {product.commission_pct}% commission
                </Badge>
              </div>

              <Button 
                onClick={handleOrder}
                className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold py-4 text-lg"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Commander Maintenant
              </Button>

              {affiliateCode && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center text-amber-800">
                    <Star className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">
                      Produit recommandé par un partenaire
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              Produit ajouté le {new Date(product.created_at).toLocaleDateString('fr-FR')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}