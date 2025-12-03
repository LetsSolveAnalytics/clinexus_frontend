import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard.tsx";
import MedicationSummary from "@/components/MedicationSummary.tsx";
import VisitSummary from "@/components/VisitSummary.tsx";
import ReferralGeneration from "@/components/ReferralGeneration.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients/:slug/medication_summary" element={<MedicationSummary />} />
            <Route path="/patients/:slug/visit_summary" element={<VisitSummary />} />
            <Route path="/patients/:slug/referral" element={<ReferralGeneration />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
