import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { VendorLayout } from "@/components/vendor/VendorLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import VendorOverview from "./pages/vendor/VendorOverview";
import AffiliateDashboard from "./pages/affiliate/AffiliateDashboard";
import AffiliateLinkInBio from "./pages/AffiliateLinkInBio";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/@:username" element={<AffiliateLinkInBio />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Vendor routes */}
            <Route path="/vendor" element={
              <ProtectedRoute requiredRole="vendor">
                <VendorLayout>
                  <VendorOverview />
                </VendorLayout>
              </ProtectedRoute>
            } />
            <Route path="/vendor/*" element={
              <ProtectedRoute requiredRole="vendor">
                <VendorLayout>
                  <div className="p-6">
                    <div className="text-center py-20">
                      <h2 className="text-2xl font-bold mb-4">Section en développement</h2>
                      <p className="text-muted-foreground">Cette fonctionnalité sera bientôt disponible</p>
                    </div>
                  </div>
                </VendorLayout>
              </ProtectedRoute>
            } />
            
            {/* Affiliate routes */}
            <Route path="/affiliate" element={
              <ProtectedRoute requiredRole="affiliate">
                <AffiliateDashboard />
              </ProtectedRoute>
            } />
            
            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
