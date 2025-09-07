import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Wand2, ExternalLink, Eye } from 'lucide-react';
import { ProductFormData } from '../../../pages/vendor/CreateProduct';

interface Props {
  formData: ProductFormData;
  updateFormData: (updates: Partial<ProductFormData>) => void;
}

export function SEOStep({ formData, updateFormData }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      updateFormData({ slug });
    }
  }, [formData.title]);

  // Auto-generate meta title from title
  useEffect(() => {
    if (formData.title && !formData.metaTitle) {
      const metaTitle = `${formData.title} - Achat en ligne (Algérie)`;
      updateFormData({ metaTitle });
    }
  }, [formData.title]);

  const generateSEOContent = async () => {
    setIsGenerating(true);
    
    try {
      // Simuler la génération IA
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const generatedTitle = `${formData.title} - Livraison Rapide Algérie | Achat Sécurisé`;
      const generatedDescription = `Découvrez ${formData.title.toLowerCase()} à ${formData.price.toLocaleString()} DA. Livraison rapide en Algérie. Qualité garantie. Commandez maintenant !`;
      
      updateFormData({
        metaTitle: generatedTitle,
        metaDescription: generatedDescription
      });
    } catch (error) {
      console.error('Erreur génération SEO:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSlugChange = (value: string) => {
    const cleanSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
    updateFormData({ slug: cleanSlug });
  };

  const isSlugValid = formData.slug && formData.slug.length >= 3;
  const isTitleValid = formData.metaTitle && formData.metaTitle.length <= 60;
  const isDescriptionValid = formData.metaDescription && formData.metaDescription.length <= 160;

  return (
    <div className="space-y-6">
      {/* SEO Generation */}
      <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wand2 className="w-5 h-5 mr-2" />
            Génération automatique SEO
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Laissez l'IA optimiser votre référencement en générant automatiquement les méta-données
          </p>
          
          <Button 
            onClick={generateSEOContent}
            disabled={isGenerating || !formData.title}
            className="bg-gradient-primary hover:opacity-90"
          >
            {isGenerating ? (
              <>
                <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Générer le SEO automatiquement
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* URL Slug */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ExternalLink className="w-5 h-5 mr-2" />
            URL du produit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="slug">Slug URL *</Label>
            <div className="flex mt-1">
              <div className="flex items-center px-3 py-2 bg-muted border border-r-0 rounded-l-md text-sm text-muted-foreground">
                linkly.com/p/
              </div>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="rounded-l-none"
                placeholder="mon-produit-genial"
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                URL finale : <span className="font-mono">linkly.com/p/{formData.slug || 'votre-slug'}</span>
              </p>
              {isSlugValid ? (
                <Badge variant="default" className="bg-success text-success-foreground">
                  Valide
                </Badge>
              ) : (
                <Badge variant="destructive">
                  Minimum 3 caractères
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meta Title */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Titre SEO
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="meta-title">Meta Title *</Label>
            <Input
              id="meta-title"
              value={formData.metaTitle}
              onChange={(e) => updateFormData({ metaTitle: e.target.value })}
              placeholder="Titre qui apparaîtra dans Google"
              maxLength={60}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                Titre qui apparaît dans les résultats de recherche Google
              </p>
              <div className="flex items-center space-x-2">
                <span className={`text-xs ${
                  formData.metaTitle.length > 60 ? 'text-destructive' : 'text-muted-foreground'
                }`}>
                  {formData.metaTitle.length}/60
                </span>
                {isTitleValid ? (
                  <Badge variant="default" className="bg-success text-success-foreground">
                    Optimal
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    À optimiser
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meta Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="meta-description">Meta Description *</Label>
            <Textarea
              id="meta-description"
              value={formData.metaDescription}
              onChange={(e) => updateFormData({ metaDescription: e.target.value })}
              placeholder="Description qui apparaîtra sous le titre dans Google"
              rows={3}
              maxLength={160}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                Description qui apparaît sous le titre dans les résultats Google
              </p>
              <div className="flex items-center space-x-2">
                <span className={`text-xs ${
                  formData.metaDescription.length > 160 ? 'text-destructive' : 'text-muted-foreground'
                }`}>
                  {formData.metaDescription.length}/160
                </span>
                {isDescriptionValid ? (
                  <Badge variant="default" className="bg-success text-success-foreground">
                    Optimal
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    À optimiser
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {formData.metaTitle && formData.metaDescription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Aperçu Google
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-background border rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-muted rounded-full"></div>
                <span className="text-xs text-muted-foreground">
                  linkly.com/p/{formData.slug || 'votre-slug'}
                </span>
              </div>
              <h3 className="text-lg text-blue-600 hover:underline cursor-pointer">
                {formData.metaTitle}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formData.metaDescription}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SEO Tips */}
      <Card className="bg-info/5 border-info/20">
        <CardHeader>
          <CardTitle className="text-info">Conseils SEO</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Incluez le mot-clé principal dans le titre et la description</li>
            <li>• Mentionnez "Algérie" ou votre région pour le référencement local</li>
            <li>• Utilisez des mots d'action : "Achetez", "Découvrez", "Commandez"</li>
            <li>• Indiquez le prix si c'est un avantage concurrentiel</li>
            <li>• Évitez la répétition excessive de mots-clés</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}