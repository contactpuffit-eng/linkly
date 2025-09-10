import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target,
  Search,
  Calendar,
  Gift,
  Award,
  Percent,
  Package
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  title: string;
  media_url: string;
  price: number;
  commission_pct: number;
  category: string;
}

interface AffiliatePerformance {
  affiliate_id: string;
  affiliate_code: string;
  total_orders: number;
  total_sales: number;
  total_commission: number;
  profiles: {
    name: string;
    avatar_url: string;
  };
}

export default function CommissionManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [affiliates, setAffiliates] = useState<AffiliatePerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalCommissionPaid: 0,
    totalAffiliates: 0,
    averageCommission: 0,
    topPerformer: null as AffiliatePerformance | null
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Charger les produits avec leurs commissions
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('title');

      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Charger les performances des affiliés
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          affiliate_id,
          affiliate_code,
          amount,
          commission_amount,
          profiles!affiliate_id (
            name,
            avatar_url
          )
        `)
        .not('affiliate_id', 'is', null)
        .not('commission_amount', 'is', null);

      if (ordersError) throw ordersError;

      // Regrouper par affilié
      const affiliateMap = new Map();
      ordersData?.forEach(order => {
        if (!order.affiliate_id) return;
        
        if (!affiliateMap.has(order.affiliate_id)) {
          affiliateMap.set(order.affiliate_id, {
            affiliate_id: order.affiliate_id,
            affiliate_code: order.affiliate_code,
            total_orders: 0,
            total_sales: 0,
            total_commission: 0,
            profiles: order.profiles
          });
        }
        
        const affiliate = affiliateMap.get(order.affiliate_id);
        affiliate.total_orders += 1;
        affiliate.total_sales += order.amount || 0;
        affiliate.total_commission += order.commission_amount || 0;
      });

      const affiliatePerformances = Array.from(affiliateMap.values());
      setAffiliates(affiliatePerformances);

      // Calculer les statistiques
      const totalCommissionPaid = affiliatePerformances.reduce((sum, a) => sum + a.total_commission, 0);
      const averageCommission = affiliatePerformances.length > 0 
        ? totalCommissionPaid / affiliatePerformances.length 
        : 0;
      const topPerformer = affiliatePerformances.sort((a, b) => b.total_commission - a.total_commission)[0] || null;

      setStats({
        totalCommissionPaid,
        totalAffiliates: affiliatePerformances.length,
        averageCommission,
        topPerformer
      });

    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProductCommission = async (productId: string, newCommission: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ commission_pct: newCommission })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Commission mise à jour",
        description: `Nouvelle commission: ${newCommission}%`,
      });

      loadData();

    } catch (error) {
      console.error('Error updating commission:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la commission",
        variant: "destructive"
      });
    }
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAffiliates = affiliates.filter(affiliate =>
    affiliate.profiles?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    affiliate.affiliate_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des commissions</h1>
          <p className="text-muted-foreground">
            Gérez les commissions de vos affiliés et analysez les performances
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{stats.totalCommissionPaid.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Commission totale (DA)</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{stats.totalAffiliates}</div>
                <div className="text-sm text-muted-foreground">Affiliés actifs</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{stats.averageCommission.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Commission moy. (DA)</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <div>
                <div className="text-lg font-bold line-clamp-1">
                  {stats.topPerformer?.profiles?.name || 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">Top affilié</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Commissions par produit</TabsTrigger>
          <TabsTrigger value="affiliates">Performance des affiliés</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Percent className="w-5 h-5 mr-2" />
                Commissions par produit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        {product.media_url ? (
                          <img 
                            src={product.media_url} 
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-semibold line-clamp-1">{product.title}</h4>
                        <div className="text-sm text-muted-foreground">
                          Prix: {product.price.toLocaleString()} DA
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          {product.commission_pct}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          = {(product.price * product.commission_pct / 100).toLocaleString()} DA
                        </div>
                      </div>
                      
                      <Input
                        type="number"
                        value={product.commission_pct}
                        onChange={(e) => updateProductCommission(product.id, parseInt(e.target.value) || 0)}
                        className="w-20 h-8"
                        min="0"
                        max="50"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="affiliates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Performance des affiliés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un affilié..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredAffiliates.map((affiliate, index) => (
                  <div key={affiliate.affiliate_id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                          #{index + 1}
                        </div>
                        {affiliate.profiles?.avatar_url ? (
                          <img 
                            src={affiliate.profiles.avatar_url} 
                            alt={affiliate.profiles.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-semibold">{affiliate.profiles?.name || 'Affilié'}</h4>
                        <div className="text-sm text-muted-foreground">
                          Code: {affiliate.affiliate_code}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div>
                        <div className="text-lg font-bold">{affiliate.total_orders}</div>
                        <div className="text-sm text-muted-foreground">Commandes</div>
                      </div>
                      
                      <div>
                        <div className="text-lg font-bold">{affiliate.total_sales.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Ventes (DA)</div>
                      </div>
                      
                      <div>
                        <div className="text-lg font-bold text-primary">{affiliate.total_commission.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Commission (DA)</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredAffiliates.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Aucun affilié trouvé</h3>
                  <p className="text-muted-foreground">
                    Les affiliés apparaîtront ici une fois qu'ils auront généré des ventes
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Commission Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gift className="w-5 h-5 mr-2" />
            Guide des commissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Recommandations par catégorie</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Électronique</span>
                  <Badge variant="outline">5-10%</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Mode</span>
                  <Badge variant="outline">10-20%</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Beauté</span>
                  <Badge variant="outline">15-25%</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Maison & Jardin</span>
                  <Badge variant="outline">8-15%</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Santé</span>
                  <Badge variant="outline">20-30%</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Bonnes pratiques</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start">
                  <Target className="w-4 h-4 mr-2 mt-0.5 text-primary" />
                  <span>Ajustez selon la marge de votre produit</span>
                </div>
                <div className="flex items-start">
                  <TrendingUp className="w-4 h-4 mr-2 mt-0.5 text-green-500" />
                  <span>Plus la commission est élevée, plus les affiliés seront motivés</span>
                </div>
                <div className="flex items-start">
                  <Award className="w-4 h-4 mr-2 mt-0.5 text-yellow-500" />
                  <span>Offrez des bonus pour les gros volumes</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}