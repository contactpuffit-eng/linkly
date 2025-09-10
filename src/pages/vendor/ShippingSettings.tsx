import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Truck, 
  Package, 
  Clock, 
  DollarSign,
  Settings,
  MapPin,
  Zap,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ShippingSettings {
  id?: string;
  vendor_id: string;
  base_shipping_cost: number;
  free_shipping_threshold: number;
  processing_days: number;
  express_shipping_cost: number;
}

interface Wilaya {
  id: number;
  code: string;
  name: string;
  shipping_cost: number;
}

export default function ShippingSettings() {
  const [settings, setSettings] = useState<ShippingSettings>({
    vendor_id: '',
    base_shipping_cost: 500,
    free_shipping_threshold: 5000,
    processing_days: 2,
    express_shipping_cost: 800
  });
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customRates, setCustomRates] = useState<Record<string, number>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Charger les paramètres de livraison existants
      const { data: settingsData, error: settingsError } = await supabase
        .from('vendor_shipping_settings')
        .select('*')
        .single();

      if (settingsData) {
        setSettings(settingsData);
      }

      // Charger les wilayas
      const { data: wilayasData, error: wilayasError } = await supabase
        .from('wilayas')
        .select('*')
        .order('name');

      if (wilayasError) throw wilayasError;
      setWilayas(wilayasData || []);

      // Initialiser les tarifs personnalisés avec les tarifs par défaut
      const defaultRates: Record<string, number> = {};
      wilayasData?.forEach(wilaya => {
        defaultRates[wilaya.code] = wilaya.shipping_cost;
      });
      setCustomRates(defaultRates);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    
    try {
      const { data, error } = await supabase
        .from('vendor_shipping_settings')
        .upsert({
          ...settings,
          vendor_id: 'temp-vendor-id' // À remplacer par l'ID réel du vendeur
        })
        .select()
        .single();

      if (error) throw error;

      setSettings(data);
      
      toast({
        title: "Paramètres sauvegardés",
        description: "Vos paramètres de livraison ont été mis à jour",
      });

    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updateCustomRate = (wilayaCode: string, rate: number) => {
    setCustomRates(prev => ({
      ...prev,
      [wilayaCode]: rate
    }));
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
          <h1 className="text-3xl font-bold">Paramètres de livraison</h1>
          <p className="text-muted-foreground">
            Configurez vos tarifs et conditions de livraison
          </p>
        </div>
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Paramètres généraux */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Paramètres généraux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="base-cost">Coût de base (DA)</Label>
                <Input
                  id="base-cost"
                  type="number"
                  value={settings.base_shipping_cost}
                  onChange={(e) => setSettings({
                    ...settings,
                    base_shipping_cost: parseInt(e.target.value) || 0
                  })}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Coût de livraison standard pour toute l'Algérie
                </p>
              </div>

              <div>
                <Label htmlFor="free-threshold">Seuil livraison gratuite (DA)</Label>
                <Input
                  id="free-threshold"
                  type="number"
                  value={settings.free_shipping_threshold}
                  onChange={(e) => setSettings({
                    ...settings,
                    free_shipping_threshold: parseInt(e.target.value) || 0
                  })}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Montant minimum pour la livraison gratuite
                </p>
              </div>

              <div>
                <Label htmlFor="processing-days">Délai de traitement (jours)</Label>
                <Input
                  id="processing-days"
                  type="number"
                  value={settings.processing_days}
                  onChange={(e) => setSettings({
                    ...settings,
                    processing_days: parseInt(e.target.value) || 0
                  })}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Temps nécessaire pour préparer une commande
                </p>
              </div>

              <div>
                <Label htmlFor="express-cost">Livraison express (DA)</Label>
                <Input
                  id="express-cost"
                  type="number"
                  value={settings.express_shipping_cost}
                  onChange={(e) => setSettings({
                    ...settings,
                    express_shipping_cost: parseInt(e.target.value) || 0
                  })}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Coût supplémentaire pour la livraison express
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Options de livraison
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Livraison gratuite disponible</Label>
                  <p className="text-sm text-muted-foreground">
                    Offrir la livraison gratuite au-dessus du seuil
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Livraison express disponible</Label>
                  <p className="text-sm text-muted-foreground">
                    Proposer une option de livraison rapide
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Suivi automatique</Label>
                  <p className="text-sm text-muted-foreground">
                    Générer automatiquement les numéros de suivi
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tarifs par wilaya */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Tarifs par wilaya
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {wilayas.map((wilaya) => (
                  <div key={wilaya.code} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">{wilaya.name}</div>
                      <div className="text-sm text-muted-foreground">Code: {wilaya.code}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={customRates[wilaya.code] || wilaya.shipping_cost}
                        onChange={(e) => updateCustomRate(wilaya.code, parseInt(e.target.value) || 0)}
                        className="w-20 h-8"
                      />
                      <span className="text-sm text-muted-foreground">DA</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                💡 Vous pouvez personnaliser les tarifs par wilaya selon vos coûts logistiques
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                Aperçu des tarifs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-primary/5 rounded-lg">
                  <DollarSign className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{settings.base_shipping_cost}</div>
                  <div className="text-sm text-muted-foreground">Coût de base</div>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold">{settings.free_shipping_threshold}</div>
                  <div className="text-sm text-muted-foreground">Seuil gratuit</div>
                </div>
                
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold">{settings.processing_days}</div>
                  <div className="text-sm text-muted-foreground">Jours traitement</div>
                </div>
                
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <Zap className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold">{settings.express_shipping_cost}</div>
                  <div className="text-sm text-muted-foreground">Express</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Exemple de calcul</h4>
                <div className="text-sm space-y-1">
                  <div>Commande 3,000 DA → Livraison: {settings.base_shipping_cost} DA</div>
                  <div>Commande 6,000 DA → Livraison: Gratuite</div>
                  <div>Express +{settings.express_shipping_cost} DA</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}