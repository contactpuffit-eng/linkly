import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Package, Tag, Percent } from 'lucide-react';
import { ProductFormData } from '../../../pages/vendor/CreateProduct';

interface Props {
  formData: ProductFormData;
  updateFormData: (updates: Partial<ProductFormData>) => void;
}

const categories = [
  'Produits e-commerce',
  'Services/Logiciels', 
  'Restaurants/Boutiques'
];

const subcategories = {
  'Produits e-commerce': ['Électronique', 'Mode', 'Maison', 'Beauté', 'Sport', 'Autre'],
  'Services/Logiciels': ['SaaS', 'Formations', 'Consulting', 'Design', 'Marketing', 'Autre'],
  'Restaurants/Boutiques': ['Restaurant', 'Café', 'Boulangerie', 'Boutique', 'Salon', 'Autre']
};

export function BasicInfoStep({ formData, updateFormData }: Props) {
  const [newTag, setNewTag] = useState('');
  const [newVariant, setNewVariant] = useState({
    name: '',
    sku: '',
    price: 0,
    stock: 0
  });

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      updateFormData({
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateFormData({
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleAddVariant = () => {
    if (newVariant.name && newVariant.sku) {
      updateFormData({
        variants: [...formData.variants, { ...newVariant }]
      });
      setNewVariant({ name: '', sku: '', price: 0, stock: 0 });
    }
  };

  const handleRemoveVariant = (index: number) => {
    updateFormData({
      variants: formData.variants.filter((_, i) => i !== index)
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    updateFormData({ 
      title,
      slug: generateSlug(title)
    });
  };

  return (
    <div className="space-y-6">
      {/* Informations principales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Informations principales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Titre du produit *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ex: iPhone 15 Pro Max 256GB"
                className="text-lg font-medium"
              />
            </div>

            <div>
              <Label htmlFor="category">Catégorie *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => updateFormData({ category: value, subcategory: '' })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subcategory">Sous-catégorie</Label>
              <Select 
                value={formData.subcategory} 
                onValueChange={(value) => updateFormData({ subcategory: value })}
                disabled={!formData.category}
              >
                <SelectTrigger id="subcategory">
                  <SelectValue placeholder="Choisir une sous-catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {formData.category && subcategories[formData.category as keyof typeof subcategories]?.map(subcat => (
                    <SelectItem key={subcat} value={subcat}>{subcat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              placeholder="Décrivez votre produit en détail..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Prix et Commission */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Percent className="w-5 h-5 mr-2" />
            Prix et Commission
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Prix (DA) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => updateFormData({ price: Number(e.target.value) })}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="crossed-price">Prix barré (DA)</Label>
              <Input
                id="crossed-price"
                type="number"
                value={formData.crossedPrice || ''}
                onChange={(e) => updateFormData({ crossedPrice: Number(e.target.value) || undefined })}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Prix original pour afficher une promotion
              </p>
            </div>

            <div>
              <Label htmlFor="commission">Commission affilié (%) *</Label>
              <Input
                id="commission"
                type="number"
                min="0"
                max="50"
                value={formData.commission}
                onChange={(e) => updateFormData({ commission: Number(e.target.value) })}
                placeholder="10"
              />
            </div>
          </div>

          {formData.price > 0 && formData.commission > 0 && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="text-sm">
                <strong>Commission par vente :</strong>{' '}
                <span className="text-success font-bold">
                  {((formData.price * formData.commission) / 100).toLocaleString()} DA
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Variantes */}
      <Card>
        <CardHeader>
          <CardTitle>Variantes du produit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.variants.length > 0 && (
            <div className="space-y-2">
              {formData.variants.map((variant, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="grid grid-cols-4 gap-4 flex-1">
                    <div>
                      <span className="text-sm text-muted-foreground">Nom</span>
                      <div className="font-medium">{variant.name}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">SKU</span>
                      <div className="font-mono text-sm">{variant.sku}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Prix</span>
                      <div className="font-medium">{variant.price.toLocaleString()} DA</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Stock</span>
                      <div className="font-medium">{variant.stock}</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveVariant(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-2 border-dashed border-muted rounded-lg">
            <div>
              <Label htmlFor="variant-name">Nom</Label>
              <Input
                id="variant-name"
                value={newVariant.name}
                onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                placeholder="Ex: 50ml"
              />
            </div>
            <div>
              <Label htmlFor="variant-sku">SKU</Label>
              <Input
                id="variant-sku"
                value={newVariant.sku}
                onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                placeholder="Ex: PROD-50ML"
              />
            </div>
            <div>
              <Label htmlFor="variant-price">Prix (DA)</Label>
              <Input
                id="variant-price"
                type="number"
                value={newVariant.price}
                onChange={(e) => setNewVariant({ ...newVariant, price: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="variant-stock">Stock</Label>
              <Input
                id="variant-stock"
                type="number"
                value={newVariant.stock}
                onChange={(e) => setNewVariant({ ...newVariant, stock: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
          </div>

          <Button 
            onClick={handleAddVariant}
            variant="outline"
            className="w-full"
            disabled={!newVariant.name || !newVariant.sku}
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une variante
          </Button>

          {formData.variants.length === 0 && (
            <div>
              <Label htmlFor="total-stock">Stock total</Label>
              <Input
                id="total-stock"
                type="number"
                value={formData.totalStock || ''}
                onChange={(e) => updateFormData({ totalStock: Number(e.target.value) || undefined })}
                placeholder="100"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Tag className="w-5 h-5 mr-2" />
            Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="flex space-x-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Ajouter un tag..."
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <Button onClick={handleAddTag} disabled={!newTag.trim()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Les tags aident à la découverte de votre produit et améliorent le SEO
          </p>
        </CardContent>
      </Card>
    </div>
  );
}