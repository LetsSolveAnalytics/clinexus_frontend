import Appointments from "@/components/Appointments.tsx";
import Dashboard from "@/components/Dashboard.tsx";
import Layout from "@/components/Layout";
import MedicationSummary from "@/components/MedicationSummary.tsx";
import PatientDetails from "@/components/PatientDetails.tsx";
import PatientHub from "@/components/PatientHub.tsx";
import ReferralGeneration from "@/components/ReferralGeneration.tsx";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import VisitSummary from "@/components/VisitSummary.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MedicationDashboard from "./components/MedicationDashboard";
import Messages from "./components/Message";
import ReportsDashboard from "./components/ReportDashboard";



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
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/patient-hub" element={<PatientHub />} />
            <Route path="/patient-hub/:id" element={<PatientDetails />} />
<Route path="/medications" element={<MedicationDashboard />} />
<Route path="/reports" element={<ReportsDashboard />} />

<Route path="/messages" element={<Messages />} />
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
