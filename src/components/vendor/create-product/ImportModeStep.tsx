import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Wand2, Edit3, Link, Loader2, Sparkles } from 'lucide-react';
import { ProductFormData } from '../../../pages/vendor/CreateProduct';

interface Props {
  formData: ProductFormData;
  updateFormData: (updates: Partial<ProductFormData>) => void;
  onAIImport: (url: string) => void;
  isImporting: boolean;
}

export function ImportModeStep({ formData, updateFormData, onAIImport, isImporting }: Props) {
  const [importUrl, setImportUrl] = useState('');

  const handleModeChange = (mode: 'ai' | 'manual') => {
    updateFormData({ importMode: mode });
  };

  const handleImport = () => {
    if (importUrl.trim()) {
      updateFormData({ sourceUrl: importUrl });
      onAIImport(importUrl);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Comment souhaitez-vous créer votre produit ?</h2>
        <p className="text-muted-foreground">
          Choisissez votre méthode de création préférée
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* IA Import Mode */}
        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            formData.importMode === 'ai' 
              ? 'ring-2 ring-primary shadow-brand' 
              : 'hover:ring-1 hover:ring-border'
          }`}
          onClick={() => handleModeChange('ai')}
        >
          <CardContent className="p-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                formData.importMode === 'ai' 
                  ? 'bg-gradient-primary text-white' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                <Wand2 className="w-8 h-8" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold flex items-center justify-center">
                Import IA
                <Badge variant="secondary" className="ml-2 bg-gradient-primary text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Recommandé
                </Badge>
              </h3>
              <p className="text-muted-foreground text-sm">
                Collez l'URL d'un produit et laissez l'IA extraire automatiquement les informations
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                Extraction automatique du titre, prix, description
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                Génération du contenu SEO optimisé
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                Import des images et variantes
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manual Mode */}
        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            formData.importMode === 'manual' 
              ? 'ring-2 ring-primary shadow-brand' 
              : 'hover:ring-1 hover:ring-border'
          }`}
          onClick={() => handleModeChange('manual')}
        >
          <CardContent className="p-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                formData.importMode === 'manual' 
                  ? 'bg-gradient-primary text-white' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                <Edit3 className="w-8 h-8" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Saisie manuelle</h3>
              <p className="text-muted-foreground text-sm">
                Remplissez vous-même toutes les informations du produit
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-info rounded-full mr-2"></div>
                Contrôle total sur le contenu
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-info rounded-full mr-2"></div>
                Personnalisation complète
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-info rounded-full mr-2"></div>
                Pas de dépendance externe
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Import Form */}
      {formData.importMode === 'ai' && (
        <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Wand2 className="w-5 h-5 text-primary" />
              <h4 className="text-lg font-semibold">Import automatique</h4>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="import-url" className="flex items-center">
                  <Link className="w-4 h-4 mr-2" />
                  URL du produit à importer
                </Label>
                <Input
                  id="import-url"
                  type="url"
                  placeholder="https://exemple.com/mon-produit"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Collez l'URL d'un produit depuis n'importe quel site e-commerce
                </p>
              </div>
              
              <Button 
                onClick={handleImport}
                disabled={!importUrl.trim() || isImporting}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Import en cours...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Importer avec l'IA
                  </>
                )}
              </Button>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h5 className="font-medium mb-2">Sites supportés</h5>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>• Boutiques Shopify</div>
                <div>• Sites WooCommerce</div>
                <div>• Amazon (produits)</div>
                <div>• Aliexpress</div>
                <div>• Sites personnalisés</div>
                <div>• Et bien d'autres...</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual Mode Info */}
      {formData.importMode === 'manual' && (
        <Card className="bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border-blue-500/20">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Edit3 className="w-5 h-5 text-blue-500" />
              <h4 className="text-lg font-semibold">Création manuelle</h4>
            </div>
            
            <p className="text-muted-foreground">
              Vous allez pouvoir remplir manuellement toutes les informations de votre produit. 
              Cette méthode vous donne un contrôle total sur le contenu et la présentation.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h5 className="font-medium">Informations requises :</h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Titre du produit</li>
                  <li>• Catégorie</li>
                  <li>• Prix et commission</li>
                  <li>• Description détaillée</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium">Éléments optionnels :</h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Variantes et stock</li>
                  <li>• Images multiples</li>
                  <li>• Tags et SEO</li>
                  <li>• Codes promotionnels</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}