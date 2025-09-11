import { useState } from 'react';
import { AffiliateTabs } from '@/components/affiliate/AffiliateTabs';
import AffiliateOverview from './AffiliateOverview';
import AffiliateProducts from './AffiliateProducts';
import AffiliateLinks from './AffiliateLinks';
import AffiliatePageManager from './AffiliatePageManager';

const AffiliateDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AffiliateOverview />;
      case 'products':
        return <AffiliateProducts />;
      case 'links':
        return <AffiliateLinks />;
      case 'page':
        return <AffiliatePageManager />;
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