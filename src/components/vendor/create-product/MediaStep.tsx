import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Star, Link, Image as ImageIcon } from 'lucide-react';
import { ProductFormData } from '../../../pages/vendor/CreateProduct';

interface Props {
  formData: ProductFormData;
  updateFormData: (updates: Partial<ProductFormData>) => void;
}

export function MediaStep({ formData, updateFormData }: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            url: e.target?.result as string,
            alt: file.name.replace(/\.[^/.]+$/, ""),
            isCover: formData.images.length === 0
          };
          
          updateFormData({
            images: [...formData.images, newImage]
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const addImageFromUrl = () => {
    if (imageUrl.trim()) {
      const newImage = {
        url: imageUrl.trim(),
        alt: 'Image produit',
        isCover: formData.images.length === 0
      };
      
      updateFormData({
        images: [...formData.images, newImage]
      });
      setImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    
    // Si on supprime l'image de couverture, faire de la première restante la couverture
    if (formData.images[index].isCover && newImages.length > 0) {
      newImages[0].isCover = true;
    }
    
    updateFormData({ images: newImages });
  };

  const setCoverImage = (index: number) => {
    const newImages = formData.images.map((img, i) => ({
      ...img,
      isCover: i === index
    }));
    
    updateFormData({ images: newImages });
  };

  const updateImageAlt = (index: number, alt: string) => {
    const newImages = [...formData.images];
    newImages[index].alt = alt;
    updateFormData({ images: newImages });
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ImageIcon className="w-5 h-5 mr-2" />
            Images du produit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Drag & Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted hover:border-muted-foreground/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Glissez-déposez vos images ici
            </h3>
            <p className="text-muted-foreground mb-4">
              ou cliquez pour sélectionner des fichiers
            </p>
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
            >
              Choisir des fichiers
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Formats acceptés: JPG, PNG, WebP. Taille max: 5MB par image
            </p>
          </div>

          {/* URL Input */}
          <div className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="image-url" className="flex items-center">
                <Link className="w-4 h-4 mr-2" />
                Ajouter une image via URL
              </Label>
              <Input
                id="image-url"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://exemple.com/image.jpg"
                className="mt-1"
              />
            </div>
            <div className="pt-6">
              <Button 
                onClick={addImageFromUrl}
                disabled={!imageUrl.trim()}
              >
                Ajouter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images Gallery */}
      {formData.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Galerie d'images ({formData.images.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group border rounded-lg overflow-hidden">
                  {/* Image */}
                  <div className="aspect-square bg-muted">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="space-x-2">
                      {!image.isCover && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setCoverImage(index)}
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Cover Badge */}
                  {image.isCover && (
                    <Badge className="absolute top-2 left-2 bg-gradient-primary text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Couverture
                    </Badge>
                  )}

                  {/* Alt Text Input */}
                  <div className="p-3 border-t">
                    <Label htmlFor={`alt-${index}`} className="text-xs text-muted-foreground">
                      Texte alternatif
                    </Label>
                    <Input
                      id={`alt-${index}`}
                      value={image.alt}
                      onChange={(e) => updateImageAlt(index, e.target.value)}
                      placeholder="Description de l'image"
                      className="mt-1 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-info/10 border border-info/20 rounded-lg">
              <h4 className="font-medium mb-2">Conseils pour de meilleures images :</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Utilisez des images haute résolution (min. 800x800px)</li>
                <li>• La première image sera utilisée comme couverture</li>
                <li>• Ajoutez un texte alternatif descriptif pour le SEO</li>
                <li>• Montrez le produit sous différents angles</li>
                <li>• Évitez les filigranes ou textes sur les images</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Requirements */}
      {formData.images.length === 0 && (
        <Card className="border-warning/20 bg-warning/5">
          <CardContent className="p-6 text-center">
            <ImageIcon className="w-12 h-12 text-warning mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Au moins une image est requise</h3>
            <p className="text-muted-foreground">
              Ajoutez des images pour rendre votre produit attractif et améliorer les conversions
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}