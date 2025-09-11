import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Eye, 
  Monitor, 
  Smartphone, 
  ExternalLink,
  Share2,
  Download,
  Sparkles,
  ShoppingCart,
  Phone,
  Star,
  CheckCircle,
  Truck,
  Shield,
  Clock,
  ThumbsUp,
  Wand2,
  Copy,
  Edit,
  Check
} from 'lucide-react';

interface PreviewStepProps {
  selectedProduct: any;
  selectedTheme: string;
  customization: any;
  onBack: () => void;
}

export const PreviewStep = ({ selectedProduct, selectedTheme, customization, onBack }: PreviewStepProps) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
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
    const landingUrl = `/landing/${customization.productName.toLowerCase().replace(/\s+/g, '-')}`;
    window.open(landingUrl, '_blank');
  };

  const handlePublishLanding = async () => {
    try {
      // Vérifier l'authentification
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentification requise",
          description: "Vous devez être connecté pour publier une landing page",
          variant: "destructive"
        });
        return;
      }

      // Générer un slug unique
      const { data: slugData, error: slugError } = await supabase
        .rpc('generate_unique_slug', {
          title_text: customization.productName,
          vendor_uuid: user.id
        });

      if (slugError) throw slugError;

      // Sauvegarder la landing page
      const { data, error } = await supabase
        .from('landing_pages')
        .insert({
          vendor_id: user.id,
          product_id: selectedProduct.id,
          title: customization.productName,
          slug: slugData,
          theme_id: selectedTheme,
          customization: customization,
          ai_data: customization.aiData,
          media_urls: customization.selectedMedia || [],
          is_published: true
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Landing page créée !",
        description: "Votre landing page a été sauvegardée et publiée",
      });

      // Rediriger vers la liste des landing pages
      window.location.href = '/vendor/landing-pages';
    } catch (error) {
      console.error('Error publishing landing page:', error);
      toast({
        title: "Erreur",
        description: "Impossible de publier la landing page",
        variant: "destructive"
      });
    }
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
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Aperçu de votre landing page
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
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg flex items-center justify-center relative overflow-hidden min-h-[600px]">
                
                <div className={`bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 ${
                  previewDevice === 'desktop' ? 'w-full max-w-6xl' : 'w-80'
                }`}>
                  {/* Landing Page Content */}
                  <div className="space-y-0">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjA1Ij4KPHBhdGggZD0iTTM2IDM0djEyaC0yVjM0aDJ6bTAtMTJ2MTBoLTJWMjJoMnptMTAgMTJ2MTJoLTJWMzRoMnptMC0xMnYxMGgtMlYyMmgyelwiLz4KPC9nPgo8L2c+Cjwvc3ZnPg==')] opacity-10"></div>
                      <div className="relative p-8">
                        <div className="flex items-center mb-4">
                          <Badge className="bg-red-500 text-white animate-pulse">
                            New!
                          </Badge>
                          <span className="ml-2 text-white/80">Offre Limitée</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-4 leading-tight">
                          {customization.productName}
                        </h1>
                        <p className="text-xl text-white/90 mb-6 max-w-2xl">
                          {customization.description?.substring(0, 120)}...
                        </p>
                        <div className="flex items-center gap-6">
                          <div className="text-5xl font-bold">
                            {parseInt(customization.price || '0').toLocaleString()} DA
                          </div>
                          <div className="text-white/70">
                            <div className="line-through text-lg">
                              {Math.round(parseInt(customization.price || '0') * 1.3).toLocaleString()} DA
                            </div>
                            <div className="text-sm">Prix normal</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Product Gallery */}
                    <div className="p-8 bg-gray-50">
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Main Image */}
                        <div className="space-y-4">
                          <div className="aspect-square bg-white rounded-xl shadow-lg overflow-hidden">
                            {selectedProduct.media_url ? (
                              <img 
                                src={selectedProduct.media_url} 
                                alt={selectedProduct.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <div className="text-center text-gray-400">
                                  <Eye className="w-20 h-20 mx-auto mb-4" />
                                  <p>Image du produit</p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                        {/* Image Thumbnails */}
                        {(customization.selectedMedia && customization.selectedMedia.length > 1) && (
                          <div className="grid grid-cols-4 gap-2">
                            {customization.selectedMedia.slice(0, 4).map((img: any, idx: number) => (
                              <div key={idx} className="aspect-square bg-white rounded-lg shadow overflow-hidden">
                                <img 
                                  src={img.url} 
                                  alt={img.alt}
                                  className="w-full h-full object-cover hover:opacity-80 transition-opacity cursor-pointer"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        </div>

                        {/* Product Info & CTA */}
                        <div className="space-y-6">
                          <div>
                            <div className="flex items-center mb-4">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="w-5 h-5 fill-current" />
                                ))}
                              </div>
                              <span className="ml-2 text-gray-600">(127 avis)</span>
                            </div>
                            
                            <h2 className="text-2xl font-bold mb-4">{customization.productName}</h2>
                            <p className="text-gray-600 leading-relaxed">{customization.description}</p>
                          </div>

                          {/* Benefits */}
                          <div className="space-y-3">
                            <h3 className="font-semibold text-lg">Pourquoi choisir ce produit ?</h3>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                <span>Qualité premium garantie</span>
                              </div>
                              <div className="flex items-center">
                                <Truck className="w-5 h-5 text-blue-500 mr-3" />
                                <span>Livraison rapide en 24-48h</span>
                              </div>
                              <div className="flex items-center">
                                <Shield className="w-5 h-5 text-purple-500 mr-3" />
                                <span>Garantie constructeur incluse</span>
                              </div>
                              <div className="flex items-center">
                                <ThumbsUp className="w-5 h-5 text-orange-500 mr-3" />
                                <span>Satisfaction client 98%</span>
                              </div>
                            </div>
                          </div>

                          {/* Pricing */}
                          <div className="bg-white rounded-xl p-6 shadow-lg">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Prix du produit:</span>
                                <span className="text-2xl font-bold">
                                  {parseInt(customization.price || '0').toLocaleString()} DA
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Livraison:</span>
                                <span className="font-semibold">
                                  {customization.shippingCost ? `${customization.shippingCost} DA` : 'Gratuite'}
                                </span>
                              </div>
                              <Separator />
                              <div className="flex items-center justify-between text-lg font-bold">
                                <span>Total:</span>
                                <span className="text-primary">
                                  {(parseInt(customization.price || '0') + parseInt(customization.shippingCost || '0')).toLocaleString()} DA
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* CTA Buttons */}
                          <div className="space-y-4">
                            <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all">
                              <ShoppingCart className="w-6 h-6 mr-3" />
                              Commander maintenant - Paiement à la livraison
                            </Button>
                            
                            <Button variant="outline" className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white text-lg py-4">
                              <Phone className="w-5 h-5 mr-2" />
                              Appeler maintenant: 0555 123 456
                            </Button>
                          </div>

                          {/* Urgency */}
                          {customization.urgency && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <div className="flex items-center text-red-700">
                                <Clock className="w-5 h-5 mr-2" />
                                <span className="font-semibold">{customization.urgency}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Trust Section */}
                    <div className="bg-white p-8">
                      <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div className="space-y-2">
                          <Shield className="w-12 h-12 text-primary mx-auto" />
                          <h3 className="font-semibold">Paiement Sécurisé</h3>
                          <p className="text-sm text-gray-600">100% sécurisé et protégé</p>
                        </div>
                        <div className="space-y-2">
                          <Truck className="w-12 h-12 text-primary mx-auto" />
                          <h3 className="font-semibold">Livraison Rapide</h3>
                          <p className="text-sm text-gray-600">24-48h partout en Algérie</p>
                        </div>
                        <div className="space-y-2">
                          <ThumbsUp className="w-12 h-12 text-primary mx-auto" />
                          <h3 className="font-semibold">Support Client</h3>
                          <p className="text-sm text-gray-600">Assistance 7j/7</p>
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
                onClick={handlePublishLanding}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Publier la landing page
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