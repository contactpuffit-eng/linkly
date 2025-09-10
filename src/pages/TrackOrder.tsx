import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Truck, 
  Package, 
  MapPin, 
  Phone, 
  CheckCircle,
  Clock,
  AlertCircle
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
  status: string;
  tracking_number: string;
  created_at: string;
  updated_at: string;
  products: {
    title: string;
    media_url: string;
  };
}

export default function TrackOrder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();

  const searchOrder = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Champs requis",
        description: "Veuillez entrer un ID de commande ou numéro de téléphone",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setNotFound(false);
    setOrder(null);

    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          products (
            title,
            media_url
          )
        `);

      // Recherche par ID ou par téléphone
      if (searchTerm.length === 36 || searchTerm.includes('-')) {
        // Probablement un UUID
        query = query.eq('id', searchTerm);
      } else {
        // Probablement un numéro de téléphone
        query = query.eq('customer_phone', searchTerm);
      }

      const { data, error } = await query.single();

      if (error || !data) {
        setNotFound(true);
        return;
      }

      setOrder(data);

    } catch (error) {
      console.error('Error searching order:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusConfig = {
      pending: { 
        label: 'En attente', 
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
        description: 'Votre commande est en cours de traitement'
      },
      confirmed: { 
        label: 'Confirmée', 
        color: 'bg-blue-100 text-blue-800',
        icon: CheckCircle,
        description: 'Votre commande a été confirmée et sera bientôt expédiée'
      },
      shipped: { 
        label: 'Expédiée', 
        color: 'bg-purple-100 text-purple-800',
        icon: Truck,
        description: 'Votre commande est en route vers votre adresse'  
      },
      delivered: { 
        label: 'Livrée', 
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        description: 'Votre commande a été livrée avec succès'
      },
      cancelled: { 
        label: 'Annulée', 
        color: 'bg-red-100 text-red-800',
        icon: AlertCircle,
        description: 'Votre commande a été annulée'
      }
    };

    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const getProgressSteps = (currentStatus: string) => {
    const steps = [
      { id: 'pending', label: 'Reçue', status: 'completed' },
      { id: 'confirmed', label: 'Confirmée', status: currentStatus === 'pending' ? 'pending' : 'completed' },
      { id: 'shipped', label: 'Expédiée', status: ['pending', 'confirmed'].includes(currentStatus) ? 'pending' : 'completed' },
      { id: 'delivered', label: 'Livrée', status: currentStatus === 'delivered' ? 'completed' : 'pending' }
    ];

    return steps;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Suivre ma commande</h1>
          <p className="text-muted-foreground">
            Entrez votre ID de commande ou numéro de téléphone pour suivre votre livraison
          </p>
        </div>

        {/* Formulaire de recherche */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Rechercher une commande
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="search">ID de commande ou numéro de téléphone</Label>
                <Input
                  id="search"
                  placeholder="Ex: abc123... ou 0555123456"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchOrder()}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={searchOrder} disabled={loading}>
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Rechercher
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Résultat de recherche */}
        {notFound && (
          <Card>
            <CardContent className="text-center py-8">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Commande non trouvée</h3>
              <p className="text-muted-foreground">
                Aucune commande trouvée avec ces informations. Vérifiez votre ID de commande ou numéro de téléphone.
              </p>
            </CardContent>
          </Card>
        )}

        {order && (
          <div className="space-y-6">
            {/* Statut principal */}
            <Card>
              <CardContent className="py-6">
                <div className="text-center">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full ${getStatusInfo(order.status).color} mb-4`}>
                    {React.createElement(getStatusInfo(order.status).icon, { className: "w-5 h-5 mr-2" })}
                    <span className="font-medium">{getStatusInfo(order.status).label}</span>
                  </div>
                  <p className="text-muted-foreground">{getStatusInfo(order.status).description}</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Détails de la commande */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Détails de la commande
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">ID:</span>
                    <span className="font-mono text-sm">{order.id.slice(0, 8)}</span>
                  </div>

                  <div className="flex space-x-4">
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
                    
                    <div className="flex-1">
                      <h3 className="font-semibold line-clamp-2">{order.products.title}</h3>
                      <div className="text-sm text-muted-foreground mt-1">
                        Total: <span className="font-medium">{order.amount.toLocaleString()} DA</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Commandé le:</span>
                      <span>{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {order.tracking_number && (
                      <div className="flex justify-between">
                        <span>N° de suivi:</span>
                        <span className="font-mono">{order.tracking_number}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Adresse de livraison */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Livraison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="font-medium">{order.customer_name}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="w-4 h-4 mr-1" />
                      {order.customer_phone}
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <div>{order.customer_address}</div>
                    <div>{order.commune}, {order.wilaya}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progression de la commande */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Suivi détaillé
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getProgressSteps(order.status).map((step, index) => (
                    <div key={step.id} className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        step.status === 'completed' 
                          ? 'bg-primary border-primary' 
                          : 'border-muted bg-background'
                      }`}>
                        {step.status === 'completed' && (
                          <CheckCircle className="w-3 h-3 text-primary-foreground ml-0.5" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className={`font-medium ${
                          step.status === 'completed' ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {step.label}
                        </div>
                      </div>
                      
                      {step.status === 'completed' && (
                        <Badge variant="secondary">✓</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}