import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  Monitor, 
  Store, 
  Star, 
  TrendingUp, 
  Eye,
  Link2,
  QrCode 
} from "lucide-react";

const Marketplace = () => {
  const products = [
    {
      id: 1,
      title: "iPhone 15 Pro Max 256GB",
      vendor: "TechStore DZ",
      category: "E-commerce",
      type: "ecommerce",
      price: "280,000 DA",
      commission: "5%",
      commissionAmount: "14,000 DA",
      rating: 4.8,
      sales: 145,
      description: "Dernier iPhone avec toutes les fonctionnalités pro",
      image: "/api/placeholder/300/200",
      icon: ShoppingBag,
      trending: true
    },
    {
      id: 2,
      title: "Formation Marketing Digital Complète",
      vendor: "EduTech Academy",
      category: "Service",
      type: "service",
      price: "15,000 DA",
      commission: "30%",
      commissionAmount: "4,500 DA",
      rating: 4.9,
      sales: 89,
      description: "Formation complète pour maîtriser le marketing digital",
      image: "/api/placeholder/300/200",
      icon: Monitor,
      trending: false
    },
    {
      id: 3,
      title: "Menu Restaurant Le Gourmet",
      vendor: "Le Gourmet Alger",
      category: "Restaurant",
      type: "physical",
      price: "Variable",
      commission: "8%",
      commissionAmount: "Variable",
      rating: 4.6,
      sales: 234,
      description: "Cuisine traditionnelle et moderne, livraison disponible",
      image: "/api/placeholder/300/200",
      icon: Store,
      trending: true
    },
    {
      id: 4,
      title: "Abonnement SaaS CRM Pro",
      vendor: "CRM Solutions",
      category: "Service",
      type: "service",
      price: "8,000 DA/mois",
      commission: "25%",
      commissionAmount: "2,000 DA/mois",
      rating: 4.7,
      sales: 67,
      description: "Solution CRM complète pour PME algériennes",
      image: "/api/placeholder/300/200",
      icon: Monitor,
      trending: false
    },
    {
      id: 5,
      title: "Boutique Mode Femme Élégance",
      vendor: "Élégance Fashion",
      category: "Boutique",
      type: "physical",
      price: "Variable",
      commission: "12%",
      commissionAmount: "Variable",
      rating: 4.5,
      sales: 178,
      description: "Mode féminine tendance et accessoires",
      image: "/api/placeholder/300/200",
      icon: Store,
      trending: false
    },
    {
      id: 6,
      title: "Samsung Galaxy S24 Ultra",
      vendor: "Mobile DZ",
      category: "E-commerce",
      type: "ecommerce",
      price: "245,000 DA",
      commission: "4%",
      commissionAmount: "9,800 DA",
      rating: 4.8,
      sales: 203,
      description: "Flagship Samsung avec S Pen et caméra 200MP",
      image: "/api/placeholder/300/200",
      icon: ShoppingBag,
      trending: true
    }
  ];

  const categories = [
    { name: "Tous", count: products.length, active: true },
    { name: "E-commerce", count: 2, active: false },
    { name: "Services", count: 2, active: false },
    { name: "Restaurants", count: 1, active: false },
    { name: "Boutiques", count: 1, active: false }
  ];

  return (
    <section id="demo" className="py-24 lg:py-32">
      <div className="container">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-6">
            Marketplace
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Découvrez les offres d'affiliation
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Parcourez notre marketplace et générez des liens affiliés pour tous types de produits et services
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Rechercher des produits, services, restaurants..." 
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Badge 
              key={category.name}
              variant={category.active ? "default" : "secondary"}
              className="cursor-pointer px-4 py-2"
            >
              {category.name} ({category.count})
            </Badge>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const IconComponent = product.icon;
            return (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {product.trending && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-gradient-primary text-primary-foreground">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Tendance
                    </Badge>
                  </div>
                )}
                
                <div className="relative h-48 bg-gradient-secondary">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <IconComponent className="w-16 h-16 text-muted-foreground" />
                  </div>
                </div>
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight mb-1">
                        {product.title}
                      </CardTitle>
                      <CardDescription>{product.vendor}</CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {product.category}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-medium">{product.rating}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{product.sales} ventes</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <div className="text-lg font-bold">{product.price}</div>
                      <div className="text-sm text-success">
                        Commission: {product.commission} ({product.commissionAmount})
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-gradient-primary hover:opacity-90" size="sm">
                      <Link2 className="w-4 h-4 mr-2" />
                      Créer lien
                    </Button>
                    {product.type === 'physical' && (
                      <Button variant="outline" size="sm">
                        <QrCode className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Voir plus de produits
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Marketplace;