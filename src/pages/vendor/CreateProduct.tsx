import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ArrowRight, Check, Wand2, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ImportModeStep } from '@/components/vendor/create-product/ImportModeStep';
import { BasicInfoStep } from '@/components/vendor/create-product/BasicInfoStep';
import { MediaStep } from '@/components/vendor/create-product/MediaStep';
import { SEOStep } from '@/components/vendor/create-product/SEOStep';
import { TrackingStep } from '@/components/vendor/create-product/TrackingStep';
import { PaymentStep } from '@/components/vendor/create-product/PaymentStep';
import { PublishStep } from '@/components/vendor/create-product/PublishStep';
import { AIImportPanel } from '@/components/vendor/create-product/AIImportPanel';

export interface ProductFormData {
  // Mode
  importMode: 'ai' | 'manual';
  sourceUrl?: string;
  
  // Basic Info
  title: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  crossedPrice?: number;
  commission: number;
  variants: Array<{
    name: string;
    sku: string;
    price: number;
    stock: number;
  }>;
  totalStock?: number;
  tags: string[];
  
  // Media
  images: Array<{
    url: string;
    alt: string;
    isCover: boolean;
  }>;
  
  // SEO
  slug: string;
  metaTitle: string;
  metaDescription: string;
  
  // Tracking
  promoCode: string;
  promoEnabled: boolean;
  
  // Payment
  paymentMode: 'form' | 'online';
  
  // Shipping
  transporterKey?: string;
}

const steps = [
  { id: 0, title: "Mode d'entrée", description: "Choisir le mode de création" },
  { id: 1, title: "Informations", description: "Détails du produit" },
  { id: 2, title: "Médias", description: "Images et visuels" },
  { id: 3, title: "SEO", description: "Référencement" },
  { id: 4, title: "Tracking", description: "Suivi et codes" },
  { id: 5, title: "Paiement", description: "Commande et livraison" },
  { id: 6, title: "Publication", description: "Générer la landing page" }
];

