import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  MapPin, 
  Phone, 
  Copy,
  Share2,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Order {
  id: string;
  product_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  wilaya: string;
  commune: string;
  quantity: number;
  amount: number;
  shipping_cost: number;
  payment_method: string;
  status: string;
  tracking_number: string;
  created_at: string;
  products: {
    title: string;
    media_url: string;
    price: number;
  };
}

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products (
            title,
            media_url,
            price
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);

    } catch (error) {
      console.error('Error loading order:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la commande",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(order?.id || '');
    toast({
      title: "ID copié !",
      description: "L'identifiant de commande a été copié",
    });
  };

  const shareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Ma commande',
        text: `Commande ${order?.id} confirmée !`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié !",
        description: "Le lien de suivi a été copié",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Commande non trouvée</h1>
          <p className="text-muted-foreground">La commande demandée n'existe pas.</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'secondary' as const },
      confirmed: { label: 'Confirmée', variant: 'default' as const },
      shipped: { label: 'Expédiée', variant: 'default' as const },
      delivered: { label: 'Livrée', variant: 'default' as const },
      cancelled: { label: 'Annulée', variant: 'destructive' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header de confirmation */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Commande confirmée !</h1>
          <p className="text-muted-foreground">
            Merci {order.customer_name}, votre commande a été enregistrée avec succès
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Détails de la commande */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Détails de la commande
                  </CardTitle>
                  {getStatusBadge(order.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">ID de commande:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm">{order.id.slice(0, 8)}</span>
                    <Button variant="ghost" size="sm" onClick={copyOrderId}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    {order.products.media_url ? (
                      <img 
                        src={order.products.media_url} 
                        alt={order.products.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-2">{order.products.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground">
                        Quantité: {order.quantity}
                      </span>
                      <span className="font-bold">
                        {order.products.price.toLocaleString()} DA
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total</span>
                    <span>{(order.products.price * order.quantity).toLocaleString()} DA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Livraison</span>
                    <span>{order.shipping_cost.toLocaleString()} DA</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span className="text-primary">{order.amount.toLocaleString()} DA</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Adresse de livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div><strong>{order.customer_name}</strong></div>
                <div className="flex items-center text-muted-foreground">
                  <Phone className="w-4 h-4 mr-2" />
                  {order.customer_phone}
                </div>
                <div className="text-sm">
                  <div>{order.customer_address}</div>
                  <div>{order.commune}, {order.wilaya}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statut et tracking */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Suivi de commande
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="text-sm">
                      <div className="font-medium">Commande reçue</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 opacity-50">
                    <div className="w-2 h-2 bg-muted rounded-full"></div>
                    <div className="text-sm text-muted-foreground">
                      <div>Confirmation</div>
                      <div className="text-xs">En attente</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 opacity-50">
                    <div className="w-2 h-2 bg-muted rounded-full"></div>
                    <div className="text-sm text-muted-foreground">
                      <div>Expédition</div>
                      <div className="text-xs">En attente</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 opacity-50">
                    <div className="w-2 h-2 bg-muted rounded-full"></div>
                    <div className="text-sm text-muted-foreground">
                      <div>Livraison</div>
                      <div className="text-xs">En attente</div>
                    </div>
                  </div>
                </div>

                {order.tracking_number && (
                  <div className="bg-primary/5 p-3 rounded-lg">
                    <div className="text-sm font-medium">Numéro de suivi</div>
                    <div className="font-mono text-sm">{order.tracking_number}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={shareOrder} variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Contacter le support
                </Button>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Paiement à la livraison</h3>
              <p className="text-sm text-blue-800">
                Vous paierez en espèces lors de la réception de votre commande. 
                Assurez-vous d'avoir le montant exact: <strong>{order.amount.toLocaleString()} DA</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}