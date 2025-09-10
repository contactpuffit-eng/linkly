import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  AlertCircle,
  Search,
  Filter,
  Edit,
  Eye,
  Phone,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  wilaya: string;
  commune: string;
  amount: number;
  shipping_cost: number;
  commission_amount: number;
  quantity: number;
  status: string;
  payment_method: string;
  tracking_number: string;
  created_at: string;
  affiliate_code: string;
  products: {
    title: string;
    media_url: string;
    price: number;
  };
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    revenue: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products (
            title,
            media_url,
            price,
            vendor_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filtrer uniquement les commandes des produits du vendeur (ou null pour test)
      const vendorOrders = data.filter(order => 
        !order.products?.vendor_id || order.products.vendor_id === null
      );

      setOrders(vendorOrders);
      calculateStats(vendorOrders);

    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les commandes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData: Order[]) => {
    const stats = {
      total: ordersData.length,
      pending: ordersData.filter(o => o.status === 'pending').length,
      confirmed: ordersData.filter(o => o.status === 'confirmed').length,
      shipped: ordersData.filter(o => o.status === 'shipped').length,
      delivered: ordersData.filter(o => o.status === 'delivered').length,
      revenue: ordersData.reduce((sum, o) => sum + o.amount, 0)
    };
    setStats(stats);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus as any,
          updated_at: new Date().toISOString(),
          tracking_number: newStatus === 'shipped' ? `TRK${Date.now()}` : null
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Statut mis à jour",
        description: `Commande ${newStatus === 'confirmed' ? 'confirmée' : newStatus === 'shipped' ? 'expédiée' : 'mise à jour'}`,
      });

      loadOrders();

    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la commande",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmée', variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Expédiée', variant: 'default' as const, color: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Livrée', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Annulée', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone.includes(searchTerm) ||
      order.id.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
          <h1 className="text-3xl font-bold">Gestion des commandes</h1>
          <p className="text-muted-foreground">
            Gérez vos commandes, livraisons et commissions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">En attente</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
            <div className="text-sm text-muted-foreground">Confirmées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.shipped}</div>
            <div className="text-sm text-muted-foreground">Expédiées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
            <div className="text-sm text-muted-foreground">Livrées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{stats.revenue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">CA (DA)</div>
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
                  placeholder="Rechercher par nom, téléphone ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmées</SelectItem>
                <SelectItem value="shipped">Expédiées</SelectItem>
                <SelectItem value="delivered">Livrées</SelectItem>
                <SelectItem value="cancelled">Annulées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    {order.products.media_url ? (
                      <img 
                        src={order.products.media_url} 
                        alt={order.products.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold line-clamp-1">{order.products.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <span>#{order.id.slice(0, 8)}</span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {order.amount.toLocaleString()} DA
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Client</div>
                  <div className="font-medium">{order.customer_name}</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="w-3 h-3 mr-1" />
                    {order.customer_phone}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Livraison</div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-3 h-3 mr-1" />
                    {order.wilaya}, {order.commune}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Frais: {order.shipping_cost.toLocaleString()} DA
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Commande</div>
                  <div>Qté: {order.quantity}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.payment_method === 'cash_on_delivery' ? 'Paiement à la livraison' : order.payment_method}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Commission</div>
                  <div className="font-medium text-green-600">
                    {order.commission_amount ? `${order.commission_amount.toLocaleString()} DA` : '0 DA'}
                  </div>
                  {order.affiliate_code && (
                    <div className="text-sm text-muted-foreground">
                      Code: {order.affiliate_code}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  {order.tracking_number && (
                    <span>Suivi: {order.tracking_number}</span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {order.status === 'pending' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateOrderStatus(order.id, 'confirmed')}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Confirmer
                    </Button>
                  )}
                  
                  {order.status === 'confirmed' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateOrderStatus(order.id, 'shipped')}
                    >
                      <Truck className="w-4 h-4 mr-1" />
                      Expédier
                    </Button>
                  )}
                  
                  {order.status === 'shipped' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Marquer livré
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Voir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Aucune commande trouvée</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'Essayez de modifier vos filtres de recherche'
                : 'Vos commandes apparaîtront ici une fois que les clients passeront commande'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}