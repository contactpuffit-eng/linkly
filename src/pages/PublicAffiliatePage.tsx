import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { 
  ShoppingBag, 
  Monitor, 
  Store, 
  ExternalLink,
  QrCode,
  Star,
  Users,
  Eye,
  Loader2
} from "lucide-react";

interface SocialLink {
  platform: string;
  url: string;
}

interface AffiliatePage {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  theme_color: string;
  social_links: SocialLink[];
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  media_url: string;
  category: string;
  commission_pct: number;
  affiliate_code: string;
  promo_code: string;
}

const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return '📷';
    case 'facebook':
      return '👥';
    case 'twitter':
      return '🐦';
    case 'linkedin':
      return '💼';
    case 'youtube':
      return '🎥';
    case 'tiktok':
      return '🎵';
    default:
      return '🔗';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'electronics':
      return Monitor;
    case 'fashion':
      return ShoppingBag;
    case 'food':
      return Store;
    default:
      return ShoppingBag;
  }
};

const PublicAffiliatePage = () => {
  const { username } = useParams();
  const [page, setPage] = useState<AffiliatePage | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      fetchAffiliatePage();
    }
  }, [username]);

  const fetchAffiliatePage = async () => {
    try {
      // Remove @ if present
      const cleanUsername = username?.replace('@', '');
      
      // Fetch affiliate page
      const { data: pageData, error: pageError } = await supabase
        .from('affiliate_pages')
        .select('*')
        .eq('username', cleanUsername)
        .eq('is_published', true)
        .single();

      if (pageError) {
        if (pageError.code === 'PGRST116') {
          setError('Cette page n\'existe pas ou n\'est pas publique.');
        } else {
          throw pageError;
        }
        return;
      }

      // Parse social links
      const socialLinks = Array.isArray(pageData.social_links) 
        ? (pageData.social_links as unknown as SocialLink[])
        : [];

      setPage({
        id: pageData.id,
        username: pageData.username,
        display_name: pageData.display_name,
        bio: pageData.bio || '',
        avatar_url: pageData.avatar_url || '',
        theme_color: pageData.theme_color,
        social_links: socialLinks
      });

      // Fetch affiliate products
      const { data: productsData, error: productsError } = await supabase
        .from('affiliate_products')
        .select(`
          affiliate_code,
          promo_code,
          products (
            id,
            title,
            description,
            price,
            media_url,
            category,
            commission_pct
          )
        `)
        .eq('affiliate_id', pageData.affiliate_id);

      if (productsError) throw productsError;

      const formattedProducts = productsData.map(item => ({
        id: item.products.id,
        title: item.products.title,
        description: item.products.description || '',
        price: item.products.price,
        media_url: item.products.media_url || '',
        category: item.products.category,
        commission_pct: item.products.commission_pct,
        affiliate_code: item.affiliate_code,
        promo_code: item.promo_code
      }));

      setProducts(formattedProducts);

    } catch (error) {
      console.error('Error fetching affiliate page:', error);
      setError('Erreur lors du chargement de la page.');
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = async (product: Product) => {
    try {
      // Record click
      await supabase
        .from('affiliate_link_stats')
        .insert({
          affiliate_id: page?.id,
          product_id: product.id,
          affiliate_code: product.affiliate_code,
          event_type: 'click',
          user_ip: 'unknown',
          user_agent: navigator.userAgent
        });

      // Redirect to product page with affiliate code
      window.open(`/product/${product.id}?ref=${product.affiliate_code}`, '_blank');
    } catch (error) {
      console.error('Error recording click:', error);
      // Still redirect even if recording fails
      window.open(`/product/${product.id}?ref=${product.affiliate_code}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Page non trouvée</h1>
          <p className="text-muted-foreground">{error || 'Cette page n\'existe pas.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto bg-card min-h-screen">
        {/* Header */}
        <div className="relative">
          <div 
            className="h-32"
            style={{ 
              background: `linear-gradient(135deg, ${page.theme_color}, ${page.theme_color}88)` 
            }}
          ></div>
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-background shadow-lg"
              style={{ backgroundColor: page.theme_color }}
            >
              {page.avatar_url ? (
                <img 
                  src={page.avatar_url} 
                  alt={page.display_name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                page.display_name.charAt(0).toUpperCase()
              )}
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 pb-8 px-6 text-center">
          <h1 className="text-2xl font-bold mb-1">{page.display_name}</h1>
          <p className="text-muted-foreground mb-1">@{page.username}</p>
          <Badge variant="secondary" className="mb-4">
            <Users className="w-3 h-3 mr-1" />
            {products.length} produit{products.length > 1 ? 's' : ''}
          </Badge>
          {page.bio && (
            <p className="text-sm leading-relaxed">{page.bio}</p>
          )}
        </div>

        {/* Social Links */}
        {page.social_links.length > 0 && (
          <div className="px-6 mb-8">
            <div className="flex justify-center flex-wrap gap-2">
              {page.social_links.map((social, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(social.url, '_blank')}
                  className="flex items-center gap-2"
                >
                  <span>{getSocialIcon(social.platform)}</span>
                  {social.platform}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        <div className="px-6 space-y-4 pb-8">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Store className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Aucun produit disponible pour le moment.</p>
            </div>
          ) : (
            products.map((product) => {
              const IconComponent = getCategoryIcon(product.category);
              return (
                <Card 
                  key={product.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        {product.media_url ? (
                          <img 
                            src={product.media_url}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                            {product.title}
                          </h3>
                          <div className="ml-2 flex-shrink-0">
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                        
                        {product.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {product.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm" style={{ color: page.theme_color }}>
                              {product.price.toLocaleString()} DA
                            </span>
                            {product.commission_pct > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {product.commission_pct}% comm.
                              </Badge>
                            )}
                          </div>
                          
                          {product.promo_code && (
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                              style={{ borderColor: page.theme_color, color: page.theme_color }}
                            >
                              Code: {product.promo_code}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-8 border-t bg-muted/50 text-center">
          <p className="text-xs text-muted-foreground mb-2">
            Créé avec 
          </p>
          <div className="flex items-center justify-center space-x-1">
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: page.theme_color }}
            ></div>
            <span className="text-sm font-semibold">Linkly</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            linkly.com/@{page.username}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicAffiliatePage;