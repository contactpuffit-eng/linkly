import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Minus,
  Edit,
  BarChart3,
  Search,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  title: string;
  media_url: string;
  price: number;
  stock_quantity: number;
  min_stock_alert: number;
  variants: any;
  sku: string;
}

interface StockMovement {
  id: string;
  movement_type: string;
  quantity: number;
  reason: string;
  created_at: string;
  created_by: string;
  products: {
    title: string;
  };
}

export default function StockManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentData, setAdjustmentData] = useState({
    type: 'in',
    quantity: 0,
    reason: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Charger les produits avec stock
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('title');

      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Charger les mouvements de stock récents
      const { data: movementsData, error: movementsError } = await supabase
        .from('stock_movements')
        .select(`
          *,
          products (title)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (movementsError) throw movementsError;
      setMovements(movementsData || []);

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

  const updateStock = async () => {
    if (!selectedProduct || !adjustmentData.quantity) return;

    try {
      const { error } = await supabase
        .from('stock_movements')
        .insert({
          product_id: selectedProduct.id,
          movement_type: adjustmentData.type,
          quantity: Math.abs(adjustmentData.quantity),
          reason: adjustmentData.reason || `Ajustement de stock ${adjustmentData.type === 'in' ? 'entrant' : 'sortant'}`
        });

      if (error) throw error;

      toast({
        title: "Stock mis à jour",
        description: `Stock ${adjustmentData.type === 'in' ? 'augmenté' : 'diminué'} de ${adjustmentData.quantity}`,
      });

      setAdjustmentData({ type: 'in', quantity: 0, reason: '' });
      setSelectedProduct(null);
      loadData();

    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le stock",
        variant: "destructive"
      });
    }
  };

  const updateMinStockAlert = async (productId: string, minStock: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ min_stock_alert: minStock })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Seuil d'alerte mis à jour",
        description: "Le seuil d'alerte de stock a été modifié",
      });

      loadData();

    } catch (error) {
      console.error('Error updating min stock:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le seuil",
        variant: "destructive"
      });
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.stock_quantity === 0) {
      return { label: 'Rupture', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
    } else if (product.stock_quantity <= product.min_stock_alert) {
      return { label: 'Stock faible', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle };
    } else {
      return { label: 'En stock', color: 'bg-green-100 text-green-800', icon: Package };
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesFilter = true;
    if (stockFilter === 'low') {
      matchesFilter = product.stock_quantity <= product.min_stock_alert;
    } else if (stockFilter === 'empty') {
      matchesFilter = product.stock_quantity === 0;
    } else if (stockFilter === 'good') {
      matchesFilter = product.stock_quantity > product.min_stock_alert;
    }
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalProducts: products.length,
    lowStock: products.filter(p => p.stock_quantity <= p.min_stock_alert && p.stock_quantity > 0).length,
    outOfStock: products.filter(p => p.stock_quantity === 0).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0)
  };

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
          <h1 className="text-3xl font-bold">Gestion des stocks</h1>
          <p className="text-muted-foreground">
            Gérez l'inventaire de vos produits et suivez les mouvements
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <div className="text-sm text-muted-foreground">Produits total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.lowStock}</div>
            <div className="text-sm text-muted-foreground">Stock faible</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
            <div className="text-sm text-muted-foreground">Rupture</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{stats.totalValue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Valeur (DA)</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrer par stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les produits</SelectItem>
                <SelectItem value="good">Stock normal</SelectItem>
                <SelectItem value="low">Stock faible</SelectItem>
                <SelectItem value="empty">Rupture de stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <div className="grid gap-4">
        {filteredProducts.map((product) => {
          const status = getStockStatus(product);
          const IconComponent = status.icon;
          
          return (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {product.media_url ? (
                        <img 
                          src={product.media_url} 
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold line-clamp-1">{product.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        {product.sku && <span>SKU: {product.sku}</span>}
                        <span>{product.price.toLocaleString()} DA</span>
                        <span>Valeur stock: {(product.price * product.stock_quantity).toLocaleString()} DA</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{product.stock_quantity}</div>
                      <div className="text-sm text-muted-foreground">En stock</div>
                    </div>
                    
                    <Badge className={status.color}>
                      <IconComponent className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Ajuster
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Ajuster le stock - {product.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Type d'ajustement</Label>
                            <Select 
                              value={adjustmentData.type} 
                              onValueChange={(value) => setAdjustmentData({...adjustmentData, type: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="in">
                                  <div className="flex items-center">
                                    <Plus className="w-4 h-4 mr-2 text-green-500" />
                                    Entrée de stock
                                  </div>
                                </SelectItem>
                                <SelectItem value="out">
                                  <div className="flex items-center">
                                    <Minus className="w-4 h-4 mr-2 text-red-500" />
                                    Sortie de stock
                                  </div>
                                </SelectItem>
                                <SelectItem value="adjustment">
                                  <div className="flex items-center">
                                    <Edit className="w-4 h-4 mr-2 text-blue-500" />
                                    Ajustement
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>Quantité</Label>
                            <Input
                              type="number"
                              value={adjustmentData.quantity}
                              onChange={(e) => setAdjustmentData({...adjustmentData, quantity: parseInt(e.target.value) || 0})}
                              placeholder="Quantité à ajuster"
                            />
                          </div>
                          
                          <div>
                            <Label>Raison (optionnel)</Label>
                            <Textarea
                              value={adjustmentData.reason}
                              onChange={(e) => setAdjustmentData({...adjustmentData, reason: e.target.value})}
                              placeholder="Raison de l'ajustement..."
                            />
                          </div>
                          
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <div className="text-sm">
                              <div>Stock actuel: <span className="font-medium">{product.stock_quantity}</span></div>
                              <div>Nouveau stock: <span className="font-medium">
                                {adjustmentData.type === 'in' 
                                  ? product.stock_quantity + adjustmentData.quantity
                                  : adjustmentData.type === 'out'
                                  ? Math.max(0, product.stock_quantity - adjustmentData.quantity)
                                  : adjustmentData.quantity
                                }
                              </span></div>
                            </div>
                          </div>
                          
                          <Button onClick={updateStock} className="w-full">
                            Confirmer l'ajustement
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Seuil d'alerte: {product.min_stock_alert} unités
                    </div>
                    <Input
                      type="number"
                      value={product.min_stock_alert}
                      onChange={(e) => updateMinStockAlert(product.id, parseInt(e.target.value) || 0)}
                      className="w-24 h-8"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Aucun produit trouvé</h3>
            <p className="text-muted-foreground">
              {searchTerm || stockFilter !== 'all' 
                ? 'Essayez de modifier vos filtres de recherche'
                : 'Ajoutez des produits pour commencer à gérer votre stock'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recent Movements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Mouvements récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {movements.slice(0, 10).map((movement) => (
              <div key={movement.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {movement.movement_type === 'in' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <div>
                    <div className="font-medium">{movement.products.title}</div>
                    <div className="text-sm text-muted-foreground">{movement.reason}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${movement.movement_type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                    {movement.movement_type === 'in' ? '+' : '-'}{movement.quantity}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(movement.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}