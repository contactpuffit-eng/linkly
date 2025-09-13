import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Wallet, 
  Plus, 
  CreditCard, 
  DollarSign, 
  TrendingUp,
  History,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const VendorWallet = () => {
  const [balance, setBalance] = useState(2450.75);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const transactions = [
    {
      id: 1,
      type: 'deposit',
      amount: 500,
      description: 'Ajout de fonds',
      date: new Date('2024-01-15'),
      status: 'completed'
    },
    {
      id: 2,
      type: 'commission',
      amount: 125.50,
      description: 'Commission vente produit #123',
      date: new Date('2024-01-14'),
      status: 'completed'
    },
    {
      id: 3,
      type: 'withdrawal',
      amount: -200,
      description: 'Retrait vers compte bancaire',
      date: new Date('2024-01-13'),
      status: 'pending'
    }
  ];

  const handleAddMoney = async () => {
    const addAmount = parseFloat(amount);
    if (!addAmount || addAmount <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un montant valide",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simuler une transaction
    setTimeout(() => {
      setBalance(prev => prev + addAmount);
      setAmount('');
      setLoading(false);
      
      toast({
        title: "Fonds ajoutés !",
        description: `${addAmount.toFixed(2)} € ont été ajoutés à votre portefeuille`,
      });
    }, 1000);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownRight className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      default:
        return <DollarSign className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'completed' ? 
      <Badge variant="default" className="bg-green-100 text-green-800">Terminé</Badge> :
      <Badge variant="secondary">En cours</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Portefeuille</h1>
        <p className="text-muted-foreground">
          Gérez vos fonds et consultez l'historique de vos transactions
        </p>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Solde actuel
          </CardTitle>
          <CardDescription>
            Fonds disponibles dans votre portefeuille
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary mb-4">
            {balance.toFixed(2)} €
          </div>
          <div className="flex gap-4">
            <Button size="sm" variant="outline">
              <CreditCard className="mr-2 h-4 w-4" />
              Retirer
            </Button>
            <Button size="sm">
              <TrendingUp className="mr-2 h-4 w-4" />
              Voir rapport
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Money Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Ajouter des fonds
          </CardTitle>
          <CardDescription>
            Rechargez votre portefeuille vendeur
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="amount">Montant (€)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="100.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleAddMoney}
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? 'Ajout...' : 'Ajouter'}
              </Button>
            </div>
          </div>
          
          {/* Quick amounts */}
          <div className="flex gap-2">
            <span className="text-sm text-muted-foreground self-center">Montants rapides:</span>
            {[50, 100, 250, 500].map((quickAmount) => (
              <Button
                key={quickAmount}
                variant="outline"
                size="sm"
                onClick={() => setAmount(quickAmount.toString())}
              >
                {quickAmount}€
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historique des transactions
          </CardTitle>
          <CardDescription>
            Consultez toutes vos transactions récentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <div key={transaction.id}>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.date.toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-medium ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)} €
                    </span>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
                {index < transactions.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorWallet;