import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Star, 
  Check, 
  ShoppingCart, 
  Phone, 
  Mail,
  MapPin,
  Share2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  media_url: string;
  category: string;
}

export default function LandingPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Pour la démo, récupérer le dernier produit créé
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching product:', error);
        } else {
          setProduct(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Produit non trouvé</h1>
          <p className="text-muted-foreground">Ce produit n'existe pas ou n'est plus disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="font-bold text-lg">Linkly</div>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Partager
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-12 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="secondary" className="w-fit">
              {product.category === 'other' ? 'Produit' : product.category}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
              {product.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              {product.description}
            </p>
            
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold text-primary">
                {product.price.toLocaleString()} DA
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">4.8</span>
                <span className="ml-1">(127 avis)</span>
              </div>
            </div>
          </div>

          <div className="relative">
            {product.media_url ? (
              <img
                src={product.media_url}
                alt={product.title}
                className="rounded-2xl shadow-2xl w-full aspect-square object-cover"
              />
            ) : (
              <div className="rounded-2xl shadow-2xl w-full aspect-square bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4" />
                  <p>Image du produit</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Pourquoi choisir ce produit ?</h2>
          <p className="text-muted-foreground text-lg">Les avantages qui font la différence</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Check className="w-6 h-6" />,
              title: "Qualité Premium",
              description: "Matériaux de haute qualité pour une durabilité exceptionnelle"
            },
            {
              icon: <Star className="w-6 h-6" />,
              title: "Satisfaction Garantie",
              description: "100% satisfait ou remboursé sous 30 jours"
            },
            {
              icon: <ShoppingCart className="w-6 h-6" />,
              title: "Livraison Rapide",
              description: "Livraison gratuite partout en Algérie en 2-3 jours"
            }
          ].map((benefit, index) => (
            <Card key={index} className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-lg">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Order Form */}
      <section className="container py-12">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Commandez maintenant</h2>
              <p className="text-muted-foreground">Remplissez le formulaire ci-dessous</p>
            </div>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom complet *</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Votre nom complet"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Téléphone *</label>
                  <input 
                    type="tel" 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="0555 123 456"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Adresse de livraison *</label>
                <textarea 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  rows={3}
                  placeholder="Adresse complète avec wilaya"
                />
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total à payer :</span>
                <span className="text-2xl text-primary">{product.price.toLocaleString()} DA</span>
              </div>
              
              <Button className="w-full bg-gradient-primary hover:opacity-90 text-lg py-6">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Confirmer la commande
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Paiement à la livraison • Livraison gratuite • Garantie satisfait ou remboursé
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Contact Footer */}
      <footer className="bg-muted/50 py-12">
        <div className="container">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Une question ?</h3>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>0555 123 456</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>contact@linkly.com</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2024 Linkly. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}