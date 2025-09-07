import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VendorLayout } from "@/components/vendor/VendorLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import VendorOverview from "./pages/vendor/VendorOverview";
import VendorProducts from "./pages/vendor/VendorProducts";
import CreateProduct from "./pages/vendor/CreateProduct";
import AffiliateDashboard from "./pages/affiliate/AffiliateDashboard";
import AffiliateLinkInBio from "./pages/AffiliateLinkInBio";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/@:username" element={<AffiliateLinkInBio />} />
          
          {/* Vendor routes */}
          <Route path="/vendor" element={
            <VendorLayout>
              <VendorOverview />
            </VendorLayout>
          } />
          <Route path="/vendor/products" element={
            <VendorLayout>
              <VendorProducts />
            </VendorLayout>
          } />
          <Route path="/vendor/products/create" element={
            <VendorLayout>
              <CreateProduct />
            </VendorLayout>
          } />
          <Route path="/vendor/*" element={
            <VendorLayout>
              <div className="p-6">
                <div className="text-center py-20">
                  <h2 className="text-2xl font-bold mb-4">Section en développement</h2>
                  <p className="text-muted-foreground">Cette fonctionnalité sera bientôt disponible</p>
                </div>
              </div>
            </VendorLayout>
          } />
          
          {/* Affiliate routes */}
          <Route path="/affiliate" element={<AffiliateDashboard />} />
          
          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;