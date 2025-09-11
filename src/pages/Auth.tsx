import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const { toast } = useToast();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Connexion / Inscription - Linkly';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Connectez-vous ou créez un compte Linkly.');

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        window.location.href = '/affiliate';
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login with any credentials
    setTimeout(() => {
      const mockUser = {
        id: 'test-user-' + Math.random().toString(36).substr(2, 9),
        email: email,
        created_at: new Date().toISOString()
      };
      
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      toast({ title: 'Connecté !', description: "Redirection..." });
      setLoading(false);
      window.location.href = '/affiliate';
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{mode === 'login' ? 'Connexion' : 'Créer un compte'}</CardTitle>
          <CardDescription>
            {mode === 'login' ? 'Connectez-vous pour accéder à votre tableau de bord affilié.' : 'Inscrivez-vous pour rejoindre la plateforme affiliée.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Veuillez patienter...' : (mode === 'login' ? 'Se connecter' : "S'inscrire")}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {mode === 'login' ? (
              <span>
                Pas de compte ?{' '}
                <button className="underline" onClick={() => setMode('signup')}>Créer un compte</button>
              </span>
            ) : (
              <span>
                Déjà inscrit ?{' '}
                <button className="underline" onClick={() => setMode('login')}>Se connecter</button>
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
