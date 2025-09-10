import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StepIndicator } from '@/components/landing-page/StepIndicator';
import { ProductStep } from '@/components/landing-page/ProductStep';
import { ThemeStep } from '@/components/landing-page/ThemeStep';
import { CustomizeStep } from '@/components/landing-page/CustomizeStep';
import { PreviewStep } from '@/components/landing-page/PreviewStep';

const steps = [
  {
    id: 'product',
    title: 'Produit',
    description: 'Choisir le produit'
  },
  {
    id: 'theme',
    title: 'Thème',
    description: 'Sélectionner le design'
  },
  {
    id: 'customize',
    title: 'Personnaliser',
    description: 'Optimiser le contenu'
  },
  {
    id: 'preview',
    title: 'Aperçu',
    description: 'Finaliser & publier'
  }
];

export default function CreateLandingPage() {
  const [currentStep, setCurrentStep] = useState('product');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [customization, setCustomization] = useState<any>(null);

  // Charger les produits
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true);
      
      if (data) {
        setProducts(data);
      }
    };
    
    fetchProducts();
  }, []);

  const handleProductNext = (productData: any) => {
    setSelectedProduct(productData);
    setCompletedSteps(prev => [...prev.filter(s => s !== 'product'), 'product']);
    setCurrentStep('theme');
  };

  const handleThemeNext = (themeId: string) => {
    setSelectedTheme(themeId);
    setCompletedSteps(prev => [...prev.filter(s => s !== 'theme'), 'theme']);
    setCurrentStep('customize');
  };

  const handleCustomizeNext = (customizationData: any) => {
    setCustomization(customizationData);
    setCompletedSteps(prev => [...prev.filter(s => s !== 'customize'), 'customize']);
    setCurrentStep('preview');
  };

  const handleBack = (targetStep: string) => {
    setCurrentStep(targetStep);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Créer une Landing Page
              </h1>
              <p className="text-sm text-muted-foreground">
                Générez une landing page optimisée pour vos conversions
              </p>
            </div>
          </div>
          
          <StepIndicator 
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-7xl mx-auto px-6 py-8">
        {currentStep === 'product' && (
          <ProductStep 
            products={products}
            onNext={handleProductNext}
          />
        )}

        {currentStep === 'theme' && selectedProduct && (
          <ThemeStep 
            selectedProduct={selectedProduct}
            onNext={handleThemeNext}
            onBack={() => handleBack('product')}
          />
        )}

        {currentStep === 'customize' && selectedProduct && selectedTheme && (
          <CustomizeStep 
            selectedProduct={selectedProduct}
            selectedTheme={selectedTheme}
            onNext={handleCustomizeNext}
            onBack={() => handleBack('theme')}
          />
        )}

        {currentStep === 'preview' && selectedProduct && selectedTheme && customization && (
          <PreviewStep 
            selectedProduct={selectedProduct}
            selectedTheme={selectedTheme}
            customization={customization}
            onBack={() => handleBack('customize')}
          />
        )}
      </div>
    </div>
  );
}