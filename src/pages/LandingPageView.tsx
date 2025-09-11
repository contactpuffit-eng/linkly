import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { 
  ShoppingCart,
  Phone,
  Star,
  CheckCircle,
  Truck,
  Shield,
  Clock,
  ThumbsUp
} from 'lucide-react';

interface LandingPage {
  id: string;
  title: string;
  slug: string;
  product_id: string;
  customization: any;
  media_urls: any;
  is_published: boolean;
}

export default function LandingPageView() {
  const { slug } = useParams();
  const [landingPage, setLandingPage] = useState<LandingPage | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchLandingPage(slug);
    }
  }, [slug]);

  const fetchLandingPage = async (pageSlug: string) => {
    try {
      const { data, error } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('slug', pageSlug)
        .eq('is_published', true)
        .single();

      if (error) throw error;

      setLandingPage(data);

      // Récupérer l'image du produit associé
      if (data.product_id) {
        const { data: productData } = await supabase
          .from('products')
          .select('media_url')
          .eq('id', data.product_id)
          .single();
        
        if (productData?.media_url) {
          setProductImage(productData.media_url);
        }
      }

      // Incrémenter le compteur de vues
      await supabase
        .from('landing_pages')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', data.id);

    } catch (error) {
      console.error('Error fetching landing page:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async () => {
    if (!landingPage) return;

    try {
      // Incrémenter le compteur de conversions
      await supabase
        .from('landing_pages')
        .update({ conversions_count: (landingPage.customization.conversions_count || 0) + 1 })
        .eq('id', landingPage.id);

      // Rediriger vers la page de commande
      window.location.href = `/order/${landingPage.product_id}`;
    } catch (error) {
      console.error('Error handling order:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  if (!landingPage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Page non trouvée</h1>
          <p className="text-muted-foreground">Cette landing page n'existe pas ou n'est plus disponible.</p>
        </div>
      </div>
    );
  }

  const { customization, media_urls } = landingPage;
  const mediaArray = Array.isArray(media_urls) ? media_urls : [];
  const coverImage = mediaArray.find(img => img.isCover) || mediaArray[0];
  
  // Utiliser l'image du produit si pas d'image dans media_urls
  const displayImage = coverImage || (productImage ? { url: productImage, alt: customization.productName } : null);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjA1Ij4KPHBhdGggZD0iTTM2IDM0djEyaC0yVjM0aDJ6bTAtMTJ2MTBoLTJWMjJoMnptMTAgMTJ2MTJoLTJWMzRoMnptMC0xMnYxMGgtMlYyMmgyelwiLz4KPC9nPgo8L2c+Cjwvc3ZnPg==')] opacity-10"></div>
        <div className="relative container max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center mb-6">
            <Badge className="bg-red-500 text-white animate-pulse mr-3">
              New!
            </Badge>
            <span className="text-white/80">{customization.urgency || 'Offre Limitée'}</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            {customization.productName}
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl">
            {customization.description}
          </p>
          <div className="flex items-center gap-8">
            <div className="text-6xl font-bold">
              {parseInt(customization.price || '0').toLocaleString()} DA
            </div>
            <div className="text-white/70">
              <div className="line-through text-xl">
                {Math.round(parseInt(customization.price || '0') * 1.3).toLocaleString()} DA
              </div>
              <div className="text-sm">Prix normal</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Gallery */}
      <div className="bg-gray-50 py-16">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Main Image */}
            <div className="space-y-6">
              <div className="aspect-square bg-white rounded-2xl shadow-2xl overflow-hidden">
                {displayImage ? (
                  <img 
                    src={displayImage.url} 
                    alt={displayImage.alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <ShoppingCart className="w-24 h-24 mx-auto mb-4" />
                      <p>Image du produit</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Image Thumbnails */}
              {mediaArray.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {mediaArray.slice(0, 4).map((img: any, idx: number) => (
                    <div key={idx} className="aspect-square bg-white rounded-xl shadow-lg overflow-hidden">
                      <img 
                        src={img.url} 
                        alt={img.alt}
                        className="w-full h-full object-cover hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info & CTA */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-current" />
                    ))}
                  </div>
                  <span className="ml-3 text-lg text-gray-600">(127 avis)</span>
                </div>
                
                <h2 className="text-3xl font-bold mb-6">{customization.productName}</h2>
                <p className="text-gray-600 leading-relaxed text-lg">{customization.description}</p>
              </div>

              {/* Benefits */}
              <div className="space-y-4">
                <h3 className="font-semibold text-xl">Pourquoi choisir ce produit ?</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-4" />
                    <span className="text-lg">Qualité premium garantie</span>
                  </div>
                  <div className="flex items-center">
                    <Truck className="w-6 h-6 text-blue-500 mr-4" />
                    <span className="text-lg">Livraison rapide en 24-48h</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-6 h-6 text-purple-500 mr-4" />
                    <span className="text-lg">Garantie constructeur incluse</span>
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp className="w-6 h-6 text-orange-500 mr-4" />
                    <span className="text-lg">Satisfaction client 98%</span>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-gray-600">Prix du produit:</span>
                    <span className="text-3xl font-bold">
                      {parseInt(customization.price || '0').toLocaleString()} DA
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-gray-600">Livraison:</span>
                    <span className="font-semibold">
                      {customization.shippingCost ? `${customization.shippingCost} DA` : 'Gratuite'}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-primary">
                      {(parseInt(customization.price || '0') + parseInt(customization.shippingCost || '0')).toLocaleString()} DA
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-4">
                <Button 
                  onClick={handleOrder}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xl py-8 shadow-lg hover:shadow-xl transition-all"
                >
                  <ShoppingCart className="w-7 h-7 mr-4" />
                  Commander maintenant - Paiement à la livraison
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white text-xl py-6"
                  onClick={() => window.location.href = 'tel:0555123456'}
                >
                  <Phone className="w-6 h-6 mr-3" />
                  Appeler maintenant: 0555 123 456
                </Button>
              </div>

              {/* Urgency */}
              {customization.urgency && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
                  <div className="flex items-center text-red-700">
                    <Clock className="w-6 h-6 mr-3" />
                    <span className="font-semibold text-lg">{customization.urgency}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="bg-white py-16">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <Shield className="w-16 h-16 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">Paiement Sécurisé</h3>
              <p className="text-gray-600">100% sécurisé et protégé</p>
            </div>
            <div className="space-y-4">
              <Truck className="w-16 h-16 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">Livraison Rapide</h3>
              <p className="text-gray-600">24-48h partout en Algérie</p>
            </div>
            <div className="space-y-4">
              <ThumbsUp className="w-16 h-16 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">Support Client</h3>
              <p className="text-gray-600">Assistance 7j/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}