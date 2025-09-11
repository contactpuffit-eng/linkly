import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Package, ArrowLeft } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  commission_pct: number;
  media_url: string;
}

export default function SimpleOrderPage() {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const affiliateCode = searchParams.get('ref');
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    wilaya: '',
    commune: '',
    notes: '',
    quantity: 1
  });

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Erreur chargement produit:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le produit",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setSubmitting(true);
    
    try {
      let affiliateId = null;
      let commissionAmount = 0;

      // Si on a un code d'affiliation, récupérer l'affilié et calculer la commission
      if (affiliateCode) {
        const { data: affiliateProduct } = await supabase
          .from('affiliate_products')
          .select('affiliate_id')
          .eq('affiliate_code', affiliateCode)
          .single();

        if (affiliateProduct) {
          affiliateId = affiliateProduct.affiliate_id;
          commissionAmount = (product.price * formData.quantity * product.commission_pct) / 100;
        }
      }

      const orderData = {
        product_id: product.id,
        affiliate_code: affiliateCode,
        affiliate_id: affiliateId,
        commission_amount: commissionAmount,
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
        customer_email: formData.customerEmail,
        customer_address: formData.customerAddress,
        wilaya: formData.wilaya,
        commune: formData.commune,
        notes: formData.notes,
        quantity: formData.quantity,
        amount: product.price * formData.quantity,
        status: 'pending' as const
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      // Si la commande est créée avec succès et qu'il y a un affilié, mettre à jour son wallet
      if (!error && affiliateId && commissionAmount > 0) {
        await supabase
          .from('wallets')
          .upsert({
            user_id: affiliateId,
            pending_balance: commissionAmount
          }, {
            onConflict: 'user_id',
            ignoreDuplicates: false
          });
        
        // Mettre aussi à jour la balance pending en ajoutant à l'existant
        const { data: currentWallet } = await supabase
          .from('wallets')
          .select('pending_balance')
          .eq('user_id', affiliateId)
          .single();

        if (currentWallet) {
          await supabase
            .from('wallets')
            .update({
              pending_balance: (currentWallet.pending_balance || 0) + commissionAmount
            })
            .eq('user_id', affiliateId);
        }

        // Enregistrer les stats du lien d'affiliation
        await supabase
          .from('affiliate_link_stats')
          .insert({
            affiliate_id: affiliateId,
            product_id: product.id,
            affiliate_code: affiliateCode,
            event_type: 'purchase',
            user_ip: null,
            user_agent: navigator.userAgent
          });
      }

      if (error) throw error;

      toast({
        title: "Commande créée !",
        description: "Votre commande a été enregistrée avec succès"
      });

      // Rediriger vers la confirmation
      window.location.href = `/order-confirmation/${data.id}`;
      
    } catch (error) {
      console.error('Erreur création commande:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la commande",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-4"></div>
          <p>Chargement...</p>
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
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                {product.media_url ? (
                  <img
                    src={product.media_url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{product.title}</h2>
                <p className="text-2xl font-bold text-primary mt-1">
                  {product.price.toLocaleString()} DA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Passer votre commande</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Nom complet *</Label>
                  <Input
                    id="customerName"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Téléphone *</Label>
                  <Input
                    id="customerPhone"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="customerAddress">Adresse complète *</Label>
                <Textarea
                  id="customerAddress"
                  required
                  value={formData.customerAddress}
                  onChange={(e) => setFormData({...formData, customerAddress: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="wilaya">Wilaya *</Label>
                  <Input
                    id="wilaya"
                    required
                    value={formData.wilaya}
                    onChange={(e) => setFormData({...formData, wilaya: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="commune">Commune *</Label>
                  <Input
                    id="commune"
                    required
                    value={formData.commune}
                    onChange={(e) => setFormData({...formData, commune: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="quantity">Quantité</Label>
                <Select
                  value={formData.quantity.toString()}
                  onValueChange={(value) => setFormData({...formData, quantity: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold mb-4">
                  <span>Total:</span>
                  <span className="text-primary">
                    {(product.price * formData.quantity).toLocaleString()} DA
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-primary hover:opacity-90"
                  size="lg"
                >
                  {submitting ? "Traitement..." : "Confirmer la commande"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}