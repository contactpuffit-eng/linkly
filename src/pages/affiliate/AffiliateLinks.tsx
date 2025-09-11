import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Link2, 
  Copy, 
  MousePointer, 
  ShoppingCart,
  DollarSign,
  Search,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AffiliateLink {
  id: string;
  product_id: string;
  affiliate_code: string;
  promo_code: string;
  created_at: string;
  product: {
    title: string;
    price: number;
    commission_pct: number;
    media_url: string;
  };
  stats: {
    clicks: number;
    orders: number;
    total_commission: number;
  };
}

export default function AffiliateLinks() {
  const { toast } = useToast();
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAffiliateLinks();
  }, []);

  const fetchAffiliateLinks = async () => {
    try {
      // Vérifier si un utilisateur est connecté
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLinks([]);
        setLoading(false);
        return;
      }

      const currentUserId = user.id;

      // Récupérer tous les liens d'affiliation de l'utilisateur
      const { data: affiliateProducts, error: linksError } = await supabase
        .from('affiliate_products')
        .select(`
          *,
          product:products(title, price, commission_pct, media_url)
        `)
        .eq('affiliate_id', currentUserId);

      if (linksError) throw linksError;

      // Pour chaque lien, récupérer les statistiques
      const linksWithStats = await Promise.all(
        (affiliateProducts || []).map(async (link) => {
          // Compter les clics
          const { count: clicks } = await supabase
            .from('affiliate_link_stats')
            .select('*', { count: 'exact' })
            .eq('affiliate_code', link.affiliate_code)
            .eq('event_type', 'click');

          // Compter les commandes et calculer la commission totale
          const { data: orders } = await supabase
            .from('orders')
            .select('commission_amount')
            .eq('affiliate_code', link.affiliate_code);

          const orderCount = orders?.length || 0;
          const totalCommission = orders?.reduce((sum, order) => sum + (order.commission_amount || 0), 0) || 0;

          return {
            ...link,
            stats: {
              clicks: clicks || 0,
              orders: orderCount,
              total_commission: totalCommission
            }
          };
        })
      );

      setLinks(linksWithStats);
    } catch (error) {
      console.error('Erreur chargement liens:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos liens d'affiliation",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateFullLink = (affiliateCode: string, productId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/product/${productId}?ref=${affiliateCode}`;
  };

  const copyLink = (affiliateCode: string, productId: string, productTitle: string) => {
    const link = generateFullLink(affiliateCode, productId);
    navigator.clipboard.writeText(link);
    toast({
      title: "Lien copié !",
      description: `Lien d'affiliation pour "${productTitle}" copié dans le presse-papiers`,
    });
  };

  const filteredLinks = links.filter(link =>
    link.product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.affiliate_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStats = links.reduce((acc, link) => ({
    clicks: acc.clicks + link.stats.clicks,
    orders: acc.orders + link.stats.orders,
    commission: acc.commission + link.stats.total_commission
  }), { clicks: 0, orders: 0, commission: 0 });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
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
          Mes Liens d'Affiliation
        </h1>
        <p className="text-muted-foreground text-lg">
          Gérez et suivez la performance de vos liens d'affiliation
        </p>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clics</p>
                <p className="text-2xl font-bold">{totalStats.clicks}</p>
              </div>
              <MousePointer className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Commandes</p>
                <p className="text-2xl font-bold text-green-600">{totalStats.orders}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Commission Totale</p>
                <p className="text-2xl font-bold text-orange-600">
                  {totalStats.commission.toLocaleString()} DA
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Rechercher des liens..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Liste des liens */}
      {links.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Link2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun lien trouvé</h3>
            <p className="text-muted-foreground mb-4">
              Connectez-vous et créez vos premiers liens d'affiliation
            </p>
            <Button onClick={() => window.location.href = '/affiliate?tab=products'}>
              Découvrir les produits
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredLinks.map((link) => (
            <Card key={link.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Image du produit */}
                  <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    {link.product.media_url ? (
                      <img
                        src={link.product.media_url}
                        alt={link.product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Link2 className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Informations principales */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-1">
                          {link.product.title}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {link.affiliate_code}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Créé le {new Date(link.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{link.product.price.toLocaleString()} DA</p>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {link.product.commission_pct}% commission
                        </Badge>
                      </div>
                    </div>

                    {/* Statistiques */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <MousePointer className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                        <p className="text-lg font-bold text-blue-700">{link.stats.clicks}</p>
                        <p className="text-xs text-blue-600">Clics</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <ShoppingCart className="w-5 h-5 text-green-500 mx-auto mb-1" />
                        <p className="text-lg font-bold text-green-700">{link.stats.orders}</p>
                        <p className="text-xs text-green-600">Commandes</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                        <p className="text-lg font-bold text-orange-700">
                          {link.stats.total_commission.toLocaleString()} DA
                        </p>
                        <p className="text-xs text-orange-600">Commission</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => copyLink(link.affiliate_code, link.product_id, link.product.title)}
                        className="flex-1 bg-gradient-primary hover:opacity-90"
                        size="sm"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copier le lien
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(generateFullLink(link.affiliate_code, link.product_id), '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Prévisualiser
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}