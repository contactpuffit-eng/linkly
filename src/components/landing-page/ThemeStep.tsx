import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Check, 
  ArrowRight,
  Zap,
  Heart,
  Star,
  Palette,
  Layout,
  ShoppingBag,
  Sparkles
} from 'lucide-react';

interface Theme {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  features: string[];
  premium?: boolean;
  popular?: boolean;
  icon: any;
  gradient: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface ThemeStepProps {
  selectedProduct: any;
  onNext: (themeId: string) => void;
  onBack: () => void;
}

const themes: Theme[] = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Design épuré et élégant, parfait pour les produits tech et lifestyle',
    category: 'Business',
    preview: '/api/placeholder/400/240',
    features: ['Hero minimaliste', 'CTA puissant', 'Testimonials', 'FAQ intégrée'],
    icon: Layout,
    gradient: 'from-slate-50 to-gray-100',
    colors: {
      primary: '#1e293b',
      secondary: '#64748b',
      accent: '#3b82f6'
    }
  },
  {
    id: 'ecommerce-pro',
    name: 'E-commerce Pro',
    description: 'Template optimisé pour la vente avec focus sur la conversion',
    category: 'E-commerce',
    preview: '/api/placeholder/400/240',
    features: ['Galerie produit', 'Prix en évidence', 'Urgence visuelle', 'Commande rapide'],
    popular: true,
    icon: ShoppingBag,
    gradient: 'from-blue-50 to-indigo-100',
    colors: {
      primary: '#1e40af',
      secondary: '#3b82f6',
      accent: '#10b981'
    }
  },
  {
    id: 'conversion-master',
    name: 'Conversion Master',
    description: 'Conçu avec la psychologie des couleurs pour maximiser les ventes',
    category: 'Marketing',
    preview: '/api/placeholder/400/240',
    features: ['Psychologie couleurs', 'Social proof', 'Scarcité', 'Multi-CTA'],
    premium: true,
    icon: Zap,
    gradient: 'from-orange-50 to-red-100',
    colors: {
      primary: '#dc2626',
      secondary: '#f97316',
      accent: '#fbbf24'
    }
  },
  {
    id: 'premium-luxury',
    name: 'Premium Luxury',
    description: 'Template haut de gamme avec animations fluides et typographie premium',
    category: 'Luxury',
    preview: '/api/placeholder/400/240',
    features: ['Animations fluides', 'Typographie premium', 'Gradients dorés', 'Parallax'],
    premium: true,
    icon: Crown,
    gradient: 'from-amber-50 to-yellow-100',
    colors: {
      primary: '#92400e',
      secondary: '#d97706',
      accent: '#f59e0b'
    }
  },
  {
    id: 'startup-launch',
    name: 'Startup Launch',
    description: 'Parfait pour lancer un nouveau produit avec effet de nouveauté',
    category: 'Startup',
    preview: '/api/placeholder/400/240',
    features: ['Countdown timer', 'Early bird', 'Beta access', 'Newsletter'],
    icon: Star,
    gradient: 'from-purple-50 to-pink-100',
    colors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#ec4899'
    }
  },
  {
    id: 'health-wellness',
    name: 'Health & Wellness',
    description: 'Optimisé pour les produits santé avec couleurs apaisantes',
    category: 'Health',
    preview: '/api/placeholder/400/240',
    features: ['Témoignages médicaux', 'Avant/après', 'Ingrédients', 'Garantie'],
    icon: Heart,
    gradient: 'from-green-50 to-emerald-100',
    colors: {
      primary: '#059669',
      secondary: '#10b981',
      accent: '#34d399'
    }
  }
];

export const ThemeStep = ({ selectedProduct, onNext, onBack }: ThemeStepProps) => {
  const categories = ['Tous', ...Array.from(new Set(themes.map(t => t.category)))];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          ← Retour
        </Button>
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Choisissez votre thème
        </h2>
        <p className="text-muted-foreground text-lg">
          Sélectionnez un thème professionnel pour votre landing page
        </p>
        <div className="bg-muted/50 rounded-lg p-4 max-w-md mx-auto">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <div className="font-semibold">{selectedProduct.title}</div>
              <div className="text-sm text-muted-foreground">
                {selectedProduct.price.toLocaleString()} DA
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Badge 
            key={category} 
            variant="secondary" 
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Themes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => {
          const IconComponent = theme.icon;
          return (
            <Card 
              key={theme.id} 
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 relative overflow-hidden"
              onClick={() => onNext(theme.id)}
            >
              {theme.popular && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    Populaire
                  </Badge>
                </div>
              )}
              
              {theme.premium && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                </div>
              )}

              <CardHeader className="relative">
                {/* Theme Preview */}
                <div className={`aspect-video bg-gradient-to-br ${theme.gradient} rounded-lg flex items-center justify-center relative overflow-hidden mb-4 group-hover:scale-105 transition-transform`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
                  
                  {/* Mock Landing Page Preview */}
                  <div className="absolute inset-4 bg-white rounded shadow-lg overflow-hidden">
                    <div className="h-full flex flex-col">
                      {/* Mock Header */}
                      <div className="h-8 bg-gray-50 border-b flex items-center px-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-red-400"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                          <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        </div>
                      </div>
                      
                      {/* Mock Content */}
                      <div className="flex-1 p-2 space-y-1">
                        <div style={{ backgroundColor: theme.colors.primary }} className="h-6 w-3/4 rounded opacity-20"></div>
                        <div className="h-2 w-full bg-gray-200 rounded"></div>
                        <div className="h-2 w-2/3 bg-gray-200 rounded"></div>
                        <div className="flex justify-between mt-2">
                          <div className="h-4 w-1/3 bg-gray-100 rounded"></div>
                          <div style={{ backgroundColor: theme.colors.accent }} className="h-4 w-1/4 rounded opacity-60"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <IconComponent className="w-8 h-8 text-white/80 absolute bottom-2 right-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {theme.name}
                    </CardTitle>
                    <Badge variant="outline">{theme.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {theme.description}
                  </p>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Features */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Fonctionnalités incluses:</div>
                    <div className="grid grid-cols-2 gap-1">
                      {theme.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-xs text-muted-foreground">
                          <Check className="w-3 h-3 mr-1 text-green-500 flex-shrink-0" />
                          <span className="truncate">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Color Palette */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Palette de couleurs:</div>
                    <div className="flex space-x-2">
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: theme.colors.primary }}
                      ></div>
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: theme.colors.secondary }}
                      ></div>
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: theme.colors.accent }}
                      ></div>
                    </div>
                  </div>

                  <Button className="w-full group-hover:bg-primary/90">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Utiliser ce thème
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};