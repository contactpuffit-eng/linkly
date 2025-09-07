import { useState } from 'react';
import { AffiliateTabs } from '@/components/affiliate/AffiliateTabs';
import AffiliateOverview from './AffiliateOverview';

const AffiliateDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AffiliateOverview />;
      case 'products':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Produits Disponibles</h2>
            <p className="text-muted-foreground">Catalogue des produits à promouvoir (en développement)</p>
          </div>
        );
      case 'links':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Mes Liens</h2>
            <p className="text-muted-foreground">Gestion de vos liens d'affiliation (en développement)</p>
          </div>
        );
      case 'page':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Ma Page</h2>
            <p className="text-muted-foreground">Page landing personnalisée (en développement)</p>
          </div>
        );
      case 'wallet':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Portefeuille</h2>
            <p className="text-muted-foreground">Gestion des gains et retraits (en développement)</p>
          </div>
        );
      default:
        return <AffiliateOverview />;
    }
  };

  return (
    <AffiliateTabs activeTab={activeTab} onTabChange={setActiveTab}>
      {renderTabContent()}
    </AffiliateTabs>
  );
};

export default AffiliateDashboard;