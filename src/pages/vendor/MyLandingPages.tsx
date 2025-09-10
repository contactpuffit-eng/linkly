import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Eye, 
  Edit, 
  Copy, 
  Trash2, 
  ExternalLink,
  Search,
  TrendingUp,
  Calendar,
  Star
} from 'lucide-react';

interface LandingPage {
  id: string;
  title: string;
  slug: string;
  theme_id: string;
  is_published: boolean;
  views_count: number;
  conversions_count: number;
  created_at: string;
  product_id: string;
  customization: any;
  media_urls: any;
}

export default function MyLandingPages() {
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchLandingPages();
  }, []);

  const fetchLandingPages = async () => {
    try {
      const { data, error } = await supabase
        .from('landing_pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLandingPages(data || []);
    } catch (error) {
      console.error('Error fetching landing pages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos landing pages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/landing/${slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Lien copié !",
      description: "Le lien de la landing page a été copié",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette landing page ?')) return;

    try {
      const { error } = await supabase
        .from('landing_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLandingPages(pages => pages.filter(p => p.id !== id));
      toast({
        title: "Supprimée !",
        description: "La landing page a été supprimée",
      });
    } catch (error) {
      console.error('Error deleting landing page:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la landing page",
        variant: "destructive"
      });
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('landing_pages')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      setLandingPages(pages => 
        pages.map(p => 
          p.id === id ? { ...p, is_published: !currentStatus } : p
        )
      );

      toast({
        title: !currentStatus ? "Publiée !" : "Dépubliée !",
        description: `La landing page a été ${!currentStatus ? 'publiée' : 'dépubliée'}`,
      });
    } catch (error) {
      console.error('Error toggling publish:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive"
      });
    }
  };

  const filteredPages = landingPages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const conversionRate = (page: LandingPage) => {
    if (page.views_count === 0) return 0;
    return ((page.conversions_count / page.views_count) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Mes Landing Pages
              </h1>
              <p className="text-muted-foreground mt-1">
                Gérez vos pages de vente créées
              </p>
            </div>
            <Button 
              onClick={() => window.location.href = '/vendor/ai-landing'}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer une nouvelle landing page
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-7xl mx-auto px-6 py-8">
        {/* Search and filters */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher une landing page..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Landing pages grid */}
        {filteredPages.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Star className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Aucune landing page</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? 'Aucun résultat trouvé pour votre recherche' : 'Créez votre première landing page pour commencer'}
                  </p>
                </div>
                {!searchTerm && (
                  <Button 
                    onClick={() => window.location.href = '/vendor/ai-landing'}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer ma première landing page
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPages.map((page) => (
              <Card key={page.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="truncate">{page.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        /{page.slug}
                      </p>
                    </div>
                    <Badge variant={page.is_published ? 'default' : 'secondary'}>
                      {page.is_published ? 'Publiée' : 'Brouillon'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Preview image */}
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    {(page.media_urls && Array.isArray(page.media_urls) && page.media_urls.length > 0) ? (
                      <img 
                        src={page.media_urls[0].url} 
                        alt={page.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Eye className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold">{page.views_count}</div>
                      <div className="text-xs text-muted-foreground">Vues</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{page.conversions_count}</div>
                      <div className="text-xs text-muted-foreground">Conversions</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{conversionRate(page)}%</div>
                      <div className="text-xs text-muted-foreground">Taux</div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(page.created_at).toLocaleDateString('fr-FR')}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/landing/${page.slug}`, '_blank')}
                      className="flex-1"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyLink(page.slug)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublish(page.id, page.is_published)}
                    >
                      {page.is_published ? 'Dépublier' : 'Publier'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(page.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}