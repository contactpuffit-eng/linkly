import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Wand2, 
  ExternalLink, 
  Copy, 
  Share2,
  Download,
  Edit,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PreviewStepProps {
  selectedProduct: any;
  selectedTheme: string;
  customization: any;
  onBack: () => void;
}

export const PreviewStep = ({ selectedProduct, selectedTheme, customization, onBack }: PreviewStepProps) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [generationProgress, setGenerationProgress] = useState(0);
  const { toast } = useToast();

  // Simuler la génération
  useState(() => {
    const timer = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          setIsGenerating(false);
          clearInterval(timer);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(timer);
  });

  const handleCopyLink = () => {
    const landingUrl = `${window.location.origin}/p/${customization.productName.toLowerCase().replace(/\s+/g, '-')}`;
    navigator.clipboard.writeText(landingUrl);
    toast({
      title: "Lien copié !",
      description: "Le lien de votre landing page a été copié dans le presse-papiers",
    });
  };

  const handleOpenPreview = () => {
    const landingUrl = `/p/${customization.productName.toLowerCase().replace(/\s+/g, '-')}`;
    window.open(landingUrl, '_blank');
  };

  if (isGenerating) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Wand2 className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Génération de votre landing page...
            </h2>
            
            <p className="text-muted-foreground text-lg">
              L'IA crée votre landing page optimisée pour les conversions
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              ></div>
            </div>
            <div className="text-sm text-muted-foreground">
              {generationProgress}% complété
            </div>
          </div>

          {/* Generation Steps */}
          <div className="max-w-md mx-auto space-y-4">
            {[
              { label: 'Analyse du produit', completed: generationProgress > 20 },
              { label: 'Application du thème', completed: generationProgress > 40 },
              { label: 'Génération du contenu IA', completed: generationProgress > 60 },
              { label: 'Optimisation des conversions', completed: generationProgress > 80 },
              { label: 'Finalisation', completed: generationProgress >= 100 }
            ].map((step, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className={step.completed ? 'text-foreground' : 'text-muted-foreground'}>
                  {step.label}
                </span>
                <span className={step.completed ? 'text-primary' : 'text-muted-foreground'}>
                  {step.completed ? '✓' : '⏳'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Votre landing page est prête !
        </h2>
        <p className="text-muted-foreground">
          Votre landing page a été générée avec succès et optimisée pour les conversions
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Aperçu de votre landing page
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[16/10] bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Mock Landing Page */}
                <div className="absolute inset-4 bg-white rounded-lg shadow-2xl overflow-hidden">
                  <div className="h-full flex flex-col">
                    {/* Mock Header */}
                    <div className="h-12 bg-gradient-primary flex items-center px-4">
                      <div className="w-24 h-6 bg-white/20 rounded"></div>
                    </div>
                    
                    {/* Mock Hero Section */}
                    <div className="flex-1 p-6 space-y-4">
                      <div className="text-center space-y-3">
                        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
                        <div className="h-4 bg-gray-100 rounded w-full"></div>
                        <div className="h-4 bg-gray-100 rounded w-2/3 mx-auto"></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="space-y-2">
                          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                            {selectedProduct.media_url && (
                              <img 
                                src={selectedProduct.media_url} 
                                alt={selectedProduct.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            )}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="h-6 bg-primary/20 rounded w-full"></div>
                          <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                          <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                          <div className="h-10 bg-gradient-primary rounded mt-4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button
                  className="absolute top-4 right-4 z-10"
                  onClick={handleOpenPreview}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Voir en grand
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions & Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Produit</div>
                <div className="font-semibold">{selectedProduct.title}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Thème</div>
                <div className="font-semibold">{selectedTheme}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">URL</div>
                <div className="text-sm font-mono bg-muted px-2 py-1 rounded truncate">
                  /p/{customization.productName.toLowerCase().replace(/\s+/g, '-')}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleOpenPreview}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Ouvrir la landing page
              </Button>
              
              <Button 
                onClick={handleCopyLink}
                variant="outline"
                className="w-full"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copier le lien
              </Button>
              
              <Button 
                variant="outline"
                className="w-full"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
              
              <Button 
                variant="outline"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Optimisations IA appliquées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  SEO optimisé
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Contenu persuasif
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  CTA optimisés
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Design responsive
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={onBack}
            variant="outline"
            className="w-full"
          >
            <Edit className="w-4 h-4 mr-2" />
            Modifier la landing page
          </Button>
        </div>
      </div>
    </div>
  );
};