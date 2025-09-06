import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, 
  Monitor, 
  Store, 
  Instagram, 
  Facebook, 
  Twitter,
  ExternalLink,
  QrCode
} from "lucide-react";

const AffiliateLinkInBio = () => {
  const affiliateData = {
    name: "Sarah Marketing",
    username: "sarahmarketingdz",
    bio: "🚀 Spécialiste Marketing Digital | 📱 Tech & Innovation | 🇩🇿 Made in Algeria",
    avatar: "S",
    followers: "12.4K",
    links: [
      {
        id: 1,
        title: "iPhone 15 Pro Max - Promo Exclusive",
        description: "Le dernier iPhone avec 15% de réduction",
        type: "ecommerce",
        icon: ShoppingBag,
        clicks: 1247,
        badge: "HOT"
      },
      {
        id: 2,
        title: "Formation Marketing Digital Complète",
        description: "Apprenez les secrets du marketing digital",
        type: "service", 
        icon: Monitor,
        clicks: 832,
        badge: "NOUVEAU"
      },
      {
        id: 3,
        title: "Restaurant Le Gourmet - Menu QR",
        description: "Cuisine fusion avec livraison gratuite",
        type: "physical",
        icon: Store,
        clicks: 456,
        badge: null
      }
    ],
    social: [
      { platform: "Instagram", handle: "@sarahmarketing_dz", icon: Instagram },
      { platform: "Facebook", handle: "Sarah Marketing DZ", icon: Facebook },
      { platform: "Twitter", handle: "@sarahmarkdz", icon: Twitter }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto bg-card min-h-screen">
        {/* Header */}
        <div className="relative">
          <div className="h-32 bg-gradient-hero"></div>
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground text-4xl font-bold border-4 border-background shadow-lg">
              {affiliateData.avatar}
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 pb-8 px-6 text-center">
          <h1 className="text-2xl font-bold mb-1">{affiliateData.name}</h1>
          <p className="text-muted-foreground mb-1">@{affiliateData.username}</p>
          <Badge variant="secondary" className="mb-4">
            {affiliateData.followers} followers
          </Badge>
          <p className="text-sm leading-relaxed">{affiliateData.bio}</p>
        </div>

        {/* Social Links */}
        <div className="px-6 mb-8">
          <div className="flex justify-center space-x-4">
            {affiliateData.social.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <Button key={index} variant="outline" size="sm">
                  <IconComponent className="w-4 h-4" />
                </Button>
              );
            })}
          </div>
        </div>

        {/* Links */}
        <div className="px-6 space-y-4 pb-8">
          {affiliateData.links.map((link) => {
            const IconComponent = link.icon;
            return (
              <Card key={link.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg">
                        <IconComponent className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm leading-tight">
                            {link.title}
                          </h3>
                          {link.badge && (
                            <Badge 
                              variant={link.badge === 'HOT' ? 'destructive' : 'default'} 
                              className="text-xs px-2 py-0.5"
                            >
                              {link.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {link.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {link.clicks} clics
                        </p>
                      </div>
                    </div>
                    <div className="ml-2">
                      {link.type === 'physical' ? (
                        <QrCode className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ExternalLink className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-8 border-t bg-muted/50 text-center">
          <p className="text-xs text-muted-foreground mb-2">
            Créé avec 
          </p>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-4 h-4 bg-gradient-primary rounded"></div>
            <span className="text-sm font-semibold">Linkly</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            linkly.com/@{affiliateData.username}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AffiliateLinkInBio;