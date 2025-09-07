import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Copy, RefreshCw, BarChart3, Code, QrCode } from 'lucide-react';
import { ProductFormData } from '../../../pages/vendor/CreateProduct';
import { useToast } from '@/hooks/use-toast';

interface Props {
  formData: ProductFormData;
  updateFormData: (updates: Partial<ProductFormData>) => void;
}

export function TrackingStep({ formData, updateFormData }: Props) {
  const { toast } = useToast();

  const generatePromoCode = () => {
    const newCode = `AFF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    updateFormData({ promoCode: newCode });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: `${label} copié dans le presse-papiers`,
    });
  };

  const trackingCode = `
// Code de tracking Linkly
const linklyTracking = {
  productId: '${formData.slug || 'product-id'}',
  
  // Au chargement de la page
  trackView: () => {
    trustaffil('view', {
      product_id: '${formData.slug || 'product-id'}',
      value: ${formData.price},
      currency: 'DZD'
    });
  },
  
  // Au clic sur "Commander"
  trackCheckoutStart: () => {
    trustaffil('checkout_start', {
      product_id: '${formData.slug || 'product-id'}',
      value: ${formData.price},
      currency: 'DZD'
    });
  },
  
  // Après commande validée
  trackPurchase: (orderId) => {
    trustaffil('purchase', {
      order_id: orderId,
      product_id: '${formData.slug || 'product-id'}',
      value: ${formData.price},
      currency: 'DZD',
      commission: ${((formData.price * formData.commission) / 100).toFixed(2)}
    });
  }
};

// Auto-tracking
linklyTracking.trackView();
`.trim();

  return (
    <div className="space-y-6">
      {/* Promo Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <QrCode className="w-5 h-5 mr-2" />
            Code promotionnel affilié
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Switch
                checked={formData.promoEnabled}
                onCheckedChange={(checked) => updateFormData({ promoEnabled: checked })}
              />
              <div>
                <Label htmlFor="promo-enabled">Activer le code promo</Label>
                <p className="text-sm text-muted-foreground">
                  Générer un code promo unique pour ce produit
                </p>
              </div>
            </div>
            <Badge variant={formData.promoEnabled ? "default" : "secondary"}>
              {formData.promoEnabled ? "Activé" : "Désactivé"}
            </Badge>
          </div>

          {formData.promoEnabled && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Label htmlFor="promo-code">Code promotionnel</Label>
                  <Input
                    id="promo-code"
                    value={formData.promoCode}
                    onChange={(e) => updateFormData({ promoCode: e.target.value.toUpperCase() })}
                    className="font-mono text-lg"
                  />
                </div>
                <div className="flex flex-col justify-end space-y-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={generatePromoCode}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(formData.promoCode, "Code promo")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                <h4 className="font-medium mb-2">Comment ça fonctionne :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Les affiliés pourront partager ce code avec leurs audiences</li>
                  <li>• Quand un client utilise ce code, la vente est attribuée à l'affilié</li>
                  <li>• Le code peut être affiché ou masqué sur la landing page</li>
                  <li>• Vous pouvez modifier le code à tout moment</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tracking Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Intégration tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <h4 className="font-medium text-success mb-2">✓ Pixel Linkly intégré automatiquement</h4>
              <p className="text-sm text-muted-foreground">
                Le tracking sera automatiquement ajouté à votre landing page générée
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Événements trackés automatiquement :</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 border rounded-lg text-center">
                  <div className="text-blue-500 font-semibold">VIEW</div>
                  <div className="text-xs text-muted-foreground mt-1">Page visitée</div>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <div className="text-orange-500 font-semibold">CHECKOUT_START</div>
                  <div className="text-xs text-muted-foreground mt-1">Clic "Commander"</div>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <div className="text-green-500 font-semibold">PURCHASE</div>
                  <div className="text-xs text-muted-foreground mt-1">Commande validée</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attribution Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres d'attribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-background border rounded-lg p-4">
            <h4 className="font-medium mb-3">Paramètres URL automatiques :</h4>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">ta_click_id</span>
                <Badge variant="secondary">Identifiant de clic unique</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">aff_id</span>
                <Badge variant="secondary">ID de l'affilié</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">utm_source</span>
                <Badge variant="secondary">Source du trafic</Badge>
              </div>
            </div>
          </div>

          <div className="bg-info/10 border border-info/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              Ces paramètres sont automatiquement ajoutés aux liens partagés par les affiliés 
              et conservés tout au long du parcours d'achat pour assurer une attribution correcte.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Code Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Code className="w-5 h-5 mr-2" />
            Code de tracking (généré automatiquement)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
              <code>{trackingCode}</code>
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(trackingCode, "Code de tracking")}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <h4 className="font-medium text-warning mb-2">Note importante</h4>
            <p className="text-sm text-muted-foreground">
              Ce code sera automatiquement intégré dans votre landing page. 
              Vous n'avez pas besoin de l'ajouter manuellement.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* QR Code for Restaurants */}
      {formData.category === 'Restaurants/Boutiques' && (
        <Card className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="w-5 h-5 mr-2" />
              QR Code spécial restaurants
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-background/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Fonctionnalité bonus !</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Pour les restaurants et boutiques physiques, nous générerons automatiquement 
                un QR code spécial que vos affiliés pourront utiliser en caisse.
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                  Validation instantanée des ventes en caisse
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                  Attribution automatique des commissions
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                  Interface simple pour le personnel
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}