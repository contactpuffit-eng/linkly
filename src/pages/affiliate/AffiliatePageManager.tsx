import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Eye, 
  ExternalLink, 
  Copy, 
  Plus,
  X,
  Loader2
} from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
}

interface AffiliatePage {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  theme_color: string;
  is_published: boolean;
  social_links: SocialLink[];
}

const AffiliatePageManager = () => {
  const [page, setPage] = useState<AffiliatePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSocialLink, setNewSocialLink] = useState<SocialLink>({ platform: '', url: '' });
  const [needsAuth, setNeedsAuth] = useState(false);
  const [isMockUser, setIsMockUser] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAffiliatePage();
  }, []);

  const fetchAffiliatePage = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      let currentUser = user as any;

      // Support mock login (any email/mdp)
      if (!currentUser) {
        const mockUserData = localStorage.getItem('mock_user');
        if (mockUserData) {
          const mock = JSON.parse(mockUserData);
          currentUser = mock;
          setIsMockUser(true);

          // Load from localStorage or create a default page
          const saved = localStorage.getItem('mock_affiliate_page');
          if (saved) {
            try { setPage(JSON.parse(saved)); } catch {}
            return;
          }
          const baseName = (mock.email?.split('@')[0] || 'user');
          const defaultPage: AffiliatePage = {
            id: 'mock-page',
            username: `${baseName}`,
            display_name: baseName,
            bio: 'Découvrez mes produits recommandés !',
            avatar_url: '',
            theme_color: '#3B82F6',
            is_published: false,
            social_links: []
          };
          localStorage.setItem('mock_affiliate_page', JSON.stringify(defaultPage));
          setPage(defaultPage);
          return;
        }
      }

      if (!currentUser) {
        setNeedsAuth(true);
        return;
      }

      const { data, error } = await supabase
        .from('affiliate_pages')
        .select('*')
        .eq('affiliate_id', currentUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching affiliate page:', error);
        return;
      }

      if (data) {
        // Parse social_links safely
        const socialLinks = Array.isArray(data.social_links) 
          ? (data.social_links as unknown as SocialLink[])
          : [];
        setPage({
          id: data.id,
          username: data.username,
          display_name: data.display_name,
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
          theme_color: data.theme_color,
          is_published: data.is_published,
          social_links: socialLinks
        });
      } else {
        // Create default page
        await createDefaultPage(currentUser);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultPage = async (user: any) => {
    try {
      console.log('Creating default page for user:', user);
      
      // Get user profile for default values - handle test case
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, username')
        .eq('user_id', user.id)
        .single();

      console.log('Profile data:', profile);

      // Generate username - fallback for test users
      let suggestedUsername = 'user123';
      try {
        const { data: usernameData } = await supabase
          .rpc('generate_affiliate_username', {
            base_name: profile?.name || user.email?.split('@')[0] || 'user'
          });
        suggestedUsername = usernameData || 'user123';
      } catch (error) {
        console.log('Username generation failed, using fallback:', error);
      }

      const defaultPage = {
        affiliate_id: user.id,
        username: suggestedUsername,
        display_name: profile?.name || 'Mon Profil Affilié',
        bio: 'Découvrez mes produits recommandés !',
        theme_color: '#3B82F6',
        is_published: false,
        social_links: []
      };

      console.log('Creating page with data:', defaultPage);

      const { data, error } = await supabase
        .from('affiliate_pages')
        .insert(defaultPage)
        .select()
        .single();

      if (error) {
        console.error('Error creating page:', error);
        throw error;
      }
      
      console.log('Page created successfully:', data);
      
      // Parse the response data
      const socialLinks = Array.isArray(data.social_links) 
        ? (data.social_links as unknown as SocialLink[])
        : [];
      setPage({
        id: data.id,
        username: data.username,
        display_name: data.display_name,
        bio: data.bio || '',
        avatar_url: data.avatar_url || '',
        theme_color: data.theme_color,
        is_published: data.is_published,
        social_links: socialLinks
      });
    } catch (error) {
      console.error('Error creating default page:', error);
    }
  };

  const handleSave = async () => {
    if (!page) return;

    if (isMockUser) {
      localStorage.setItem('mock_affiliate_page', JSON.stringify(page));
      toast({
        title: "Page sauvegardée !",
        description: "Vos modifications ont été enregistrées (mode démo).",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('affiliate_pages')
        .update({
          username: page.username,
          display_name: page.display_name,
          bio: page.bio,
          avatar_url: page.avatar_url,
          theme_color: page.theme_color,
          is_published: page.is_published,
          social_links: page.social_links as any
        })
        .eq('id', page.id);

      if (error) throw error;

      toast({
        title: "Page sauvegardée !",
        description: "Vos modifications ont été enregistrées.",
      });
    } catch (error) {
      console.error('Error saving page:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la page",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const copyPageUrl = () => {
    if (!page) return;
    const url = `${window.location.origin}/@${page.username}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Lien copié !",
      description: "Le lien de votre page a été copié dans le presse-papier.",
    });
  };

  const addSocialLink = () => {
    if (!newSocialLink.platform || !newSocialLink.url || !page) return;

    const updatedLinks = [...page.social_links, newSocialLink];
    setPage({ ...page, social_links: updatedLinks });
    setNewSocialLink({ platform: '', url: '' });
  };

  const removeSocialLink = (index: number) => {
    if (!page) return;
    const updatedLinks = page.social_links.filter((_, i) => i !== index);
    setPage({ ...page, social_links: updatedLinks });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (needsAuth) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-2">Connexion requise</h2>
        <p className="text-muted-foreground">Veuillez vous connecter pour gérer votre page affilié.</p>
        <div className="mt-6">
          <Button onClick={() => (window.location.href = '/auth')}>Se connecter</Button>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Erreur</h2>
        <p className="text-muted-foreground">Impossible de charger votre page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ma Page</h1>
          <p className="text-muted-foreground">Personnalisez votre page de profil affilié</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={copyPageUrl}
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copier le lien
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.open(`/@${page.username}`, '_blank')}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Prévisualiser
          </Button>
        </div>
      </div>

      {/* URL Preview */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={page.is_published ? "default" : "secondary"}>
                {page.is_published ? "Publié" : "Brouillon"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {window.location.origin}/@{page.username}
              </span>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuration
          </CardTitle>
          <CardDescription>
            Personnalisez l'apparence et les informations de votre page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input
              id="username"
              value={page.username}
              onChange={(e) => setPage({ ...page, username: e.target.value })}
              placeholder="votreusername"
            />
            <p className="text-xs text-muted-foreground">
              Votre page sera accessible via @{page.username}
            </p>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">Nom d'affichage</Label>
            <Input
              id="displayName"
              value={page.display_name}
              onChange={(e) => setPage({ ...page, display_name: e.target.value })}
              placeholder="Votre nom complet"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Biographie</Label>
            <Textarea
              id="bio"
              value={page.bio || ''}
              onChange={(e) => setPage({ ...page, bio: e.target.value })}
              placeholder="Décrivez-vous en quelques mots..."
              rows={3}
            />
          </div>

          {/* Theme Color */}
          <div className="space-y-2">
            <Label htmlFor="themeColor">Couleur du thème</Label>
            <div className="flex items-center gap-4">
              <Input
                id="themeColor"
                type="color"
                value={page.theme_color}
                onChange={(e) => setPage({ ...page, theme_color: e.target.value })}
                className="w-16 h-10"
              />
              <Input
                value={page.theme_color}
                onChange={(e) => setPage({ ...page, theme_color: e.target.value })}
                placeholder="#3B82F6"
                className="flex-1"
              />
            </div>
          </div>

          {/* Published Status */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Page publique</Label>
              <p className="text-sm text-muted-foreground">
                Rendre votre page accessible au public
              </p>
            </div>
            <Switch
              checked={page.is_published}
              onCheckedChange={(checked) => setPage({ ...page, is_published: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Liens sociaux</CardTitle>
          <CardDescription>
            Ajoutez vos réseaux sociaux pour plus de visibilité
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Links */}
          {page.social_links.map((link, index) => (
            <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="capitalize font-medium min-w-20">
                {link.platform}
              </div>
              <div className="flex-1 text-sm text-muted-foreground truncate">
                {link.url}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeSocialLink(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {/* Add New Link */}
          <div className="flex gap-2">
            <Input
              placeholder="Plateforme (Instagram, Facebook...)"
              value={newSocialLink.platform}
              onChange={(e) => setNewSocialLink({ ...newSocialLink, platform: e.target.value })}
              className="flex-1"
            />
            <Input
              placeholder="URL du profil"
              value={newSocialLink.url}
              onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
              className="flex-2"
            />
            <Button
              onClick={addSocialLink}
              disabled={!newSocialLink.platform || !newSocialLink.url}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Sauvegarder les modifications
        </Button>
      </div>
    </div>
  );
};

export default AffiliatePageManager;
