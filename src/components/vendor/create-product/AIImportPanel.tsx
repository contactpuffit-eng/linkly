import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, X, Wand2, Loader2, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  aiData: any;
  onAccept: (field?: string) => void;
  isLoading: boolean;
}

export function AIImportPanel({ isOpen, onClose, aiData, onAccept, isLoading }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <Card className="shadow-2xl">
          <CardHeader className="bg-gradient-primary text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Wand2 className="w-6 h-6 mr-2" />
                Proposition IA
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                  <div>
                    <h3 className="font-semibold text-lg">Analyse en cours...</h3>
                    <p className="text-muted-foreground">
                      L'IA extrait les informations du produit
                    </p>
                  </div>
                </div>
              </div>
            ) : aiData ? (
              <>
                {/* Actions */}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Données extraites</h3>
                  <div className="space-x-2">
                    <Button onClick={() => onAccept('all')} className="bg-gradient-primary">
                      <Check className="w-4 h-4 mr-2" />
                      Accepter tout
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                      Ignorer
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Extracted Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-lg">Informations de base</h4>
                    
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <label className="text-sm font-medium text-muted-foreground">Titre</label>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onAccept('title')}
                          >
                            Accepter
                          </Button>
                        </div>
                        <p className="font-medium">{aiData.extracted.title}</p>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <label className="text-sm font-medium text-muted-foreground">Prix</label>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onAccept('price')}
                          >
                            Accepter
                          </Button>
                        </div>
                        <p className="font-medium">
                          {aiData.extracted.price?.toLocaleString()} {aiData.extracted.currency}
                        </p>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <label className="text-sm font-medium text-muted-foreground">Description</label>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onAccept('description')}
                          >
                            Accepter
                          </Button>
                        </div>
                        <p className="text-sm">{aiData.extracted.description}</p>
                      </div>

                      {aiData.extracted.tags && (
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <label className="text-sm font-medium text-muted-foreground">Tags</label>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => onAccept('tags')}
                            >
                              Accepter
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {aiData.extracted.tags.map((tag: string, index: number) => (
                              <Badge key={index} variant="secondary">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Generated Content */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-lg">Contenu généré par IA</h4>
                    
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <label className="text-sm font-medium text-muted-foreground">Titre SEO</label>
                        <p className="font-medium text-sm mt-1">{aiData.ai_generated.seo_title}</p>
                      </div>

                      <div className="border rounded-lg p-4">
                        <label className="text-sm font-medium text-muted-foreground">Description SEO</label>
                        <p className="text-sm mt-1">{aiData.ai_generated.seo_description}</p>
                      </div>

                      <div className="border rounded-lg p-4">
                        <label className="text-sm font-medium text-muted-foreground">Points de vente</label>
                        <ul className="text-sm mt-1 space-y-1">
                          {aiData.ai_generated.bullet_benefits?.map((benefit: string, index: number) => (
                            <li key={index} className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Images */}
                {aiData.extracted.images && aiData.extracted.images.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-lg">Images extraites</h4>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onAccept('images')}
                        >
                          Accepter toutes
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {aiData.extracted.images.map((image: any, index: number) => (
                          <div key={index} className="border rounded-lg overflow-hidden">
                            <img 
                              src={image.url} 
                              alt={image.alt || `Image ${index + 1}`}
                              className="w-full h-24 object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Variants */}
                {aiData.extracted.variants && aiData.extracted.variants.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-lg">Variantes détectées</h4>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onAccept('variants')}
                        >
                          Accepter toutes
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {aiData.extracted.variants.map((variant: any, index: number) => (
                          <div key={index} className="grid grid-cols-4 gap-4 p-3 border rounded-lg text-sm">
                            <div>
                              <span className="text-muted-foreground">Nom:</span>
                              <div className="font-medium">{variant.name}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">SKU:</span>
                              <div className="font-mono">{variant.sku}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Prix:</span>
                              <div className="font-medium">{variant.price?.toLocaleString()} DA</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Stock:</span>
                              <div className="font-medium">{variant.stock}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Reviews */}
                {aiData.extracted.reviews && aiData.extracted.reviews.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-lg">Avis clients détectés</h4>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onAccept('reviews')}
                        >
                          Accepter tous
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {aiData.extracted.reviews.slice(0, 3).map((review: any, index: number) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex items-center mb-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                  >
                                    ★
                                  </div>
                                ))}
                              </div>
                              <span className="ml-2 text-sm font-medium">{review.rating}/5</span>
                              {review.author && (
                                <span className="ml-2 text-sm text-muted-foreground">- {review.author}</span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Échec de l'extraction</h3>
                <p className="text-muted-foreground mb-4">
                  L'IA n'a pas pu extraire les informations de cette URL
                </p>
                <Button onClick={onClose}>
                  Continuer en manuel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}