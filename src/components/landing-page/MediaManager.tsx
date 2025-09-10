import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  X, 
  Star, 
  Link2, 
  Image as ImageIcon,
  Loader2,
  Plus
} from 'lucide-react';

interface MediaItem {
  url: string;
  alt: string;
  isCover?: boolean;
  source: 'ai' | 'upload' | 'url';
}

interface MediaManagerProps {
  aiImages: MediaItem[];
  selectedMedia: MediaItem[];
  onMediaChange: (media: MediaItem[]) => void;
}

export const MediaManager = ({ aiImages, selectedMedia, onMediaChange }: MediaManagerProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;
    
    setIsUploading(true);
    const newMedia: MediaItem[] = [];

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;

        // Générer un nom unique pour le fichier
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${file.name.split('.').pop()}`;
        const filePath = `${Date.now()}/${fileName}`;

        const { data, error } = await supabase.storage
          .from('landing-page-media')
          .upload(filePath, file);

        if (error) {
          console.error('Error uploading file:', error);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from('landing-page-media')
          .getPublicUrl(data.path);

        newMedia.push({
          url: urlData.publicUrl,
          alt: file.name.split('.')[0],
          source: 'upload'
        });
      }

      if (newMedia.length > 0) {
        onMediaChange([...selectedMedia, ...newMedia]);
        toast({
          title: "Images uploadées !",
          description: `${newMedia.length} image(s) ajoutée(s) avec succès`,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erreur d'upload",
        description: "Impossible d'uploader les images",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddFromUrl = () => {
    if (!imageUrl.trim()) return;

    const newImage: MediaItem = {
      url: imageUrl,
      alt: 'Image ajoutée via URL',
      source: 'url'
    };

    onMediaChange([...selectedMedia, newImage]);
    setImageUrl('');
    setIsAddingUrl(false);
    
    toast({
      title: "Image ajoutée !",
      description: "L'image a été ajoutée depuis l'URL",
    });
  };

  const removeImage = (indexToRemove: number) => {
    const newMedia = selectedMedia.filter((_, index) => index !== indexToRemove);
    onMediaChange(newMedia);
  };

  const setCoverImage = (index: number) => {
    const newMedia = selectedMedia.map((item, i) => ({
      ...item,
      isCover: i === index
    }));
    onMediaChange(newMedia);
  };

  const importAiImages = () => {
    const aiMediaItems: MediaItem[] = aiImages.map(img => ({
      ...img,
      source: 'ai' as const
    }));
    
    onMediaChange([...selectedMedia, ...aiMediaItems]);
    
    toast({
      title: "Images IA importées !",
      description: `${aiImages.length} image(s) ajoutée(s) depuis l'IA`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ImageIcon className="w-5 h-5 mr-2" />
          Gestion des médias
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Images IA disponibles */}
        {aiImages.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">Images extraites par l'IA ({aiImages.length})</Label>
              <Button
                onClick={importAiImages}
                variant="outline"
                size="sm"
                disabled={aiImages.length === 0}
              >
                <Plus className="w-4 h-4 mr-1" />
                Tout importer
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {aiImages.slice(0, 8).map((img, idx) => (
                <div key={idx} className="aspect-square bg-muted rounded border overflow-hidden">
                  <img 
                    src={img.url} 
                    alt={img.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            {aiImages.length > 8 && (
              <Badge variant="secondary">
                +{aiImages.length - 8} autres images disponibles
              </Badge>
            )}
          </div>
        )}

        {/* Méthodes d'ajout */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Ajouter des médias</Label>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Upload depuis l'ordinateur */}
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              disabled={isUploading}
              className="h-20 flex-col"
            >
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin mb-2" />
              ) : (
                <Upload className="w-6 h-6 mb-2" />
              )}
              <span className="text-sm">Upload depuis PC</span>
            </Button>
            
            {/* Ajouter depuis URL */}
            <Button
              onClick={() => setIsAddingUrl(true)}
              variant="outline"
              className="h-20 flex-col"
            >
              <Link2 className="w-6 h-6 mb-2" />
              <span className="text-sm">Ajouter depuis URL</span>
            </Button>
          </div>

          {/* Input pour URL */}
          {isAddingUrl && (
            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL de l'image</Label>
              <div className="flex gap-2">
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1"
                />
                <Button onClick={handleAddFromUrl} disabled={!imageUrl.trim()}>
                  Ajouter
                </Button>
                <Button onClick={() => setIsAddingUrl(false)} variant="outline">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Images sélectionnées */}
        {selectedMedia.length > 0 && (
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Images sélectionnées ({selectedMedia.length})
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {selectedMedia.map((item, idx) => (
                <div key={idx} className="relative group aspect-square bg-muted rounded border overflow-hidden">
                  <img 
                    src={item.url} 
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Source badge */}
                  <Badge 
                    variant={item.source === 'ai' ? 'default' : item.source === 'upload' ? 'secondary' : 'outline'}
                    className="absolute top-1 left-1 text-xs"
                  >
                    {item.source === 'ai' ? 'IA' : item.source === 'upload' ? 'PC' : 'URL'}
                  </Badge>
                  
                  {/* Cover badge */}
                  {item.isCover && (
                    <Badge className="absolute top-1 right-1 bg-yellow-500">
                      <Star className="w-3 h-3" />
                    </Badge>
                  )}
                  
                  {/* Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setCoverImage(idx)}
                      disabled={item.isCover}
                    >
                      <Star className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeImage(idx)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input file caché */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};