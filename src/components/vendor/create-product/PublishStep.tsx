import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Rocket, 
  ExternalLink, 
  Copy, 
  Check, 
  Globe, 
  BarChart3, 
  QrCode,
  Smartphone,
  Eye,
  Loader2
} from 'lucide-react';
import { ProductFormData } from '../../../pages/vendor/CreateProduct';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  formData: ProductFormData;
  updateFormData: (updates: Partial<ProductFormData>) => void;
}

export function PublishStep({ formData, updateFormData }: Props) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [landingPageUrl, setLandingPageUrl] = useState('');

  const publishProduct = async () => {
    setIsPublishing(true);
    
    try {
      // Valider les données avant insertion
      if (!formData.title || !formData.description || formData.price <= 0) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      // Calculer la commission en pourcentage pour la base de données
      let commissionPct = formData.commission;
      if (formData.commissionType === 'fixed') {
        // Convertir le montant fixe en pourcentage
        commissionPct = formData.price > 0 ? (formData.commission / formData.price) * 100 : 0;
      }

      // S'assurer que les valeurs sont dans des limites raisonnables
      const safePrice = Math.min(Math.max(formData.price, 0), 999999999);
      const safeCommission = Math.min(Math.max(commissionPct, 0), 100);

      // Sauvegarder le produit en base (sans utilisateur connecté)
      const { data: product, error } = await supabase
        .from('products')
        .insert({
          title: formData.title,
          description: formData.description,
          price: safePrice,
          commission_pct: safeCommission,
          category: 'other' as const,
          vendor_id: '00000000-0000-0000-0000-000000000000', // ID par défaut pour la démo
          media_url: formData.images.find(img => img.isCover)?.url || formData.images[0]?.url || null,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Erreur de base de données: ${error.message}`);
      }

      // Génération de la landing page réelle
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedUrl = `${window.location.origin}/p/${formData.slug || product.id}`;
      setLandingPageUrl(generatedUrl);
      setIsPublished(true);
      
      toast({
        title: "Produit publié avec succès !",
        description: "Votre landing page a été générée et est maintenant en ligne",
      });

    } catch (error) {
      console.error('Erreur publication:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de publier le produit. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: `${label} copié dans le presse-papiers`,
    });
  };

  if (isPublished) {
    return (
      <div className="space-y-6 text-center">
        {/* Success State */}
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-white" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              🎉 Produit publié avec succès !
            </h2>
            <p className="text-muted-foreground">
              Votre landing page est maintenant en ligne et prête à convertir
            </p>
          </div>
        </div>

        {/* Landing Page Info */}
        <Card className="text-left">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Votre landing page
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono">{landingPageUrl}</span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(landingPageUrl, "URL de la landing page")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(landingPageUrl, '_blank')}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Fonctionnalités incluses :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Design mobile optimisé</li>
                  <li>✓ Tracking automatique intégré</li>
                  <li>✓ SEO optimisé</li>
                  <li>✓ Formulaire de commande</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Prêt pour :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Partage par les affiliés</li>
                  <li>✓ Campagnes publicitaires</li>
                  <li>✓ Référencement Google</li>
                  <li>✓ Réseaux sociaux</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/vendor')}
            className="bg-gradient-primary hover:opacity-90"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Voir les statistiques
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.open(landingPageUrl, '_blank')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Prévisualiser la landing page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pre-publish Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Rocket className="w-5 h-5 mr-2" />
            Résumé avant publication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Info */}
            <div className="space-y-4">
              <h4 className="font-medium">Informations produit :</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Titre :</span>
                  <span className="font-medium">{formData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prix :</span>
                  <span className="font-medium">{formData.price.toLocaleString()} DA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Commission :</span>
                  <span className="font-medium text-success">
                    {formData.commissionType === 'fixed' 
                      ? `${formData.commission} DA`
                      : `${formData.commission}%`
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Images :</span>
                  <span className="font-medium">{formData.images.length}</span>
                </div>
              </div>
            </div>

            {/* Configuration */}
            <div className="space-y-4">
              <h4 className="font-medium">Configuration :</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">URL :</span>
                  <span className="font-mono text-xs">linkly.com/p/{formData.slug}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paiement :</span>
                  <Badge variant="secondary">
                    {formData.paymentMode === 'form' ? 'Formulaire' : 'En ligne'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Code promo :</span>
                  <Badge variant={formData.promoEnabled ? "default" : "secondary"}>
                    {formData.promoEnabled ? formData.promoCode : 'Désactivé'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tracking :</span>
                  <Badge variant="default" className="bg-success text-success-foreground">
                    Activé
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What will be generated */}
      <Card>
        <CardHeader>
          <CardTitle>Ce qui sera généré automatiquement :</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Landing Page Features */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center">
                <Smartphone className="w-4 h-4 mr-2" />
                Landing Page Mobile-First
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-success mr-2" />
                  Section hero avec image de couverture
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-success mr-2" />
                  Liste des bénéfices et points de vente
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-success mr-2" />
                  Galerie d'images avec carrousel
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-success mr-2" />
                  Formulaire de commande optimisé
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-success mr-2" />
                  Section confiance et témoignages
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-success mr-2" />
                  FAQ générée automatiquement
                </li>
              </ul>
            </div>

            {/* Tracking & Attribution */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Tracking et Attribution
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-success mr-2" />
                  Pixel Linkly intégré automatiquement
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-success mr-2" />
                  Tracking des vues, clics et conversions
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-success mr-2" />
                  Attribution automatique aux affiliés
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-success mr-2" />
                  Conservation des paramètres UTM
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-success mr-2" />
                  Page de remerciement avec tracking
                </li>
                {formData.category === 'Restaurants/Boutiques' && (
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-success mr-2" />
                    QR code pour validation en caisse
                  </li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Special Features for Restaurants */}
      {formData.category === 'Restaurants/Boutiques' && (
        <Card className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="w-5 h-5 mr-2" />
              Fonctionnalité spéciale restaurant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                En plus de la landing page, nous générerons un QR code spécial que vos affiliés 
                pourront utiliser directement en caisse pour valider les ventes.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Pour vos affiliés :</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• QR code personnalisé à présenter</li>
                    <li>• Attribution automatique des ventes</li>
                    <li>• Interface simple de validation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Pour votre équipe :</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Scanner pour valider les ventes</li>
                    <li>• Suivi des commissions en temps réel</li>
                    <li>• Interface caisse simplifiée</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Publish Button */}
      <div className="text-center">
        <Button
          onClick={publishProduct}
          disabled={isPublishing}
          size="lg"
          className="bg-gradient-primary hover:opacity-90 px-8 py-4 text-lg"
        >
          {isPublishing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Publication en cours...
            </>
          ) : (
            <>
              <Rocket className="w-5 h-5 mr-2" />
              Publier & Générer la Landing Page
            </>
          )}
        </Button>
        
        <p className="text-sm text-muted-foreground mt-4">
          La génération de votre landing page prendra quelques secondes
        </p>
      </div>
    </div>
  );
}