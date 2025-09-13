import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { AIImportPanel } from '@/components/vendor/create-product/AIImportPanel';
import { MediaManager } from './MediaManager';
import { 
  Eye, 
  Monitor, 
  Smartphone, 
  Sparkles, 
  Palette,
  ArrowRight,
  Wand2,
  Globe,
  Truck,
  Percent,
  DollarSign,
  Loader2
} from 'lucide-react';

interface CustomizeStepProps {
  selectedProduct: any;
  selectedTheme: string;
  onNext: (customization: any) => void;
  onBack: () => void;
}

export const CustomizeStep = ({ selectedProduct, selectedTheme, onNext, onBack }: CustomizeStepProps) => {
  const [formData, setFormData] = useState({
    productName: selectedProduct.title || '',
    description: selectedProduct.description || '',
    price: selectedProduct.price?.toString() || '',
    targetAudience: '',
    mainBenefit: '',
    urgency: '',
    customInstructions: '',
    // Nouvelles données livraison et commission
    shippingCost: '500',
    commissionType: 'percentage', // 'percentage' ou 'fixed'
    commissionValue: '10',
    // URL pour import IA
    productUrl: '',
    // Données IA importées
    aiImages: [] as any[],
    aiData: null as any,
    // Médias sélectionnés
    selectedMedia: [] as any[]
  });

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showAIImport, setShowAIImport] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleSubmit = () => {
    onNext(formData);
  };

  const handleAIImport = async () => {
    if (!formData.productUrl.trim()) return;
    
    setIsImporting(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-import-product', {
        body: { url: formData.productUrl }
      });

      if (error) throw error;

      setFormData(prev => {
        const aiImages = data.extracted.images || [];
        const selectedFromAI = prev.selectedMedia.length === 0
          ? aiImages.map((img: any, idx: number) => ({
              url: img.url,
              alt: img.alt || `Image IA ${idx + 1}`,
              source: 'ai',
              isCover: idx === 0,
            }))
          : prev.selectedMedia;

        return {
          ...prev,
          aiData: data,
          productName: data.extracted.title || prev.productName,
          description: data.extracted.description || prev.description,
          price: data.extracted.price?.toString() || prev.price,
          aiImages,
          selectedMedia: selectedFromAI,
        };
      });
      
      setShowAIImport(true);
    } catch (error) {
      console.error('Erreur import IA:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleAIAccept = (field?: string) => {
    if (formData.aiData) {
      const { extracted, ai_generated } = formData.aiData;
      const aiImages = extracted.images || formData.aiImages || [];
      const selectedFromAI = formData.selectedMedia.length === 0
        ? aiImages.map((img: any, idx: number) => ({
            url: img.url,
            alt: img.alt || `Image IA ${idx + 1}`,
            source: 'ai',
            isCover: idx === 0,
          }))
        : formData.selectedMedia;
      
      setFormData(prev => ({
        ...prev,
        productName: extracted.title || prev.productName,
        description: extracted.description || prev.description,
        price: extracted.price?.toString() || prev.price,
        aiImages,
        selectedMedia: selectedFromAI,
        targetAudience: ai_generated.category_suggestion || prev.targetAudience,
        mainBenefit: ai_generated.bullet_benefits?.[0] || prev.mainBenefit
      }));
    }
    setShowAIImport(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          ← Retour
        </Button>
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Personnalisez votre landing page
        </h2>
        <p className="text-muted-foreground">
          Optimisez le contenu pour maximiser vos conversions
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Aperçu en temps réel
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={previewDevice === 'desktop' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewDevice('desktop')}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewDevice === 'mobile' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewDevice('mobile')}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`bg-muted rounded-lg flex items-center justify-center transition-all duration-300 ${
                previewDevice === 'desktop' ? 'aspect-[16/10]' : 'aspect-[9/16] max-w-sm mx-auto'
              }`}>
                <div className="text-center text-muted-foreground space-y-4">
                  <div className={`bg-white rounded-lg shadow-lg p-6 ${
                    previewDevice === 'desktop' ? 'w-full max-w-md' : 'w-48'
                  }`}>
                    {/* Mock Landing Page Preview */}
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="h-2 bg-primary/20 rounded w-3/4"></div>
                      
                      {/* Product Image */}
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        {selectedProduct.media_url ? (
                          <img 
                            src={selectedProduct.media_url} 
                            alt={selectedProduct.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-300 rounded"></div>
                        )}
                      </div>
                      
                      {/* Title */}
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                      
                      {/* Price */}
                      <div className="h-4 bg-primary/30 rounded w-1/3"></div>
                      
                      {/* CTA */}
                      <div className="h-8 bg-primary rounded"></div>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    Aperçu {previewDevice === 'desktop' ? 'Desktop' : 'Mobile'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customization Form */}
        <div className="space-y-6">
          {/* Import IA */}
              {/* Gestion des médias */}
              {(formData.aiImages.length > 0 || formData.selectedMedia.length > 0) && (
                <MediaManager
                  aiImages={formData.aiImages}
                  selectedMedia={formData.selectedMedia}
                  onMediaChange={(media) => setFormData({...formData, selectedMedia: media})}
                />
              )}

              <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Import automatique par IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="productUrl">URL du produit</Label>
                <div className="flex gap-2">
                  <Input
                    id="productUrl"
                    value={formData.productUrl}
                    onChange={(e) => setFormData({...formData, productUrl: e.target.value})}
                    placeholder="https://www.jumia.com.dz/..."
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAIImport}
                    disabled={!formData.productUrl.trim() || isImporting}
                    variant="outline"
                  >
                    {isImporting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4" />
                    )}
                    Importer
                  </Button>
                </div>
              </div>
              
              {formData.aiImages.length > 0 && (
                <div>
                  <Label>Images importées ({formData.aiImages.length})</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {formData.aiImages.slice(0, 4).map((img: any, idx: number) => (
                      <div key={idx} className="aspect-square bg-muted rounded border overflow-hidden">
                        <img 
                          src={img.url} 
                          alt={img.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  {formData.aiImages.length > 4 && (
                    <Badge variant="secondary" className="mt-2">
                      +{formData.aiImages.length - 4} autres images
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Informations du produit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="productName">Nom du produit *</Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(e) => setFormData({...formData, productName: e.target.value})}
                  placeholder="Ex: Machine à café premium"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description du produit *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Décrivez votre produit en détail..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Prix (DA)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="15000"
                  />
                </div>
                <div>
                  <Label htmlFor="urgency">Urgence</Label>
                  <Input
                    id="urgency"
                    value={formData.urgency}
                    onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                    placeholder="Offre limitée"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Livraison et Commission */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                Livraison et Commission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shippingCost">Frais de livraison (DA)</Label>
                <Input
                  id="shippingCost"
                  type="number"
                  value={formData.shippingCost}
                  onChange={(e) => setFormData({...formData, shippingCost: e.target.value})}
                  placeholder="500"
                />
              </div>
              
              <Separator />
              
              <div>
                <Label>Type de commission</Label>
                <RadioGroup 
                  value={formData.commissionType} 
                  onValueChange={(value) => setFormData({...formData, commissionType: value})}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id="percentage" />
                    <Label htmlFor="percentage" className="flex items-center">
                      <Percent className="w-4 h-4 mr-1" />
                      Pourcentage
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed" className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Montant fixe
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label htmlFor="commissionValue">
                  {formData.commissionType === 'percentage' ? 'Pourcentage (%)' : 'Montant fixe (DA)'}
                </Label>
                <Input
                  id="commissionValue"
                  type="number"
                  value={formData.commissionValue}
                  onChange={(e) => setFormData({...formData, commissionValue: e.target.value})}
                  placeholder={formData.commissionType === 'percentage' ? '10' : '1000'}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Optimisation IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="targetAudience">Public cible</Label>
                <Input
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                  placeholder="Ex: Femmes 25-45 ans, urbaines, revenus moyens+"
                />
              </div>
              
              <div>
                <Label htmlFor="mainBenefit">Principal bénéfice</Label>
                <Input
                  id="mainBenefit"
                  value={formData.mainBenefit}
                  onChange={(e) => setFormData({...formData, mainBenefit: e.target.value})}
                  placeholder="Ex: Économise 2h par semaine"
                />
              </div>
              
              <div>
                <Label htmlFor="customInstructions">Instructions personnalisées</Label>
                <Textarea
                  id="customInstructions"
                  value={formData.customInstructions}
                  onChange={(e) => setFormData({...formData, customInstructions: e.target.value})}
                  placeholder="Instructions spéciales pour l'IA..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={handleSubmit}
            disabled={!formData.productName || !formData.description}
            className="w-full bg-gradient-primary hover:opacity-90 text-lg py-6"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Générer la landing page
          </Button>
        </div>
      </div>

      {/* AI Import Panel */}
      <AIImportPanel
        isOpen={showAIImport}
        onClose={() => setShowAIImport(false)}
        aiData={formData.aiData}
        onAccept={handleAIAccept}
        isLoading={isImporting}
      />
    </div>
  );
};