export default function CreateProduct() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAIImporting, setIsAIImporting] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiData, setAIData] = useState<any>(null);
  
  const [formData, setFormData] = useState<ProductFormData>({
    importMode: 'manual',
    title: '',
    category: '',
    subcategory: '',
    description: '',
    price: 0,
    commission: 10,
    variants: [],
    tags: [],
    images: [],
    slug: '',
    metaTitle: '',
    metaDescription: '',
    promoCode: `AFF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    promoEnabled: true,
    paymentMode: 'form'
  });

  const updateFormData = (updates: Partial<ProductFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true;
      case 1: return formData.title && formData.category && formData.price > 0;
      case 2: return formData.images.length > 0;
      case 3: return formData.slug && formData.metaTitle;
      case 4: return true;
      case 5: return true;
      case 6: return true;
      default: return false;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAIImport = async (url: string) => {
    setIsAIImporting(true);
    setShowAIPanel(true);
    
    try {
      // Simuler l'import IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAIData = {
        extracted: {
          title: "Crème Visage Omega+ Hydratante",
          price: 4200,
          currency: "DZD",
          description: "Hydratation 24h garantie avec vitamine E et acide hyaluronique",
          images: [
            { url: "/placeholder.svg", alt: "Crème visage", isCover: true }
          ],
          variants: [
            { name: "50ml", sku: "OMEGA50", price: 4200, stock: 30 },
            { name: "100ml", sku: "OMEGA100", price: 6900, stock: 20 }
          ],
          tags: ["soin", "hydratant", "peau sèche"]
        },
        ai_generated: {
          bullet_benefits: ["Hydratation longue durée", "Protection antioxydante", "Texture légère"],
          seo_title: "Crème Visage Omega+ — Hydratation 24h (Algérie)",
          seo_description: "Soin hydratant riche en Vitamine E. Livraison rapide. Essayez maintenant."
        }
      };
      
      setAIData(mockAIData);
    } catch (error) {
      console.error('Erreur import IA:', error);
    } finally {
      setIsAIImporting(false);
    }
  };

  const acceptAIData = (field?: string) => {
    if (!aiData) return;
    
    const updates: Partial<ProductFormData> = {};
    
    if (!field || field === 'all') {
      updates.title = aiData.extracted.title;
      updates.price = aiData.extracted.price;
      updates.description = aiData.extracted.description;
      updates.images = aiData.extracted.images;
      updates.variants = aiData.extracted.variants;
      updates.tags = aiData.extracted.tags;
      updates.metaTitle = aiData.ai_generated.seo_title;
      updates.metaDescription = aiData.ai_generated.seo_description;
      updates.slug = aiData.extracted.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    } else if (field === 'title') {
      updates.title = aiData.extracted.title;
    } else if (field === 'price') {
      updates.price = aiData.extracted.price;
    } else if (field === 'description') {
      updates.description = aiData.extracted.description;
    }
    
    updateFormData(updates);
    
    if (!field || field === 'all') {
      setShowAIPanel(false);
      setCurrentStep(1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ImportModeStep
            formData={formData}
            updateFormData={updateFormData}
            onAIImport={handleAIImport}
            isImporting={isAIImporting}
          />
        );
      case 1:
        return (
          <BasicInfoStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <MediaStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <SEOStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return (
          <TrackingStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 5:
        return (
          <PaymentStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 6:
        return (
          <PublishStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 relative">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/vendor')}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Créer un produit
                </h1>
                <p className="text-muted-foreground">
                  {steps[currentStep].description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center">
                {formData.importMode === 'ai' ? (
                  <Wand2 className="w-3 h-3 mr-1" />
                ) : (
                  <Edit3 className="w-3 h-3 mr-1" />
                )}
                {formData.importMode === 'ai' ? 'Import IA' : 'Manuel'}
              </Badge>
            </div>
          </div>
          
          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Étape {currentStep + 1} sur {steps.length}
              </span>
              <span className="text-sm font-medium">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          {/* Steps */}
          <div className="flex items-center justify-between mt-4 overflow-x-auto">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                  index === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : index < currentStep
                    ? 'bg-success text-success-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold">
                  {index < currentStep ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="font-medium">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-brand">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold mr-3">
                    {currentStep + 1}
                  </div>
                  {steps[currentStep].title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderStep()}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Précédent
              </Button>
              
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center"
              >
                {currentStep === steps.length - 1 ? 'Publier' : 'Suivant'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Sidebar Preview */}
          <div className="lg:col-span-1">
            <Card className="sticky top-32">
              <CardHeader>
                <CardTitle className="text-lg">Aperçu du produit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.images.length > 0 && (
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img
                      src={formData.images.find(img => img.isCover)?.url || formData.images[0]?.url}
                      alt="Aperçu produit"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {formData.title && (
                  <div>
                    <h3 className="font-semibold text-lg">{formData.title}</h3>
                    {formData.category && (
                      <p className="text-sm text-muted-foreground">{formData.category}</p>
                    )}
                  </div>
                )}
                
                {formData.price > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-primary">
                      {formData.price.toLocaleString()} DA
                    </span>
                    {formData.crossedPrice && formData.crossedPrice > formData.price && (
                      <span className="text-lg text-muted-foreground line-through">
                        {formData.crossedPrice.toLocaleString()} DA
                      </span>
                    )}
                  </div>
                )}
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Commission: <span className="font-medium text-success">{formData.commission}%</span>
                  </div>
                  {formData.slug && (
                    <div className="text-sm text-muted-foreground mt-1">
                      URL: <span className="font-mono">linkly.com/p/{formData.slug}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Import Panel */}
      {showAIPanel && (
        <AIImportPanel
          isOpen={showAIPanel}
          onClose={() => setShowAIPanel(false)}
          aiData={aiData}
          onAccept={acceptAIData}
          isLoading={isAIImporting}
        />
      )}
    </div>
  );
}