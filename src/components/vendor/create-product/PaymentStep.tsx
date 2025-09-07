import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CreditCard, FileText, Truck, Key, AlertCircle } from 'lucide-react';
import { ProductFormData } from '../../../pages/vendor/CreateProduct';

interface Props {
  formData: ProductFormData;
  updateFormData: (updates: Partial<ProductFormData>) => void;
}

export function PaymentStep({ formData, updateFormData }: Props) {
  return (
    <div className="space-y-6">
      {/* Payment Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Mode de paiement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Form Mode */}
            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                formData.paymentMode === 'form' 
                  ? 'ring-2 ring-primary shadow-brand' 
                  : 'hover:ring-1 hover:ring-border'
              }`}
              onClick={() => updateFormData({ paymentMode: 'form' })}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="flex justify-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    formData.paymentMode === 'form' 
                      ? 'bg-gradient-primary text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <FileText className="w-6 h-6" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold">Commande sans paiement</h3>
                  <p className="text-sm text-muted-foreground">
                    Formulaire de contact avec informations client
                  </p>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div>• Pas de paiement en ligne</div>
                  <div>• Confirmation par téléphone</div>
                  <div>• Paiement à la livraison</div>
                </div>
                
                {formData.paymentMode === 'form' && (
                  <Badge className="bg-gradient-primary text-white">
                    Sélectionné
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Online Payment Mode */}
            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                formData.paymentMode === 'online' 
                  ? 'ring-2 ring-primary shadow-brand' 
                  : 'hover:ring-1 hover:ring-border'
              }`}
              onClick={() => updateFormData({ paymentMode: 'online' })}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="flex justify-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    formData.paymentMode === 'online' 
                      ? 'bg-gradient-primary text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <CreditCard className="w-6 h-6" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center justify-center">
                    Paiement en ligne
                    <Badge variant="secondary" className="ml-2">
                      Bientôt
                    </Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Intégration avec les passerelles de paiement
                  </p>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div>• CIB / Carte bancaire</div>
                  <div>• Paiement instantané</div>
                  <div>• Conversion optimisée</div>
                </div>
                
                {formData.paymentMode === 'online' && (
                  <Badge className="bg-gradient-primary text-white">
                    Sélectionné
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Mode Details */}
          {formData.paymentMode === 'form' && (
            <div className="bg-info/10 border border-info/20 rounded-lg p-4">
              <h4 className="font-medium mb-2">Mode "Commande sans paiement"</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Vos clients rempliront un formulaire avec leurs informations. 
                Vous devrez les contacter pour confirmer la commande.
              </p>
              <div className="text-sm">
                <strong>Champs du formulaire :</strong>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>• Nom complet</li>
                  <li>• Numéro de téléphone</li>
                  <li>• Email</li>
                  <li>• Wilaya et commune</li>
                  <li>• Adresse de livraison</li>
                </ul>
              </div>
            </div>
          )}

          {formData.paymentMode === 'online' && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                <div>
                  <h4 className="font-medium text-warning mb-2">Fonctionnalité en développement</h4>
                  <p className="text-sm text-muted-foreground">
                    Le paiement en ligne sera bientôt disponible avec les passerelles 
                    CIB et autres solutions populaires en Algérie.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipping Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="w-5 h-5 mr-2" />
            Livraison
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="transporter-key" className="flex items-center">
                <Key className="w-4 h-4 mr-2" />
                Clé API Transporteur (optionnel)
              </Label>
              <Input
                id="transporter-key"
                type="password"
                value={formData.shippingApiKey || ''}
                onChange={(e) => updateFormData({ shippingApiKey: e.target.value })}
                placeholder="Votre clé API transporteur"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Clé API pour la création automatique d'envois (Yalidine, Kaliblue, etc.)
              </p>
            </div>

            <div className="bg-background border rounded-lg p-4">
              <h4 className="font-medium mb-3">Gestion des livraisons :</h4>
              
              {formData.shippingApiKey ? (
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                    <span className="text-success font-medium">Mode automatique activé</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Création automatique d'envoi lors de l'expédition</li>
                    <li>• Numéro de suivi généré automatiquement</li>
                    <li>• Mise à jour automatique du statut de livraison</li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-warning rounded-full mr-2"></div>
                    <span className="text-warning font-medium">Mode manuel</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Saisie manuelle du numéro de suivi</li>
                    <li>• Mise à jour manuelle des statuts</li>
                    <li>• Vous devrez gérer les envois vous-même</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-info/10 border border-info/20 rounded-lg p-4">
              <h4 className="font-medium mb-2">Transporteurs supportés :</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                <div>• Yalidine</div>
                <div>• Kaliblue</div>
                <div>• ZR Express</div>
                <div>• Procolis</div>
                <div>• TCS</div>
                <div>• Autres (sur demande)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Flow */}
      <Card>
        <CardHeader>
          <CardTitle>Flux de commande</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h4 className="font-medium">Processus de validation :</h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <div className="font-medium">Commande reçue</div>
                  <div className="text-sm text-muted-foreground">
                    Status: <Badge variant="secondary">À confirmer</Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <div className="font-medium">Confirmation client</div>
                  <div className="text-sm text-muted-foreground">
                    Vous appelez le client pour confirmer
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <div className="font-medium">Expédition</div>
                  <div className="text-sm text-muted-foreground">
                    {formData.shippingApiKey 
                      ? "Création automatique d'envoi + tracking" 
                      : "Saisie manuelle du tracking"
                    }
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <div className="font-medium">Livraison validée</div>
                  <div className="text-sm text-muted-foreground">
                    Commission affilié validée automatiquement
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}