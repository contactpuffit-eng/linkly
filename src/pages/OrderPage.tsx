import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  MapPin, 
  Phone, 
  User, 
  Package,
  Truck,
  CreditCard,
  Check,
  AlertCircle,
  Plus,
  Minus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Wilaya {
  id: number;
  code: string;
  name: string;
  shipping_cost: number;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  media_url: string;
  commission_pct: number;
}

export default function OrderPage() {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const affiliateCode = searchParams.get('ref');
  
  const [product, setProduct] = useState<Product | null>(null);
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedWilaya, setSelectedWilaya] = useState<Wilaya | null>(null);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    address: '',
    wilaya: '',
    commune: '',
    notes: '',
    paymentMethod: 'cash_on_delivery'
  });

  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [productId]);

  const loadData = async () => {
    try {
      // Charger le produit
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (productError) throw productError;
      setProduct(productData);

      // Charger les wilayas
      const { data: wilayasData, error: wilayasError } = await supabase
        .from('wilayas')
        .select('*')
        .order('name');

      if (wilayasError) throw wilayasError;
      setWilayas(wilayasData);

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

  const handleWilayaChange = (wilayaCode: string) => {
    const wilaya = wilayas.find(w => w.code === wilayaCode);
    setSelectedWilaya(wilaya || null);
    setFormData({ ...formData, wilaya: wilayaCode });
  };

  const calculateTotal = () => {
    if (!product || !selectedWilaya) return 0;
    const productTotal = product.price * quantity;
    const shippingCost = selectedWilaya.shipping_cost;
    return productTotal + shippingCost;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !selectedWilaya) return;

    setSubmitting(true);
    
    try {
      const orderData = {
        product_id: product.id,
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
        customer_email: formData.customerEmail || null,
        customer_address: formData.address,
        wilaya: selectedWilaya.name,
        commune: formData.commune,
        quantity: quantity,
        amount: calculateTotal(),
        shipping_cost: selectedWilaya.shipping_cost,
        payment_method: formData.paymentMethod,
        notes: formData.notes || null,
        affiliate_code: affiliateCode || null,
        commission_amount: affiliateCode ? (product.price * quantity * product.commission_pct / 100) : null,
        status: 'pending' as const
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Commande confirmée !",
        description: "Votre commande a été enregistrée avec succès",
      });

      // Rediriger vers la page de confirmation
      window.location.href = `/order-confirmation/${data.id}`;
      
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la commande. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Produit non trouvé</h1>
          <p className="text-muted-foreground">Le produit demandé n'existe pas ou n'est plus disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Résumé du produit */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Votre commande
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4">
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    {product.media_url ? (
                      <img 
                        src={product.media_url} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-2">{product.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xl font-bold text-primary">
                        {product.price.toLocaleString()} DA
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center">{quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Résumé des coûts */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total ({quantity} article{quantity > 1 ? 's' : ''})</span>
                    <span>{(product.price * quantity).toLocaleString()} DA</span>
                  </div>
                  {selectedWilaya && (
                    <div className="flex justify-between text-sm">
                      <span>Livraison vers {selectedWilaya.name}</span>
                      <span>{selectedWilaya.shipping_cost.toLocaleString()} DA</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span className="text-primary">{calculateTotal().toLocaleString()} DA</span>
                  </div>
                </div>

                {affiliateCode && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center text-green-800">
                      <Check className="w-4 h-4 mr-2" />
                      <span className="text-sm">Code parrain appliqué: {affiliateCode}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Formulaire de commande */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Informations personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        value={formData.customerName}
                        onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="0555 123 456"
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email (optionnel)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                    />
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
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="wilaya">Wilaya *</Label>
                    <Select onValueChange={handleWilayaChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre wilaya" />
                      </SelectTrigger>
                      <SelectContent>
                        {wilayas.map((wilaya) => (
                          <SelectItem key={wilaya.code} value={wilaya.code}>
                            {wilaya.name} - {wilaya.shipping_cost} DA
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="commune">Commune *</Label>
                    <Input
                      id="commune"
                      value={formData.commune}
                      onChange={(e) => setFormData({...formData, commune: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Adresse complète *</Label>
                    <Textarea
                      id="address"
                      placeholder="Rue, numéro, quartier..."
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Mode de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg bg-primary/5 border-primary">
                      <input
                        type="radio"
                        id="cash_on_delivery"
                        name="payment"
                        value="cash_on_delivery"
                        checked={formData.paymentMethod === 'cash_on_delivery'}
                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                        className="text-primary"
                      />
                      <Label htmlFor="cash_on_delivery" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Paiement à la livraison</div>
                            <div className="text-sm text-muted-foreground">
                              Payez en espèces lors de la réception
                            </div>
                          </div>
                          <Badge variant="secondary">Recommandé</Badge>
                        </div>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notes (optionnel)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Instructions spéciales pour la livraison..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </CardContent>
              </Card>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90 text-lg py-6"
                disabled={submitting || !selectedWilaya}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Confirmation...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Confirmer la commande - {calculateTotal().toLocaleString()} DA
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}